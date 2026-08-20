ALTER TABLE `supplier_profiles` ADD `supplier_type` text NOT NULL DEFAULT 'Živnostník';
--> statement-breakpoint
ALTER TABLE `supplier_profiles` ADD `address` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `supplier_profiles` ADD `website` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `supplier_profiles` ADD `other_services` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `supplier_profiles` ADD `travel_radius` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `supplier_profiles` ADD `availability` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `supplier_profiles` ADD `years_experience` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `supplier_profiles` ADD `team_size` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `supplier_profiles` ADD `pricing` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `supplier_profiles` ADD `credentials` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `supplier_profiles` ADD `insurance` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `supplier_profiles` ADD `references_text` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `employer_profiles` ADD `contact_name` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `employer_profiles` ADD `address` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `employer_profiles` ADD `website` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `employer_profiles` ADD `industry` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `employer_profiles` ADD `company_size` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `employer_profiles` ADD `about` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `employer_profiles` ADD `benefits` text NOT NULL DEFAULT '';
