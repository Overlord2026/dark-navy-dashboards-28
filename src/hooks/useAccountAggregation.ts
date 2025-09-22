import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AggregatedAccount {
  id: string;
  name: string;
  type: 'bank' | 'investment' | 'hsa' | 'retirement';
  balance: number;
  lastUpdate: string;
  institution?: string;
  accountNumber?: string;
  performance?: {
    oneDay: number;
    oneWeek: number;
    oneMonth: number;
    ytd: number;
  };
  rmdRequired?: boolean;
  rmdAmount?: number;
  rmdDeadline?: string;
}

export interface AccountAggregationSummary {
  totalBalance: number;
  totalInvestments: number;
  totalCash: number;
  totalHSA: number;
  totalRetirement: number;
  performanceToday: number;
  performanceYTD: number;
  upcomingRMDs: Array<{
    accountId: string;
    accountName: string;
    amount: number;
    deadline: string;
    clientId?: string;
    clientName?: string;
  }>;
  rebalanceAlerts: Array<{
    accountId: string;
    accountName: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export const useAccountAggregation = (clientId?: string) => {
  const [accounts, setAccounts] = useState<AggregatedAccount[]>([]);
  const [summary, setSummary] = useState<AccountAggregationSummary>({
    totalBalance: 0,
    totalInvestments: 0,
    totalCash: 0,
    totalHSA: 0,
    totalRetirement: 0,
    performanceToday: 0,
    performanceYTD: 0,
    upcomingRMDs: [],
    rebalanceAlerts: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAccountData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const userId = clientId || user.id;

      // Fetch all account types in parallel
      const [bankData, investmentData, hsaData] = await Promise.all([
        supabase.from('bank_accounts').select('*').eq('user_id', userId),
        supabase.from('investment_accounts').select('*').eq('user_id', userId),
        supabase.from('hsa_accounts').select('*').eq('user_id', userId)
      ]);

      const aggregatedAccounts: AggregatedAccount[] = [];
      let totalBalance = 0;
      let totalInvestments = 0;
      let totalCash = 0;
      let totalHSA = 0;
      let totalRetirement = 0;
      const upcomingRMDs: AccountAggregationSummary['upcomingRMDs'] = [];
      const rebalanceAlerts: AccountAggregationSummary['rebalanceAlerts'] = [];

      // Process bank accounts
      if (bankData.data) {
        for (const account of bankData.data) {
          const aggregatedAccount: AggregatedAccount = {
            id: account.id,
            name: account.name,
            type: 'bank',
            balance: account.balance || 0,
            lastUpdate: account.updated_at,
            institution: account.institution_name,
            accountNumber: account.account_number_last4
          };
          
          aggregatedAccounts.push(aggregatedAccount);
          totalBalance += account.balance || 0;
          totalCash += account.balance || 0;
        }
      }

      // Process investment accounts
      if (investmentData.data) {
        for (const account of investmentData.data) {
          const isRetirement = account.account_type?.toLowerCase().includes('ira') || 
                              account.account_type?.toLowerCase().includes('401k') ||
                              account.account_type?.toLowerCase().includes('retirement');
          
          // Mock performance data
          const performance = {
            oneDay: (Math.random() - 0.5) * 2, // -1% to +1%
            oneWeek: (Math.random() - 0.5) * 5, // -2.5% to +2.5%
            oneMonth: (Math.random() - 0.5) * 8, // -4% to +4%
            ytd: (Math.random() - 0.3) * 20 // -6% to +14%
          };

          // Check for RMD requirements (mock logic)
          const rmdRequired = isRetirement && Math.random() > 0.8; // 20% chance
          const rmdAmount = rmdRequired ? (account.balance || 0) * 0.04 : undefined;
          const rmdDeadline = rmdRequired ? '2025-12-31' : undefined;

          if (rmdRequired && rmdAmount) {
            upcomingRMDs.push({
              accountId: account.id,
              accountName: account.account_name,
              amount: rmdAmount,
              deadline: rmdDeadline!,
              clientId: userId !== user.id ? userId : undefined,
              clientName: userId !== user.id ? 'Client Name' : undefined // In real app, fetch client name
            });
          }

          // Check for rebalancing needs (mock logic)
          if (Math.random() > 0.7) { // 30% chance
            rebalanceAlerts.push({
              accountId: account.id,
              accountName: account.account_name,
              message: 'Portfolio drift detected - consider rebalancing',
              severity: Math.random() > 0.5 ? 'medium' : 'low'
            });
          }

          const aggregatedAccount: AggregatedAccount = {
            id: account.id,
            name: account.name,
            type: isRetirement ? 'retirement' : 'investment',
            balance: account.balance || 0,
            lastUpdate: account.updated_at,
            institution: account.custodian,
            accountNumber: account.account_number,
            performance,
            rmdRequired,
            rmdAmount,
            rmdDeadline
          };
          
          aggregatedAccounts.push(aggregatedAccount);
          totalBalance += account.balance || 0;
          totalInvestments += account.balance || 0;
          
          if (isRetirement) {
            totalRetirement += account.balance || 0;
          }
        }
      }

      // Process HSA accounts
      if (hsaData.data) {
        for (const account of hsaData.data) {
          const aggregatedAccount: AggregatedAccount = {
            id: account.id,
            name: account.account_name || 'HSA Account',
            type: 'hsa',
            balance: account.cash_balance || 0,
            lastUpdate: account.updated_at,
            institution: account.provider,
            accountNumber: account.account_number
          };
          
          aggregatedAccounts.push(aggregatedAccount);
          totalBalance += account.balance || 0;
          totalHSA += account.balance || 0;
        }
      }

      // Calculate overall performance (mock)
      const performanceToday = totalInvestments > 0 ? (Math.random() - 0.5) * 2 : 0;
      const performanceYTD = totalInvestments > 0 ? (Math.random() - 0.3) * 20 : 0;

      setAccounts(aggregatedAccounts);
      setSummary({
        totalBalance,
        totalInvestments,
        totalCash,
        totalHSA,
        totalRetirement,
        performanceToday,
        performanceYTD,
        upcomingRMDs,
        rebalanceAlerts
      });

    } catch (error) {
      console.error('Error fetching account data:', error);
      toast({
        title: "Error loading account data",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [clientId, toast]);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  return {
    accounts,
    summary,
    loading,
    refreshAccounts: fetchAccountData
  };
};