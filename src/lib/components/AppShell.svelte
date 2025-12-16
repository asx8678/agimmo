<script lang="ts">
	import AgiTopNav from '$lib/components/agi/AgiTopNav.svelte';

	type ShellUser = {
		id: string;
		email: string;
	} | null;

	let { user, children } = $props<{ user: ShellUser; children: any }>();
</script>

<div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
	<AgiTopNav {user} />

	<main class="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
		{@render children?.()}
	</main>
</div>
