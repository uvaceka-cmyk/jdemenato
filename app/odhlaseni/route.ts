import { cookies } from "next/headers";
import { clearedSessionCookieHeader, destroySession, safeRelativePath, SESSION_COOKIE_NAME } from "../auth";

export async function GET(request: Request): Promise<Response> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  await destroySession(token);

  const url = new URL(request.url);
  const returnTo = safeRelativePath(url.searchParams.get("return_to") || "", "/");

  const res = new Response(null, { status: 303, headers: { Location: returnTo } });
  res.headers.append("Set-Cookie", clearedSessionCookieHeader());
  return res;
}
