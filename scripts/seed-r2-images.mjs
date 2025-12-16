import { spawn } from 'node:child_process';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const BUCKET_NAME = process.env.AGI_R2_BUCKET ?? 'agi-images';
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

const LISTING_IMAGES = [
	{
		id: 'agi-lst-001',
		unsplash: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
	},
	{
		id: 'agi-lst-002',
		unsplash: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
	},
	{
		id: 'agi-lst-003',
		unsplash: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'
	},
	{
		id: 'agi-lst-004',
		unsplash: 'https://images.unsplash.com/photo-1613575831056-0acd5da8f085'
	},
	{
		id: 'agi-lst-005',
		unsplash: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914'
	},
	{
		id: 'agi-lst-006',
		unsplash: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365'
	},
	{
		id: 'agi-lst-007',
		unsplash: 'https://images.unsplash.com/photo-1540396515873-dd778f7679e7'
	},
	{
		id: 'agi-lst-008',
		unsplash: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb'
	},
	{
		id: 'agi-lst-009',
		unsplash: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'
	},
	{
		id: 'agi-lst-010',
		unsplash: 'https://images.unsplash.com/photo-1554995207-c18c203602cb'
	},
	{
		id: 'agi-lst-011',
		unsplash: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab'
	},
	{
		id: 'agi-lst-012',
		unsplash: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'
	},
	{
		id: 'agi-lst-013',
		unsplash: 'https://images.unsplash.com/photo-1484154218962-a197022b5858'
	},
	{
		id: 'agi-lst-014',
		unsplash: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20'
	},
	{
		id: 'agi-lst-015',
		unsplash: 'https://images.unsplash.com/photo-1564078516393-cf04bd966897'
	},
	{
		id: 'agi-lst-016',
		unsplash: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6'
	},
	{
		id: 'agi-lst-017',
		unsplash: 'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5'
	},
	{
		id: 'agi-lst-018',
		unsplash: 'https://images.unsplash.com/photo-1565020244281-fe53df7df170'
	},
	{
		id: 'agi-lst-019',
		unsplash: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0'
	},
	{
		id: 'agi-lst-020',
		unsplash: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd'
	}
];

function asJpegCropped(url) {
	const u = new URL(url);
	u.searchParams.set('fm', 'jpg');
	u.searchParams.set('fit', 'crop');
	u.searchParams.set('crop', 'entropy');
	u.searchParams.set('w', '1200');
	u.searchParams.set('h', '800');
	u.searchParams.set('q', '80');
	return u.toString();
}

function runWranglerPut(objectPath, bodyStream) {
	return new Promise((resolve, reject) => {
		const child = spawn(
			'pnpm',
			[
				'wrangler',
				'r2',
				'object',
				'put',
				objectPath,
				'--pipe',
				'--remote',
				'--ct',
				'image/jpeg',
				'--cc',
				CACHE_CONTROL
			],
			{ stdio: ['pipe', 'inherit', 'inherit'] }
		);

		child.on('error', reject);
		child.on('exit', (code) => {
			if (code === 0) resolve();
			else reject(new Error(`wrangler exited with code ${code}`));
		});

		pipeline(bodyStream, child.stdin).catch(reject);
	});
}

async function seedOne({ id, unsplash }) {
	const sourceUrl = asJpegCropped(unsplash);
	const response = await fetch(sourceUrl);

	if (!response.ok || !response.body) {
		throw new Error(`Failed to fetch ${sourceUrl} (${response.status} ${response.statusText})`);
	}

	const contentType = response.headers.get('content-type') ?? '';
	if (!contentType.includes('image/jpeg')) {
		throw new Error(`Unexpected content-type for ${sourceUrl}: ${contentType || '(missing)'}`);
	}

	const key = `listings/${id}.jpg`;
	const objectPath = `${BUCKET_NAME}/${key}`;
	await runWranglerPut(objectPath, Readable.fromWeb(response.body));
}

let failures = 0;

for (const entry of LISTING_IMAGES) {
	process.stdout.write(`Uploading ${entry.id}… `);
	try {
		await seedOne(entry);
		process.stdout.write('done\n');
	} catch (err) {
		failures += 1;
		process.stdout.write('failed\n');
		console.error(err);
	}
}

if (failures > 0) {
	console.error(`\nSeed finished with ${failures} failure(s).`);
	process.exit(1);
}

console.log('\nSeed finished successfully.');

