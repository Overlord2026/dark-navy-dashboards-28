// CDN purge API stub
export async function purgeCDN() {
  try {
    const res = await fetch('/api/admin/purge-cdn', { method: 'POST' });
    if (!res.ok) throw new Error('purge failed');
    return true;
  } catch {
    // fallback: print manual steps
    console.log('Manual CDN purge steps:');
    console.log('1. Log into your CDN provider dashboard');
    console.log('2. Navigate to cache/purge section');
    console.log('3. Purge all files or specific routes:');
    console.log('   - /discover');
    console.log('   - /solutions/*');
    console.log('   - /nil/*');
    console.log('   - /sitemap.xml');
    console.log('   - /robots.txt');
    return false;
  }
}