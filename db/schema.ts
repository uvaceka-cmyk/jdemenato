import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), email: text("email").notNull(), passwordHash: text("password_hash").notNull(), displayName: text("display_name").notNull(), createdAt: integer("created_at").notNull(),
}, table => ({ emailIdx: uniqueIndex("idx_users_email").on(table.email) }));

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(), userId: text("user_id").notNull().references(() => users.id), expiresAt: integer("expires_at").notNull(), createdAt: integer("created_at").notNull(),
}, table => ({ userIdx: index("idx_sessions_user").on(table.userId), expiryIdx: index("idx_sessions_expires_at").on(table.expiresAt) }));

export const supplierProfiles = sqliteTable("supplier_profiles", {
  id: text("id").primaryKey(), email: text("email").notNull(), displayName: text("display_name").notNull(), companyName: text("company_name").notNull(), ico: text("ico").notNull(), phone: text("phone").notNull(), supplierType: text("supplier_type").notNull().default("Živnostník"), address: text("address").notNull().default(""), website: text("website").notNull().default(""), category: text("category").notNull().default("Ostatní služby"), otherServices: text("other_services").notNull().default(""), serviceArea: text("service_area").notNull().default("Celá ČR"), travelRadius: text("travel_radius").notNull().default(""), availability: text("availability").notNull().default(""), yearsExperience: text("years_experience").notNull().default(""), teamSize: text("team_size").notNull().default(""), pricing: text("pricing").notNull().default(""), credentials: text("credentials").notNull().default(""), insurance: text("insurance").notNull().default(""), referencesText: text("references_text").notNull().default(""), bio: text("bio").notNull().default(""), verificationStatus: text("verification_status").notNull().default("pending"), subscriptionStatus: text("subscription_status").notNull().default("launch_free"), subscriptionValidUntil: integer("subscription_valid_until"), createdAt: integer("created_at").notNull(),
});

export const employerProfiles = sqliteTable("employer_profiles", {
  id: text("id").primaryKey(), email: text("email").notNull(), displayName: text("display_name").notNull(), companyName: text("company_name").notNull(), ico: text("ico").notNull(), phone: text("phone").notNull(), contactName: text("contact_name").notNull().default(""), address: text("address").notNull().default(""), website: text("website").notNull().default(""), industry: text("industry").notNull().default(""), companySize: text("company_size").notNull().default(""), about: text("about").notNull().default(""), benefits: text("benefits").notNull().default(""), verificationStatus: text("verification_status").notNull().default("pending"), createdAt: integer("created_at").notNull(),
});

export const candidateProfiles = sqliteTable("candidate_profiles", {
  id: text("id").primaryKey(), email: text("email").notNull(), displayName: text("display_name").notNull(), phone: text("phone").notNull().default(""), desiredRole: text("desired_role").notNull(), location: text("location").notNull(), workTypes: text("work_types").notNull(), salaryExpectation: text("salary_expectation").notNull().default(""), education: text("education").notNull(), experience: text("experience").notNull(), skills: text("skills").notNull(), preferences: text("preferences").notNull().default(""), requirements: text("requirements").notNull().default(""), summary: text("summary").notNull().default(""), visibility: text("visibility").notNull().default("private"), updatedAt: integer("updated_at").notNull(), createdAt: integer("created_at").notNull(),
}, table => ({ visibilityIdx: index("idx_candidate_profiles_visibility").on(table.visibility), roleIdx: index("idx_candidate_profiles_desired_role").on(table.desiredRole) }));

export const jobPostings = sqliteTable("job_postings", {
  id: text("id").primaryKey(), employerId: text("employer_id").notNull().references(() => employerProfiles.id), title: text("title").notNull(), location: text("location").notNull(), employmentType: text("employment_type").notNull(), workMode: text("work_mode").notNull().default("Na pracovišti"), schedule: text("schedule").notNull().default(""), salary: text("salary").notNull(), startDate: text("start_date").notNull().default("Dohodou"), description: text("description").notNull(), requirements: text("requirements").notNull().default(""), benefits: text("benefits").notNull().default(""), applyUrl: text("apply_url").notNull(), status: text("status").notNull().default("active"), expiresAt: integer("expires_at").notNull(), createdAt: integer("created_at").notNull(),
}, table => ({ employerIdx: index("idx_job_postings_employer").on(table.employerId), activeExpiryIdx: index("idx_job_postings_status_expiry").on(table.status, table.expiresAt) }));

export const customerRequests = sqliteTable("customer_requests", {
  id: text("id").primaryKey(), category: text("category").notNull(), location: text("location").notNull(), neededBy: text("needed_by").notNull(), description: text("description").notNull(), budget: text("budget"), priceType: text("price_type"), customerName: text("customer_name").notNull(), phone: text("phone").notNull(), email: text("email").notNull(), status: text("status").notNull().default("active"), managementTokenHash: text("management_token_hash").notNull(), consentAt: integer("consent_at").notNull(), expiresAt: integer("expires_at").notNull(), createdAt: integer("created_at").notNull(),
}, table => ({ activeCategoryIdx: index("idx_customer_requests_status_category").on(table.status, table.category), expiryIdx: index("idx_customer_requests_expires_at").on(table.expiresAt) }));

export const contactAccessLog = sqliteTable("contact_access_log", {
  id: text("id").primaryKey(), requestId: text("request_id").notNull().references(() => customerRequests.id), supplierId: text("supplier_id").notNull().references(() => supplierProfiles.id), accessedAt: integer("accessed_at").notNull(),
}, table => ({ supplierAccessIdx: index("idx_contact_access_supplier_time").on(table.supplierId, table.accessedAt) }));

export const candidateContactAccessLog = sqliteTable("candidate_contact_access_log", {
  id: text("id").primaryKey(), candidateId: text("candidate_id").notNull().references(() => candidateProfiles.id), employerId: text("employer_id").notNull().references(() => employerProfiles.id), accessedAt: integer("accessed_at").notNull(),
}, table => ({ employerAccessIdx: index("idx_candidate_contact_access_employer_time").on(table.employerId, table.accessedAt) }));

export const supplierReviews = sqliteTable("supplier_reviews", {
  id: text("id").primaryKey(), supplierId: text("supplier_id").notNull().references(() => supplierProfiles.id), requestId: text("request_id").notNull().references(() => customerRequests.id), rating: integer("rating").notNull(), comment: text("comment").notNull().default(""), createdAt: integer("created_at").notNull(),
}, table => ({ supplierIdx: index("idx_supplier_reviews_supplier").on(table.supplierId), requestIdx: uniqueIndex("idx_supplier_reviews_request").on(table.requestId) }));

export const siteFeedback = sqliteTable("site_feedback", {
  id: text("id").primaryKey(), rating: integer("rating").notNull(), message: text("message").notNull().default(""), page: text("page").notNull().default("/"), createdAt: integer("created_at").notNull(),
}, table => ({ createdIdx: index("idx_site_feedback_created").on(table.createdAt) }));
