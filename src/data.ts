interface Item {
    name: string;
    description: string;
    link: string;
}

interface Category {
    title: string;
    items: Item[];
}

export const data: Category[] = [
    {
        title: "Libraries",
        items: [
            {
                name: "MinestomPvP",
                description: "A combat library with both 1.8 and modern PvP.",
                link: "https://github.com/TogAr2/MinestomPvP"
            },
            {
                name: "Polar",
                description: "A fast and small world format for Minestom.",
                link: "https://github.com/hollow-cube/polar"
            },
            {
                name: "Schem",
                description: "A schematic reader and writer library for Minestom.",
                link: "https://github.com/hollow-cube/schem"
            },
            {
                name: "WorldSeedEntityEngine",
                description: "Allows you to create advanced Bedrock-like multipart entities.",
                link: "https://github.com/AtlasEngineCa/WorldSeedEntityEngine"
            },
            {
                name: "AtlasProjectiles",
                description: "Implementations for arrows, fireballs, snowballs, and more.",
                link: "https://github.com/AtlasEngineCa/AtlasProjectiles"
            },
            {
                name: "KotStom",
                description: "Kotlinizes Minestom with extension functions and utilities.",
                link: "https://github.com/bladehuntmc/KotStom"
            }
        ]
    },
    {
        title: "Servers",
        items: [
            {
                name: "Hollow Cube",
                description: "Play, create, share builds and parkour maps, all on one server!",
                link: "https://hollowcube.net"
            },
            {
                name: "EmortalMC",
                description: "A minigame network powered by Minestom with lots of overengineering.",
                link: "https://github.com/emortalmc"
            }
        ]
    },
    {
        title: "Resources",
        items: [
            {
                name: "Minestom Wiki",
                description: "The official documentation.",
                link: "https://minestom.net/docs/introduction"
            },
            {
                name: "Kody Simpson's videos",
                description: "A great guide to introduce beginners to Minestom development.",
                link: "https://www.youtube.com/watch?v=QcEQcFhYLoY&list=PLfu_Bpi_zcDP3lfhG_5VQ7G0kD4a8GwDf"
            }
        ]
    }
];