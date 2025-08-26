import type { CMARow, GlideRow } from './types';

let CMA: CMARow[] = [
  { asset: 'US_Equity', er: 0.065, stdev: 0.16 },
  { asset: 'Intl_Equity', er: 0.06, stdev: 0.17 },
  { asset: 'US_Bonds', er: 0.035, stdev: 0.07 },
  { asset: 'Cash', er: 0.02, stdev: 0.01 }
];

let GLIDE: GlideRow[] = [
  { age: 25, equity: 0.90, bonds: 0.09, cash: 0.01 },
  { age: 35, equity: 0.80, bonds: 0.18, cash: 0.02 },
  { age: 45, equity: 0.70, bonds: 0.28, cash: 0.02 },
  { age: 55, equity: 0.55, bonds: 0.42, cash: 0.03 },
  { age: 65, equity: 0.40, bonds: 0.57, cash: 0.03 }
];

export function getCMA(): CMARow[] { 
  return CMA; 
}

export function setCMA(rows: CMARow[]): void { 
  CMA = rows; 
}

export function getGlide(): GlideRow[] { 
  return GLIDE; 
}

export function setGlide(rows: GlideRow[]): void { 
  GLIDE = rows; 
}

export function glideForAge(age: number): GlideRow {
  const sorted = [...GLIDE].sort((a, b) => a.age - b.age);
  const found = sorted.find(g => age <= g.age) || sorted[sorted.length - 1];
  return found;
}

// CSV parsing helpers
export function parseCMAFromCSV(csvText: string): CMARow[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].toLowerCase().split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      asset: values[headers.indexOf('asset')]?.trim() || '',
      er: parseFloat(values[headers.indexOf('er')] || '0'),
      stdev: parseFloat(values[headers.indexOf('stdev')] || '0')
    };
  }).filter(row => row.asset);
}

export function parseGlideFromCSV(csvText: string): GlideRow[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].toLowerCase().split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      age: parseInt(values[headers.indexOf('age')] || '0'),
      equity: parseFloat(values[headers.indexOf('equity')] || '0'),
      bonds: parseFloat(values[headers.indexOf('bonds')] || '0'),
      cash: parseFloat(values[headers.indexOf('cash')] || '0')
    };
  }).filter(row => row.age > 0);
}

// CSV export helpers
export function exportCMAToCSV(): string {
  const headers = 'asset,er,stdev';
  const rows = CMA.map(row => `${row.asset},${row.er},${row.stdev}`);
  return [headers, ...rows].join('\n');
}

export function exportGlideToCSV(): string {
  const headers = 'age,equity,bonds,cash';
  const rows = GLIDE.map(row => `${row.age},${row.equity},${row.bonds},${row.cash}`);
  return [headers, ...rows].join('\n');
}