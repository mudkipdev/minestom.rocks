import type { PingerState } from "$lib/server/ping";

declare global {
    // eslint-disable-next-line no-var
    var __minestomRocksPinger: PingerState | undefined;
}

export {};
