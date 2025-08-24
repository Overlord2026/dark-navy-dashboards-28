import type { Checklist } from './types';

// Simple in-memory store - in production would use database
const checklistStore = new Map<string, Checklist>();

export async function getChecklist(clientId: string): Promise<Checklist | undefined> {
  const checklist = checklistStore.get(clientId);
  if (checklist) {
    console.log(`[Checklist Store] Retrieved checklist for ${clientId}`);
  }
  return checklist;
}

export async function saveChecklist(checklist: Checklist): Promise<void> {
  checklistStore.set(checklist.clientId, { ...checklist });
  console.log(`[Checklist Store] Saved checklist for ${checklist.clientId}`);
}

export async function getAllChecklists(): Promise<Checklist[]> {
  return Array.from(checklistStore.values());
}

export async function deleteChecklist(clientId: string): Promise<boolean> {
  const existed = checklistStore.has(clientId);
  checklistStore.delete(clientId);
  console.log(`[Checklist Store] Deleted checklist for ${clientId}: ${existed}`);
  return existed;
}

export function getChecklistCount(): number {
  return checklistStore.size;
}