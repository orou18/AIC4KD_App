import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// --- DÉBUT DE LA MODIFICATION ---
// Charge dotenv uniquement si l'environnement n'est PAS 'production'
if (process.env.NODE_ENV !== 'production') {
  import dotenv from "dotenv"; // Utilisez import si vous êtes en ES Modules
  dotenv.config();
}
// --- FIN DE LA MODIFICATION ---

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });