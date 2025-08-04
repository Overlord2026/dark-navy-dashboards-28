import { runIMOAdminDashboardTests } from '@/scripts/imoAdminDashboardTests';

// Execute comprehensive IMO/FMO dashboard tests
const testResults = runIMOAdminDashboardTests();

// Export results for download
export const downloadIMOTestReport = () => {
  const blob = new Blob([JSON.stringify(testResults, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `imo-admin-dashboard-test-report-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  return testResults;
};