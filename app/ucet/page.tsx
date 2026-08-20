import { env } from "cloudflare:workers";
import { redirect } from "next/navigation";
import { requireSessionUser } from "../auth";
export const dynamic="force-dynamic";
export default async function Account(){const user=await requireSessionUser("/ucet");const candidate=await env.DB.prepare("SELECT id FROM candidate_profiles WHERE id = ?").bind(user.userId).first();if(candidate)redirect("/pro-uchazece");const supplier=await env.DB.prepare("SELECT id FROM supplier_profiles WHERE id = ?").bind(user.userId).first();if(supplier)redirect("/pro-dodavatele");const employer=await env.DB.prepare("SELECT id FROM employer_profiles WHERE id = ?").bind(user.userId).first();if(employer)redirect("/pro-zamestnavatele");redirect("/registrace")}
