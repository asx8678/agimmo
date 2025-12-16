<script lang="ts">
	import { Badge, Card, Tooltip } from 'flowbite-svelte';
	import { HeartSolid, HeartOutline } from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';

	import type { AgiListing } from '$lib/types/agi-listing';

	const dispatch = createEventDispatcher<{
		hover: { id: string };
		unhover: { id: string };
		toggleSave: { id: string };
	}>();

	let { listing, selected = false, saved = false } = $props<{
		listing: AgiListing;
		selected?: boolean;
		saved?: boolean;
	}>();

	const isRent = $derived(listing.mode === 'rent');
	const saveBtnId = $derived(`agi-save-${listing.id}`);

	const formatPrice = (amount: number) =>
		new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(amount);

	const badgeColor = (b: string) =>
		b.toLowerCase().includes('new')
			? 'blue'
			: b.toLowerCase().includes('sea')
				? 'cyan'
				: b.toLowerCase().includes('furnished')
					? 'emerald'
					: 'gray';

	const onSave = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dispatch('toggleSave', { id: listing.id });
	};
</script>

<a
	href={`/listings/${listing.id}`}
	class="group block focus:outline-none"
	onmouseenter={() => dispatch('hover', { id: listing.id })}
	onmouseleave={() => dispatch('unhover', { id: listing.id })}
	onfocusin={() => dispatch('hover', { id: listing.id })}
	onfocusout={() => dispatch('unhover', { id: listing.id })}
>
	<Card
		class={
			'relative overflow-hidden border-0 bg-white/80 shadow-sm ring-1 ring-gray-200/70 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm hover:ring-emerald-500/15 dark:bg-gray-950/60 dark:ring-gray-800 dark:hover:ring-emerald-400/15 ' +
			(selected ? 'ring-2 ring-emerald-500/60 dark:ring-emerald-400/50' : '')
		}
	>
		<div class="relative -mx-6 -mt-6 mb-4 overflow-hidden">
			<img
				alt={listing.title}
				src={listing.coverImage}
				loading="lazy"
				class="h-44 w-full object-cover sm:h-48"
			/>
			<div class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-emerald-500/0 via-sky-500/0 to-emerald-500/0 opacity-0 transition duration-200 group-hover:opacity-100 group-hover:from-emerald-500/14 group-hover:via-sky-500/10 group-hover:to-emerald-500/8"></div>

			<div class="absolute left-3 top-3">
				<span class="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-800 ring-1 ring-gray-200/70 backdrop-blur dark:bg-gray-950/70 dark:text-gray-200 dark:ring-gray-800">
					{listing.propertyType}
				</span>
			</div>

			<div class="absolute bottom-3 left-3 rounded-xl bg-white/90 px-3 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-gray-200/70 backdrop-blur dark:bg-gray-950/70 dark:text-gray-100 dark:ring-gray-800">
				{formatPrice(listing.price)} {listing.currency}{#if isRent}<span class="text-xs font-medium text-gray-500 dark:text-gray-400"> / mo</span>{/if}
			</div>

			<div class="absolute right-3 top-3">
				<button
					id={saveBtnId}
					type="button"
					class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 ring-1 ring-gray-200/70 backdrop-blur transition hover:bg-white hover:text-gray-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200/60 dark:bg-gray-950/70 dark:text-gray-200 dark:ring-gray-800 dark:hover:text-white dark:focus-visible:ring-emerald-900/40"
					onclick={onSave}
					aria-label={saved ? 'Unsave listing' : 'Save listing'}
				>
					{#if saved}
						<HeartSolid class="h-5 w-5 text-rose-600" />
					{:else}
						<HeartOutline class="h-5 w-5" />
					{/if}
				</button>
				<Tooltip triggeredBy={'#' + saveBtnId} placement="left" class="text-xs">
					{saved ? 'Saved' : 'Save'}
				</Tooltip>
			</div>
		</div>

		<div class="space-y-2">
			<h3 class="line-clamp-1 text-base font-semibold tracking-tight">{listing.title}</h3>

			<p class="text-sm text-gray-600 dark:text-gray-300">
				{listing.neighborhood}, {listing.city}
			</p>

			<p class="text-sm text-gray-600 dark:text-gray-300">
				{listing.bedrooms} beds • {listing.bathrooms} baths • {listing.areaM2} m²
			</p>

			{#if listing.badges.length > 0}
				<div class="flex flex-wrap gap-1.5 pt-1">
					{#each listing.badges as b (b)}
						<Badge color={badgeColor(b)} class="border border-gray-200/60 bg-white/70 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-200">
							{b}
						</Badge>
					{/each}
				</div>
			{/if}
		</div>
	</Card>
</a>
