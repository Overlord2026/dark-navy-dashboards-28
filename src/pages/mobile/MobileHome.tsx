
import React from "react";
import { useNetWorth } from "@/context/NetWorthContext";

// Create a basic MobileHome component to fix the errors
const MobileHome = () => {
  const { assets, totalAssetValue, totalLiabilityValue } = useNetWorth();
  
  const netWorth = totalAssetValue - totalLiabilityValue;
  
  return (
    <div>
      <h1>Mobile Home Dashboard</h1>
      <div>
        <h2>Financial Overview</h2>
        <p>Assets: ${totalAssetValue.toLocaleString()}</p>
        <p>Liabilities: ${totalLiabilityValue.toLocaleString()}</p>
        <p>Net Worth: ${netWorth.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default MobileHome;
