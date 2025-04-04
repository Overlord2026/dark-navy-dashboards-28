import React from "react";
import { Route } from "react-router-dom";

// Import pages
import Accounts from "../pages/Accounts";
import AllAssets from "../pages/AllAssets";
import Investments from "../pages/Investments";
import ViewAllOfferings from "../pages/ViewAllOfferings";
import AllModelPortfolios from "../pages/AllModelPortfolios";
import PortfolioModelDetail from "../pages/PortfolioModelDetail";
import AllAlternativeInvestments from "../pages/AllAlternativeInvestments";
import AlternativeAssetCategory from "../pages/AlternativeAssetCategory";
import PortfolioBuilder from "../pages/PortfolioBuilder";
import InvestmentBuilder from "../pages/InvestmentBuilder";
import InvestmentPerformance from "../pages/InvestmentPerformance";
import InvestmentRisk from "../pages/InvestmentRisk";
import Insurance from "../pages/Insurance";
import PersonalInsurance from "../pages/PersonalInsurance";
import Lending from "../pages/Lending";
import TaxPlanning from "../pages/TaxPlanning";
import TaxBudgets from "../pages/TaxBudgets";
import CashManagement from "../pages/CashManagement";
import Transfers from "../pages/Transfers";
import BankingTransfers from "../pages/BankingTransfers";
import FundingAccounts from "../pages/FundingAccounts";
import BillPay from "../pages/BillPay";
import Marketplace from "../pages/Marketplace";
import MarketplaceRfp from "../pages/MarketplaceRfp";
import MarketplaceRfpDetail from "../pages/MarketplaceRfpDetail";

const FinanceRoutes = () => {
  return (
    <>
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/all-assets" element={<AllAssets />} />
      <Route path="/investments" element={<Investments />} />
      <Route path="/investments/view-all-offerings" element={<ViewAllOfferings />} />
      <Route path="/investments/all-models" element={<AllModelPortfolios />} />
      <Route path="/investments/model/:modelId" element={<PortfolioModelDetail />} />
      <Route path="/investments/models/:modelId" element={<PortfolioModelDetail />} />
      <Route path="/investments/alternatives" element={<AllAlternativeInvestments />} />
      <Route path="/investments/alternative/:categoryId" element={<AlternativeAssetCategory />} />
      <Route path="/investments/alternative/:categoryId/view-all" element={<ViewAllOfferings />} />
      <Route path="/investments/portfolio-builder" element={<PortfolioBuilder />} />
      <Route path="/investments/investment-builder" element={<InvestmentBuilder />} />
      <Route path="/investments/performance" element={<InvestmentPerformance />} />
      <Route path="/investments/risk" element={<InvestmentRisk />} />
      <Route path="/insurance" element={<Insurance />} />
      <Route path="/personal-insurance" element={<PersonalInsurance />} />
      <Route path="/lending" element={<Lending />} />
      <Route path="/education/tax-planning" element={<TaxPlanning />} />
      <Route path="/tax-budgets" element={<TaxBudgets />} />
      <Route path="/cash-management" element={<CashManagement />} />
      <Route path="/transfers" element={<Transfers />} />
      <Route path="/banking-transfers" element={<BankingTransfers />} />
      <Route path="/funding-accounts" element={<FundingAccounts />} />
      <Route path="/billpay" element={<BillPay />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/marketplace/rfp" element={<MarketplaceRfp />} />
      <Route path="/marketplace/rfp/:rfpId" element={<MarketplaceRfpDetail />} />
    </>
  );
};

export default FinanceRoutes;
