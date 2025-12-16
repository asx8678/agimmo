import Stripe from 'stripe';

const stripeClients = new Map<string, Stripe>();

export function getStripe(env: App.Platform['env']) {
	const key = env.AGI_STRIPE_SECRET_KEY;
	if (!key) throw new Error('Missing AGI_STRIPE_SECRET_KEY');

	const existing = stripeClients.get(key);
	if (existing) return existing;

	const stripe = new Stripe(key, {
		apiVersion: Stripe.API_VERSION as Stripe.LatestApiVersion,
		httpClient: Stripe.createFetchHttpClient()
	});

	stripeClients.set(key, stripe);
	return stripe;
}
