
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
import Properties from '@/pages/Properties';
import Investments from '@/pages/Investments';
import IPProtection from '@/pages/IPProtection';

// Import Marketplace Module components
import { MarketplaceProvider } from '@/modules/marketplace/context/MarketplaceContext';
import MarketplacePage from '@/modules/marketplace/pages/MarketplacePage';
import FamilyOfficeDirectory from '@/pages/FamilyOfficeDirectory';
import DataImportPage from '@/pages/DataImportPage';

// Register the marketplace navigation in the main navigation
import { registerNavItem } from '@/components/navigation/NavigationConfig';
import { ShoppingBag, FileIcon, Activity } from 'lucide-react';

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
                    
                    {/* Wealth Management Routes */}
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/investments" element={<Investments />} />
                    <Route path="/financial-plans" element={<Index />} />
                    <Route path="/accounts" element={<Index />} />
                    <Route path="/insurance" element={<Index />} />
                    <Route path="/social-security" element={<Index />} />
                    
                    {/* Banking Routes */}
                    <Route path="/cash-management" element={<CashManagement />} />
                    <Route path="/lending" element={<Index />} />
                    <Route path="/transfers" element={<Index />} />
                    <Route path="/bills-management" element={<BillsManagement />} />
                    
                    {/* Collaboration Routes */}
                    <Route path="/sharing" element={<Index />} />
                    <Route path="/ip-protection" element={<IPProtection />} />
                    
                    {/* Marketplace Module Routes */}
                    <Route path="/marketplace" element={<MarketplacePage />} />
                    <Route path="/family-office-directory" element={<FamilyOfficeDirectory />} />
                    <Route path="/data-import" element={<DataImportPage />} />
                    
                    {/* Document Management Routes */}
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/legacy-vault" element={<LegacyVault />} />
                    
                    {/* System Diagnostics Routes */}
                    <Route path="/system-diagnostics" element={<SystemDiagnostics />} />
                    
                    {/* Education Routes */}
                    <Route path="/education" element={<Education />} />
                    <Route path="/education/:categoryId" element={<Education />} />
                    
                    <Route path="/subscription" element={<Subscription />} />
                    <Route path="/advisor-profile" element={<AdvisorProfile />} />
                    <Route path="/tax-budgets" element={<Index />} />
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
