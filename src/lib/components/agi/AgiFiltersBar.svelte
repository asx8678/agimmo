<script lang="ts">
	import { Badge, Button, Drawer, Input, Label, Select, Toggle } from 'flowbite-svelte';

	import AgiZelligeCorner from '$lib/components/agi/AgiZelligeCorner.svelte';
	import AgiZelligeStripe from '$lib/components/agi/AgiZelligeStripe.svelte';
	import { agiActiveFilterChips, agiActiveFiltersCount, agiFilters, clearAgiFilter, resetAgiFilters, type AgiFilters, type AgiPropertyType, type AgiSort } from '$lib/stores/agi-filters';
	import { agiMockListings } from '$lib/data/agi-mock-listings';

	const propertyTypes: AgiPropertyType[] = ['Apartment', 'Studio', 'House', 'Riad'];
	const sortOptions: { label: string; value: AgiSort }[] = [
		{ label: 'Newest', value: 'newest' },
		{ label: 'Price low → high', value: 'price_asc' },
		{ label: 'Price high → low', value: 'price_desc' }
	];

	const suggestions = Array.from(
		new Set(
			agiMockListings
				.flatMap((l) => [l.city, l.neighborhood])
				.map((s) => s.trim())
				.filter(Boolean)
		)
	).slice(0, 12);

	let moreOpen = $state(false);

	const setFilters = (patch: Partial<AgiFilters>) => {
		agiFilters.update((f) => ({ ...f, ...patch }));
	};

	const onNumber = (key: keyof Pick<AgiFilters, 'minPrice' | 'maxPrice' | 'minBedrooms' | 'minBathrooms' | 'minAreaM2'>) =>
		(e: Event) => {
			const value = (e.currentTarget as HTMLInputElement | HTMLSelectElement).value;
			const num = value === '' ? undefined : Number(value);
			setFilters({ [key]: Number.isFinite(num as number) ? (num as number) : undefined } as Partial<AgiFilters>);
		};

	const onText = (key: keyof Pick<AgiFilters, 'locationQuery'>) => (e: Event) => {
		setFilters({ [key]: (e.currentTarget as HTMLInputElement).value } as Partial<AgiFilters>);
	};

	const onSelect = <K extends keyof Pick<AgiFilters, 'propertyType' | 'sort'>>(key: K) =>
		(e: Event) => {
			const value = (e.currentTarget as HTMLSelectElement).value;
			setFilters({ [key]: (value || undefined) as any } as Partial<AgiFilters>);
		};

	const onMode = (mode: 'rent' | 'buy') => () => setFilters({ mode });
</script>

<section class="sticky top-0 z-40 -mx-4 border-b border-gray-200 bg-gray-50/70 backdrop-blur dark:border-gray-800 dark:bg-gray-950/60 sm:-mx-6 lg:-mx-8">
	<div class="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
		<div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 p-3 shadow-sm ring-1 ring-white/60 dark:border-gray-800 dark:bg-gray-950/70 dark:ring-black/20">
			<AgiZelligeCorner corner="top-right" class="opacity-70" />

			<div class="flex flex-wrap items-center justify-between gap-3">
				<div class="flex items-center gap-2">
					<div class="inline-flex rounded-xl bg-gradient-to-r from-emerald-600/10 to-sky-600/10 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200/60 dark:text-gray-200 dark:ring-gray-800">
						Filters
					</div>
					{#if $agiActiveFiltersCount > 0}
						<span class="text-xs text-gray-500 dark:text-gray-400">{$agiActiveFiltersCount} active</span>
					{/if}
				</div>
				<div class="flex items-center gap-2">
					<Button color="light" class="hidden sm:inline-flex" disabled={$agiActiveFiltersCount === 0} onclick={resetAgiFilters}>
						Clear
					</Button>
					<Button color="light" class="sm:hidden" onclick={() => (moreOpen = true)}>More filters</Button>
				</div>
			</div>

			<div class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-12">
				<div class="lg:col-span-4">
					<Label for="agi-location" class="sr-only">Location</Label>
					<Input
						id="agi-location"
						placeholder="Search city or neighborhood"
						aria-label="Location"
						value={$agiFilters.locationQuery}
						data={suggestions}
						oninput={onText('locationQuery')}
					/>
				</div>

				<div class="lg:col-span-2">
					<div class="flex h-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-2 py-2 dark:border-gray-800 dark:bg-gray-950">
						<span class="text-xs font-medium text-gray-600 dark:text-gray-300">Mode</span>
						<div class="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-900">
							<button
								type="button"
								class={
									'rounded-md px-3 py-1 text-sm transition ' +
									($agiFilters.mode === 'rent'
										? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-100'
										: 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100')
								}
								onclick={onMode('rent')}
							>
								Rent
							</button>
							<button
								type="button"
								class={
									'rounded-md px-3 py-1 text-sm transition ' +
									($agiFilters.mode === 'buy'
										? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-100'
										: 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100')
								}
								onclick={onMode('buy')}
							>
								Buy
							</button>
						</div>
					</div>
				</div>

				<div class="lg:col-span-2">
					<Label for="agi-min-price" class="sr-only">Min price</Label>
					<Input
						id="agi-min-price"
						type="number"
						min="0"
						inputmode="numeric"
						placeholder="Min (MAD)"
						aria-label="Min price"
						value={$agiFilters.minPrice ?? ''}
						oninput={onNumber('minPrice')}
					/>
				</div>
				<div class="lg:col-span-2">
					<Label for="agi-max-price" class="sr-only">Max price</Label>
					<Input
						id="agi-max-price"
						type="number"
						min="0"
						inputmode="numeric"
						placeholder="Max (MAD)"
						aria-label="Max price"
						value={$agiFilters.maxPrice ?? ''}
						oninput={onNumber('maxPrice')}
					/>
				</div>

				<div class="lg:col-span-1">
					<Label for="agi-beds" class="sr-only">Bedrooms</Label>
					<Select
						id="agi-beds"
						aria-label="Min bedrooms"
						value={($agiFilters.minBedrooms ?? '') as any}
						onchange={onNumber('minBedrooms')}
						placeholder="Beds"
						items={[
							{ name: 'Any beds', value: '' },
							{ name: '1+', value: '1' },
							{ name: '2+', value: '2' },
							{ name: '3+', value: '3' },
							{ name: '4+', value: '4' }
						]}
					/>
				</div>

				<div class="lg:col-span-1">
					<Label for="agi-type" class="sr-only">Property type</Label>
					<Select
						id="agi-type"
						aria-label="Property type"
						value={($agiFilters.propertyType ?? '') as any}
						onchange={onSelect('propertyType')}
						placeholder="Type"
						items={[{ name: 'Any type', value: '' }, ...propertyTypes.map((t) => ({ name: t, value: t }))]}
					/>
				</div>

				<div class="hidden lg:col-span-12 lg:block">
					<div class="flex flex-wrap items-center justify-between gap-3">
						<div class="flex flex-wrap items-center gap-2">
							{#if $agiActiveFilterChips.length > 0}
								{#each $agiActiveFilterChips as chip (chip.key + chip.label)}
									<Badge
										color="gray"
										class="cursor-pointer select-none gap-2 border border-gray-200 bg-white/70 text-gray-700 hover:bg-white dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
										onclick={() => clearAgiFilter(chip.key)}
									>
										<span class="text-xs">{chip.label}</span>
										<span class="text-xs opacity-60">×</span>
									</Badge>
								{/each}
							{/if}
						</div>

						<div class="flex items-center gap-2">
							<Label for="agi-sort" class="sr-only">Sort</Label>
							<Select
								id="agi-sort"
								aria-label="Sort"
								value={$agiFilters.sort as any}
								onchange={onSelect('sort')}
								items={sortOptions.map((o) => ({ name: o.label, value: o.value }))}
							/>

							<Button color="light" onclick={() => (moreOpen = true)}>More</Button>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-3">
				<AgiZelligeStripe class="h-2 w-full opacity-70" />
			</div>
		</div>
	</div>

	<Drawer placement="bottom" bind:open={moreOpen} class="p-0">
		<div class="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
			<div class="flex items-center justify-between gap-3">
				<div>
					<p class="text-sm font-semibold text-gray-900 dark:text-gray-100">More filters</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">Keep it simple. Add only what you need.</p>
				</div>
				<Button color="light" onclick={() => (moreOpen = false)}>Done</Button>
			</div>
		</div>

		<div class="space-y-4 bg-gray-50 px-4 py-4 dark:bg-gray-950">
			<div class="grid gap-3 sm:grid-cols-2">
				<div>
					<Label for="agi-sort-mobile" class="mb-1 block text-sm">Sort</Label>
					<Select
						id="agi-sort-mobile"
						value={$agiFilters.sort as any}
						onchange={onSelect('sort')}
						items={sortOptions.map((o) => ({ name: o.label, value: o.value }))}
					/>
				</div>

				<div>
					<Label for="agi-baths" class="mb-1 block text-sm">Bathrooms (min)</Label>
					<Input
						id="agi-baths"
						type="number"
						min="0"
						inputmode="numeric"
						placeholder="Any"
						value={$agiFilters.minBathrooms ?? ''}
						oninput={onNumber('minBathrooms')}
					/>
				</div>

				<div>
					<Label for="agi-area" class="mb-1 block text-sm">Area (m² min)</Label>
					<Input
						id="agi-area"
						type="number"
						min="0"
						inputmode="numeric"
						placeholder="Any"
						value={$agiFilters.minAreaM2 ?? ''}
						oninput={onNumber('minAreaM2')}
					/>
				</div>

				<div class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-950">
					<Toggle
						checked={$agiFilters.showFurnishedOnly}
						onchange={() => setFilters({ showFurnishedOnly: !$agiFilters.showFurnishedOnly })}
					/>
					<div>
						<p class="text-sm font-medium text-gray-900 dark:text-gray-100">Furnished only</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">Show furnished listings.</p>
					</div>
				</div>
			</div>

			<div class="flex flex-wrap items-center justify-between gap-2">
				<Button color="light" disabled={$agiActiveFiltersCount === 0} onclick={resetAgiFilters}>Clear all</Button>
				<Button onclick={() => (moreOpen = false)} class="bg-gradient-to-r from-emerald-600 to-sky-600 text-white hover:from-emerald-500 hover:to-sky-500">
					View results
				</Button>
			</div>
		</div>
	</Drawer>
</section>
