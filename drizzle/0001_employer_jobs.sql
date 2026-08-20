CREATE TABLE `employer_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`company_name` text NOT NULL,
	`ico` text NOT NULL,
	`phone` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `job_postings` (
	`id` text PRIMARY KEY NOT NULL,
	`employer_id` text NOT NULL,
	`title` text NOT NULL,
	`location` text NOT NULL,
	`employment_type` text NOT NULL,
	`salary` text NOT NULL,
	`description` text NOT NULL,
	`apply_url` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`employer_id`) REFERENCES `employer_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_job_postings_employer` ON `job_postings` (`employer_id`);
--> statement-breakpoint
CREATE INDEX `idx_job_postings_status_expiry` ON `job_postings` (`status`,`expires_at`);
--> statement-breakpoint
PRAGMA optimize;
