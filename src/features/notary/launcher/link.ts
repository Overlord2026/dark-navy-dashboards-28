export type NotaryLaunchParams = {
  docId: string;                 // Vault file id (sha256:... or internal id)
  state?: string;                // 2-letter code
  mode?: 'RON'|'IN_PERSON';      // default choose by policy
  back?: string;                 // absolute or relative; we will sanitize
  title?: string;                // optional display name
  signerEmail?: string;          // optional convenience
  signerName?: string;           // optional convenience
};

function sanitizeBack(back?: string){
  if (!back) return '';
  try {
    // allow same-origin or relative only
    const u = new URL(back, window.location.origin);
    return (u.origin === window.location.origin) ? u.pathname + u.search + u.hash : '/';
  } catch { return '/'; }
}

export function buildNotaryLink(p: NotaryLaunchParams){
  const qp = new URLSearchParams();
  qp.set('docId', p.docId);
  if (p.state) qp.set('state', p.state);
  if (p.mode) qp.set('mode', p.mode);
  if (p.title) qp.set('title', p.title);
  if (p.signerEmail) qp.set('signerEmail', p.signerEmail);
  if (p.signerName) qp.set('signerName', p.signerName);
  const back = sanitizeBack(p.back);
  if (back) qp.set('back', back);
  return `/notary/request?${qp.toString()}`;
}