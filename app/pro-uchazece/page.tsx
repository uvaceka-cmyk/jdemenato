import type { Metadata } from "next";
import { env } from "cloudflare:workers";
import Link from "../ui/SiteLink";
import { signOutPath, requireSessionUser } from "../auth";
import { CandidateProfile } from "./candidate-profile";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Profil uchazeče",description:"Zkušenosti, vzdělání a pracovní preference uchazeče."};
export default async function Page(){const user=await requireSessionUser("/pro-uchazece");const profile=await env.DB.prepare("SELECT phone,desired_role,location,work_types,salary_expectation,education,experience,skills,preferences,requirements,summary,visibility FROM candidate_profiles WHERE id = ?").bind(user.userId).first<Record<string,string>>();return <><header className="site-header"><Link href="/" className="brand"><span>JdemNa</span><strong>To!</strong></Link><nav><Link href="/prace">Nabídky práce</Link><a href={signOutPath("/")}>Odhlásit se</a></nav></header><CandidateProfile email={user.email} name={user.displayName} profile={profile}/></>}
