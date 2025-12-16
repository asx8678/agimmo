<script lang="ts">
	import AgiZelligeLine from '$lib/components/agi/AgiZelligeLine.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="pt-10">
	<AgiZelligeLine class="opacity-60" />
	<div class="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-6 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300 sm:flex-row sm:items-center sm:justify-between">
		<p>© {year} Agimmo</p>
		<div class="flex flex-wrap gap-x-5 gap-y-2">
			<a class="agi-link" href="/terms">Terms</a>
			<a class="agi-link" href="/privacy">Privacy</a>
			<a class="agi-link" href="/contact">Contact</a>
		</div>
	</div>
</footer>
