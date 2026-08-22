import { env } from "cloudflare:workers";
import { createPasswordResetToken, sendPasswordResetEmail } from "../../../auth";

function redirectTo(location: string): Response {
  return new Response(null, { status: 303, headers: { Location: location } });
}

export async function POST(request: Request): Promise<Response> {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const url = new URL(request.url);
  const confirmUrl = "/zapomenute-heslo?sent=1";

const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const { success } = await env.REQUEST_LIMITER.limit({ key: `forgot-password:${ip}` });
  if (!success) return redirectTo(confirmUrl);

if (email && email.includes("@")) {
  const user = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first<{ id: string }>();
  if (user) {
    const token = await createPasswordResetToken(user.id);
    const resetUrl = `${url.origin}/obnova-hesla?token=${encodeURIComponent(token)}`;
    await sendPasswordResetEmail(email, resetUrl);
  }
}

return redirectTo(confirmUrl);
}
