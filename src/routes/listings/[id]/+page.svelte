<script lang="ts">
	import { Badge, Button, Card } from 'flowbite-svelte';

	import AgiZelligeLine from '$lib/components/agi/AgiZelligeLine.svelte';
	import type { AgiListing } from '$lib/types/agi-listing';

	let { data } = $props<{ data: { listing: AgiListing } }>();
	const listing = $derived(data.listing);
	const isRent = $derived(listing.mode === 'rent');

	const formatPrice = (amount: number) =>
		new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(amount);
</script>

<div class="space-y-6">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<Button href="/" color="light" class="agi-btn-light">← Back to results</Button>
		<p class="text-sm text-gray-500 dark:text-gray-400">{listing.neighborhood}, {listing.city}</p>
	</div>

	<div class="agi-surface relative overflow-hidden bg-white/60 dark:bg-gray-950/40">
		<div class="absolute inset-x-0 top-0">
			<AgiZelligeLine class="opacity-70" />
		</div>
		<img src={listing.coverImage} alt={listing.title} class="h-64 w-full object-cover sm:h-80" />
	</div>

	<div class="grid gap-6 lg:grid-cols-[1fr,320px]">
		<Card size="xl" class="rounded-2xl border-0 bg-white/70 p-6 shadow-sm ring-1 ring-gray-200/70 backdrop-blur dark:bg-gray-950/60 dark:ring-gray-800 sm:p-7">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div class="space-y-1">
					<h1 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{listing.title}</h1>
					<p class="text-sm text-gray-600 dark:text-gray-300">{listing.propertyType} • {listing.mode === 'rent' ? 'Rent' : 'Buy'}</p>
				</div>

				<div class="text-right">
					<p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
						{formatPrice(listing.price)} {listing.currency}{#if isRent}<span class="text-sm font-medium text-gray-500 dark:text-gray-400"> / mo</span>{/if}
					</p>
					<p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
						{listing.bedrooms} beds • {listing.bathrooms} baths • {listing.areaM2} m²
					</p>
				</div>
			</div>

			{#if listing.badges.length > 0}
				<div class="mt-4 flex flex-wrap gap-2">
					{#each listing.badges as b (b)}
						<Badge color="gray" class="border border-gray-200 bg-white/70 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-200">
							{b}
						</Badge>
					{/each}
				</div>
			{/if}

			<div class="mt-6 text-sm text-gray-600 dark:text-gray-300">
				<p class="font-medium text-gray-900 dark:text-gray-100">About this home</p>
				<p class="mt-2">
					Mock listing details page — wire this to your real listings table and photo storage when ready.
				</p>
			</div>
		</Card>

		<Card size="xl" class="rounded-2xl border-0 bg-white/70 p-6 shadow-sm ring-1 ring-gray-200/70 backdrop-blur dark:bg-gray-950/60 dark:ring-gray-800 sm:p-7">
			<h2 class="text-lg font-semibold">Next steps</h2>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
				Add contact actions, scheduling, and verified landlord profiles.
			</p>
			<div class="mt-5 flex flex-wrap gap-2">
				<Button href="/contact" class="agi-btn-primary">
					Contact
				</Button>
				<Button href="/" color="light" class="agi-btn-light">Keep browsing</Button>
			</div>
		</Card>
	</div>
</div>
