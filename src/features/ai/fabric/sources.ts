export type Source = { key: string; kind: 'tabular' | 'doc' | 'api' | 'event'; status: 'ok' | 'stale' };

export const SOURCES: Source[] = [
  { key: 'k401.accounts', kind: 'tabular', status: 'ok' },
  { key: 'k401.provider_rules', kind: 'tabular', status: 'ok' },
  { key: 'vault.docs', kind: 'doc', status: 'ok' },
  { key: 'events.bus', kind: 'event', status: 'ok' },
];

export function getSource(key: string): Source | undefined {
  return SOURCES.find(s => s.key === key);
}

export function getSourcesByKind(kind: Source['kind']): Source[] {
  return SOURCES.filter(s => s.kind === kind);
}

export function isSourceHealthy(key: string): boolean {
  const source = getSource(key);
  return source?.status === 'ok';
}