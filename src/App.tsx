
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import CustomerProfile from '@/pages/CustomerProfile';
import CashManagement from '@/pages/CashManagement';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import { Toaster } from 'sonner';
import Education from '@/pages/Education';
import Index from '@/pages/Index';
import { NetWorthProvider } from '@/context/NetWorthContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { BillsProvider } from '@/hooks/useBills';
import Subscription from '@/pages/Subscription';
import BillsManagement from '@/pages/BillsManagement';
import AdvisorProfile from '@/pages/AdvisorProfile';
import Documents from '@/pages/Documents';
import LegacyVault from '@/pages/LegacyVault';
import SystemDiagnostics from '@/pages/SystemDiagnostics';

// Import Marketplace Module components
import { MarketplaceProvider } from '@/modules/marketplace/context/MarketplaceContext';
import MarketplacePage from '@/modules/marketplace/pages/MarketplacePage';
import FamilyOfficeDirectory from '@/pages/FamilyOfficeDirectory';
import DataImportPage from '@/pages/DataImportPage';

// Register the marketplace navigation in the main navigation
import { registerNavItem } from '@/components/navigation/NavigationConfig';
import { registerMarketplaceNavigation } from '@/modules/marketplace/navigation/MarketplaceNavigationConfig';
import { ShoppingBag, FileIcon, Activity } from 'lucide-react';

// Register marketplace in main navigation
registerNavItem('collaboration', {
  id: "marketplace",
  label: "Marketplace",
  icon: ShoppingBag,
  href: "/marketplace"
});

// Register Documents/Legacy Vault in main navigation
registerNavItem('client', {
  id: "legacy-vault",
  label: "Legacy Vault",
  icon: FileIcon,
  href: "/legacy-vault"
});

// Register System Diagnostics in main navigation
registerNavItem('admin', {
  id: "system-diagnostics",
  label: "System Diagnostics",
  icon: Activity,
  href: "/system-diagnostics"
});

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <SubscriptionProvider>
          <NetWorthProvider>
            <BillsProvider>
              <MarketplaceProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/landing" element={<HomePage />} />
                    <Route path="/login" element={<Navigate to="/" />} />
                    <Route path="/dashboard" element={<Index />} />
                    <Route path="/home" element={<Index />} />
                    <Route path="/profile" element={<CustomerProfile />} />
                    
                    {/* Marketplace Module Routes */}
                    <Route path="/marketplace" element={<MarketplacePage />} />
                    <Route path="/family-office-directory" element={<FamilyOfficeDirectory />} />
                    <Route path="/data-import" element={<DataImportPage />} />
                    
                    {/* Document Management Routes */}
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/legacy-vault" element={<LegacyVault />} />
                    
                    {/* System Diagnostics Routes */}
                    <Route path="/system-diagnostics" element={<SystemDiagnostics />} />
                    
                    <Route path="/cash-management" element={<CashManagement />} />
                    <Route path="/education" element={<Education />} />
                    <Route path="/subscription" element={<Subscription />} />
                    <Route path="/bills-management" element={<BillsManagement />} />
                    <Route path="/advisor-profile" element={<AdvisorProfile />} />
                  </Routes>
                </BrowserRouter>
                <Toaster />
              </MarketplaceProvider>
            </BillsProvider>
          </NetWorthProvider>
        </SubscriptionProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
