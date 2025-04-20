import React, { createContext, useContext, useState } from 'react';

interface NetWorthContextType {
  totalAssetValue: number;
  totalLiabilityValue: number;
  netWorth: number;
  assets: { id: string; name: string; value: number }[];
  liabilities: { id: string; name: string; value: number }[];
  addAsset: (name: string, value: number) => void;
  addLiability: (name: string, value: number) => void;
  updateAsset: (id: string, value: number) => void;
  updateLiability: (id: string, value: number) => void;
  deleteAsset: (id: string) => void;
  deleteLiability: (id: string) => void;
}

const NetWorthContext = createContext<NetWorthContextType | undefined>(undefined);

export const NetWorthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<{ id: string; name: string; value: number }[]>([
    { id: 'asset-1', name: 'Checking Account', value: 50000 },
    { id: 'asset-2', name: 'Savings Account', value: 150000 },
    { id: 'asset-3', name: 'Investment Account', value: 500000 },
    { id: 'asset-4', name: 'Retirement Account', value: 750000 },
    { id: 'asset-5', name: 'Real Estate', value: 1200000 },
  ]);
  const [liabilities, setLiabilities] = useState<{ id: string; name: string; value: number }[]>([
    { id: 'liability-1', name: 'Mortgage', value: 800000 },
    { id: 'liability-2', name: 'Car Loan', value: 30000 },
    { id: 'liability-3', name: 'Credit Card Debt', value: 5000 },
    { id: 'liability-4', name: 'Student Loans', value: 20000 },
  ]);

  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilityValue = liabilities.reduce((sum, liability) => sum + liability.value, 0);
  const netWorth = totalAssetValue - totalLiabilityValue;

  const addAsset = (name: string, value: number) => {
    const newAsset = { id: `asset-${Date.now()}`, name, value };
    setAssets([...assets, newAsset]);
  };

  const addLiability = (name: string, value: number) => {
    const newLiability = { id: `liability-${Date.now()}`, name, value };
    setLiabilities([...liabilities, newLiability]);
  };

  const updateAsset = (id: string, value: number) => {
    setAssets(assets.map(asset => asset.id === id ? { ...asset, value } : asset));
  };

  const updateLiability = (id: string, value: number) => {
    setLiabilities(liabilities.map(liability => liability.id === id ? { ...liability, value } : liability));
  };

  const deleteAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

  const deleteLiability = (id: string) => {
    setLiabilities(liabilities.filter(liability => liability.id !== id));
  };

  return (
    <NetWorthContext.Provider value={{
      totalAssetValue,
      totalLiabilityValue,
      netWorth,
      assets,
      liabilities,
      addAsset,
      addLiability,
      updateAsset,
      updateLiability,
      deleteAsset,
      deleteLiability
    }}>
      {children}
    </NetWorthContext.Provider>
  );
};

export const useNetWorth = (): NetWorthContextType => {
  const context = useContext(NetWorthContext);
  if (context === undefined) {
    throw new Error('useNetWorth must be used within a NetWorthProvider');
  }
  return context;
};
