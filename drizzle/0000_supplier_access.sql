CREATE TABLE `supplier_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`company_name` text NOT NULL,
	`ico` text NOT NULL,
	`phone` text NOT NULL,
	`subscription_status` text DEFAULT 'launch_free' NOT NULL,
	`subscription_valid_until` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `customer_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`location` text NOT NULL,
	`needed_by` text NOT NULL,
	`description` text NOT NULL,
	`budget` text,
	`price_type` text,
	`customer_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`consent_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_customer_requests_status_category` ON `customer_requests` (`status`,`category`);
--> statement-breakpoint
CREATE INDEX `idx_customer_requests_expires_at` ON `customer_requests` (`expires_at`);
--> statement-breakpoint
CREATE TABLE `contact_access_log` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`supplier_id` text NOT NULL,
	`accessed_at` integer NOT NULL,
	FOREIGN KEY (`request_id`) REFERENCES `customer_requests`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_id`) REFERENCES `supplier_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_contact_access_supplier_time` ON `contact_access_log` (`supplier_id`,`accessed_at`);
--> statement-breakpoint
PRAGMA optimize;
