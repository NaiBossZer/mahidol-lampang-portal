import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Resolve the database only when an API handler is called. The route tree imports
// API modules during SSR, so throwing at module scope would crash every page when
// an optional database environment variable is missing.
export function getDb() {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) throw new Error("DATABASE_URL is required");
  return drizzle(neon(databaseUrl), { schema });
}
