import { Lead, ProPersona } from '../types';

const STORAGE_KEY = 'pro_leads';

export class LeadModel {
  static getAll(): Lead[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static getByPersona(persona: ProPersona): Lead[] {
    return this.getAll().filter(lead => lead.persona === persona);
  }

  static create(leadData: Omit<Lead, 'id' | 'created_at'>): Lead {
    const lead: Lead = {
      ...leadData,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };

    const leads = this.getAll();
    leads.unshift(lead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    
    return lead;
  }

  static update(id: string, updates: Partial<Lead>): Lead | null {
    const leads = this.getAll();
    const index = leads.findIndex(lead => lead.id === id);
    
    if (index === -1) return null;
    
    leads[index] = { ...leads[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    
    return leads[index];
  }

  static delete(id: string): boolean {
    const leads = this.getAll();
    const filtered = leads.filter(lead => lead.id !== id);
    
    if (filtered.length === leads.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  static exportCSV(persona?: ProPersona): string {
    const leads = persona ? this.getByPersona(persona) : this.getAll();
    
    const headers = ['Name', 'Email', 'Phone', 'Tags', 'Persona', 'Status', 'Created At'];
    const rows = leads.map(lead => [
      lead.name,
      lead.email,
      lead.phone || '',
      lead.tags.join('; '),
      lead.persona,
      lead.status,
      new Date(lead.created_at).toLocaleDateString()
    ]);

    return [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  static getMetrics(persona?: ProPersona) {
    const leads = persona ? this.getByPersona(persona) : this.getAll();
    
    return {
      total: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      qualified: leads.filter(l => l.status === 'qualified').length,
      converted: leads.filter(l => l.status === 'converted').length,
      lost: leads.filter(l => l.status === 'lost').length,
      with_consent: leads.filter(l => l.consent_given).length,
    };
  }
}