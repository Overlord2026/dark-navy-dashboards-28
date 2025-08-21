import { AnyRDS } from './types';

const store: AnyRDS[] = [];

export function recordReceipt<T extends AnyRDS>(rds: T): T {
  store.push(rds);
  console.info('receipt.recorded', rds);
  return rds;
}

export function listReceipts(): AnyRDS[] {
  return [...store];
}

export function getReceipt(id: string): AnyRDS | null {
  return store.find(r => r.id === id) || null;
}

export function getReceiptsByType<T extends AnyRDS>(type: T['type']): T[] {
  return store.filter(r => r.type === type) as T[];
}

export function clearReceipts(): void {
  store.length = 0;
  console.info('receipt.store.cleared');
}

export function getReceiptsCount(): number {
  return store.length;
}