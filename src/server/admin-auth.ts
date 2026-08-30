const COOKIE_NAME = "mahidol_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function secret(): string {
  const value = process.env["ADMIN_PASSWORD"];
  if (!value || value.length < 12)
    throw new Error("ADMIN_PASSWORD must be configured with at least 12 characters");
  return value;
}

async function signature(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

async function digest(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

async function matchesSecret(candidate: string, expected: string): Promise<boolean> {
  const [candidateDigest, expectedDigest] = await Promise.all([
    digest(candidate),
    digest(expected),
  ]);
  if (candidateDigest.length !== expectedDigest.length) return false;
  let difference = 0;
  for (let index = 0; index < candidateDigest.length; index += 1) {
    difference |= (candidateDigest[index] ?? 0) ^ (expectedDigest[index] ?? 0);
  }
  return difference === 0;
}

export async function createAdminCookie(request?: Request): Promise<string> {
  const payload = `${Date.now()}`;
  const secure = request && new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE_NAME}=${payload}.${await signature(payload)}; Max-Age=${MAX_AGE_SECONDS}; Path=/; HttpOnly; SameSite=Lax${secure}`;
}

export async function isAdminRequest(request: Request): Promise<boolean> {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  const token = cookie?.slice(COOKIE_NAME.length + 1);
  if (!token) return false;
  const [payload, provided] = token.split(".");
  if (!payload || !provided) return false;
  const issuedAt = Number(payload);
  if (
    !Number.isFinite(issuedAt) ||
    Date.now() - issuedAt > MAX_AGE_SECONDS * 1000 ||
    issuedAt > Date.now()
  )
    return false;
  try {
    const expected = await signature(payload);
    return await matchesSecret(provided, expected);
  } catch {
    return false;
  }
}

export function clearAdminCookie(request?: Request): string {
  const secure = request && new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secure}`;
}
