
// Mock data for developers
const mockDevelopers = [
  {
    id: "dev1",
    name: "Alex Johnson",
    role: "developer",
    email: "alex.johnson@example.com",
    canRunDiagnostics: true,
    canAccessSystemDiagnostics: false
  },
  {
    id: "dev2",
    name: "Sam Wilson",
    role: "developer",
    email: "sam.wilson@example.com",
    canRunDiagnostics: false,
    canAccessSystemDiagnostics: false
  },
  {
    id: "dev3",
    name: "Taylor Chen",
    role: "consultant",
    email: "taylor.chen@example.com",
    canRunDiagnostics: true,
    canAccessSystemDiagnostics: true
  },
  {
    id: "dev4",
    name: "Morgan Patel",
    role: "developer",
    email: "morgan.patel@example.com",
    canRunDiagnostics: false, 
    canAccessSystemDiagnostics: false
  }
];

// This would be stored in a database in a real application
let developersData = [...mockDevelopers];

export async function getDevelopers() {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return a copy to avoid direct mutation
  return [...developersData];
}

export async function updateDeveloperAccess(
  developerId: string, 
  accessType: 'diagnostics' | 'systemDiagnostics', 
  value: boolean
) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, this would be a PUT/PATCH request to an API
  developersData = developersData.map(dev => {
    if (dev.id === developerId) {
      if (accessType === 'diagnostics') {
        return { ...dev, canRunDiagnostics: value };
      } else if (accessType === 'systemDiagnostics') {
        return { ...dev, canAccessSystemDiagnostics: value };
      }
    }
    return dev;
  });
  
  // Return the updated developer
  return developersData.find(dev => dev.id === developerId);
}

// Add a function to check if a user has access to diagnostics features
export async function checkDiagnosticsAccess(userId: string, accessType: 'diagnostics' | 'systemDiagnostics') {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const developer = developersData.find(dev => dev.id === userId);
  if (!developer) return false;
  
  if (accessType === 'diagnostics') {
    return developer.canRunDiagnostics;
  } else if (accessType === 'systemDiagnostics') {
    return developer.canAccessSystemDiagnostics;
  }
  
  return false;
}
