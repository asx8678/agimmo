import { eq } from 'drizzle-orm';

import { getDb } from '$lib/server/db/client';
import { agiUsers } from '$lib/server/db/schema';
import { hashPassword, verifyPassword } from './password';

export type PublicUser = {
	id: string;
	email: string;
	createdAt: number;
	stripeCustomerId: string | null;
	stripeSubscriptionId: string | null;
	stripeSubscriptionStatus: string | null;
	stripePriceId: string | null;
};

function toPublicUser(row: {
	id: string;
	email: string;
	createdAt: number;
	stripeCustomerId: string | null;
	stripeSubscriptionId: string | null;
	stripeSubscriptionStatus: string | null;
	stripePriceId: string | null;
}): PublicUser {
	return row;
}

export async function getUserById(env: App.Platform['env'], userId: string): Promise<PublicUser | null> {
	const db = getDb(env);
	const user = await db
		.select({
			id: agiUsers.id,
			email: agiUsers.email,
			createdAt: agiUsers.createdAt,
			stripeCustomerId: agiUsers.stripeCustomerId,
			stripeSubscriptionId: agiUsers.stripeSubscriptionId,
			stripeSubscriptionStatus: agiUsers.stripeSubscriptionStatus,
			stripePriceId: agiUsers.stripePriceId
		})
		.from(agiUsers)
		.where(eq(agiUsers.id, userId))
		.get();

	return user ? toPublicUser(user) : null;
}

export class UserExistsError extends Error {
	override name = 'UserExistsError';
}

export class InvalidCredentialsError extends Error {
	override name = 'InvalidCredentialsError';
}

export async function signUpWithEmailPassword(env: App.Platform['env'], email: string, password: string) {
	const db = getDb(env);

	const existing = await db
		.select({ id: agiUsers.id })
		.from(agiUsers)
		.where(eq(agiUsers.email, email))
		.get();

	if (existing) throw new UserExistsError('Email already in use');

	const userId = crypto.randomUUID();
	const passwordHash = await hashPassword(password, env);
	const createdAt = Date.now();

	await db
		.insert(agiUsers)
		.values({
			id: userId,
			email,
			passwordHash,
			createdAt
		})
		.run();

	return { id: userId, email };
}

export async function signInWithEmailPassword(env: App.Platform['env'], email: string, password: string) {
	const db = getDb(env);
	const user = await db
		.select({ id: agiUsers.id, passwordHash: agiUsers.passwordHash })
		.from(agiUsers)
		.where(eq(agiUsers.email, email))
		.get();

	if (!user) throw new InvalidCredentialsError('Invalid email or password');
	const ok = await verifyPassword(password, user.passwordHash);
	if (!ok) throw new InvalidCredentialsError('Invalid email or password');

	return { id: user.id, email };
}

