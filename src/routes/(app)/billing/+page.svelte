<script lang="ts">
	import { Card } from 'flowbite-svelte';

	let { data } = $props();
</script>

<div class="space-y-8">
	<header class="space-y-2">
		<h1 class="text-3xl font-semibold tracking-tight">Billing</h1>
		<p class="text-gray-600 dark:text-gray-300">Manage your subscription and invoices.</p>
	</header>

	<Card class="border-0 shadow-lg">
		<p class="text-sm text-gray-600 dark:text-gray-300">
			Stripe billing is configured, but you still need to set your Stripe keys and price ID. Once set, you can start
			a subscription from here.
		</p>
		<p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
			Signed in as <span class="font-medium">{data.user.email}</span>.
		</p>
	</Card>
</div>

