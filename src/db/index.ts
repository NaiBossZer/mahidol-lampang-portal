import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

let client: ReturnType<typeof postgres> | undefined;

// Supabase PostgreSQL is the central database. The connection is created lazily
// so public SPA routes can still build when DATABASE_URL is not configured locally.
export function getDb() {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl)
    throw new Error("DATABASE_URL is required (Supabase PostgreSQL connection string)");
  client ??= postgres(databaseUrl, { max: 5, prepare: false });
  return drizzle(client, { schema });
}
