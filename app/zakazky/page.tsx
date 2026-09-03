import type { Metadata } from "next";
import { env } from "cloudflare:workers";
import Link from "../ui/SiteLink";

export const dynamic = "force-dynamic";
export const metadata:Metadata={title:"Aktuální zakázky",description:"Jednorázové i dlouhodobé zakázky pro živnostníky a týmy napříč obory.",alternates:{canonical:"/zakazky"}};
type DbGig={title:string;place:string;budget:string;meta:string};

export default async function Page(){
  let live:DbGig[]=[];
  try { const result=await env.DB.prepare("SELECT substr(description,1,90) as title, location as place, budget as budget, category as meta FROM customer_requests WHERE status='active' AND expires_at>? ORDER BY created_at DESC").bind(Date.now()).all<DbGig>(); live=result.results; } catch {}
  return <main className="simple"><Link href="/" className="brand"><span>Zak</span><strong>ly</strong></Link><p className="eyebrow">HLEDÁM ZAKÁZKU</p><h1>Aktuální poptávky</h1><div className="gig-list">{live.map((g,i)=><article key={g.title+i}><span className="gig-no">0{i+1}</span><div><small>{g.meta}</small><h3>{g.title}</h3><p>⌖ {g.place}</p></div><strong>{g.budget}</strong></article>)}</div>{live.length===0 && <p className="empty-note">Zatím tu nejsou žádné poptávky. <Link href="/dodavatele">Zadejte první →</Link></p>}<p>Kontakt, smlouva, faktura i platba probíhají přímo mezi stranami mimo Zakly.</p></main>;
}
