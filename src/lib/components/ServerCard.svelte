<script lang="ts">
    import type { ServerStatus } from "$lib/server/ping";

    interface Props {
        name: string;
        description: string;
        ip: string;
        website?: string;
        github?: string;
        discord?: string;
        status?: ServerStatus;
        version?: string;
    }

    let { name, description, ip, website, github, discord, status, version }: Props = $props();

    let copied = $state(false);

    const iconLinkClass = "relative group flex items-center justify-center rounded-md border border-card/40 p-1.5 text-foreground no-underline transition-colors hover:border-card/70";
    const tooltipClass = "pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 rounded-md border border-card/30 bg-black/80 px-2 py-0.5 text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100";

    async function copy() {
        await navigator.clipboard.writeText(ip);
        copied = true;
        setTimeout(() => { copied = false; }, 1000);
    }
</script>

<div class="flex flex-col rounded-lg border border-card/30 bg-card/5 p-4">
    <div class="flex items-center gap-2.5">
        {#if status?.icon}
            <img class="size-8 shrink-0 rounded-sm object-contain [image-rendering:pixelated]" src={status.icon} alt="" />
        {/if}

        <h3 class="m-0 wrap-anywhere">{name}</h3>

        {#if status}
            {#if status.online}
                {#if status.players}
                    <span class="ml-auto rounded-sm bg-green-500/15 text-green-400 px-2 py-0.5 text-sm whitespace-nowrap">
                        {status.players.online} / {status.players.max}
                    </span>
                {:else}
                    <span class="ml-auto rounded-sm bg-green-500/15 text-green-400 px-2 py-0.5 text-sm whitespace-nowrap">Online</span>
                {/if}
            {:else}
                <span class="ml-auto rounded-sm bg-card/15 text-white/50 px-2 py-0.5 text-sm whitespace-nowrap">Offline</span>
            {/if}
        {/if}
    </div>

    <p class="grow text-sm text-white/60">{description}</p>

    <div class="flex items-center justify-between gap-2">
        {#if version}
            <span class="whitespace-nowrap text-white/60 text-sm">{version}</span>
        {:else}
            <span></span>
        {/if}

        <div class="flex flex-wrap justify-end gap-1.5">
            {#if website}
                <a class={iconLinkClass} href={website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>

                    <span class={tooltipClass}>Website</span>
                </a>
            {/if}

            {#if github}
                <a class={iconLinkClass} href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>

                    <span class={tooltipClass}>GitHub</span>
                </a>
            {/if}

            {#if discord}
                <a class={iconLinkClass} href="https://discord.com/invite/{discord}" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                    </svg>
                    <span class={tooltipClass}>Discord</span>
                </a>
            {/if}

            <button
                class="grid place-items-center rounded-md border border-card/40 px-5 py-1 text-sm transition-colors {copied ? 'border-green-400 text-green-400' : 'hover:border-card/70'}"
                onclick={copy}
            >
                <span class="[grid-area:1/1] {copied ? 'invisible' : ''}" aria-hidden={copied}>{ip}</span>
                <span class="[grid-area:1/1] {copied ? '' : 'invisible'}" aria-hidden={!copied}>Copied!</span>
            </button>
        </div>
    </div>
</div>
