<script lang="ts">
    import { onMount } from "svelte";
    import CodePanel from "$lib/components/CodePanel.svelte";
    import GeneratorForm from "$lib/components/GeneratorForm.svelte";
    import {
        fetchLatestRelease,
        generateGroovyCode,
        generateKotlinCode,
        generateMavenCode,
        minestom,
        optionalDependencies,
        type Configuration
    } from "$lib/generator";

    let dsl = $state<Configuration["dsl"]>("kotlin");
    let language = $state<Configuration["language"]>("java");
    let group = $state("com.example");
    let mainClass = $state("com.example.Server");
    let dependencies = $state<string[]>([]);
    let logger = $state<Configuration["logger"]>("none");
    let resolvedVersions = $state<Record<string, string>>({});

    const code = $derived.by(() => {
        const configuration: Configuration = { dsl, language, group, mainClass, dependencies, logger };

        if (configuration.dsl === "groovy") return generateGroovyCode(configuration, resolvedVersions);
        if (configuration.dsl === "maven") return generateMavenCode(configuration, resolvedVersions);
        return generateKotlinCode(configuration, resolvedVersions);
    });

    onMount(async () => {
        resolvedVersions = await fetchVersions();
    });

    async function fetchVersions(): Promise<Record<string, string>> {
        const versions: Record<string, string> = {};

        try {
            const kotlinTagName = await fetchLatestRelease("JetBrains", "kotlin");
            versions["kotlin"] = kotlinTagName.startsWith("v") ? kotlinTagName.substring(1) : kotlinTagName;
        } catch (error) {
            console.warn("Failed to fetch version for kotlin:", error);
        }

        if (typeof minestom.version === "function") {
            try {
                versions[minestom.artifact] = await minestom.version();
            } catch (error) {
                console.warn(`Failed to fetch version for ${minestom.artifact}:`, error);
                versions[minestom.artifact] = "latest";
            }
        }

        for (const dependency of Object.values(optionalDependencies)) {
            if (typeof dependency.version === "function") {
                try {
                    versions[dependency.artifact] = await dependency.version();
                } catch (error) {
                    console.warn(`Failed to fetch version for ${dependency.artifact}:`, error);
                    versions[dependency.artifact] = "latest";
                }
            }
        }

        return versions;
    }
</script>

<svelte:head>
    <title>Installation</title>
</svelte:head>

<div class="install-container fixed inset-0 flex overflow-hidden bg-background">
    <GeneratorForm bind:dsl bind:language bind:group bind:mainClass bind:dependencies bind:logger />
    <CodePanel {code} {dsl} />
</div>

<style>
    :global(body:has(.install-container)) {
        max-width: none;
        margin: 0;
        padding: 0;
    }
</style>
