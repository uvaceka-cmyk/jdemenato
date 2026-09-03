import { env } from "cloudflare:workers";
import { getSessionUser } from "../../auth";
import Link from "../../ui/SiteLink";

const OWNER_EMAIL = "andrej.uvacek@seznam.cz";

type Row = { id: string; companyName: string; ico: string; email: string; phone: string };

export const dynamic = "force-dynamic";

export default async function AdminVerification() {
  const user = await getSessionUser();
  if (!user || user.email !== OWNER_EMAIL) {
    return (
      <>
        <header className="site-header"><Link href="/" className="brand"><span>Zak</span><strong>ly</strong></Link></header>
        <main className="simple"><h1>Nemáte přístup</h1><p>Tahle stránka je jen pro správce webu.</p></main>
      </>
    );
  }

  const suppliers = await env.DB.prepare(
    "SELECT id, company_name as companyName, ico, email, phone FROM supplier_profiles WHERE verification_status = 'pending' ORDER BY created_at DESC",
  ).all<Row>();
  const employers = await env.DB.prepare(
    "SELECT id, company_name as companyName, ico, email, phone FROM employer_profiles WHERE verification_status = 'pending' ORDER BY created_at DESC",
  ).all<Row>();

  return (
    <>
      <header className="site-header"><Link href="/" className="brand"><span>Zak</span><strong>ly</strong></Link></header>
      <main className="simple">
        <p className="eyebrow">SPRÁVA</p>
        <h1>Čekají na ověření</h1>
        <p>Zkontrolujte IČO na ARES (ares.gov.cz) a poté potvrďte ověření.</p>

        <h2>Dodavatelé ({suppliers.results.length})</h2>
        <div className="admin-list">
          {suppliers.results.map(s => (
            <form className="admin-row" method="post" action="/api/admin/verify-supplier" key={s.id}>
              <input type="hidden" name="id" value={s.id} />
              <div><strong>{s.companyName}</strong><span>IČO: {s.ico}</span><span>{s.email} · {s.phone}</span></div>
              <button className="primary small">Ověřit</button>
            </form>
          ))}
          {suppliers.results.length === 0 && <p>Žádní čekající dodavatelé.</p>}
        </div>

        <h2>Zaměstnavatelé ({employers.results.length})</h2>
        <div className="admin-list">
          {employers.results.map(e => (
            <form className="admin-row" method="post" action="/api/admin/verify-employer" key={e.id}>
              <input type="hidden" name="id" value={e.id} />
              <div><strong>{e.companyName}</strong><span>IČO: {e.ico}</span><span>{e.email} · {e.phone}</span></div>
              <button className="primary small">Ověřit</button>
            </form>
          ))}
          {employers.results.length === 0 && <p>Žádní čekající zaměstnavatelé.</p>}
        </div>
      </main>
    </>
  );
}
