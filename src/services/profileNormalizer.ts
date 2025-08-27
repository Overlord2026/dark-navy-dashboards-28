/**
 * Profile normalizer for Social Graph Invite Engine
 * Normalizes CSV rows for content-free invite generation
 */

import { inputs_hash } from '@/lib/canonical';

export interface ProfileRow {
  persona: 'agent' | 'family';
  full_name: string;
  title?: string;
  market?: string;
  specialties?: string[];
  profile_url?: string;
  email?: string;
  phone?: string;
  source?: string;
  advisor_id?: string;
}

export interface NormalizedProfile {
  persona: 'agent' | 'family';
  platform: 'linkedin' | 'email' | 'phone';
  profile_url?: string;
  tokens: {
    name: string;
    title?: string;
    market?: string;
    specialties?: string[];
  };
  email_hash?: string;
  phone_hash?: string;
  inputs_hash: string;
}

const VALID_SPECIALTIES = [
  'marine',
  'fine_art', 
  'coastal_home',
  'exotics',
  'umbrella',
  'flood_eq'
] as const;

/**
 * Normalize a single profile row for invite generation
 * Removes PII and creates content-free tokens
 */
export async function normalizeProfileRow(row: ProfileRow): Promise<NormalizedProfile> {
  // Validate persona
  if (!['agent', 'family'].includes(row.persona)) {
    throw new Error(`Invalid persona: ${row.persona}`);
  }

  // Validate and filter specialties
  const specialties = row.specialties?.filter(s => 
    VALID_SPECIALTIES.includes(s as any)
  ) || [];

  // Determine platform
  let platform: 'linkedin' | 'email' | 'phone' = 'email';
  if (row.profile_url?.includes('linkedin.com')) {
    platform = 'linkedin';
  } else if (row.phone && !row.email) {
    platform = 'phone';
  }

  // Create content-free tokens (no PII)
  const tokens = {
    name: row.full_name,
    title: row.title,
    market: row.market,
    specialties
  };

  // Generate hashes for email/phone if present
  let email_hash: string | undefined;
  let phone_hash: string | undefined;

  if (row.email) {
    email_hash = await inputs_hash({ email: row.email.toLowerCase().trim() });
  }

  if (row.phone) {
    const cleanPhone = row.phone.replace(/\D/g, '');
    phone_hash = await inputs_hash({ phone: cleanPhone });
  }

  // Generate inputs hash for the normalized profile
  const profile_inputs_hash = await inputs_hash({
    persona: row.persona,
    platform,
    tokens,
    email_hash,
    phone_hash
  });

  return {
    persona: row.persona,
    platform,
    profile_url: row.profile_url,
    tokens,
    email_hash,
    phone_hash,
    inputs_hash: profile_inputs_hash
  };
}

/**
 * Normalize multiple profile rows from CSV
 */
export async function normalizeProfileRows(rows: ProfileRow[]): Promise<NormalizedProfile[]> {
  const normalized: NormalizedProfile[] = [];
  
  for (const row of rows) {
    try {
      const normalizedRow = await normalizeProfileRow(row);
      normalized.push(normalizedRow);
    } catch (error) {
      console.error('Failed to normalize profile row:', error, row);
      // Continue processing other rows
    }
  }
  
  return normalized;
}

/**
 * Parse CSV content into ProfileRow objects
 */
export function parseProfileCSV(csvContent: string): ProfileRow[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have header row and at least one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const rows: ProfileRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: Partial<ProfileRow> = {};

    headers.forEach((header, index) => {
      const value = values[index];
      if (!value) return;

      switch (header.toLowerCase()) {
        case 'persona':
          row.persona = value as 'agent' | 'family';
          break;
        case 'full_name':
          row.full_name = value;
          break;
        case 'title':
          row.title = value;
          break;
        case 'market':
          row.market = value;
          break;
        case 'specialties':
          try {
            row.specialties = JSON.parse(value);
          } catch {
            row.specialties = value.split(';').map(s => s.trim());
          }
          break;
        case 'profile_url':
          row.profile_url = value;
          break;
        case 'email':
          row.email = value;
          break;
        case 'phone':
          row.phone = value;
          break;
        case 'source':
          row.source = value;
          break;
        case 'advisor_id':
          row.advisor_id = value;
          break;
      }
    });

    if (row.persona && row.full_name) {
      rows.push(row as ProfileRow);
    }
  }

  return rows;
}