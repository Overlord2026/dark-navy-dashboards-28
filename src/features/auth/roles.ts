export type Role = 'FAMILY' | 'ADVISOR' | 'CPA' | 'ATTORNEY' | 'ADMIN';

export function canWrite(role: Role | undefined): boolean {
  return role === 'ADVISOR' || role === 'ADMIN';
}

export function canRead(role: Role | undefined): boolean {
  return !!role; // All authenticated users can read
}

export function getRoleDisplayName(role: Role): string {
  const roleNames = {
    FAMILY: 'Family Member',
    ADVISOR: 'Financial Advisor',
    CPA: 'CPA',
    ATTORNEY: 'Attorney',
    ADMIN: 'Administrator'
  };
  return roleNames[role] || 'User';
}

// Mock function for demo - replace with real auth context
export function getCurrentUserRole(): Role {
  // This would normally come from your auth context/state
  return (localStorage.getItem('user_role') as Role) || 'ADVISOR';
}

export function setMockRole(role: Role): void {
  localStorage.setItem('user_role', role);
}