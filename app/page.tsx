import type { Metadata } from "next";
import { env } from "cloudflare:workers";
import { HomePage } from "./ui/HomePage";

export const metadata: Metadata = {
  title: "Zakly – práce, zakázky a dodavatelé",
  description: "Najděte práci, brigádu nebo zakázku podle oboru, lokality a způsobu práce. Přehledně, bez CV a přímo u zadavatele.",
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";

type JobRow = { id: string; title: string; company: string; place: string; pay: string; type: string };
type GigRow = { title: string; place: string; budget: string; meta: string };

export default async function Page() {
  const now = Date.now();

const jobsResult = await env.DB.prepare(
  "SELECT j.id as id, j.title as title, e.company_name as company, j.location as place, j.salary as pay, j.employment_type as type FROM job_postings j JOIN employer_profiles e ON e.id = j.employer_id WHERE j.status = 'active' AND j.expires_at > ? ORDER BY j.created_at DESC LIMIT 3",
  ).bind(now).all<JobRow>();

const gigsResult = await env.DB.prepare(
  "SELECT substr(description,1,70) as title, location as place, category as meta, budget as budget FROM customer_requests WHERE status = 'active' AND expires_at > ? ORDER BY created_at DESC LIMIT 3",
  ).bind(now).all<GigRow>();

return <HomePage jobs={jobsResult.results} gigs={gigsResult.results} />;
}
