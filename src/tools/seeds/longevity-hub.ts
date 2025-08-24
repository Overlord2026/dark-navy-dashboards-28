import { recordReceipt } from '@/features/receipts/record';

export interface LongevityProtocol {
  id: string;
  name: string;
  category: 'exercise' | 'nutrition' | 'sleep' | 'stress' | 'social';
  description: string;
  frequency: string;
  evidence: string;
  impact: 'high' | 'medium' | 'low';
}

export interface HealthScreening {
  id: string;
  name: string;
  lastCompleted: string;
  nextDue: string;
  status: 'current' | 'due_soon' | 'overdue';
  importance: 'critical' | 'important' | 'routine';
}

export interface WearableData {
  id: string;
  device: string;
  metric: string;
  value: number;
  unit: string;
  trend: 'improving' | 'stable' | 'declining';
  lastSync: string;
}

export async function seedLongevityHub() {
  const protocols: LongevityProtocol[] = [
    {
      id: 'strength_training',
      name: 'Resistance Training',
      category: 'exercise',
      description: 'Progressive strength training 3x per week focusing on compound movements',
      frequency: '3 times per week',
      evidence: 'Reduces all-cause mortality by 15-20%',
      impact: 'high'
    },
    {
      id: 'meditation',
      name: 'Mindfulness Meditation',
      category: 'stress',
      description: 'Daily 20-minute mindfulness practice to reduce cortisol and inflammation',
      frequency: 'Daily',
      evidence: 'Improves telomere length and reduces cellular aging',
      impact: 'high'
    }
  ];

  const screenings: HealthScreening[] = [
    {
      id: 'annual_physical',
      name: 'Annual Physical Exam',
      lastCompleted: '2024-06-15',
      nextDue: '2025-06-15',
      status: 'current',
      importance: 'critical'
    },
    {
      id: 'colonoscopy',
      name: 'Colonoscopy Screening',
      lastCompleted: '2021-08-20',
      nextDue: '2025-08-20',
      status: 'due_soon',
      importance: 'critical'
    }
  ];

  const wearableData: WearableData[] = [
    {
      id: 'steps',
      device: 'Apple Watch',
      metric: 'Daily Steps',
      value: 8847,
      unit: 'steps',
      trend: 'improving',
      lastSync: new Date().toISOString()
    },
    {
      id: 'hrv',
      device: 'WHOOP',
      metric: 'Heart Rate Variability',
      value: 42,
      unit: 'ms',
      trend: 'stable',
      lastSync: new Date().toISOString()
    }
  ];

  // Store in localStorage for demo
  localStorage.setItem('longevity_protocols', JSON.stringify(protocols));
  localStorage.setItem('health_screenings', JSON.stringify(screenings));
  localStorage.setItem('wearable_data', JSON.stringify(wearableData));

  // Create proof slip
  const now = new Date().toISOString();
  recordReceipt({
    id: `longevity_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['LONGEVITY_PROTOCOL_ADDED'],
    created_at: now
  } as any);

  return { protocols, screenings, wearableData };
}

export function getLongevityData() {
  try {
    return {
      protocols: JSON.parse(localStorage.getItem('longevity_protocols') || '[]'),
      screenings: JSON.parse(localStorage.getItem('health_screenings') || '[]'),
      wearableData: JSON.parse(localStorage.getItem('wearable_data') || '[]')
    };
  } catch {
    return { protocols: [], screenings: [], wearableData: [] };
  }
}