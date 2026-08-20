import { env } from "cloudflare:workers";
import { verifyPassword } from "../../../../lib/auth/password";
import { createSession, safeRelativePath, sessionCookieHeader } from "../../../auth";

function redirectTo(location: string, cookie?: string): Response {
  const res = new Response(null, { status: 303, headers: { Location: location } });
  if (cookie) res.headers.append("Set-Cookie", cookie);
  return res;
}

export async function POST(request: Request): Promise<Response> {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const returnTo = safeRelativePath(String(form.get("returnTo") || ""), "/ucet");

  const user = await env.DB.prepare("SELECT id, password_hash FROM users WHERE email = ?")
    .bind(email).first<{ id: string; password_hash: string }>();
  const ok = user ? await verifyPassword(password, user.password_hash) : false;

  if (!user || !ok) {
    const url = `/prihlaseni?mode=login&error=${encodeURIComponent("Nesprávný e-mail nebo heslo.")}&return_to=${encodeURIComponent(returnTo)}&email=${encodeURIComponent(email)}`;
    return redirectTo(url);
  }

  const token = await createSession(user.id);
  return redirectTo(returnTo, sessionCookieHeader(token));
}
