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
    // Libraries which you can import and use in your Minestom server
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
                name: "Trove",
                description: "A vanilla loot table parser and evaluator.",
                link: "https://github.com/GoldenStack/trove"
            },
            {
                name: "Window",
                description: "A useful API for dealing with inventories.",
                link: "https://github.com/GoldenStack/window"
            },
            {
                name: "KotStom",
                description: "Kotlinizes Minestom with extension functions and utilities.",
                link: "https://github.com/bladehuntmc/KotStom"
            },
            {
                name: "LuckPerms",
                description: "A Minestom port of the popular permissions plugin.",
                link: "https://github.com/LooFifteen/LuckPerms"
            },
            {
                name: "Simple Voice Chat",
                description: "A Minestom port of the popular voice chat mod.",
                link: "https://github.com/LooFifteen/simple-voice-chat-minestom"
            },
            {
                name: "Terra",
                description: "A popular world generation plugin which supports Minestom.",
                link: "https://github.com/PolyhedralDev/Terra"
            }
        ]
    },

    // Publicly hosted servers which primarily use Minestom
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
            },
            {
                name: "CounterMine",
                description: "A Russian recreation of Counter Strike with insane custom models and GUIs.",
                link: "https://cherry.pizza"
            },
            {
                name: "BlueDragon",
                description: "A minigame server that strives to produce high-quality original content.",
                link: "https://bluedragonmc.com"
            },
            {
                name: "McWar.io",
                description: "A first-person shooter with realistic weapons and a unique desktop GUI.",
                link: "https://www.youtube.com/watch?v=xfKPJ35fA4I"
            },
            {
                name: "Endercube",
                description: "A parkour server with simple code that is easy to learn from.",
                link: "https://github.com/Ender-Cube/Endercube"
            }
        ]
    },

    // Tutorials, guides, or anything that is helpful for Minestom development
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
            },
            {
                name: "PlaybackPlayer.java",
                description: "A widely shared gist used to implement fake player NPCs.",
                link: "https://gist.github.com/mworzala/2c5da51204c45c70db771d0ce7fe9412"
            }
        ]
    },

    // Things that don't belong into any of the other categories, such as servers which are not hosted publicly
    {
        title: "Miscellaneous",
        items: [
            {
                name: "Swofty's Skyblock",
                description: "A recreation of Hypixel's Skyblock game mode in Minestom.",
                link: "https://github.com/Swofty-Developments/HypixelSkyBlock"
            },
            {
                name: "CRAFT-8",
                description: "A recreation of PICO-8 in Minestom using maps.",
                link: "https://github.com/miberss/CRAFT-8"
            },
            {
                name: "BlockPhysics",
                description: "A Minecraft physics playground powered by display entities.",
                link: "https://github.com/emortaldev/BlockPhysics"
            },
            {
                name: "minestom-version-cli",
                description: "Check the latest Minestom commit in your terminal.",
                link: "https://github.com/cosrnic/minestom-version-cli"
            }
        ]
    }
];