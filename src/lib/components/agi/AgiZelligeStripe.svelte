<script lang="ts">
	type Variant = 'light' | 'dark';
	let { variant = 'light', class: className } = $props<{ variant?: Variant; class?: string }>();

	const colors = $derived(
		variant === 'dark'
			? { a: '#0EA5E9', b: '#34D399', o: 0.22 }
			: { a: '#0284C7', b: '#10B981', o: 0.18 }
	);
</script>

<svg
	aria-hidden="true"
	class={className ?? 'h-2 w-full'}
	viewBox="0 0 240 16"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	preserveAspectRatio="none"
>
	<defs>
		<pattern id="agi-zellige-stripe" width="24" height="16" patternUnits="userSpaceOnUse">
			<path d="M12 1 L23 8 L12 15 L1 8 Z" fill={colors.a} fill-opacity={colors.o} />
			<path d="M12 4 L18 8 L12 12 L6 8 Z" fill={colors.b} fill-opacity={colors.o} />
		</pattern>
		<linearGradient id="agi-zellige-fade" x1="0" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
			<stop stop-color="white" stop-opacity="0" />
			<stop offset="0.12" stop-color="white" stop-opacity="1" />
			<stop offset="0.88" stop-color="white" stop-opacity="1" />
			<stop offset="1" stop-color="white" stop-opacity="0" />
		</linearGradient>
		<mask id="agi-zellige-mask">
			<rect width="240" height="16" fill="url(#agi-zellige-fade)" />
		</mask>
	</defs>

	<g mask="url(#agi-zellige-mask)">
		<rect width="240" height="16" fill="url(#agi-zellige-stripe)" />
	</g>
</svg>
