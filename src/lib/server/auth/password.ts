const DEFAULT_PBKDF2_ITERS = 100_000;
const MAX_PBKDF2_ITERS = 100_000;

function clampIterations(value: unknown) {
	const n = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value);
	if (!Number.isFinite(n) || n <= 0) return DEFAULT_PBKDF2_ITERS;
	return Math.min(n, MAX_PBKDF2_ITERS);
}

function toHex(bytes: Uint8Array) {
	let hex = '';
	for (let i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, '0');
	return hex;
}

function fromHex(hex: string) {
	if (!/^[0-9a-f]*$/i.test(hex) || hex.length % 2 !== 0) throw new Error('Invalid hex');
	const out = new Uint8Array(hex.length / 2);
	for (let i = 0; i < out.length; i++) out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
	return out;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
	return diff === 0;
}

async function pbkdf2Sha256(password: string, salt: Uint8Array, iterations: number) {
	const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
		'deriveBits'
	]);
	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', hash: 'SHA-256', salt: salt as unknown as BufferSource, iterations },
		key,
		256
	);
	return new Uint8Array(bits);
}

export async function hashPassword(password: string, env: App.Platform['env']) {
	const iterations = clampIterations(env.AGI_PBKDF2_ITERS);
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const hash = await pbkdf2Sha256(password, salt, iterations);
	return `pbkdf2_sha256$${iterations}$${toHex(salt)}$${toHex(hash)}`;
}

export async function verifyPassword(password: string, stored: string) {
	const parts = stored.split('$');
	if (parts.length !== 4) return false;
	const [algo, itersRaw, saltHex, hashHex] = parts;
	if (algo !== 'pbkdf2_sha256') return false;

	let salt: Uint8Array;
	let expected: Uint8Array;
	const iterations = clampIterations(itersRaw);
	try {
		salt = fromHex(saltHex);
		expected = fromHex(hashHex);
	} catch {
		return false;
	}

	const actual = await pbkdf2Sha256(password, salt, iterations);
	return constantTimeEqual(actual, expected);
}
