export async function createBeneficiaryTask(
  clientId: string,
  accountId: string,
  intent: string,
  current: string
) {
  const task = {
    id: `task-${Date.now()}-${accountId}`,
    clientId,
    type: 'beneficiary_fix',
    title: 'Beneficiary Mismatch Detected',
    description: `Account ${accountId} beneficiary should be "${intent}" but is currently "${current}"`,
    accountId,
    intent,
    current,
    status: 'pending',
    createdAt: new Date().toISOString(),
    priority: 'medium'
  };
  
  // Store task (using localStorage for demo)
  const tasks = JSON.parse(localStorage.getItem('beneficiary_tasks') || '[]');
  tasks.push(task);
  localStorage.setItem('beneficiary_tasks', JSON.stringify(tasks));
  
  return task;
}

export async function getBeneficiaryTasks(clientId: string) {
  const tasks = JSON.parse(localStorage.getItem('beneficiary_tasks') || '[]');
  return tasks.filter((t: any) => t.clientId === clientId);
}