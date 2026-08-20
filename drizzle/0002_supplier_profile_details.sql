ALTER TABLE `supplier_profiles` ADD `category` text DEFAULT 'Ostatní služby' NOT NULL;
--> statement-breakpoint
ALTER TABLE `supplier_profiles` ADD `service_area` text DEFAULT 'Celá ČR' NOT NULL;
--> statement-breakpoint
ALTER TABLE `supplier_profiles` ADD `bio` text DEFAULT '' NOT NULL;
--> statement-breakpoint
PRAGMA optimize;
