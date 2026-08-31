import { env } from "cloudflare:workers";
import { getSessionUser } from "../../../auth";

const OWNER_EMAIL = "andrej.uvacek@seznam.cz";

export async function POST(request: Request): Promise<Response> {
  const user = await getSessionUser();
  if (!user || user.email !== OWNER_EMAIL) {
    return new Response("Forbidden", { status: 403 });
  }
  const form = await request.formData();
  const id = String(form.get("id") || "");
  if (id) {
    await env.DB.prepare("UPDATE supplier_profiles SET verification_status = 'verified' WHERE id = ?").bind(id).run();
  }
  return new Response(null, { status: 303, headers: { Location: "/admin/overeni" } });
}
