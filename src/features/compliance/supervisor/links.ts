export function buildDigestUrls(firmId: string, personas: string[]) {
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://app.mybfocfo.com';
  const personaQS = personas.length && personas.length < 7 ? `&personas=${encodeURIComponent(personas.join(','))}` : '';
  
  return {
    exceptions_link: `${base}/supervisor/exceptions?firm=${firmId}${personaQS}`,
    evidence_link: `${base}/supervisor/evidence?firm=${firmId}${personaQS}`,
    anchors_link: `${base}/supervisor/anchors?firm=${firmId}${personaQS}`,
    audits_link: `${base}/supervisor/audits?firm=${firmId}${personaQS}`
  };
}