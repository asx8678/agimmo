<script lang="ts">
	type Corner = 'top-right' | 'bottom-left';
	let { corner = 'top-right', class: className } = $props<{ corner?: Corner; class?: string }>();

	const position = $derived(
		corner === 'top-right'
			? 'right-0 top-0 -translate-y-4 translate-x-4'
			: 'left-0 bottom-0 translate-y-4 -translate-x-4'
	);
</script>

<div class={"pointer-events-none absolute " + position + " " + (className ?? '')} aria-hidden="true">
	<svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<linearGradient id="agi-corner-g" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
				<stop stop-color="#0EA5E9" stop-opacity="0.16" />
				<stop offset="0.5" stop-color="#10B981" stop-opacity="0.12" />
				<stop offset="1" stop-color="#22C55E" stop-opacity="0.10" />
			</linearGradient>
			<pattern id="agi-corner-z" width="40" height="40" patternUnits="userSpaceOnUse">
				<path d="M20 3 L37 20 L20 37 L3 20 Z" fill="#0F766E" fill-opacity="0.12" />
				<path d="M20 10 L30 20 L20 30 L10 20 Z" fill="#0284C7" fill-opacity="0.10" />
			</pattern>
			<radialGradient id="agi-corner-v" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(80 80) rotate(90) scale(80)">
				<stop stop-color="white" stop-opacity="0.9" />
				<stop offset="1" stop-color="white" stop-opacity="0" />
			</radialGradient>
			<mask id="agi-corner-mask">
				<rect width="160" height="160" fill="url(#agi-corner-v)" />
			</mask>
		</defs>

		<g mask="url(#agi-corner-mask)">
			<rect width="160" height="160" rx="28" fill="url(#agi-corner-g)" />
			<rect width="160" height="160" rx="28" fill="url(#agi-corner-z)" opacity="0.9" />
		</g>
	</svg>
</div>
