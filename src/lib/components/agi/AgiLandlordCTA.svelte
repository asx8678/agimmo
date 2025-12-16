<script lang="ts">
	import { Button } from 'flowbite-svelte';

	import AgiZelligeLine from '$lib/components/agi/AgiZelligeLine.svelte';
</script>

<section aria-label="List your property" class="pt-2">
	<div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-emerald-600/10 to-sky-600/10 p-6 ring-1 ring-white/60 dark:border-gray-800 dark:from-emerald-500/10 dark:to-sky-500/10 dark:ring-black/20 sm:p-8">
		<div class="absolute inset-x-0 top-0">
			<AgiZelligeLine class="opacity-70" />
		</div>

		<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
			<div class="max-w-xl">
				<h2 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
					List your property — reach serious renters & buyers
				</h2>
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
					No fluff. Just a clean listing flow, pricing clarity, and map-first discovery.
				</p>
			</div>

			<div class="flex flex-wrap gap-2">
				<Button
					href="/list-property"
					class="bg-gradient-to-r from-emerald-600 to-sky-600 text-white hover:from-emerald-500 hover:to-sky-500"
				>
					List a property
				</Button>
				<Button href="/signin" color="light">Sign in</Button>
			</div>
		</div>
	</div>
</section>
