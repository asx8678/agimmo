<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import AgiListingCard from '$lib/components/agi/AgiListingCard.svelte';
	import type { AgiListing } from '$lib/types/agi-listing';

	const dispatch = createEventDispatcher<{
		select: { id: string | null };
	}>();

	let { listings, selectedId, layout = 'full' } = $props<{
		listings: AgiListing[];
		selectedId: string | null;
		layout?: 'full' | 'split';
	}>();

	const gridClass = $derived(
		layout === 'split'
			? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3'
			: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
	);

	let savedIds = $state<Set<string>>(new Set());

	const toggleSave = (id: string) => {
		savedIds = new Set(savedIds);
		if (savedIds.has(id)) savedIds.delete(id);
		else savedIds.add(id);
	};
</script>

{#if listings.length === 0}
	<div class="agi-surface border-dashed border-gray-300/80 bg-white/50 p-8 text-center text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-300">
		<p class="text-base font-semibold text-gray-900 dark:text-gray-100">No homes found</p>
		<p class="mt-2">Try widening your search — fewer filters, broader location.</p>
	</div>
{:else}
	<div class={gridClass}>
		{#each listings as listing (listing.id)}
			<AgiListingCard
				{listing}
				selected={selectedId === listing.id}
				saved={savedIds.has(listing.id)}
				on:hover={(e) => dispatch('select', { id: e.detail.id })}
				on:unhover={() => dispatch('select', { id: null })}
				on:toggleSave={(e) => toggleSave(e.detail.id)}
			/>
		{/each}
	</div>
{/if}
