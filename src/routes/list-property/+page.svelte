<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';

	import AgiZelligeCorner from '$lib/components/agi/AgiZelligeCorner.svelte';
	import AgiZelligeLine from '$lib/components/agi/AgiZelligeLine.svelte';

	let { data } = $props();
</script>

<div class="space-y-6">
	<div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-emerald-600/10 to-sky-600/10 p-6 ring-1 ring-white/60 dark:border-gray-800 dark:from-emerald-500/10 dark:to-sky-500/10 dark:ring-black/20 sm:p-8">
		<AgiZelligeCorner corner="top-right" class="opacity-60" />
		<div class="absolute inset-x-0 top-0">
			<AgiZelligeLine class="opacity-70" />
		</div>

		<h1 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">List a property</h1>
		<p class="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
			This is a placeholder route for the landlord flow. Add your listing form + image upload next.
		</p>

		<div class="mt-6 flex flex-wrap gap-2">
			<Button href="/" color="light" class="agi-btn-light">Browse listings</Button>
			{#if data.user}
				<Button
					href="/dashboard"
					class="agi-btn-primary"
				>
					Go to account
				</Button>
			{:else}
				<Button
					href="/signup"
					class="agi-btn-primary"
				>
					Create an account
				</Button>
			{/if}
		</div>
	</div>

	<Card size="xl" class="rounded-2xl border-0 bg-white/70 p-6 shadow-sm ring-1 ring-gray-200/70 backdrop-blur dark:bg-gray-950/60 dark:ring-gray-800 sm:p-7">
		<h2 class="text-lg font-semibold">What to build next</h2>
		<ul class="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
			<li>Property basics: title, type, beds/baths, area</li>
			<li>Price + rent/buy mode</li>
			<li>Precise location + map pin</li>
			<li>Photos + feature badges</li>
		</ul>
	</Card>
</div>
