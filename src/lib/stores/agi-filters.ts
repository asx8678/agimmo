import { derived, writable } from 'svelte/store';

import { agiMockListings } from '$lib/data/agi-mock-listings';
import type { AgiListing } from '$lib/types/agi-listing';

export type AgiSort = 'newest' | 'price_asc' | 'price_desc';
export type AgiMode = 'rent' | 'buy';
export type AgiPropertyType = AgiListing['propertyType'];

export type AgiFilters = {
	locationQuery: string;
	mode: AgiMode;
	minPrice?: number;
	maxPrice?: number;
	minBedrooms?: number;
	propertyType?: AgiPropertyType;
	sort: AgiSort;
	showFurnishedOnly: boolean;
	minBathrooms?: number;
	minAreaM2?: number;
};

export const agiDefaultFilters: AgiFilters = {
	locationQuery: '',
	mode: 'rent',
	minPrice: undefined,
	maxPrice: undefined,
	minBedrooms: undefined,
	propertyType: undefined,
	sort: 'newest',
	showFurnishedOnly: false,
	minBathrooms: undefined,
	minAreaM2: undefined
};

export const agiFilters = writable<AgiFilters>({ ...agiDefaultFilters });

const matchesLocation = (listing: AgiListing, query: string) => {
	if (!query) return true;
	const q = query.trim().toLowerCase();
	if (!q) return true;
	return (
		listing.city.toLowerCase().includes(q) ||
		listing.neighborhood.toLowerCase().includes(q) ||
		listing.title.toLowerCase().includes(q)
	);
};

const toNumberOrUndefined = (value: unknown) => {
	if (value === null || value === undefined) return undefined;
	const n = typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : NaN;
	if (!Number.isFinite(n)) return undefined;
	return n;
};

export const agiFilteredListings = derived(agiFilters, ($filters) => {
	const query = $filters.locationQuery;
	const minPrice = toNumberOrUndefined($filters.minPrice);
	const maxPrice = toNumberOrUndefined($filters.maxPrice);
	const minBedrooms = toNumberOrUndefined($filters.minBedrooms);
	const minBathrooms = toNumberOrUndefined($filters.minBathrooms);
	const minAreaM2 = toNumberOrUndefined($filters.minAreaM2);

	const filtered = agiMockListings.filter((l) => {
		if (l.mode !== $filters.mode) return false;
		if (!matchesLocation(l, query)) return false;
		if ($filters.propertyType && l.propertyType !== $filters.propertyType) return false;
		if ($filters.showFurnishedOnly && !l.furnished) return false;
		if (minPrice !== undefined && l.price < minPrice) return false;
		if (maxPrice !== undefined && l.price > maxPrice) return false;
		if (minBedrooms !== undefined && l.bedrooms < minBedrooms) return false;
		if (minBathrooms !== undefined && l.bathrooms < minBathrooms) return false;
		if (minAreaM2 !== undefined && l.areaM2 < minAreaM2) return false;
		return true;
	});

	const sorted = [...filtered].sort((a, b) => {
		if ($filters.sort === 'price_asc') return a.price - b.price;
		if ($filters.sort === 'price_desc') return b.price - a.price;
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	return sorted;
});

export const agiIsAnyFilterActive = derived(agiFilters, ($filters) => {
	return (
		($filters.locationQuery?.trim()?.length ?? 0) > 0 ||
		$filters.mode !== agiDefaultFilters.mode ||
		$filters.minPrice !== undefined ||
		$filters.maxPrice !== undefined ||
		$filters.minBedrooms !== undefined ||
		$filters.propertyType !== undefined ||
		$filters.sort !== agiDefaultFilters.sort ||
		$filters.showFurnishedOnly !== agiDefaultFilters.showFurnishedOnly ||
		$filters.minBathrooms !== undefined ||
		$filters.minAreaM2 !== undefined
	);
});

export type AgiActiveFilterChip = { key: keyof AgiFilters; label: string };

export const agiActiveFilterChips = derived(agiFilters, ($filters): AgiActiveFilterChip[] => {
	const chips: AgiActiveFilterChip[] = [];

	const q = $filters.locationQuery.trim();
	if (q) chips.push({ key: 'locationQuery', label: `“${q}”` });
	if ($filters.mode !== agiDefaultFilters.mode) chips.push({ key: 'mode', label: $filters.mode === 'rent' ? 'Rent' : 'Buy' });
	if ($filters.propertyType) chips.push({ key: 'propertyType', label: $filters.propertyType });
	if ($filters.minBedrooms !== undefined) chips.push({ key: 'minBedrooms', label: `${$filters.minBedrooms}+ beds` });
	if ($filters.minBathrooms !== undefined) chips.push({ key: 'minBathrooms', label: `${$filters.minBathrooms}+ baths` });
	if ($filters.minAreaM2 !== undefined) chips.push({ key: 'minAreaM2', label: `${$filters.minAreaM2}+ m²` });
	if ($filters.showFurnishedOnly) chips.push({ key: 'showFurnishedOnly', label: 'Furnished' });

	if ($filters.minPrice !== undefined || $filters.maxPrice !== undefined) {
		const min = $filters.minPrice !== undefined ? `${$filters.minPrice}` : 'Any';
		const max = $filters.maxPrice !== undefined ? `${$filters.maxPrice}` : 'Any';
		chips.push({ key: 'minPrice', label: `${min}–${max} MAD` });
	}

	if ($filters.sort !== agiDefaultFilters.sort) {
		const label =
			$filters.sort === 'price_asc' ? 'Price ↑' : $filters.sort === 'price_desc' ? 'Price ↓' : 'Newest';
		chips.push({ key: 'sort', label });
	}

	return chips;
});

export const agiActiveFiltersCount = derived(agiActiveFilterChips, ($chips) => $chips.length);

export function resetAgiFilters() {
	agiFilters.set({ ...agiDefaultFilters });
}

export function clearAgiFilter(key: keyof AgiFilters) {
	agiFilters.update((f) => {
		const next: AgiFilters = { ...f };
		if (key === 'locationQuery') next.locationQuery = '';
		else if (key === 'mode') next.mode = agiDefaultFilters.mode;
		else if (key === 'sort') next.sort = agiDefaultFilters.sort;
		else if (key === 'showFurnishedOnly') next.showFurnishedOnly = false;
		else (next as any)[key] = undefined;

		return next;
	});
}

