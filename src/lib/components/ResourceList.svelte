<script lang="ts">
    interface Item {
        name: string;
        description: string;
        link?: string;
        version?: string;
    }

    interface Props {
        title: string;
        items: Item[];
    }

    let { title, items }: Props = $props();
</script>

<section>
    <h2>{title}</h2>
    <ul class="my-3 list-disc ps-10">
        {#each items as item, index (index)}
            <li class="my-1">
                {#if item.link}
                    <a href={item.link} target="_blank" rel="noopener noreferrer" class="underline">{item.name}</a>
                {:else}
                    <span>{item.name}</span>
                {/if}

                {" "}- {item.description}

                {#if item.version}
                    <span class="text-muted">({item.version})</span>
                {/if}
            </li>
        {/each}
    </ul>
</section>
