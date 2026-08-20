import type { Metadata } from "next";
import { env } from "cloudflare:workers";
import Link from "../ui/SiteLink";
import { jobs as examples } from "../data";

export const dynamic = "force-dynamic";
export const metadata:Metadata={title:"Aktuální nabídky práce",description:"Zaměstnání, brigády a další nabídky práce z celé České republiky.",alternates:{canonical:"/prace"}};
type DbJob={id:string;title:string;location:string;employment_type:string;salary:string;company_name:string};

export default async function Page(){
  let live:DbJob[]=[];
  try { const result=await env.DB.prepare("SELECT j.id,j.title,j.location,j.employment_type,j.salary,e.company_name FROM job_postings j JOIN employer_profiles e ON e.id=j.employer_id WHERE j.status='active' AND j.expires_at>? ORDER BY j.created_at DESC").bind(Date.now()).all<DbJob>(); live=result.results; } catch {}
  return <main className="simple"><Link href="/" className="brand"><span>JdemNa</span><strong>To!</strong></Link><p className="eyebrow">HLEDÁM ZAMĚSTNÁNÍ</p><h1>Aktuální nabídky práce</h1><div className="job-grid">{live.map(j=><Link className="job-card" href={`/prace/${j.id}`} key={j.id}><small>{j.company_name}</small><h3>{j.title}</h3><p>{j.location} · {j.employment_type}</p><b>{j.salary}</b></Link>)}{examples.filter(j=>new Date(j.expires)>=new Date()).map(j=><Link className="job-card" href={`/prace/${j.slug}`} key={j.slug}><small>{j.company}</small><h3>{j.title}</h3><p>{j.place} · {j.type}</p><b>{j.pay}</b></Link>)}</div></main>;
}

