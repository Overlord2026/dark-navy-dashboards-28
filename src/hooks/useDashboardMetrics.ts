
import { useState, useEffect } from 'react';
import { DashboardMetrics, DashboardMetric } from '@/types/dashboard';

const defaultMetrics: DashboardMetrics = {
  income: {
    value: null,
    previousValue: null,
    target: 12500,
    label: 'Income',
    type: 'income'
  },
  expenses: {
    value: null,
    previousValue: null,
    target: 8500,
    label: 'Expenses',
    type: 'expenses'
  },
  cashFlow: {
    value: null,
    previousValue: null,
    target: 3075,
    label: 'Cash Flow',
    type: 'cashflow'
  },
  savingsRate: {
    value: null,
    previousValue: null,
    target: 20,
    label: 'Savings Rate',
    type: 'savings'
  }
};

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(() => {
    const saved = localStorage.getItem('dashboard-metrics');
    return saved ? JSON.parse(saved) : defaultMetrics;
  });

  useEffect(() => {
    localStorage.setItem('dashboard-metrics', JSON.stringify(metrics));
  }, [metrics]);

  const updateMetric = (type: keyof DashboardMetrics, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        previousValue: prev[type].value,
        value: value
      }
    }));
  };

  const updateTarget = (type: keyof DashboardMetrics, target: number) => {
    setMetrics(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        target
      }
    }));
  };

  return { metrics, updateMetric, updateTarget };
}
