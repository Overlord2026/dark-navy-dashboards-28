import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { TenantProvider } from "@/context/TenantContext";
import { UserProvider } from "@/context/UserContext";
import { NetWorthProvider } from "@/context/NetWorthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { FinancialPlanProvider } from "@/context/FinancialPlanContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DiagnosticsProvider } from "@/context/DiagnosticsContext";
import { AdvisorProvider } from "@/context/AdvisorContext";
import { BankAccountsProvider } from "@/context/BankAccountsContext";
import { CreditCardsProvider } from "@/context/CreditCardsContext";
import { RetirementPlansProvider } from "@/context/RetirementPlansContext";
import { InvestmentAccountsProvider } from "@/context/InvestmentAccountsContext";
import { PrivateEquityAccountsProvider } from "@/context/PrivateEquityAccountsContext";
import { PublicStocksProvider } from "@/context/PublicStocksContext";
import { DigitalAssetsProvider } from "@/context/DigitalAssetsContext";
import { RealEstateProvider } from "@/context/RealEstateContext";
import { OtherAssetsProvider } from "@/context/OtherAssetsContext";
import { LiabilitiesProvider } from "@/context/LiabilitiesContext";
import { TransfersProvider } from "@/context/TransfersContext";
import { TenantBrandingWrapper } from "@/components/tenant/TenantBrandingWrapper";
import { useRoleUpdate } from '@/hooks/useRoleUpdate';

// Create a Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TenantProvider>
            <TenantBrandingWrapper>
              <UserProvider>
                <AppContent />
                <Toaster position="top-right" richColors closeButton />
              </UserProvider>
            </TenantBrandingWrapper>
          </TenantProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  // Use the role update hook
  useRoleUpdate();
  
  return (
    <SubscriptionProvider>
      <NetWorthProvider>
        <FinancialPlanProvider>
          <BankAccountsProvider>
            <CreditCardsProvider>
              <TransfersProvider>
              <RetirementPlansProvider>
                <InvestmentAccountsProvider>
                  <PrivateEquityAccountsProvider>
                    <PublicStocksProvider>
                      <DigitalAssetsProvider>
                        <RealEstateProvider>
                          <OtherAssetsProvider>
                            <LiabilitiesProvider>
                              <DiagnosticsProvider>
                                <AdvisorProvider>
                                  <RouterProvider router={routes} />
                                </AdvisorProvider>
                              </DiagnosticsProvider>
                            </LiabilitiesProvider>
                          </OtherAssetsProvider>
                        </RealEstateProvider>
                      </DigitalAssetsProvider>
                    </PublicStocksProvider>
                  </PrivateEquityAccountsProvider>
                </InvestmentAccountsProvider>
              </RetirementPlansProvider>
              </TransfersProvider>
            </CreditCardsProvider>
          </BankAccountsProvider>
        </FinancialPlanProvider>
      </NetWorthProvider>
    </SubscriptionProvider>
  );
}

export default App;
