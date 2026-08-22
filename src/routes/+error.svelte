<script lang="ts">
    import { page } from "$app/state";
</script>

<svelte:head>
    <title>{page.status}</title>
</svelte:head>

<h2>{page.status}</h2>
<p>Page not found.</p>