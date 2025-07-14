import React from "react";
import Accounts from "@/pages/Accounts";

const WealthAccounts = () => {
  // Reuse existing Accounts component which already integrates with BankAccountsContext
  return <Accounts />;
};

export default WealthAccounts;