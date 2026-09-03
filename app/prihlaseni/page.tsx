import Link from "../ui/SiteLink";
import { safeRelativePath } from "../auth";

type Params = Promise<{ [key: string]: string | string[] | undefined }>;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function Login({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  const mode = first(sp.mode) === "register" ? "register" : "login";
  const error = first(sp.error);
  const returnTo = safeRelativePath(first(sp.return_to), "/ucet");
  const email = first(sp.email);
  const displayName = first(sp.displayName);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand"><span>Zak</span><strong>ly</strong></Link>
      </header>
      <main className="login-page">
        <div>
          <span className="eyebrow">{mode === "register" ? "REGISTRACE" : "PŘIHLÁŠENÍ"}</span>
          <h1>{mode === "register" ? "Vytvořit účet Zakly" : "Váš účet Zakly"}</h1>
          <p>
            {mode === "register"
              ? "Zadejte jméno, e-mail a heslo. Po registraci si vyberete účet uchazeče, dodavatele nebo zaměstnavatele."
              : "Přihlaste se e-mailem a heslem, které jste zadali při registraci."}
          </p>

          {error && <p className="form-error">{error}</p>}

          {mode === "register" ? (
            <form className="supplier-register" method="post" action="/api/auth/register">
              <input type="hidden" name="returnTo" value={returnTo} />
              <input type="text" name="hp_x9k2" autoCorrect="off" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }} aria-hidden="true" />
              <label>Jméno a příjmení *
                <input required name="displayName" autoComplete="name" defaultValue={displayName} placeholder="Jan Novák" />
              </label>
              <label>E-mail *
                <input required name="email" type="email" autoComplete="email" defaultValue={email} placeholder="jan@priklad.cz" />
              </label>
              <label>Heslo *
                <input required name="password" type="password" autoComplete="new-password" minLength={8} placeholder="Alespoň 8 znaků" />
              </label>
              <button className="primary login-main">Vytvořit účet →</button>
              <small>Už máte účet? <a href={`/prihlaseni?mode=login&return_to=${encodeURIComponent(returnTo)}`}>Přihlaste se</a></small>
            </form>
          ) : (
            <form className="supplier-register" method="post" action="/api/auth/login">
              <input type="hidden" name="returnTo" value={returnTo} />
              <label>E-mail *
                <input required name="email" type="email" autoComplete="email" defaultValue={email} placeholder="jan@priklad.cz" />
              </label>
              <label>Heslo *
                <input required name="password" type="password" autoComplete="current-password" placeholder="Vaše heslo" />
              </label>
              <button className="primary login-main">Přihlásit se →</button>
              <small>Nemáte účet? <a href={`/prihlaseni?mode=register&return_to=${encodeURIComponent(returnTo)}`}>Zaregistrujte se</a> · <a href="/zapomenute-heslo">Zapomenuté heslo?</a></small>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
