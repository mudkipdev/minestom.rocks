import { compareVersions, data, latestVersion, supportsLatestVersion, type Item, type Server } from "$lib/data";
import { getServerStatus, initializePinger } from "$lib/server/ping";
import type { PageServerLoad } from "./$types";

const resolveVersion = (item: Item | Server): string | undefined =>
    "ip" in item ? getServerStatus(item.ip)?.version ?? item.version : item.version;

const hasServers = (items: (Item | Server)[]): boolean => items.some((item) => "ip" in item);

export const load: PageServerLoad = async () => {
    await initializePinger();

    const serverSection = (() => {
        const category = data.find((category) => hasServers(category.items));
        if (!category) return undefined;

        const servers = category.items
            .filter((item): item is Server => "ip" in item)
            .map((server) => ({
                name: server.name,
                description: server.description,
                ip: server.ip,
                website: server.website,
                github: server.github,
                discord: server.discord,
                status: getServerStatus(server.ip),
                version: resolveVersion(server),
                supported: supportsLatestVersion(resolveVersion(server))
            }))
            .sort((left, right) => {
                const leftPlayers = left.status?.players?.online ?? -1;
                const rightPlayers = right.status?.players?.online ?? -1;

                if (leftPlayers !== rightPlayers) return rightPlayers - leftPlayers;
                return compareVersions(left.version ?? "0", right.version ?? "0");
            });

        return { title: category.title, servers };
    })();

    const otherSections = data
        .filter((category) => !hasServers(category.items))
        .map((category) => ({
            title: category.title,
            items: category.items
                .filter((item): item is Item => !("ip" in item))
                .map((item) => ({
                    name: item.name,
                    description: item.description,
                    link: item.link,
                    version: item.version,
                    supported: supportsLatestVersion(item.version)
                }))
        }));

    return { latestVersion, serverSection, otherSections };
};
