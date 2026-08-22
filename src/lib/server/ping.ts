import dns from "node:dns/promises";
import net from "node:net";
import { Buffer } from "node:buffer";
import { data, type Server } from "$lib/data";

const PING_TIMEOUT = 5000;
const REFRESH_INTERVAL = 120000;
const MAX_CONCURRENT_PINGS = 4;
const DEFAULT_PORT = 25565;

const HANDSHAKE_PROTOCOL_VERSION = 0;

const PROTOCOL_VERSIONS: Record<number, string> = {
    776: "26.2",
    775: "26.1.2",
    774: "1.21.11",
    773: "1.21.10",
    772: "1.21.8",
    771: "1.21.6",
    770: "1.21.5",
    769: "1.21.4",
    768: "1.21.3",
    767: "1.21.1",
    766: "1.20.6",
    765: "1.20.4",
    764: "1.20.2",
    763: "1.20.1",
    762: "1.19.4",
    761: "1.19.3",
    760: "1.19.2",
    759: "1.19",
    758: "1.18.2",
    757: "1.18.1",
    756: "1.17.1",
    755: "1.17",
    754: "1.16.5"
};

const LATEST_PROTOCOL = Math.max(...Object.keys(PROTOCOL_VERSIONS).map(Number));
const LATEST_VERSION = PROTOCOL_VERSIONS[LATEST_PROTOCOL];

export interface ServerStatus {
    online: boolean;
    checkedAt: number;
    players?: { online: number; max: number };
    version?: string;
    icon?: string;
}

interface PingResult extends ServerStatus {
    protocol?: number;
}

interface StatusResponse {
    version?: { name?: string; protocol?: number };
    players?: { online?: number; max?: number };
    favicon?: string;
}

export interface PingerState {
    statuses: Map<string, ServerStatus>;
    icons: Map<string, string>;
    timer: ReturnType<typeof setInterval>;
    refreshing: boolean;
    ready: Promise<void>;
}

const serverAddresses = data
    .flatMap((category) => category.items)
    .filter((item): item is Server => "ip" in item)
    .map((server) => server.ip);

function encodeVarInt(value: number): Buffer {
    const bytes: number[] = [];
    let remaining = value;
    do {
        let byte = remaining & 0x7f;
        remaining >>>= 7;
        if (remaining !== 0) byte |= 0x80;
        bytes.push(byte);
    } while (remaining !== 0);
    return Buffer.from(bytes);
}

function decodeVarInt(buffer: Buffer, offset: number): { value: number; offset: number } | undefined {
    let result = 0;
    let shift = 0;
    let position = offset;

    while (true) {
        if (position >= buffer.length || position - offset >= 5) return undefined;
        const byte = buffer[position];
        position++;
        if (byte === undefined) return undefined;
        result |= (byte & 0x7f) << shift;
        if ((byte & 0x80) === 0) return { value: result, offset: position };
        shift += 7;
    }
}

async function resolveAddress(address: string): Promise<{ host: string; port: number }> {
    const separator = address.indexOf(":");
    const hostname = separator === -1 ? address : address.substring(0, separator);
    const explicitPort = separator === -1 ? undefined : Number(address.substring(separator + 1));

    if (explicitPort === undefined) {
        const records = await dns.resolveSrv(`_minecraft._tcp.${hostname}`).catch(() => []);
        const record = records[0];
        if (record) return { host: record.name, port: record.port };
    }

    return { host: hostname, port: explicitPort ?? DEFAULT_PORT };
}

function pingSocket(host: string, port: number, announcedProtocol: number): Promise<PingResult> {
    return new Promise((resolve, reject) => {
        const socket = net.createConnection({ host, port });
        let received = Buffer.alloc(0);
        let settled = false;

        const fail = (error: Error) => {
            if (settled) return;
            settled = true;
            socket.destroy();
            reject(error);
        };

        const complete = (status: PingResult) => {
            if (settled) return;
            settled = true;
            socket.destroy();
            resolve(status);
        };

        socket.setTimeout(PING_TIMEOUT);
        socket.once("timeout", () => fail(new Error(`Timed out pinging ${host}:${port}`)));
        socket.once("error", (error) => fail(error));

        socket.once("connect", () => {
            const address = Buffer.from(host, "utf8");
            const handshake = Buffer.concat([
                encodeVarInt(0),
                encodeVarInt(announcedProtocol),
                encodeVarInt(address.length),
                address,
                Buffer.from([(port >> 8) & 0xff, port & 0xff]),
                encodeVarInt(1)
            ]);
            const request = encodeVarInt(0);

            socket.write(Buffer.concat([encodeVarInt(handshake.length), handshake]));
            socket.write(Buffer.concat([encodeVarInt(request.length), request]));
        });

        socket.on("data", (chunk: Buffer) => {
            received = Buffer.concat([received, chunk]);
            if (settled) return;

            const length = decodeVarInt(received, 0);
            if (length === undefined || received.length < length.offset + length.value) return;

            const packet = received.subarray(length.offset, length.offset + length.value);
            const packetId = decodeVarInt(packet, 0);
            if (packetId === undefined || packetId.value !== 0) return fail(new Error("Unexpected status packet"));

            const payloadLength = decodeVarInt(packet, packetId.offset);
            if (payloadLength === undefined) return fail(new Error("Malformed status response"));
            const payload = packet.subarray(payloadLength.offset, payloadLength.offset + payloadLength.value);

            try {
                complete(statusFromResponse(JSON.parse(payload.toString("utf8")) as StatusResponse));
            } catch (error) {
                fail(error instanceof Error ? error : new Error("Invalid status response"));
            }
        });

        socket.once("close", () => fail(new Error("Connection closed before status response")));
    });
}

const versionPattern = /(\d+)\.(\d+)(?:\.(\d+))?/g;
const formattingCodePattern = /§./g;

function normalizeVersion(raw: string | undefined): string | undefined {
    if (!raw) return undefined;

    let best: { text: string; major: number; minor: number; patch: number } | undefined;
    for (const match of raw.replace(formattingCodePattern, "").matchAll(versionPattern)) {
        const candidate = {
            text: match[0],
            major: Number(match[1]),
            minor: Number(match[2]),
            patch: Number(match[3] ?? 0)
        };

        if (!best
            || candidate.major > best.major
            || (candidate.major === best.major && candidate.minor > best.minor)
            || (candidate.major === best.major && candidate.minor === best.minor && candidate.patch > best.patch)) {
            best = candidate;
        }
    }

    return best?.text;
}

function resolveVersion(protocol: number | undefined, raw: string | undefined): string | undefined {
    if (protocol !== undefined && protocol > 0) {
        const known = PROTOCOL_VERSIONS[protocol];
        if (known) return known;
    }
    return normalizeVersion(raw);
}

function statusFromResponse(response: StatusResponse): PingResult {
    const status: PingResult = { online: true, checkedAt: Date.now() };
    const protocol = response.version?.protocol;
    if (protocol !== undefined) status.protocol = protocol;

    if (response.players) {
        status.players = { online: response.players.online ?? 0, max: response.players.max ?? 0 };
    }

    const version = resolveVersion(response.version?.protocol, response.version?.name);
    if (version) status.version = version;

    if (response.favicon) status.icon = response.favicon;
    return status;
}

async function pingServer(address: string, icons: Map<string, string>): Promise<ServerStatus> {
    const target = await resolveAddress(address);

    const modern = await pingSocket(target.host, target.port, LATEST_PROTOCOL).catch(() => undefined);
    const status = modern ?? await pingSocket(target.host, target.port, HANDSHAKE_PROTOCOL_VERSION).catch(() => undefined);

    if (!status || !LATEST_VERSION) return { online: false, checkedAt: Date.now() };

    if (status.protocol === LATEST_PROTOCOL) {
        status.version = LATEST_VERSION;
    }

    if (status.icon) {
        icons.set(address, status.icon);
    } else {
        const cached = icons.get(address);
        if (cached) status.icon = cached;
    }

    return status;
}

async function sweep(statuses: Map<string, ServerStatus>, icons: Map<string, string>): Promise<void> {
    const pending = [...statuses.keys()];
    const worker = async () => {
        while (pending.length > 0) {
            const address = pending.shift();
            if (address === undefined) break;
            statuses.set(address, await pingServer(address, icons));
        }
    };

    await Promise.all(Array.from({ length: MAX_CONCURRENT_PINGS }, () => worker()));
}

async function refresh(state: PingerState): Promise<void> {
    if (state.refreshing) return;
    state.refreshing = true;
    try {
        await sweep(state.statuses, state.icons);
    } finally {
        state.refreshing = false;
    }
}

export function initializePinger(): Promise<void> {
    if (!globalThis.__minestomRocksPinger) {
        const statuses = new Map(serverAddresses.map((address) => [address, {
            online: false,
            checkedAt: 0
        } satisfies ServerStatus]));
        const icons = new Map<string, string>();
        const state: PingerState = {
            statuses,
            icons,
            timer: setInterval(() => void refresh(state), REFRESH_INTERVAL),
            refreshing: true,
            ready: sweep(statuses, icons).then(() => {
                state.refreshing = false;
            })
        };
        globalThis.__minestomRocksPinger = state;
    }

    return globalThis.__minestomRocksPinger.ready;
}

export function getServerStatus(address: string): ServerStatus | undefined {
    if (!globalThis.__minestomRocksPinger) throw new Error("Pinger not initialized");
    return globalThis.__minestomRocksPinger.statuses.get(address);
}
