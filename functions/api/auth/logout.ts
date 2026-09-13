import { clearCookieHeaders, json } from "./_shared";

function handlePost(): Response {
  const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });
  for (const cookie of clearCookieHeaders()) headers.append("Set-Cookie", cookie);
  return new Response(JSON.stringify({ success: true, data: { authenticated: false } }), {
    status: 200,
    headers,
  });
}

export async function onRequestPost() {
  return handlePost();
}

export async function onRequest({ request }: { request: Request }) {
  if (request.method === "POST") return handlePost();
  return json({ error: "Method Not Allowed" }, 405, { Allow: "POST" });
}
