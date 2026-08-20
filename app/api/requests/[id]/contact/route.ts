import { env } from "cloudflare:workers";
import { getSessionUser } from "../../../../auth";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Nejprve se přihlaste." }, { status: 401 });
  const supplier = await env.DB.prepare("SELECT subscription_status, subscription_valid_until FROM supplier_profiles WHERE id = ?").bind(user.userId).first<{subscription_status:string;subscription_valid_until:number|null}>();
  const allowed = supplier && (supplier.subscription_status === "launch_free" || supplier.subscription_status === "active" && (!supplier.subscription_valid_until || supplier.subscription_valid_until > Date.now()));
  if (!allowed) return Response.json({ error: "Kontakt je dostupný pouze s aktivním předplatným." }, { status: 403 });
  const { id } = await context.params;
  const item = await env.DB.prepare("SELECT customer_name, phone, email FROM customer_requests WHERE id = ? AND status = 'active' AND expires_at > ?").bind(id, Date.now()).first();
  if (!item) return Response.json({ error: "Poptávka už není aktivní." }, { status: 404 });
  await env.DB.prepare("INSERT INTO contact_access_log (id, request_id, supplier_id, accessed_at) VALUES (?, ?, ?, ?)").bind(crypto.randomUUID(), id, user.userId, Date.now()).run();
  return Response.json(item);
}
