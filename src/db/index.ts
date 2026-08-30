import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Connection pool setup
// In production, use environment variables for connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mahidol_farm',
});

// Create Drizzle ORM instance with schema attached for relational queries
export const db = drizzle(pool, { schema });
