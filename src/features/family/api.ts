// Mock family/client API
export async function listClients() {
  return [
    { id: 'client-1', name: 'John Smith' },
    { id: 'client-2', name: 'Jane Doe' },
    { id: 'client-3', name: 'Bob Johnson' }
  ];
}

export async function listHouseholds() {
  return [
    { id: 'household-1', name: 'Smith Family' },
    { id: 'household-2', name: 'Doe Family' },
    { id: 'household-3', name: 'Johnson Family' }
  ];
}