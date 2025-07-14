import React from "react";
import { Navigate } from "react-router-dom";
import CashManagement from "@/pages/CashManagement";

const WealthCashManagement = () => {
  // Reuse existing CashManagement component
  return <CashManagement />;
};

export default WealthCashManagement;