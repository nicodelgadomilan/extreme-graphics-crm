CREATE TABLE `crm_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`auth_user_id` text,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'agent' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`auth_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `crm_users_auth_user_id_unique` ON `crm_users` (`auth_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `crm_users_email_unique` ON `crm_users` (`email`);