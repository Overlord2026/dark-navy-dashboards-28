export type SupervisorPrefs = {
  userId: string;
  firmId: string;
  enabled: boolean;
  hourUtc: number; // 0..23
  personas: ('advisor' | 'cpa' | 'attorney' | 'insurance' | 'medicare' | 'healthcare' | 'realtor')[];
  sendEmpty: boolean; // override flag for this user
};

export async function getSupervisorPrefs(firmId: string): Promise<SupervisorPrefs[]> {
  // Load from localStorage for demo (in real app, would be from database)
  const allPrefs = JSON.parse(localStorage.getItem('supervisor_prefs') || '[]');
  return allPrefs.filter((p: SupervisorPrefs) => p.firmId === firmId);
}

export async function saveSupervisorPrefs(p: SupervisorPrefs): Promise<void> {
  // Save to localStorage for demo (in real app, would be to database)
  const allPrefs = JSON.parse(localStorage.getItem('supervisor_prefs') || '[]');
  const existingIndex = allPrefs.findIndex((pref: SupervisorPrefs) => 
    pref.userId === p.userId && pref.firmId === p.firmId
  );
  
  if (existingIndex >= 0) {
    allPrefs[existingIndex] = p;
  } else {
    allPrefs.push(p);
  }
  
  localStorage.setItem('supervisor_prefs', JSON.stringify(allPrefs));
}

export async function getAllSupervisorPrefs(): Promise<SupervisorPrefs[]> {
  // Get all supervisor preferences for job processing
  return JSON.parse(localStorage.getItem('supervisor_prefs') || '[]');
}