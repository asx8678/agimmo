<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
</script>

<div class="grid gap-10 lg:grid-cols-2 lg:items-center">
	<div class="space-y-6">
		<p class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
			<span class="font-medium">Codex Agadir</span>
			<span class="text-gray-400 dark:text-gray-500">•</span>
			<span>Cloudflare Workers SaaS starter</span>
		</p>

		<h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">
			Launch a subscription SaaS on Cloudflare Workers in minutes
		</h1>
		<p class="text-lg text-gray-600 dark:text-gray-300">
			Auth, sessions, D1, Stripe subscriptions, invoices, and a clean Flowbite Svelte UI — wired end-to-end so you
			can build your product, not your boilerplate.
		</p>

		<div class="flex flex-wrap gap-3">
			<Button href="/signup">Get started</Button>
			<Button href="/pricing" color="light">View pricing</Button>
		</div>

		<p class="text-sm text-gray-500 dark:text-gray-400">
			Email/password auth • KV-backed sessions • D1 (SQLite) • Stripe Billing + webhooks
		</p>
	</div>

	<div class="grid gap-4">
		<Card class="border-0 shadow-lg">
			<h2 class="text-lg font-semibold">Production-ready foundations</h2>
			<ul class="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
				<li>Cloudflare Workers deployment with `wrangler.jsonc`</li>
				<li>Database migrations (D1) with Drizzle schema</li>
				<li>Server-side sessions stored in KV (cookie: `agi-session`)</li>
				<li>Stripe subscriptions with Payment Element + Customer Portal</li>
			</ul>
		</Card>

		<Card class="border-0 shadow-lg">
			<h2 class="text-lg font-semibold">Built for fast iteration</h2>
			<p class="mt-3 text-sm text-gray-600 dark:text-gray-300">
				Route groups + layouts, Zod validation + Superforms, and shared UI components keep your app consistent and
				maintainable.
			</p>
		</Card>
	</div>
</div>
