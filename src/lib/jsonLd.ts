// src/lib/jsonLd.ts
export function jsonLdSafe(obj: unknown): string {
  const json = JSON.stringify(obj ?? {});
  // Prevent </script> breakouts and HTML parsing edge-cases
  return json
    .replace(/</g, '\\u003C')
    .replace(/>/g, '\\u003E')
    .replace(/&/g, '\\u0026')
    .replace(/<\/script/gi, '<\\/script');
}