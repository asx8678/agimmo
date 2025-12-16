CREATE TABLE `agi_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer NOT NULL,
	`stripe_customer_id` text,
	`stripe_subscription_id` text,
	`stripe_subscription_status` text,
	`stripe_price_id` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `agi_users_email_unique` ON `agi_users` (`email`);