import { NextResponse } from 'next/server';
import { getPool } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const pool = getPool();
  try {
    const client = await pool.connect();
    try {
      const tables = await client.query(
        `select count(*)::int as cnt from information_schema.tables where table_schema not in ('pg_catalog','information_schema');`
      );
      const schemas = await client.query(
        `select count(distinct table_schema)::int as cnt from information_schema.tables where table_schema not in ('pg_catalog','information_schema');`
      );
      return NextResponse.json({
        connected: true,
        tablesCount: tables.rows[0]?.cnt ?? 0,
        schemasCount: schemas.rows[0]?.cnt ?? 0,
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        connected: false,
        message: err?.message || 'DB error',
      },
      { status: 500 }
    );
  }
}
