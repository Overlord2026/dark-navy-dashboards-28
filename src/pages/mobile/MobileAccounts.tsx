
import React from "react";
import { AccountType } from "@/types/assets";
import { useNetWorth } from "@/context/NetWorthContext";

// Create a basic MobileAccounts component to fix the errors
const MobileAccounts = () => {
  const { accounts } = useNetWorth();
  
  const renderAccounts = () => {
    return (
      <div>
        {accounts.map(account => {
          // Fix the type comparison errors
          const isManual = account.type === "manual";
          const isLoan = account.type === "loan";
          
          return (
            <div key={account.id}>
              <h3>{account.name}</h3>
              <p>Type: {account.type}</p>
              <p>Value: ${account.value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div>
      <h1>Mobile Accounts</h1>
      {renderAccounts()}
    </div>
  );
};

export default MobileAccounts;
