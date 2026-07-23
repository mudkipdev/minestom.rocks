export type DiscordInvite = string & { readonly __discord: unique symbol };

export const discord = <T extends string>(
    code: T extends `http${string}` ? never
        : T extends `${string}/${string}` ? never
        : T
): DiscordInvite => code as unknown as DiscordInvite;

interface BaseEntry {
    name: string;
    description: string;
    version?: `${number}.${number}` | `${number}.${number}.${number}`;
}

export interface Item extends BaseEntry {
    link?: string;
}

export interface Server extends BaseEntry {
    ip: string;
    website?: string;
    github?: string;
    discord?: DiscordInvite;
}

interface Category {
    title: string;
    items: (Item | Server)[];
}

export const latestVersion = "26.1.2";
export const supportsLatestVersion = (item: Item | Server): boolean =>
    item.version === latestVersion || !item.version;

export const data: Category[] = [
    /*
        A list of unreleased Minestom servers:
        - BridgeSplash (owned by TropicalShadow)
        - Asorda (owned by Bloeckchengrafik, AEinNico, and CreepyX)
        - Cytosis (owned by Webhead1104 and Foxikle)
        - TrainCraft (owned by IEatSystemFiles)
        - OledMC (owned by hapily, IP: oledmc.minehut.gg?)
        - WidowMC (owned by Pxblosky)
        - w77 (owned by Cody, IP: w77.gg)
    */

    // Publicly hosted servers which primarily use Minestom
    {
        title: "Servers",
        items: [
            {
                name: "Hollow Cube",
                description: "Play, create, share builds and parkour maps, all on one server!",
                version: "26.1.2",
                ip: "hollowcube.net",
                website: "https://hollowcube.net",
                github: "https://github.com/hollow-cube",
                discord: discord("h9Z9DGGJjJ")
            },
            {
                name: "EmortalMC",
                description: "A minigame network powered by Minestom with lots of overengineering.",
                version: "26.1.2",
                ip: "mc.emortal.dev",
                github: "https://github.com/emortalmc",
                discord: discord("qrgqe8hDmx")
            },
            {
                name: "CounterMine",
                description: "A Russian recreation of Counter Strike with insane custom models and GUIs.",
                version: "1.21.11",
                ip: "direct.cherry.pizza",
                website: "https://cherry.pizza",
                discord: discord("TNbyVSuaQh")
            },
            {
                name: "kloon.io",
                description: "A creative server developed by Minikloon featuring powerful building tools.",
                version: "1.21.8",
                ip: "play.kloon.io",
                website: "https://kloon.io",
                github: "https://github.com/KloonInnovations/GameServer-Public",
                discord: discord("peC3UVmZc6")
            },
            {
                name: "BlueDragon",
                description: "A minigame server that strives to produce high-quality original content.",
                version: "1.21.11",
                ip: "bluedragonmc.com",
                website: "https://bluedragonmc.com",
                github: "https://github.com/BlueDragonMC",
                discord: discord("pYA7xxytYJ")
            },
            // {
            //     name: "Endercube",
            //     description: "A parkour server with simple code that is easy to learn from.",
            //     version: "1.21.8",
            //     ip: "play.endercube.net",
            //     website: "https://endercube.net",
            //     github: "https://github.com/Ender-Cube/Endercube"
            // },
            {
                name: "sb.tems.pl",
                description: "A Speed Builders server featuring practice and competitive game modes.",
                version: "1.21.11",
                ip: "sb.tems.pl",
                website: "https://www.tems.pl",
                discord: discord("dkb2hCHV6A")
            },
            {
                name: "Minecrement",
                description: "A free-to-play idle gens server with automine, farming, and RPG elements.",
                version: "26.1.2",
                ip: "minecrement.minehut.gg",
                discord: discord("5Cx9njv7D6")
            },
            {
                name: "Fracture",
                description: "A competitive minigames arena with leaderboards and high-stakes matches.",
                version: "1.21.11",
                ip: "playfracture.com",
                website: "https://playfracture.com",
                discord: discord("apcJbvmdNV")
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
                version: "26.1.1"
            },
            {
                name: "MinestomFluids",
                description: "A library to simulate water and lava physics.",
                link: "https://github.com/TogAr2/MinestomFluids",
                version: "1.21.5"
            },
            {
                name: "Polar",
                description: "A fast and small world format for Minestom.",
                link: "https://github.com/hollow-cube/polar",
                version: "26.1.2"
            },
            {
                name: "Schem",
                description: "A schematic reader and writer library for Minestom.",
                link: "https://github.com/hollow-cube/schem",
                version: "1.21.10"
            },
            {
                name: "WorldSeedEntityEngine",
                description: "Allows you to create advanced Bedrock-like multipart entities.",
                link: "https://github.com/AtlasEngineCa/WorldSeedEntityEngine",
                version: "1.21.11"
            },
            {
                name: "AtlasProjectiles",
                description: "Implementations for arrows, fireballs, snowballs, and more.",
                link: "https://github.com/AtlasEngineCa/AtlasProjectiles",
                version: "1.21.11"
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
                version: "1.21.8"
            },
            {
                name: "KotStom",
                description: "Kotlinizes Minestom with extension functions and utilities.",
                link: "https://github.com/bladehuntmc/KotStom",
                version: "1.21.7"
            },
            {
                name: "LuckPerms",
                description: "A Minestom port of the popular permissions plugin.",
                link: "https://github.com/LooFifteen/LuckPerms",
                version: "1.21.11"
            },
            {
                name: "Spark",
                description: "A Minestom port of the popular Minecraft profiler.",
                link: "https://github.com/LooFifteen/spark",
                version: "1.21.11"
            },
            {
                name: "Simple Voice Chat",
                description: "A Minestom port of the popular voice chat mod.",
                link: "https://github.com/LooFifteen/simple-voice-chat-minestom",
                version: "1.21.8"
            },
            {
                name: "Terra",
                description: "A popular world generation plugin which supports Minestom.",
                link: "https://github.com/PolyhedralDev/Terra",
                version: "1.21.8"
            },
            {
                name: "NBStom",
                description: "A Note Block Studio reader and player for Minestom.",
                link: "https://github.com/emortalmc/NBStom",
                version: "1.21.8"
            },
            {
                name: "Blocks and Stuff",
                description: "Common block and fluid implementations for Minestom.",
                link: "https://github.com/everbuild-org/blocks-and-stuff",
                version: "26.1.2"
            },
            {
                name: "minecraft-heads-minestom",
                description: "Minecraft-Heads.com integration for Minestom.",
                link: "https://github.com/everbuild-org/minecraft-heads-minestom",
                version: "1.21.9"
            },
            {
                name: "minecraft-utils",
                description: "A feature-rich Minestom library containing many examples.",
                link: "https://github.com/tropicalshadow/minestom-utils",
                version: "26.1.2"
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
                description: "A somewhat outdated but great guide to introduce beginners to Minestom.",
                link: "https://www.youtube.com/watch?v=QcEQcFhYLoY&list=PLfu_Bpi_zcDP3lfhG_5VQ7G0kD4a8GwDf",
                version: "1.21.1"
            }
        ]
    },

// I want to add snippet category but metadata index 17 is outdated in 1.21.11, so this snippet is no longer correct
// In the future I will put placement rules etc. in here
// pm me on discord if you have one to add
/*
    {
        title: "Snippets",
        items: [
            {
                name: "PlaybackPlayer.java",
                description: "A widely shared gist used to implement fake player NPCs.",
                link: "https://gist.github.com/mworzala/2c5da51204c45c70db771d0ce7fe9412"
            }
        ]
    },
*/

    // Things that don't belong into any of the other categories, such as servers which are not hosted publicly
    {
        title: "Miscellaneous",
        items: [
            {
                name: "minestom-ca",
                description: "Implementing vanilla Minecraft with cellular automata.",
                link: "https://github.com/GoldenStack/minestom-ca",
                version: "1.21.8"
            },
            {
                name: "Swofty's Skyblock",
                description: "A recreation of Hypixel's Skyblock and Bed Wars game modes in Minestom.",
                link: "https://github.com/Swofty-Developments/HypixelSkyBlock",
                version: "26.1.2"
            },
            {
                name: "CRAFT-8",
                description: "A recreation of PICO-8 in Minestom using maps.",
                link: "https://github.com/miberss/CRAFT-8",
                version: "1.21.3"
            },
            {
                name: "BlockPhysics",
                description: "A Minecraft physics playground powered by display entities.",
                link: "https://github.com/emortaldev/BlockPhysics",
                version: "1.21.10"
            },
            {
                name: "minestom-version-cli",
                description: "Check the latest Minestom commit from your terminal.",
                link: "https://github.com/cosrnic/minestom-version-cli"
            },
            {
                name: "Minestom Template",
                description: "An unofficial project template including Spark, LuckPerms, and other basics for faster setup.",
                link: "https://github.com/tropicalshadow/minestom-template"
            }
        ]
    }
];

data.forEach((category) => {
    category.items.sort((left, right) => {
        if (!left.version && right.version) return -1;
        if (left.version && !right.version) return 1;
        if (!left.version && !right.version) return 0;

        const parseVersion = (version: string) => {
            const parts = version.split('.').map(Number);
            return { major: parts[0] || 0, minor: parts[1] || 0, patch: parts[2] || 0 };
        };

        const leftVersion = parseVersion(left.version || "");
        const rightVersion = parseVersion(right.version || "");

        if (rightVersion.major !== leftVersion.major) return rightVersion.major - leftVersion.major;
        if (rightVersion.minor !== leftVersion.minor) return rightVersion.minor - leftVersion.minor;
        return rightVersion.patch - leftVersion.patch;
    });
});
