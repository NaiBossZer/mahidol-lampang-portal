import { clearCookieHeaders, json } from "./_shared";

export async function onRequestPost() {
  const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });
  for (const cookie of clearCookieHeaders()) headers.append("Set-Cookie", cookie);
  return new Response(JSON.stringify({ success: true, data: { authenticated: false } }), { status: 200, headers });
}
