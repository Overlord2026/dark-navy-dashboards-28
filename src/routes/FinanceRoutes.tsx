
import React from "react";
import { Route, Routes } from "react-router-dom";
import BillInbox from "@/pages/BillInbox";
import BillPay from "@/pages/BillPay";
import BankingTransfers from "@/pages/BankingTransfers";

const FinanceRoutes = () => {
  return (
    <Routes>
      <Route path="bill-pay" element={<BillPay />} />
      <Route path="bill-inbox" element={<BillInbox />} />
      <Route path="banking-transfers" element={<BankingTransfers />} />
    </Routes>
  );
};

export default FinanceRoutes;
