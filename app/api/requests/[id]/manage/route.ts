import { env } from "cloudflare:workers";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  const row = await authorizedRequest(request, context);
  if (row instanceof Response) return row;
  const responders = await env.DB.prepare(`SELECT s.id,s.company_name,MAX(l.accessed_at) accessed_at FROM contact_access_log l JOIN supplier_profiles s ON s.id=l.supplier_id WHERE l.request_id=? GROUP BY s.id,s.company_name ORDER BY accessed_at DESC`).bind(row.id).all();
  return Response.json({ ...publicRequest(row), responders: responders.results });
}

export async function PATCH(request: Request, context: Context) {
  const row = await authorizedRequest(request, context);
  if (row instanceof Response) return row;
  const body = await request.json() as Record<string, unknown>;
  const now = Date.now();

  if (body.action === "close") {
    await env.DB.prepare("UPDATE customer_requests SET status = 'closed' WHERE id = ?").bind(row.id).run();
    return Response.json({ ok: true, status: "closed" });
  }
  if (body.action === "extend") {
    const base = Math.max(now, Number(row.expires_at));
    await env.DB.prepare("UPDATE customer_requests SET status = 'active', expires_at = ? WHERE id = ?").bind(base + 30 * 86400000, row.id).run();
    return Response.json({ ok: true, status: "active", expiresAt: base + 30 * 86400000 });
  }

  const required = ["category", "location", "neededBy", "description", "customerName", "phone", "email"];
  if (required.some(key => typeof body[key] !== "string" || !clean(body[key]))) return Response.json({ error: "Vyplňte prosím všechna povinná pole." }, { status: 400 });
  if (!/^\S+@\S+\.\S+$/.test(clean(body.email))) return Response.json({ error: "Zadejte platný e-mail." }, { status: 400 });
  await env.DB.prepare(`UPDATE customer_requests SET category = ?, location = ?, needed_by = ?, description = ?, budget = ?, price_type = ?, customer_name = ?, phone = ?, email = ? WHERE id = ?`)
    .bind(clean(body.category), clean(body.location), clean(body.neededBy), clean(body.description), clean(body.budget), clean(body.priceType), clean(body.customerName), clean(body.phone), clean(body.email), row.id).run();
  return Response.json({ ok: true });
}

async function authorizedRequest(request: Request, context: Context) {
  const { id } = await context.params;
  const token = request.headers.get("x-management-token") || "";
  if (!token || token.length > 200) return Response.json({ error: "Neplatný odkaz pro správu poptávky." }, { status: 401 });
  const tokenHash = await hashToken(token);
  const row = await env.DB.prepare("SELECT * FROM customer_requests WHERE id = ? AND management_token_hash = ?").bind(id, tokenHash).first<Record<string, unknown>>();
  if (!row) return Response.json({ error: "Neplatný odkaz pro správu poptávky." }, { status: 401 });
  return row;
}

function publicRequest(row: Record<string, unknown>) {
  return { id: row.id, category: row.category, location: row.location, neededBy: row.needed_by, description: row.description, budget: row.budget || "", priceType: row.price_type || "Cena dohodou", customerName: row.customer_name, phone: row.phone, email: row.email, status: row.status, expiresAt: row.expires_at };
}
function clean(value: unknown) { return typeof value === "string" ? value.trim().slice(0, 4000) : ""; }
async function hashToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}
