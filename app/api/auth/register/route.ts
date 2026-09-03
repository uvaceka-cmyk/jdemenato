import { env } from "cloudflare:workers";
import { hashPassword } from "../../../../lib/auth/password";
import { createSession, safeRelativePath, sessionCookieHeader } from "../../../auth";

function redirectTo(location: string, cookie?: string): Response {
  const res = new Response(null, { status: 303, headers: { Location: location } });
  if (cookie) res.headers.append("Set-Cookie", cookie);
  return res;
}

function backToForm(message: string, returnTo: string, email: string, displayName: string): Response {
  const url = `/prihlaseni?mode=register&error=${encodeURIComponent(message)}&return_to=${encodeURIComponent(returnTo)}&email=${encodeURIComponent(email)}&displayName=${encodeURIComponent(displayName)}`;
  return redirectTo(url);
}

export async function POST(request: Request): Promise<Response> {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const displayName = String(form.get("displayName") || "").trim().slice(0, 150);
  const returnTo = safeRelativePath(String(form.get("returnTo") || ""), "/ucet");
  const honeypot = String(form.get("hp_x9k2") || "");

if (honeypot.trim()) return backToForm("Registraci se nepodařilo dokončit.", returnTo, email, displayName);

const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const { success } = await env.REQUEST_LIMITER.limit({ key: `register:${ip}` });
  if (!success) return backToForm("Příliš mnoho pokusů o registraci. Zkuste to prosím za chvíli.", returnTo, email, displayName);

if (!displayName) return backToForm("Vyplňte prosím jméno.", returnTo, email, displayName);
  if (!email || !email.includes("@") || email.length > 320) {
    return backToForm("Zadejte platný e-mail.", returnTo, email, displayName);
  }
  if (password.length < 8) {
    return backToForm("Heslo musí mít alespoň 8 znaků.", returnTo, email, displayName);
  }

const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existing) {
    return backToForm("Tento e-mail už je registrovaný. Zkuste se přihlásit.", returnTo, email, displayName);
  }

const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  await env.DB.prepare(
    "INSERT INTO users (id, email, password_hash, display_name, created_at) VALUES (?, ?, ?, ?, ?)",
    ).bind(id, email, passwordHash, displayName, Date.now()).run();

const token = await createSession(id);
  return redirectTo(returnTo, sessionCookieHeader(token));
}
