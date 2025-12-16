<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
</script>

<div class="space-y-8">
	<header class="space-y-2">
		<h1 class="text-3xl font-semibold tracking-tight">Pricing</h1>
		<p class="text-gray-600 dark:text-gray-300">Start free, then upgrade when you’re ready.</p>
	</header>

	<div class="grid gap-6 md:grid-cols-2">
		<Card size="xl" class="rounded-2xl border-0 bg-white/80 p-6 shadow-xl ring-1 ring-gray-200/70 backdrop-blur dark:bg-gray-950/60 dark:ring-gray-800 sm:p-7">
			<h2 class="text-xl font-semibold">Free</h2>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">For trying the starter and building your MVP.</p>
			<p class="mt-6 text-4xl font-semibold">$0</p>
			<ul class="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
				<li>Dashboard access</li>
				<li>Local development workflow</li>
				<li>Upgrade anytime</li>
			</ul>
			<div class="mt-8">
				<Button href="/signup" color="light" class="agi-btn-light">Create account</Button>
			</div>
		</Card>

		<Card
			size="xl"
			class="rounded-2xl border-0 bg-white/80 p-6 shadow-xl ring-1 ring-blue-200 backdrop-blur dark:bg-gray-950/60 dark:ring-blue-900 sm:p-7"
		>
			<div class="flex items-center justify-between gap-3">
				<h2 class="text-xl font-semibold">Pro</h2>
				<span class="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">Best value</span>
			</div>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">For production SaaS with subscriptions.</p>
			<p class="mt-6 text-4xl font-semibold">$19</p>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">per month</p>
			<ul class="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
				<li>Stripe subscriptions + invoices</li>
				<li>Customer Portal</li>
				<li>Webhook-driven billing state</li>
			</ul>
			<div class="mt-8 flex flex-wrap gap-3">
				<Button href="/signup" class="agi-btn-primary">Get started</Button>
				<Button href="/signin" color="light" class="agi-btn-light">I already have an account</Button>
			</div>
		</Card>
	</div>
</div>
