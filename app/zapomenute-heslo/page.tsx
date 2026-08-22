import Link from "../ui/SiteLink";

type Params = Promise<{ [key: string]: string | string[] | undefined }>;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function ForgotPassword({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  const sent = first(sp.sent) === "1";
  const error = first(sp.error);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand"><span>JdemNa</span><strong>To!</strong></Link>
      </header>
      <main className="login-page">
        <div>
          <span className="eyebrow">ZAPOMENUTÉ HESLO</span>
          <h1>Obnovit heslo</h1>
          {sent ? (
            <>
              <p>Pokud u nás máte účet s touto adresou, poslali jsme na ni odkaz pro nastavení nového hesla. Odkaz platí 1 hodinu.</p>
              <small><Link href="/prihlaseni">Zpět na přihlášení</Link></small>
            </>
          ) : (
            <>
              <p>Zadejte e-mail, který jste použili při registraci. Pošleme vám odkaz pro nastavení nového hesla.</p>
              {error && <p className="form-error">{error}</p>}
              <form className="supplier-register" method="post" action="/api/auth/forgot-password">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }} aria-hidden="true" />
                <label>E-mail *
                  <input required name="email" type="email" autoComplete="email" placeholder="jan@priklad.cz" />
                </label>
                <button className="primary login-main">Poslat odkaz pro obnovu →</button>
                <small><Link href="/prihlaseni">Zpět na přihlášení</Link></small>
              </form>
            </>
          )}
        </div>
      </main>
    </>
  );
}
