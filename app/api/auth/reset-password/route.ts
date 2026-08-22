import { env } from "cloudflare:workers";
import { hashPassword } from "../../../../lib/auth/password";
import { consumePasswordResetToken, createSession, sessionCookieHeader } from "../../../auth";

function redirectTo(location: string, cookie?: string): Response {
  const res = new Response(null, { status: 303, headers: { Location: location } });
  if (cookie) res.headers.append("Set-Cookie", cookie);
  return res;
}

export async function POST(request: Request): Promise<Response> {
  const form = await request.formData();
  const token = String(form.get("token") || "");
  const password = String(form.get("password") || "");

if (password.length < 8) {
  return redirectTo(`/obnova-hesla?token=${encodeURIComponent(token)}&error=${encodeURIComponent("Heslo musí mít alespoň 8 znaků.")}`);
}

const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const { success } = await env.REQUEST_LIMITER.limit({ key: `reset-password:${ip}` });
  if (!success) {
    return redirectTo(`/obnova-hesla?token=${encodeURIComponent(token)}&error=${encodeURIComponent("Příliš mnoho pokusů. Zkuste to prosím za chvíli.")}`);
  }

const userId = await consumePasswordResetToken(token);
  if (!userId) {
    return redirectTo(`/zapomenute-heslo?error=${encodeURIComponent("Odkaz je neplatný nebo už vypršel. Zkuste to prosím znovu.")}`);
  }

const passwordHash = await hashPassword(password);
  await env.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(passwordHash, userId).run();

const sessionToken = await createSession(userId);
  return redirectTo("/ucet", sessionCookieHeader(sessionToken));
}
