
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import { NetWorthProvider } from "@/context/NetWorthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { FinancialPlanProvider } from "@/context/FinancialPlanContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DiagnosticsProvider } from "@/context/DiagnosticsContext";
import { AdvisorProvider } from "@/context/AdvisorContext";
import { BankAccountsProvider } from "@/context/BankAccountsContext";
import { RetirementPlansProvider } from "@/context/RetirementPlansContext";
import { InvestmentAccountsProvider } from "@/context/InvestmentAccountsContext";
import { PrivateEquityAccountsProvider } from "@/context/PrivateEquityAccountsContext";
import { PublicStocksProvider } from "@/context/PublicStocksContext";
import { DigitalAssetsProvider } from "@/context/DigitalAssetsContext";
import { RealEstateProvider } from "@/context/RealEstateContext";
import { OtherAssetsProvider } from "@/context/OtherAssetsContext";
import { LiabilitiesProvider } from "@/context/LiabilitiesContext";
import { TransfersProvider } from "@/context/TransfersContext";

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
          <UserProvider>
            <SubscriptionProvider>
              <NetWorthProvider>
                <FinancialPlanProvider>
                  <BankAccountsProvider>
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
                                      <Toaster position="top-right" richColors closeButton />
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
                                  </BankAccountsProvider>
                </FinancialPlanProvider>
              </NetWorthProvider>
            </SubscriptionProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
