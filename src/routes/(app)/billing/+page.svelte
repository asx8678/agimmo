<script lang="ts">
	import { Alert, Button, Card, Modal, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { loadStripe, type Stripe, type StripeElements, type StripePaymentElement } from '@stripe/stripe-js';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { tick } from 'svelte';

	import LoadingButton from '$lib/components/LoadingButton.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';

	let { data } = $props();

	const subscriptionStatus = $derived(data.billing.subscriptionStatus);
	const isSubscribed = $derived(subscriptionStatus === 'active' || subscriptionStatus === 'trialing');
	const currentPlan = $derived(isSubscribed ? 'Pro' : 'Free');

	let subscribeOpen = $state(false);
	let subscribeLoading = $state(false);
	let confirmLoading = $state(false);
	let subscribeError = $state<string | null>(null);

	let stripe = $state.raw<Stripe | null>(null);
	let elements = $state.raw<StripeElements | null>(null);
	let paymentElement = $state.raw<StripePaymentElement | null>(null);
	let paymentMount = $state.raw<HTMLDivElement | null>(null);

	const cleanupStripeUi = () => {
		try {
			paymentElement?.unmount();
		} catch {
			// ignore
		}
		paymentElement = null;
		elements = null;
		stripe = null;
	};

	$effect(() => {
		if (!subscribeOpen) {
			subscribeError = null;
			subscribeLoading = false;
			confirmLoading = false;
			cleanupStripeUi();
		}
	});

	const openSubscribe = async () => {
		if (!data.stripe.ready) return;
		subscribeError = null;
		confirmLoading = false;
		subscribeLoading = true;
		subscribeOpen = true;
		cleanupStripeUi();

		try {
			const res = await fetch('/api/stripe/create-subscription', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ priceId: data.stripe.pricePro })
			});
			const payload = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(payload?.error || 'Could not start subscription');

			stripe = await loadStripe(data.stripe.publishableKey);
			if (!stripe) throw new Error('Could not load Stripe.js');

			await tick();
			if (!paymentMount) throw new Error('Payment UI not ready');

			elements = stripe.elements({
				clientSecret: payload.clientSecret,
				appearance: { theme: 'stripe' }
			});
			paymentElement = elements.create('payment');
			paymentElement.mount(paymentMount);
		} catch (err) {
			subscribeError = err instanceof Error ? err.message : 'Could not start subscription';
		} finally {
			subscribeLoading = false;
		}
	};

	const confirmPayment = async () => {
		if (!stripe || !elements) return;
		confirmLoading = true;
		subscribeError = null;

		try {
			const { error } = await stripe.confirmPayment({
				elements,
				confirmParams: { return_url: new URL('/billing?success=1', data.stripe.appUrl).toString() },
				redirect: 'if_required'
			});

			if (error) throw new Error(error.message || 'Payment confirmation failed');

			subscribeOpen = false;
			cleanupStripeUi();
			await invalidateAll();
		} catch (err) {
			subscribeError = err instanceof Error ? err.message : 'Payment confirmation failed';
		} finally {
			confirmLoading = false;
		}
	};

	const closeModal = () => {
		subscribeOpen = false;
		subscribeError = null;
		subscribeLoading = false;
		confirmLoading = false;
		cleanupStripeUi();
	};

	const formatAmount = (amount: number | null, currency: string | null) => {
		if (amount === null || !currency) return '—';
		try {
			return new Intl.NumberFormat(undefined, {
				style: 'currency',
				currency: currency.toUpperCase()
			}).format(amount / 100);
		} catch {
			return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
		}
	};

	const formatDate = (unixSeconds: number) => new Date(unixSeconds * 1000).toLocaleDateString();
</script>

<div class="space-y-8">
	<header class="space-y-2">
		<h1 class="text-3xl font-semibold tracking-tight">Billing</h1>
		<p class="text-gray-600 dark:text-gray-300">Manage your subscription and invoices.</p>
	</header>

	{#if page.url.searchParams.get('success')}
		<Alert color="green">Payment confirmed. Your subscription will update shortly.</Alert>
	{/if}

	{#if !data.stripe.ready}
		<Alert color="amber">
			Stripe is not configured yet. Set `AGI_STRIPE_SECRET_KEY`, `AGI_STRIPE_PUBLISHABLE_KEY`, and `AGI_STRIPE_PRICE_PRO`
			to enable subscriptions.
		</Alert>
	{/if}

	<div class="grid gap-6 md:grid-cols-2">
		<Card class="border-0 shadow-lg">
			<div class="flex items-start justify-between gap-4">
				<div>
					<h2 class="text-lg font-semibold">Current plan</h2>
					<p class="mt-1 text-sm text-gray-600 dark:text-gray-300">Signed in as {data.user.email}</p>
				</div>
				<div class="text-right">
					<p class="text-sm text-gray-500 dark:text-gray-400">Status</p>
					<StatusBadge status={data.billing.subscriptionStatus} />
				</div>
			</div>

			<div class="mt-6 flex items-end justify-between gap-4">
				<div>
					<p class="text-3xl font-semibold">{currentPlan}</p>
					<p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
						{#if isSubscribed}
							You have access to Pro features.
						{:else}
							Upgrade to Pro to enable subscriptions and invoices.
						{/if}
					</p>
				</div>

				<div class="flex flex-wrap justify-end gap-2">
					<form method="POST" action="/api/stripe/portal">
						<Button type="submit" color="light" disabled={!data.stripe.ready}>Manage billing</Button>
					</form>
					{#if !isSubscribed}
						<Button onclick={openSubscribe} disabled={!data.stripe.ready}>Subscribe</Button>
					{/if}
				</div>
			</div>
		</Card>

		<Card class="border-0 shadow-lg">
			<h2 class="text-lg font-semibold">Pro plan</h2>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Payment Element checkout + webhook-driven state.</p>
			<p class="mt-6 text-4xl font-semibold">$19</p>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">per month</p>
			<ul class="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
				<li>Stripe Customer Portal</li>
				<li>Invoice history in-app</li>
				<li>Subscription status badge</li>
			</ul>
			<div class="mt-8">
				<Button onclick={openSubscribe} disabled={!data.stripe.ready || isSubscribed}>Subscribe</Button>
			</div>
		</Card>
	</div>

	<Card class="border-0 shadow-lg">
		<div class="flex items-center justify-between gap-4">
			<div>
				<h2 class="text-lg font-semibold">Invoices</h2>
				<p class="mt-1 text-sm text-gray-600 dark:text-gray-300">Latest invoices for your Stripe customer.</p>
			</div>
		</div>

		{#if data.invoices.length === 0}
			<p class="mt-4 text-sm text-gray-600 dark:text-gray-300">No invoices yet.</p>
		{:else}
			<div class="mt-4 overflow-x-auto">
				<Table striped>
					<TableHead>
						<TableHeadCell>Date</TableHeadCell>
						<TableHeadCell>Invoice</TableHeadCell>
						<TableHeadCell>Status</TableHeadCell>
						<TableHeadCell>Paid</TableHeadCell>
						<TableHeadCell>Due</TableHeadCell>
						<TableHeadCell>Link</TableHeadCell>
					</TableHead>
					<TableBody>
						{#each data.invoices as inv (inv.id)}
							<TableBodyRow>
								<TableBodyCell>{formatDate(inv.created)}</TableBodyCell>
								<TableBodyCell>{inv.number ?? inv.id}</TableBodyCell>
								<TableBodyCell>{inv.status ?? '—'}</TableBodyCell>
								<TableBodyCell>{formatAmount(inv.amountPaid, inv.currency)}</TableBodyCell>
								<TableBodyCell>{formatAmount(inv.amountDue, inv.currency)}</TableBodyCell>
								<TableBodyCell>
									{#if inv.hostedInvoiceUrl}
										<a
											class="font-medium text-blue-700 hover:underline dark:text-blue-400"
											href={inv.hostedInvoiceUrl}
											target="_blank"
											rel="noreferrer"
											>View</a
										>
									{:else}
										—
									{/if}
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		{/if}
	</Card>

	<Modal bind:open={subscribeOpen} title="Subscribe to Pro" size="lg">
		{#if subscribeError}
			<Alert color="red" class="mb-4">{subscribeError}</Alert>
		{/if}

		{#if subscribeLoading}
			<p class="text-sm text-gray-600 dark:text-gray-300">Preparing checkout…</p>
		{:else}
			<div class="space-y-4">
				<div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
					<div bind:this={paymentMount}></div>
				</div>

				<div class="flex flex-wrap justify-end gap-2">
					<Button color="light" onclick={closeModal}>Cancel</Button>
					<LoadingButton onclick={confirmPayment} loading={confirmLoading} disabled={subscribeLoading || !stripe}>
						Confirm payment
					</LoadingButton>
				</div>
			</div>
		{/if}
	</Modal>
</div>
