export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/db-stats`, {
      // Ensures fresh data in Azure
      cache: 'no-store',
    });
    if (!res.ok) {
      return { connected: false, message: `HTTP ${res.status}` };
    }
    return res.json();
  } catch (e: any) {
    return { connected: false, message: e?.message ?? 'fetch failed' };
  }
}

export default async function Home() {
  const stats = await getStats();
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial', padding: 24 }}>
      <h1>Unite Hello World</h1>
      <p>Next.js on Azure App Service</p>
      <section style={{ marginTop: 16, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
        <h2>Database status</h2>
        <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 6, overflowX: 'auto' }}>
{JSON.stringify(stats, null, 2)}
        </pre>
        {!stats?.connected && (
          <p style={{ color: '#b00' }}>Not connected. Ensure DATABASE_URL and SSL settings are correct.</p>
        )}
      </section>
    </main>
  );
}
