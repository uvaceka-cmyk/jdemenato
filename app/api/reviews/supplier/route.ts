import { env } from "cloudflare:workers";

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const requestId = clean(body.requestId, 80), supplierId = clean(body.supplierId, 120), token = clean(body.managementToken, 200);
  const rating = Number(body.rating), comment = clean(body.comment, 1200);
  if (!requestId || !supplierId || !token || !Number.isInteger(rating) || rating < 1 || rating > 5) return Response.json({ error: "Hodnocení není úplné." }, { status: 400 });
  const item = await env.DB.prepare("SELECT management_token_hash FROM customer_requests WHERE id=?").bind(requestId).first<{management_token_hash:string}>();
  if (!item || !safeEqual(item.management_token_hash, await hashToken(token))) return Response.json({ error: "Neplatný odkaz pro správu poptávky." }, { status: 403 });
  const contact = await env.DB.prepare("SELECT id FROM contact_access_log WHERE request_id=? AND supplier_id=? LIMIT 1").bind(requestId, supplierId).first();
  if (!contact) return Response.json({ error: "Hodnotit lze pouze dodavatele, který si u této poptávky zobrazil kontakt." }, { status: 409 });
  try {
    await env.DB.prepare("INSERT INTO supplier_reviews (id,supplier_id,request_id,rating,comment,created_at) VALUES (?,?,?,?,?,?)").bind(crypto.randomUUID(), supplierId, requestId, rating, comment, Date.now()).run();
  } catch {
    return Response.json({ error: "Tato poptávka už byla ohodnocena." }, { status: 409 });
  }
  return Response.json({ ok: true }, { status: 201 });
}

function clean(value: unknown, limit: number) { return typeof value === "string" ? value.trim().slice(0, limit) : ""; }
async function hashToken(token: string) { const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)); return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join(""); }
function safeEqual(a: string, b: string) { if (a.length !== b.length) return false; let result = 0; for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i); return result === 0; }
