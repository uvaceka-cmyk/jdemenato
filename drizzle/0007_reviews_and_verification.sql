ALTER TABLE `supplier_profiles` ADD `verification_status` text DEFAULT 'pending' NOT NULL;
ALTER TABLE `employer_profiles` ADD `verification_status` text DEFAULT 'pending' NOT NULL;
CREATE TABLE `supplier_reviews` (
  `id` text PRIMARY KEY NOT NULL,
  `supplier_id` text NOT NULL,
  `request_id` text NOT NULL,
  `rating` integer NOT NULL,
  `comment` text DEFAULT '' NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`supplier_id`) REFERENCES `supplier_profiles`(`id`),
  FOREIGN KEY (`request_id`) REFERENCES `customer_requests`(`id`)
);
CREATE UNIQUE INDEX `idx_supplier_reviews_request` ON `supplier_reviews` (`request_id`);
CREATE INDEX `idx_supplier_reviews_supplier` ON `supplier_reviews` (`supplier_id`);
CREATE TABLE `site_feedback` (
  `id` text PRIMARY KEY NOT NULL,
  `rating` integer NOT NULL,
  `message` text DEFAULT '' NOT NULL,
  `page` text DEFAULT '/' NOT NULL,
  `created_at` integer NOT NULL
);
CREATE INDEX `idx_site_feedback_created` ON `site_feedback` (`created_at`);
PRAGMA optimize;
