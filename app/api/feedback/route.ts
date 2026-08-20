import { env } from "cloudflare:workers";

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  if (body.website) return Response.json({ ok: true });
  const rating = Number(body.rating);
  const message = clean(body.message, 1200);
  const page = clean(body.page, 180) || "/";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "Vyberte hodnocení od 1 do 5." }, { status: 400 });
  }
  await env.DB.prepare("INSERT INTO site_feedback (id,rating,message,page,created_at) VALUES (?,?,?,?,?)")
    .bind(crypto.randomUUID(), rating, message, page, Date.now()).run();
  return Response.json({ ok: true }, { status: 201 });
}

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}
