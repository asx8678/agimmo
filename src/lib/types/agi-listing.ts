export type AgiListing = {
	id: string;
	mode: 'rent' | 'buy';
	title: string;
	city: string;
	neighborhood: string;
	lat: number;
	lng: number;
	price: number;
	currency: 'MAD';
	period?: 'month';
	bedrooms: number;
	bathrooms: number;
	areaM2: number;
	propertyType: 'Apartment' | 'Studio' | 'House' | 'Riad';
	furnished: boolean;
	badges: string[];
	coverImage: string;
	createdAt: string;
};

