<script lang="ts">
	import AgiTopNav from '$lib/components/agi/AgiTopNav.svelte';
	import AgiZelligeLine from '$lib/components/agi/AgiZelligeLine.svelte';

	type ShellUser = {
		id: string;
		email: string;
	} | null;

	let { user, children } = $props<{ user: ShellUser; children: any }>();
</script>

<div class="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-50 via-gray-50 to-white text-gray-900 transition-colors duration-200 dark:from-gray-950 dark:via-gray-950 dark:to-gray-950 dark:text-gray-100">
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(12,116,117,0.12),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.10),transparent_55%),radial-gradient(circle_at_50%_90%,rgba(217,119,6,0.08),transparent_60%)] opacity-70 dark:opacity-30"
	></div>

	<div class="relative">
		<AgiZelligeLine class="opacity-80" />
		<AgiTopNav {user} />
	</div>

	<main class="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
		{@render children?.()}
	</main>
</div>
