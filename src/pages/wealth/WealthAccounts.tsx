import React from "react";
import { Navigate } from "react-router-dom";
import Accounts from "@/pages/Accounts";

const WealthAccounts = () => {
  // Reuse existing Accounts component
  return <Accounts />;
};

export default WealthAccounts;