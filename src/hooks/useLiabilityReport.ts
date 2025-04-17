
import { useState, useEffect } from 'react';

export interface LiabilityEntry {
  id: string;
  name: string;
  type: 'mortgage' | 'auto' | 'education' | 'revolving' | 'other';
  balance: number;
  owner: string;
  interestRate: number;
  dueDate?: string;
}

export function useLiabilityReport() {
  const [liabilities, setLiabilities] = useState<LiabilityEntry[]>(() => {
    const saved = localStorage.getItem('liability-report-data');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('liability-report-data', JSON.stringify(liabilities));
  }, [liabilities]);

  const addLiability = () => {
    const newLiability: LiabilityEntry = {
      id: `liability-${Date.now()}`,
      name: '',
      type: 'other',
      balance: 0,
      owner: '',
      interestRate: 0
    };
    setLiabilities([...liabilities, newLiability]);
  };

  const updateLiability = (id: string, updates: Partial<LiabilityEntry>) => {
    setLiabilities(prevLiabilities =>
      prevLiabilities.map(liability =>
        liability.id === id ? { ...liability, ...updates } : liability
      )
    );
  };

  const deleteLiability = (id: string) => {
    setLiabilities(prevLiabilities => prevLiabilities.filter(liability => liability.id !== id));
  };

  const getTotalLiabilities = () => {
    return liabilities.reduce((sum, liability) => sum + (liability.balance || 0), 0);
  };

  const getAverageInterestRate = () => {
    if (liabilities.length === 0) return 0;
    const total = liabilities.reduce((sum, liability) => sum + (liability.interestRate || 0), 0);
    return total / liabilities.length;
  };

  return {
    liabilities,
    addLiability,
    updateLiability,
    deleteLiability,
    getTotalLiabilities,
    getAverageInterestRate
  };
}
