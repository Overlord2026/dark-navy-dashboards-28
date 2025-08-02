// Data privacy utilities for coaches
export function maskClientData(data: any, userRole: string) {
  if (userRole !== 'coach') {
    return data; // Non-coaches see full data
  }

  // Coaches only see aggregate/masked data
  if (Array.isArray(data)) {
    return data.map(item => maskSingleRecord(item));
  }
  
  return maskSingleRecord(data);
}

function maskSingleRecord(record: any) {
  if (!record) return record;

  const masked = { ...record };

  // Mask PII fields
  if (masked.email) {
    masked.email = maskEmail(masked.email);
  }
  
  if (masked.phone) {
    masked.phone = maskPhone(masked.phone);
  }
  
  if (masked.name || masked.client_name) {
    const name = masked.name || masked.client_name;
    masked.name = maskName(name);
    masked.client_name = maskName(name);
  }

  if (masked.first_name) {
    masked.first_name = maskName(masked.first_name);
  }

  if (masked.last_name) {
    masked.last_name = masked.last_name.charAt(0) + '***';
  }

  // Remove sensitive fields entirely
  delete masked.ssn;
  delete masked.bank_account;
  delete masked.credit_card;
  delete masked.full_address;
  delete masked.detailed_notes;

  return masked;
}

function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  const maskedUsername = username.charAt(0) + '*'.repeat(Math.max(username.length - 2, 0)) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.substring(0, 3)}) ***-${digits.substring(6)}`;
  }
  return '***-***-' + digits.slice(-4);
}

function maskName(name: string): string {
  const parts = name.split(' ');
  return parts.map(part => 
    part.charAt(0) + '*'.repeat(Math.max(part.length - 1, 0))
  ).join(' ');
}

// Aggregate client data for coaches
export function aggregateClientData(clients: any[]) {
  return {
    totalClients: clients.length,
    averageValue: clients.reduce((sum, c) => sum + (c.value || 0), 0) / clients.length,
    statusBreakdown: clients.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    geographicDistribution: clients.reduce((acc, c) => {
      if (c.state) {
        acc[c.state] = (acc[c.state] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    ageGroups: clients.reduce((acc, c) => {
      if (c.age) {
        const group = c.age < 35 ? 'Under 35' : c.age < 50 ? '35-50' : c.age < 65 ? '50-65' : 'Over 65';
        acc[group] = (acc[group] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>)
  };
}