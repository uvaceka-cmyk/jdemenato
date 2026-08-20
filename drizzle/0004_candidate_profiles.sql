CREATE TABLE `candidate_profiles` (
	`id` text PRIMARY KEY NOT NULL, `email` text NOT NULL, `display_name` text NOT NULL, `phone` text DEFAULT '' NOT NULL,
	`desired_role` text NOT NULL, `location` text NOT NULL, `work_types` text NOT NULL, `salary_expectation` text DEFAULT '' NOT NULL,
	`education` text NOT NULL, `experience` text NOT NULL, `skills` text NOT NULL, `preferences` text DEFAULT '' NOT NULL, `requirements` text DEFAULT '' NOT NULL,
	`summary` text DEFAULT '' NOT NULL, `visibility` text DEFAULT 'private' NOT NULL, `updated_at` integer NOT NULL, `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_candidate_profiles_visibility` ON `candidate_profiles` (`visibility`);
--> statement-breakpoint
CREATE INDEX `idx_candidate_profiles_desired_role` ON `candidate_profiles` (`desired_role`);
