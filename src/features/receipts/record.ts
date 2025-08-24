// Simple receipt recording system for demo purposes
export function recordReceipt(receipt: any) {
  try {
    const receipts = JSON.parse(localStorage.getItem('family_receipts') || '[]');
    receipts.unshift(receipt);
    localStorage.setItem('family_receipts', JSON.stringify(receipts));
    console.log('✅ Receipt recorded:', receipt.id);
    return receipt;
  } catch (error) {
    console.error('❌ Failed to record receipt:', error);
    return receipt;
  }
}

export function listReceipts(): any[] {
  try {
    return JSON.parse(localStorage.getItem('family_receipts') || '[]');
  } catch {
    return [];
  }
}

export function getReceiptsCount(): number {
  return listReceipts().length;
}

export function getReceiptsByType(type: string): any[] {
  return listReceipts().filter(r => r.type === type);
}

export function clearReceipts(): void {
  localStorage.removeItem('family_receipts');
}