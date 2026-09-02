import type { Metadata } from "next";
import { env } from "cloudflare:workers";
import Link from "../ui/SiteLink";
import { requireSessionUser, signOutPath } from "../auth";
import { SupplierDashboard } from "./supplier-dashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Účet dodavatele", description: "Registrace dodavatele a bezpečný přístup k aktuálním poptávkám." };

export default async function Page() {
  const user = await requireSessionUser("/pro-dodavatele");
  const profile = await env.DB.prepare("SELECT company_name,ico,phone,supplier_type,address,website,category,other_services,service_area,travel_radius,availability,years_experience,team_size,pricing,credentials,insurance,references_text,bio,subscription_status FROM supplier_profiles WHERE id = ?").bind(user.userId).first<Record<string, string>>();
  const requests = profile ? await env.DB.prepare("SELECT id, category, location, needed_by, description, budget, price_type, created_at FROM customer_requests WHERE status = 'active' AND expires_at > ? ORDER BY created_at DESC LIMIT 50").bind(Date.now()).all<Record<string, string | number>>() : { results: [] };
  return <><header className="site-header"><Link href="/" className="brand"><span>Zak</span><strong>ly</strong></Link><nav><Link href="/dodavatele">Zadat poptávku</Link><a href={signOutPath("/")}>Odhlásit se</a></nav></header><SupplierDashboard email={user.email} profile={profile} requests={requests.results}/></>;
}


