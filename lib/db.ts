import { Pool } from 'pg';
import fs from 'fs';

let pool: Pool | undefined;

export function getPool(): Pool {
  if (pool) return pool;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set. For Azure Postgres, include sslmode=require.');
  }

  // SSL config: Azure Postgres requires SSL, often with the DigiCert root cert.
  const sslRoot = process.env.PGSSLROOTCERT;
  let ssl: any = { rejectUnauthorized: false };
  if (sslRoot && fs.existsSync(sslRoot)) {
    try {
      const ca = fs.readFileSync(sslRoot).toString();
      ssl = { ca };
    } catch {
      // fallback to not rejecting to keep demo working
      ssl = { rejectUnauthorized: false };
    }
  }

  pool = new Pool({
    connectionString: databaseUrl,
    ssl,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected PG pool error', err);
  });

  return pool;
}
