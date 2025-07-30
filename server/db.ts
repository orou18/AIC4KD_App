import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

neonConfig.webSocketConstructor = ws;

console.log('--- DB.TS DEBUG ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL direct in db.ts:', process.env.DATABASE_URL);
console.log('--- END DB.TS DEBUG ---');

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
