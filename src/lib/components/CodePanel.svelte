<script lang="ts">
    import { onMount } from "svelte";
    import type { Highlighter } from "shiki";
    import type { Configuration } from "$lib/generator";

    interface Props {
        code: string;
        dsl: Configuration["dsl"];
    }

    let { code, dsl }: Props = $props();

    let highlighter = $state<Highlighter | null>(null);
    let copied = $state(false);

    const highlightedCode = $derived(highlighter ? highlighter.codeToHtml(code, {
        lang: dslToLanguage(dsl),
        themes: { light: "github-light", dark: "github-dark-high-contrast" },
        defaultColor: false
    }) : "");

    const filename = $derived(dsl === "maven" ? "pom.xml" : dsl === "groovy" ? "build.gradle" : "build.gradle.kts");

    function dslToLanguage(dsl: string): string {
        if (dsl === "maven") return "xml";
        if (dsl === "groovy") return "groovy";
        return "kotlin";
    }

    async function copy() {
        await navigator.clipboard.writeText(code);
        copied = true;
        setTimeout(() => {
            copied = false;
        }, 1000);
    }

    async function save() {
        const content = code;

        const accept: Record<`${string}/${string}`, `.${string}`> = {
            [dsl === "maven" ? "application/xml" : "text/plain"]: filename.substring(filename.indexOf(".")) as `.${string}`
        };
        const fileTypes: FilePickerAcceptType[] = [{
            description: dsl === "maven" ? "Maven files" : "Gradle files",
            accept
        }];

        if ("showSaveFilePicker" in window) {
            try {
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: filename,
                    types: fileTypes
                });

                const writable = await fileHandle.createWritable();
                await writable.write(content);
                await writable.close();
            } catch (error) {
                if (error instanceof DOMException && error.name !== "AbortError") {
                    console.error("Save failed:", error);
                }
            }
        } else {
            const blob = new Blob([content], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const linkElement = document.createElement("a");
            linkElement.href = url;
            linkElement.download = filename;
            linkElement.click();
            URL.revokeObjectURL(url);
        }
    }

    onMount(async () => {
        const { createHighlighter } = await import("shiki");

        highlighter = await createHighlighter({
            themes: ["github-light", "github-dark-high-contrast"],
            langs: ["kotlin", "groovy", "xml"]
        });
    });
</script>

<div class="flex min-w-0 grow flex-col overflow-hidden border-l border-[#D0D7DE] dark:border-[#30363D]">
    <div class="flex gap-2 border-b border-[#D0D7DE] p-2 dark:border-[#30363D]">
        <button class="w-[300px] p-2" onclick={copy}>{copied ? "Copied!" : "Copy"}</button>
        <button class="w-[300px] p-2" onclick={save}>Save</button>
    </div>

    <div id="code" class="grow overflow-auto">
        {@html highlightedCode}
    </div>
</div>

<style>
    #code :global(pre) {
        margin: 0;
        padding: 16px;
        font-size: 14px;
        white-space: pre;
        min-height: 100%;
    }

    #code :global(.shiki),
    #code :global(.shiki span) {
        color: var(--shiki-light);
        background-color: var(--shiki-light-bg);
    }

    @media (prefers-color-scheme: dark) {
        #code :global(.shiki),
        #code :global(.shiki span) {
            color: var(--shiki-dark) !important;
            background-color: var(--shiki-dark-bg) !important;
        }
    }
</style>
