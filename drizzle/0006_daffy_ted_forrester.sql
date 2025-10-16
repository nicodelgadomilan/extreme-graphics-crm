CREATE TABLE `estimates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quote_number` text NOT NULL,
	`client_name` text NOT NULL,
	`client_email` text NOT NULL,
	`client_phone` text,
	`client_address` text,
	`items` text NOT NULL,
	`subtotal` integer NOT NULL,
	`tax_rate` integer DEFAULT 0,
	`tax_amount` integer DEFAULT 0,
	`shipping_cost` integer DEFAULT 0,
	`total` integer NOT NULL,
	`notes` text,
	`valid_until` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`user_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `estimates_quote_number_unique` ON `estimates` (`quote_number`);