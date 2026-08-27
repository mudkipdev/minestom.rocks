<script lang="ts">
    import { optionalDependencies, type Configuration } from "$lib/generator";

    interface Props {
        dsl: Configuration["dsl"];
        language: Configuration["language"];
        group: string;
        mainClass: string;
        dependencies: string[];
        logger: Configuration["logger"];
    }

    let { dsl = $bindable(), language = $bindable(), group = $bindable(), mainClass = $bindable(), dependencies = $bindable(), logger = $bindable() }: Props = $props();
</script>

<div class="generator-form">
    <a href="/" class="mb-4 block">&larr; Back</a>
    <form onsubmit={(event) => event.preventDefault()}>
        <p>Build Script</p>
        <div>
            <input type="radio" value="kotlin" bind:group={dsl} id="dsl-kotlin" />
            <label for="dsl-kotlin">Gradle (Kotlin)</label>
        </div>
        <div>
            <input type="radio" value="groovy" bind:group={dsl} id="dsl-groovy" />
            <label for="dsl-groovy">Gradle (Groovy)</label>
        </div>
        <div>
            <input type="radio" value="maven" bind:group={dsl} id="dsl-maven" />
            <label for="dsl-maven">Maven</label>
        </div>

        <p>Language</p>
        <div>
            <input type="radio" value="java" bind:group={language} id="language-java" />
            <label for="language-java">Java</label>
        </div>
        <div>
            <input type="radio" value="kotlin" bind:group={language} id="language-kotlin" />
            <label for="language-kotlin">Kotlin</label>
        </div>

        <p>Group</p>
        <input type="text" bind:value={group} class="text-base" />

        <p>Main Class</p>
        <input type="text" bind:value={mainClass} class="text-base" />

        <p>Dependencies</p>
        {#each Object.entries(optionalDependencies) as [key, dependency] (key)}
            <div>
                <input type="checkbox" value={key} bind:group={dependencies} id={key} />
                <label for={key}>{dependency.name}</label>
            </div>
        {/each}

        <p>Logger</p>
        <div>
            <input type="radio" value="none" bind:group={logger} id="logger-none" />
            <label for="logger-none">None</label>
        </div>
        <div>
            <input type="radio" value="tinylog" bind:group={logger} id="logger-tinylog" />
            <label for="logger-tinylog">tinylog</label>
        </div>
        <div>
            <input type="radio" value="logback" bind:group={logger} id="logger-logback" />
            <label for="logger-logback">Logback</label>
        </div>
        <div>
            <input type="radio" value="simple" bind:group={logger} id="logger-simple" />
            <label for="logger-simple">Simple</label>
        </div>
    </form>
</div>

<style>
    .generator-form {
        flex: 0 0 fit-content;
        padding: 32px 48px;
        overflow-y: auto;
        user-select: none;
    }

    form p {
        margin-top: 16px;
        margin-bottom: 0;
        font-weight: bold;
    }

    form p:first-child {
        margin-top: 0;
    }

    input[type="text"] {
        border: 2px inset;
        font-size: 16px;
    }

    form div > input[type="radio"],
    form div > input[type="checkbox"] {
        transform: scale(1.2);
        margin-right: 8px;
    }
</style>
