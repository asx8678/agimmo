<script lang="ts">
	import AgiZelligeStripe from '$lib/components/agi/AgiZelligeStripe.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="pt-10">
	<AgiZelligeStripe class="h-2 w-full opacity-60" />
	<div class="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-6 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300 sm:flex-row sm:items-center sm:justify-between">
		<p>© {year} Agimmo</p>
		<div class="flex flex-wrap gap-x-5 gap-y-2">
			<a class="hover:text-gray-900 hover:underline dark:hover:text-gray-100" href="/terms">Terms</a>
			<a class="hover:text-gray-900 hover:underline dark:hover:text-gray-100" href="/privacy">Privacy</a>
			<a class="hover:text-gray-900 hover:underline dark:hover:text-gray-100" href="/contact">Contact</a>
		</div>
	</div>
</footer>

