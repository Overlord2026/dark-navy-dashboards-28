export type SavedView = {
  id: string;
  name: string;
  filter: string;         // FilterKey
  search?: string;
  sort?: 'risk_desc' | 'client_asc' | 'state_asc' | 'none';
  visible?: string[];    // optional: columns
  createdAt: string;
};

const KEY = 'checklist.saved.views.v1';

export function loadViews(): SavedView[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveViews(v: SavedView[]) {
  localStorage.setItem(KEY, JSON.stringify(v));
}

export function addView(v: SavedView) {
  const arr = loadViews();
  arr.push(v);
  saveViews(arr);
  return arr;
}

export function removeView(id: string) {
  const arr = loadViews().filter(x => x.id !== id);
  saveViews(arr);
  return arr;
}

export function exportViews(): string {
  return JSON.stringify(loadViews(), null, 2);
}

export function importViews(json: string) {
  const arr = JSON.parse(json);
  if (Array.isArray(arr)) saveViews(arr);
  return arr;
}