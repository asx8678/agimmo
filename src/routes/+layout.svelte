<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import AppShell from '$lib/components/AppShell.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<AppShell user={data.user}>
	{@render children()}
</AppShell>
