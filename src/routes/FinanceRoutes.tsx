
import React from "react";
import { Route, Routes } from "react-router-dom";
import BillInbox from "@/pages/BillInbox";
import BillPay from "@/pages/BillPay";
import BankingTransfers from "@/pages/BankingTransfers";
import BillPayStyleGuide from "@/pages/BillPayStyleGuide";
import NotFound from "@/pages/NotFound";

const FinanceRoutes = () => {
  return (
    <Routes>
      <Route path="bill-pay" element={<BillPay />} />
      <Route path="bill-inbox" element={<BillInbox />} />
      <Route path="banking-transfers" element={<BankingTransfers />} />
      <Route path="bill-pay/style-guide" element={<BillPayStyleGuide />} />
      {/* Add a catch-all route for unmatched paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default FinanceRoutes;
