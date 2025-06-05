interface Item {
    name: string;
    description: string;
    link: string;
    version?: `1.${number}` | `1.${number}.${number}`;
}

interface Category {
    title: string;
    items: Item[];
}

export const latestVersion = "1.21.5";
export const supportsLatestVersion = (item: Item): boolean =>
    item.version === latestVersion || !item.version;

export const data: Category[] = [
    // Publicly hosted servers which primarily use Minestom
    {
        title: "Servers",
        items: [
            {
                name: "Hollow Cube",
                description: "Play, create, share builds and parkour maps, all on one server!",
                link: "https://hollowcube.net",
                version: "1.21.5"
            },
            {
                name: "EmortalMC",
                description: "A minigame network powered by Minestom with lots of overengineering.",
                link: "https://github.com/emortalmc",
                version: "1.21.5"
            },
            {
                name: "CounterMine",
                description: "A Russian recreation of Counter Strike with insane custom models and GUIs.",
                link: "https://cherry.pizza",
                version: "1.21.4"
            },
            {
                name: "kloon.io",
                description: "A creative server developed by Minikloon featuring powerful building tools.",
                link: "https://kloon.io",
                version: "1.21.3"
            },
            {
                name: "BlueDragon",
                description: "A minigame server that strives to produce high-quality original content.",
                link: "https://bluedragonmc.com",
                version: "1.21.5"
            },
            {
                name: "McWar.io",
                description: "A first-person shooter with realistic weapons and a unique desktop GUI.",
                link: "https://www.youtube.com/watch?v=xfKPJ35fA4I",
                version: "1.21.1"
            },
            {
                name: "Endercube",
                description: "A parkour server with simple code that is easy to learn from.",
                link: "https://github.com/Ender-Cube/Endercube",
                version: "1.21.4"
            }
        ]
    },

    // Libraries which you can import and use in your Minestom server
    {
        title: "Libraries",
        items: [
            {
                name: "MinestomPvP",
                description: "A combat library with both 1.8 and modern PvP.",
                link: "https://github.com/TogAr2/MinestomPvP",
                version: "1.21.4"
            },
            {
                name: "Polar",
                description: "A fast and small world format for Minestom.",
                link: "https://github.com/hollow-cube/polar",
                version: "1.21.5"
            },
            {
                name: "Schem",
                description: "A schematic reader and writer library for Minestom.",
                link: "https://github.com/hollow-cube/schem",
                version: "1.21.3"
            },
            {
                name: "WorldSeedEntityEngine",
                description: "Allows you to create advanced Bedrock-like multipart entities.",
                link: "https://github.com/AtlasEngineCa/WorldSeedEntityEngine",
                version: "1.21.4"
            },
            {
                name: "AtlasProjectiles",
                description: "Implementations for arrows, fireballs, snowballs, and more.",
                link: "https://github.com/AtlasEngineCa/AtlasProjectiles",
                version: "1.21.3"
            },
            {
                name: "Trove",
                description: "A vanilla loot table parser and evaluator.",
                link: "https://github.com/GoldenStack/trove",
                version: "1.21.5"
            },
            {
                name: "Window",
                description: "A useful API for dealing with inventories.",
                link: "https://github.com/GoldenStack/window",
                version: "1.21.4"
            },
            {
                name: "KotStom",
                description: "Kotlinizes Minestom with extension functions and utilities.",
                link: "https://github.com/bladehuntmc/KotStom",
                version: "1.21.4"
            },
            {
                name: "LuckPerms",
                description: "A Minestom port of the popular permissions plugin.",
                link: "https://github.com/LooFifteen/LuckPerms",
                version: "1.21.5"
            },
            {
                name: "Spark",
                description: "A Minestom port of the popular Minecraft profiler.",
                link: "https://github.com/LooFifteen/spark",
                version: "1.21.4"
            },
            {
                name: "Simple Voice Chat",
                description: "A Minestom port of the popular voice chat mod.",
                link: "https://github.com/LooFifteen/simple-voice-chat-minestom",
                version: "1.21.3"
            },
            {
                name: "Terra",
                description: "A popular world generation plugin which supports Minestom.",
                link: "https://github.com/PolyhedralDev/Terra",
                version: "1.21.4"
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
                name: "Minestom Javadoc",
                description: "The official API reference.",
                link: "https://javadoc.minestom.net"
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
                link: "https://github.com/Swofty-Developments/HypixelSkyBlock",
                version: "1.21.4"
            },
            {
                name: "CRAFT-8",
                description: "A recreation of PICO-8 in Minestom using maps.",
                link: "https://github.com/miberss/CRAFT-8",
                version: "1.21.4"
            },
            {
                name: "BlockPhysics",
                description: "A Minecraft physics playground powered by display entities.",
                link: "https://github.com/emortaldev/BlockPhysics",
                version: "1.21.4"
            },
            {
                name: "minestom-version-cli",
                description: "Check the latest Minestom commit from your terminal.",
                link: "https://github.com/cosrnic/minestom-version-cli"
            }
        ]
    }
];

data.forEach((category) => {
    category.items.sort((left, right) => {
        if (!left.version) return 1;
        if (!right.version) return -1;
        return left.version > right.version ? -1 : left.version < right.version ? 1 : 0;
    });
});
