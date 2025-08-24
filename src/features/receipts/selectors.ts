import { ProPersona } from '../pro/types';

export interface ReceiptFilter {
  tenantId?: string;
  clientIds?: string[];
  personaId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  hasAnchor?: boolean;
}

export interface ProReceiptScope {
  firmId: string;
  clientIds: string[];
  personaType: ProPersona;
}

export interface SupervisorReceiptScope {
  firmId: string;
  allClients: boolean;
}

/**
 * Get current user's professional scope for receipt filtering
 */
export function getCurrentUserProScope(): ProReceiptScope | null {
  // In a real implementation, this would come from auth context
  // For now, return mock data based on localStorage or auth state
  try {
    const userData = localStorage.getItem('user_session');
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    return {
      firmId: user.firmId || 'demo-firm-001',
      clientIds: user.clientIds || ['client-001', 'client-002'],
      personaType: user.persona || 'advisor'
    };
  } catch {
    return {
      firmId: 'demo-firm-001',
      clientIds: ['client-001', 'client-002'],
      personaType: 'advisor'
    };
  }
}

/**
 * Get current user's supervisor scope for receipt filtering
 */
export function getCurrentUserSupervisorScope(): SupervisorReceiptScope | null {
  try {
    const userData = localStorage.getItem('user_session');
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    if (!user.isSupervisor) return null;
    
    return {
      firmId: user.firmId || 'demo-firm-001',
      allClients: true
    };
  } catch {
    return null;
  }
}

/**
 * List receipts for professional personas (firm-scoped + client-linked filtering)
 */
export function listReceiptsForPro(filters: ReceiptFilter = {}): any[] {
  const scope = getCurrentUserProScope();
  if (!scope) return [];
  
  try {
    // Get all receipt types from localStorage
    const receiptSources = [
      'family_receipts',
      'consent_receipts', 
      'decision_receipts',
      'comms_receipts',
      'call_receipts',
      'vault_receipts'
    ];
    
    let allReceipts: any[] = [];
    
    receiptSources.forEach(source => {
      const stored = localStorage.getItem(source);
      if (stored) {
        const receipts = JSON.parse(stored);
        allReceipts = allReceipts.concat(receipts);
      }
    });
    
    // Apply firm and client scoping
    let filteredReceipts = allReceipts.filter(receipt => {
      // Firm scope check
      if (receipt.firmId && receipt.firmId !== scope.firmId) {
        return false;
      }
      
      // Client scope check - only show receipts for linked clients
      if (receipt.clientId && !scope.clientIds.includes(receipt.clientId)) {
        return false;
      }
      
      return true;
    });
    
    // Apply additional filters
    if (filters.type) {
      filteredReceipts = filteredReceipts.filter(r => r.type === filters.type);
    }
    
    if (filters.personaId) {
      filteredReceipts = filteredReceipts.filter(r => 
        r.payload?.persona === filters.personaId || r.persona === filters.personaId
      );
    }
    
    if (filters.startDate) {
      filteredReceipts = filteredReceipts.filter(r => 
        new Date(r.timestamp) >= new Date(filters.startDate!)
      );
    }
    
    if (filters.endDate) {
      filteredReceipts = filteredReceipts.filter(r => 
        new Date(r.timestamp) <= new Date(filters.endDate!)
      );
    }
    
    if (filters.hasAnchor !== undefined) {
      filteredReceipts = filteredReceipts.filter(r => 
        Boolean(r.anchor_ref) === filters.hasAnchor
      );
    }
    
    // Sort by timestamp desc
    return filteredReceipts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
  } catch (error) {
    console.error('Error listing receipts for pro:', error);
    return [];
  }
}

/**
 * List receipts for compliance supervisors (firm-scoped filtering)
 */
export function listReceiptsForSupervisor(filters: ReceiptFilter = {}): any[] {
  const scope = getCurrentUserSupervisorScope();
  if (!scope) return [];
  
  try {
    // Get all receipt types from localStorage
    const receiptSources = [
      'family_receipts',
      'consent_receipts',
      'decision_receipts', 
      'comms_receipts',
      'call_receipts',
      'vault_receipts'
    ];
    
    let allReceipts: any[] = [];
    
    receiptSources.forEach(source => {
      const stored = localStorage.getItem(source);
      if (stored) {
        const receipts = JSON.parse(stored);
        allReceipts = allReceipts.concat(receipts);
      }
    });
    
    // Apply firm scoping only (supervisors see all clients in firm)
    let filteredReceipts = allReceipts.filter(receipt => {
      if (receipt.firmId && receipt.firmId !== scope.firmId) {
        return false;
      }
      return true;
    });
    
    // Apply additional filters
    if (filters.type) {
      filteredReceipts = filteredReceipts.filter(r => r.type === filters.type);
    }
    
    if (filters.personaId) {
      filteredReceipts = filteredReceipts.filter(r => 
        r.payload?.persona === filters.personaId || r.persona === filters.personaId
      );
    }
    
    if (filters.startDate) {
      filteredReceipts = filteredReceipts.filter(r => 
        new Date(r.timestamp) >= new Date(filters.startDate!)
      );
    }
    
    if (filters.endDate) {
      filteredReceipts = filteredReceipts.filter(r => 
        new Date(r.timestamp) <= new Date(filters.endDate!)
      );
    }
    
    if (filters.hasAnchor !== undefined) {
      filteredReceipts = filteredReceipts.filter(r => 
        Boolean(r.anchor_ref) === filters.hasAnchor
      );
    }
    
    // Sort by timestamp desc
    return filteredReceipts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
  } catch (error) {
    console.error('Error listing receipts for supervisor:', error);
    return [];
  }
}

/**
 * Count receipts by type for dashboard metrics
 */
export function getReceiptCounts(scope: 'pro' | 'supervisor' = 'pro'): Record<string, number> {
  const receipts = scope === 'pro' ? listReceiptsForPro() : listReceiptsForSupervisor();
  
  const counts: Record<string, number> = {};
  
  receipts.forEach(receipt => {
    const type = receipt.type || 'unknown';
    counts[type] = (counts[type] || 0) + 1;
  });
  
  return counts;
}

/**
 * Get recent receipts for dashboard
 */
export function getRecentReceipts(limit: number = 10, scope: 'pro' | 'supervisor' = 'pro'): any[] {
  const receipts = scope === 'pro' ? listReceiptsForPro() : listReceiptsForSupervisor();
  return receipts.slice(0, limit);
}

/**
 * Export receipts to CSV (PII redacted)
 */
export function exportReceiptsToCSV(scope: 'pro' | 'supervisor' = 'pro', filters: ReceiptFilter = {}): string {
  const receipts = scope === 'pro' ? listReceiptsForPro(filters) : listReceiptsForSupervisor(filters);
  
  if (receipts.length === 0) {
    return 'No receipts found for export';
  }
  
  // CSV headers (PII redacted)
  const headers = [
    'Receipt ID',
    'Type', 
    'Action',
    'Result',
    'Timestamp',
    'Client Hash',
    'Persona',
    'Has Anchor',
    'Policy Version'
  ];
  
  const csvRows = [headers.join(',')];
  
  receipts.forEach(receipt => {
    const row = [
      receipt.inputs_hash || receipt.id || '',
      receipt.type || '',
      receipt.payload?.action || receipt.action || '',
      receipt.payload?.result || receipt.result || '',
      receipt.timestamp || '',
      receipt.clientId ? `hash_${receipt.clientId.slice(0, 8)}` : '',
      receipt.payload?.persona || receipt.persona || '',
      Boolean(receipt.anchor_ref) ? 'Yes' : 'No',
      receipt.policy_version || ''
    ];
    
    csvRows.push(row.map(field => `"${field}"`).join(','));
  });
  
  return csvRows.join('\n');
}