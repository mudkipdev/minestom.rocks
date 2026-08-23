declare module "cloudflare:sockets" {
    interface Socket {
        opened: Promise<void>;
        readable: ReadableStream<Uint8Array>;
        writable: WritableStream<Uint8Array>;
        close(): void;
    }

    function connect(address: { hostname: string; port?: number | string }): Socket;

    export { connect };
    export type { Socket };
}
