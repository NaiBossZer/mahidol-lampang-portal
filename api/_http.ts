import type { IncomingMessage, ServerResponse } from "node:http";

export type ApiRequest = IncomingMessage & { body?: unknown };
export type ApiResponse = ServerResponse;

export async function readJson(req: ApiRequest): Promise<unknown> {
  if (req.body !== undefined) return req.body;
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function json(res: ApiResponse, status: number, data: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

export function methodNotAllowed(res: ApiResponse, methods: string[]): void {
  res.setHeader("Allow", methods.join(", "));
  json(res, 405, { error: "Method not allowed" });
}

export function getId(req: ApiRequest): string | null {
  const url = new URL(req.url ?? "/", "http://localhost");
  return url.searchParams.get("id");
}
