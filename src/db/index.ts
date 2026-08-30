import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Database access must be configured by the deployment environment.
// Never ship a fallback credential or connect to localhost in production.
const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const sql = neon(databaseUrl);

// Create Drizzle ORM instance with schema attached for relational queries
export const db = drizzle(sql, { schema });
