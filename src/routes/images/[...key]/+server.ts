import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	const placeholderUrl = '/agi/listing-placeholder.svg';
	const key = params.key;

	const redirectToPlaceholder = () =>
		new Response(null, {
			status: 302,
			headers: {
				location: placeholderUrl
			}
		});

	if (!key) {
		return redirectToPlaceholder();
	}

	const bucket = platform?.env?.AGI_IMAGES;
	if (!bucket) {
		return redirectToPlaceholder();
	}

	const object = await bucket.get(key);
	if (!object) {
		return redirectToPlaceholder();
	}

	const headers: Record<string, string> = {};
	const meta = object.httpMetadata;
	if (meta?.contentType) headers['content-type'] = meta.contentType;
	if (meta?.contentLanguage) headers['content-language'] = meta.contentLanguage;
	if (meta?.contentDisposition) headers['content-disposition'] = meta.contentDisposition;
	if (meta?.contentEncoding) headers['content-encoding'] = meta.contentEncoding;
	if (meta?.cacheControl) headers['cache-control'] = meta.cacheControl;
	if (meta?.cacheExpiry) headers.expires = meta.cacheExpiry.toUTCString();
	headers.etag = object.httpEtag;

	if (!headers['cache-control']) {
		headers['cache-control'] = 'public, max-age=31536000, immutable';
	}

	return new Response(object.body as unknown as BodyInit, { headers });
};
