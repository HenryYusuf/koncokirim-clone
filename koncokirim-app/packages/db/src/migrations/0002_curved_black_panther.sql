CREATE TABLE `address` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`label` text NOT NULL,
	`full_address` text NOT NULL,
	`receiver_name` text NOT NULL,
	`receiver_phone` text NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `address_userId_idx` ON `address` (`user_id`);--> statement-breakpoint
ALTER TABLE `user` ADD `otp_code` text;--> statement-breakpoint
ALTER TABLE `user` ADD `otp_expires_at` integer;