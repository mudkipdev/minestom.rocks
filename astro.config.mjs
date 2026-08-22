import node from "@astrojs/node";
import { defineConfig } from "astro/config";

export default defineConfig({
    site: "https://minestom.rocks",
    trailingSlash: "ignore",
    output: "server",
    adapter: node({ mode: "standalone" }),
    devToolbar: {
        enabled: false
    }
});