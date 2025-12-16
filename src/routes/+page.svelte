<script lang="ts">
	import { Badge, Button, Select } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	import AgiFiltersBar from '$lib/components/agi/AgiFiltersBar.svelte';
	import AgiFooter from '$lib/components/agi/AgiFooter.svelte';
	import AgiLandlordCTA from '$lib/components/agi/AgiLandlordCTA.svelte';
	import AgiListingsGrid from '$lib/components/agi/AgiListingsGrid.svelte';
	import AgiMapPanel from '$lib/components/agi/AgiMapPanel.client.svelte';
	import {
		agiActiveFiltersCount,
		agiFilters,
		agiFilteredListings,
		agiIsAnyFilterActive,
		resetAgiFilters,
		type AgiSort
	} from '$lib/stores/agi-filters';

	const sortOptions: { label: string; value: AgiSort }[] = [
		{ label: 'Newest', value: 'newest' },
		{ label: 'Price low → high', value: 'price_asc' },
		{ label: 'Price high → low', value: 'price_desc' }
	];

	let hoveredId = $state<string | null>(null);
	let pinnedId = $state<string | null>(null);
	const activeId = $derived(hoveredId ?? pinnedId);

	let isDesktop = $state(false);
	let desktopShowMap = $state(true);
	let mobileView = $state<'list' | 'map'>('list');

	onMount(() => {
		const mql = window.matchMedia('(min-width: 1024px)');
		const update = () => {
			isDesktop = mql.matches;
		};
		update();
		mql.addEventListener?.('change', update);
		return () => mql.removeEventListener?.('change', update);
	});

	const setSort = (e: Event) => {
		const value = (e.currentTarget as HTMLSelectElement).value as AgiSort;
		agiFilters.update((f) => ({ ...f, sort: value }));
	};

	const selectListView = () => {
		if (isDesktop) desktopShowMap = false;
		else mobileView = 'list';
	};

	const selectMapView = () => {
		if (isDesktop) desktopShowMap = true;
		else mobileView = 'map';
	};
</script>

<div class="space-y-6">
	<p class="text-sm text-gray-600 dark:text-gray-300">Find homes in Agadir — rent or buy, without the noise.</p>

	<AgiFiltersBar />

	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class="flex items-center gap-2">
			<h1 class="text-base font-semibold tracking-tight sm:text-lg">{$agiFilteredListings.length} homes found</h1>
			{#if $agiActiveFiltersCount > 0}
				<Badge
					color="gray"
					class="border border-gray-200 bg-white/70 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950/60 dark:text-gray-200"
				>
					{$agiActiveFiltersCount} filters
				</Badge>
			{/if}
		</div>

		<div class="flex items-center gap-2">
			{#if $agiIsAnyFilterActive}
				<Button color="light" onclick={resetAgiFilters}>Clear filters</Button>
			{/if}

			<div class="w-56">
				<Select
					aria-label="Sort listings"
					value={$agiFilters.sort as any}
					onchange={setSort}
					items={sortOptions.map((o) => ({ name: o.label, value: o.value }))}
				/>
			</div>

			<div class="inline-flex overflow-hidden rounded-xl border border-gray-200 bg-white/70 p-1 text-sm dark:border-gray-800 dark:bg-gray-950/60">
				<button
					type="button"
					class={
						'rounded-lg px-3 py-1.5 transition ' +
						((isDesktop ? !desktopShowMap : mobileView === 'list')
							? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
							: 'text-gray-700 hover:bg-white dark:text-gray-200 dark:hover:bg-gray-900')
					}
					onclick={selectListView}
				>
					List
				</button>
				<button
					type="button"
					class={
						'rounded-lg px-3 py-1.5 transition ' +
						((isDesktop ? desktopShowMap : mobileView === 'map')
							? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
							: 'text-gray-700 hover:bg-white dark:text-gray-200 dark:hover:bg-gray-900')
					}
					onclick={selectMapView}
				>
					Map
				</button>
			</div>
		</div>
	</div>

	{#if !isDesktop && mobileView === 'map'}
		<AgiMapPanel
			class="h-[calc(100vh-18rem)]"
			listings={$agiFilteredListings}
			selectedId={activeId}
			on:select={(e) => (pinnedId = e.detail.id)}
		/>
	{:else}
		<div class="grid gap-6 lg:grid-cols-[1fr,420px]">
			<div>
				<AgiListingsGrid
					listings={$agiFilteredListings}
					selectedId={activeId}
					on:select={(e) => (hoveredId = e.detail.id)}
				/>
			</div>

			<aside class="hidden lg:block">
				<div class="sticky top-24 space-y-3">
					<div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
						<span>Map</span>
						{#if $agiFilteredListings.length > 0}
							<span>{$agiFilteredListings.length} markers</span>
						{/if}
					</div>

					{#if isDesktop && desktopShowMap}
						<AgiMapPanel
							class="h-[calc(100vh-10rem)]"
							listings={$agiFilteredListings}
							selectedId={activeId}
							on:select={(e) => (pinnedId = e.detail.id)}
						/>
					{:else}
						<div class="grid h-[calc(100vh-10rem)] place-items-center rounded-2xl border border-dashed border-gray-300 bg-white/50 p-6 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-300">
							<p>Switch to Map view to load the map.</p>
						</div>
					{/if}
				</div>
			</aside>
		</div>
	{/if}

	<AgiLandlordCTA />
	<AgiFooter />
</div>
