<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	import type { AgiListing } from '$lib/types/agi-listing';

	type Leaflet = typeof import('leaflet');

	const dispatch = createEventDispatcher<{
		select: { id: string };
	}>();

	let { listings, selectedId, class: className } = $props<{
		listings: AgiListing[];
		selectedId: string | null;
		class?: string;
	}>();

	let container = $state<HTMLDivElement | null>(null);
	let L = $state.raw<Leaflet | null>(null);
	let map = $state.raw<import('leaflet').Map | null>(null);
	let markers = $state.raw(new Map<string, import('leaflet').CircleMarker>());
	let didFit = $state(false);

	const selectedStyle = {
		radius: 10,
		weight: 2,
		color: '#059669',
		fillColor: '#10B981',
		fillOpacity: 0.75
	} as const;

	const normalStyle = {
		radius: 7,
		weight: 2,
		color: '#0284C7',
		fillColor: '#0EA5E9',
		fillOpacity: 0.65
	} as const;

	const formatPrice = (l: AgiListing) => {
		const amount = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(l.price);
		return l.mode === 'rent' ? `${amount} MAD / mo` : `${amount} MAD`;
	};

	const fitToListings = () => {
		if (!map || listings.length === 0 || !L) return;
		const bounds = L.latLngBounds(listings.map((l: AgiListing) => [l.lat, l.lng] as [number, number]));
		map.fitBounds(bounds.pad(0.15), { animate: false });
		didFit = true;
	};

	const highlightSelected = () => {
		if (!map || !L) return;
		for (const [id, marker] of markers) {
			marker.setStyle(id === selectedId ? selectedStyle : normalStyle);
			marker.setRadius(id === selectedId ? selectedStyle.radius : normalStyle.radius);
		}
	};

	const syncMarkersForListings = () => {
		if (!map || !L) return;

		const ids = new Set(listings.map((l: AgiListing) => l.id));
		for (const [id, marker] of markers) {
			if (!ids.has(id)) {
				marker.remove();
				markers.delete(id);
			}
		}

		for (const listing of listings) {
			const existing = markers.get(listing.id);
			if (existing) continue;

			const marker = L.circleMarker([listing.lat, listing.lng], normalStyle);
			marker.bindTooltip(formatPrice(listing), { direction: 'top', opacity: 0.9 });
			marker.on('click', () => dispatch('select', { id: listing.id }));
			marker.addTo(map);
			markers.set(listing.id, marker);
		}

		for (const marker of markers.values()) marker.setStyle(normalStyle);
		if (!didFit) fitToListings();
	};

	onMount(async () => {
		if (!container) return;
		const [leafletMod] = await Promise.all([
			import('leaflet'),
			import('leaflet/dist/leaflet.css')
		]);
		const leaflet = (leafletMod as any).default ?? leafletMod;
		L = leaflet as Leaflet;

		const createdMap = leaflet.map(container, {
			zoomControl: true,
			attributionControl: false
		});
		map = createdMap;

		leaflet
			.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; OpenStreetMap contributors'
			})
			.addTo(createdMap);

		leaflet.control
			.attribution({ position: 'bottomright' })
			.addAttribution('&copy; OpenStreetMap')
			.addTo(createdMap);

		if (listings.length === 0) {
			createdMap.setView([30.4278, -9.5981], 12);
		} else {
			didFit = false;
			fitToListings();
		}

		syncMarkersForListings();
		highlightSelected();
	});

	$effect(() => {
		if (!map || !L) return;
		didFit = false;
		syncMarkersForListings();
	});

	$effect(() => {
		if (!map || !L) return;
		highlightSelected();
	});

	onDestroy(() => {
		for (const marker of markers.values()) marker.remove();
		markers.clear();
		map?.remove();
		map = null;
	});
</script>

<div class={className ?? ''}>
	<div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/60 dark:border-gray-800 dark:bg-gray-950/40">
		<div bind:this={container} class="h-full min-h-[320px] w-full"></div>
		<noscript>
			<div class="absolute inset-0 grid place-items-center p-6 text-sm text-gray-600 dark:text-gray-300">
				Enable JavaScript to view the map.
			</div>
		</noscript>
	</div>
</div>
