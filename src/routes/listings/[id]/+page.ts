import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import { agiMockListings } from '$lib/data/agi-mock-listings';

export const load: PageLoad = ({ params }) => {
	const listing = agiMockListings.find((l) => l.id === params.id);
	if (!listing) throw error(404, 'Listing not found');
	return { listing };
};

