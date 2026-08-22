<script lang="ts">
    import { onMount } from "svelte";
    import ResourceList from "$lib/components/ResourceList.svelte";
    import ServerCard from "$lib/components/ServerCard.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    let showLatestOnly = $state(false);
    let minestorm = $state(false);

    const visibleServers = $derived((showLatestOnly ? data.serverSection?.servers.filter((server) => server.supported) : data.serverSection?.servers) ?? []);

    const visibleItems = $derived.by(() => {
        const map = new Map<string, { name: string; description: string; link?: string; version?: string }[]>();
        for (const section of data.otherSections) {
            const items = showLatestOnly ? section.items.filter((item) => item.supported) : section.items;
            if (items.length > 0) map.set(section.title, items.map(transformItem));
        }
        return map;
    });

    function transformItem(item: (typeof data.otherSections)[number]["items"][number]) {
        return {
            name: minestormify(item.name),
            description: minestormify(item.description),
            link: item.link,
            version: item.version
        };
    }

    function minestormify(text: string): string {
        if (!minestorm) return text;
        return text.replaceAll("Minestom", "Minestorm").replaceAll("minestom", "minestorm");
    }

    onMount(() => {
        const today = new Date();
        const isAprilFools = today.getMonth() === 3 && today.getDate() === 1;

        if (Math.random() < 0.01 || isAprilFools) minestorm = true;
    });
</script>

<svelte:head>
    <title>{minestormify("Awesome Minestom")}</title>
    <meta name="description" content="A collection of awesome Minestom resources." />
    <meta property="og:title" content="minestom.rocks" />
    <meta property="og:description" content="A collection of awesome Minestom resources." />
</svelte:head>

<label class="mb-4 flex items-center gap-2">
    <input type="checkbox" bind:checked={showLatestOnly} />
    Show {data.latestVersion} projects only
</label>

{#if data.serverSection && (!showLatestOnly || visibleServers.length > 0)}
    <section>
        <h2>{data.serverSection.title}</h2>
        <div class="my-4 grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4 max-sm:grid-cols-1">
            {#each visibleServers as server (server.ip)}
                <ServerCard
                    name={minestormify(server.name)}
                    description={minestormify(server.description)}
                    ip={server.ip}
                    website={server.website}
                    github={server.github}
                    discord={server.discord}
                    status={server.status}
                    version={server.version}
                />
            {/each}
        </div>
    </section>
{/if}

{#each data.otherSections as section (section.title)}
    {@const items = visibleItems.get(section.title)}
    {#if !showLatestOnly || items}
        <ResourceList title={section.title} items={items ?? []} />
    {/if}
{/each}

<p class="mt-4 mb-8 text-muted">
    Star the project on <a href="https://github.com/mudkipdev/minestom.rocks" class="underline text-muted">GitHub</a>.
    Also try our <a href="/install" class="underline text-muted">build script generator!</a>
</p>
