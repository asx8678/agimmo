<script lang="ts">
	import { Card } from 'flowbite-svelte';

	let { data } = $props();
</script>

<div class="space-y-8">
	<header class="space-y-2">
		<h1 class="text-3xl font-semibold tracking-tight">Dashboard</h1>
		<p class="text-gray-600 dark:text-gray-300">You’re signed in as {data.user.email}.</p>
	</header>

	<div class="grid gap-6 md:grid-cols-2">
		<Card class="border-0 shadow-lg">
			<h2 class="text-lg font-semibold">Next steps</h2>
			<ul class="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
				<li>Visit the billing page to start a subscription</li>
				<li>Configure Stripe webhooks to keep your billing state in sync</li>
				<li>Build your product on top of the starter</li>
			</ul>
		</Card>

		<Card class="border-0 shadow-lg">
			<h2 class="text-lg font-semibold">Billing</h2>
			<p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
				Your subscription status and invoices live in <a class="font-medium text-blue-700 hover:underline dark:text-blue-400" href="/billing">Billing</a>.
			</p>
		</Card>
	</div>
</div>

