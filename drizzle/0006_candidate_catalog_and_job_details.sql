ALTER TABLE `job_postings` ADD `work_mode` text NOT NULL DEFAULT 'Na pracovišti';
--> statement-breakpoint
ALTER TABLE `job_postings` ADD `schedule` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `job_postings` ADD `start_date` text NOT NULL DEFAULT 'Dohodou';
--> statement-breakpoint
ALTER TABLE `job_postings` ADD `requirements` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `job_postings` ADD `benefits` text NOT NULL DEFAULT '';
--> statement-breakpoint
CREATE TABLE `candidate_contact_access_log` (
	`id` text PRIMARY KEY NOT NULL,
	`candidate_id` text NOT NULL,
	`employer_id` text NOT NULL,
	`accessed_at` integer NOT NULL,
	FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`employer_id`) REFERENCES `employer_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_candidate_contact_access_employer_time` ON `candidate_contact_access_log` (`employer_id`,`accessed_at`);
