import { env } from "cloudflare:workers";

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const required = ["category", "location", "neededBy", "description", "customerName", "phone", "email"];
  if (required.some(key => typeof body[key] !== "string" || !(body[key] as string).trim())) return Response.json({ error: "Vyplňte prosím všechna povinná pole." }, { status: 400 });
  if (body.consent !== true) return Response.json({ error: "Pro zveřejnění poptávky je nutné potvrdit předání kontaktu." }, { status: 400 });
  const now = Date.now(); const id = crypto.randomUUID();
  const managementToken = createToken();
  const managementTokenHash = await hashToken(managementToken);
  await env.DB.prepare(`INSERT INTO customer_requests (id, category, location, needed_by, description, budget, price_type, customer_name, phone, email, status, management_token_hash, consent_at, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)`)
    .bind(id, clean(body.category), clean(body.location), clean(body.neededBy), clean(body.description), clean(body.budget), clean(body.priceType), clean(body.customerName), clean(body.phone), clean(body.email), managementTokenHash, now, now + 45 * 86400000, now).run();
  return Response.json({ id, managementToken }, { status: 201 });
}
function clean(value: unknown) { return typeof value === "string" ? value.trim().slice(0, 4000) : ""; }
function createToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
async function hashToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}
