<script lang="ts">
	import { Badge } from 'flowbite-svelte';

	let { status } = $props<{ status: string | null | undefined }>();

	const normalized = $derived((status ?? 'none').toLowerCase());
	const color = $derived(
		normalized === 'active' || normalized === 'trialing'
			? 'green'
			: normalized === 'past_due' || normalized === 'unpaid'
				? 'yellow'
				: normalized === 'canceled' || normalized === 'incomplete_expired'
					? 'red'
					: normalized === 'incomplete'
						? 'purple'
						: 'gray'
	);

	const label = $derived(normalized.replaceAll('_', ' '));
</script>

<Badge {color} class="capitalize">{label}</Badge>
