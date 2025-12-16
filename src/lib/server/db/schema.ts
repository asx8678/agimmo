import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const agiUsers = sqliteTable('agi_users', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	createdAt: integer('created_at').notNull(),
	stripeCustomerId: text('stripe_customer_id'),
	stripeSubscriptionId: text('stripe_subscription_id'),
	stripeSubscriptionStatus: text('stripe_subscription_status'),
	stripePriceId: text('stripe_price_id')
});

export type AgiUser = typeof agiUsers.$inferSelect;
export type AgiUserInsert = typeof agiUsers.$inferInsert;

