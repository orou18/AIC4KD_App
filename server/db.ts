import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// --- DÉBUT DE LA NOUVELLE MODIFICATION ---
// Déclarez dotenv en haut mais ne le configurez que si nécessaire
import * as dotenv from "dotenv"; // Importez dotenv de manière standard en haut du fichier

// Conditionnez l'appel à .config()
if (process.env.NODE_ENV !== 'production') {
  dotenv.config(); // Appelez .config() uniquement si ce n'est pas la production
}
// --- FIN DE LA NOUVELLE MODIFICATION ---

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });