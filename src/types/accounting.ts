// Accounting OS TypeScript Types
export type CurrencyCode = 'USD' | string;

export type CoaType = 'asset' | 'liability' | 'equity' | 'income' | 'expense';

export interface CoaAccount {
  id: string; 
  org_id: string;
  code: string; 
  name: string;
  type: CoaType; 
  subtype?: string | null;
  normal_balance: 'debit' | 'credit';
  parent_id?: string | null;
  is_active: boolean;
  currency: CurrencyCode;
  created_at: string;
}

export interface Journal {
  id: string; 
  org_id: string;
  txn_date: string; 
  reference?: string | null;
  source?: string | null;
  status: 'draft' | 'posted' | 'void';
  created_by?: string | null;
  created_at: string; 
  posted_at?: string | null;
}

export interface LedgerEntry {
  id: string; 
  org_id: string; 
  journal_id: string; 
  account_id: string;
  description?: string | null;
  debit: number; 
  credit: number;
  currency: CurrencyCode; 
  created_at: string;
}

export interface Partner {
  id: string; 
  org_id: string;
  kind: 'customer' | 'vendor' | 'both';
  name: string; 
  email?: string | null; 
  phone?: string | null; 
  tax_id?: string | null;
  is_active: boolean; 
  created_at: string;
}

export interface ARInvoice {
  id: string; 
  org_id: string; 
  partner_id: string;
  invoice_no: string; 
  invoice_date: string; 
  due_date?: string | null;
  currency: CurrencyCode; 
  subtotal: number; 
  tax_total: number; 
  total: number;
  status: 'open' | 'paid' | 'void';
  journal_id?: string | null; 
  created_at: string;
}

export interface APBill {
  id: string; 
  org_id: string; 
  partner_id: string;
  bill_no: string; 
  bill_date: string; 
  due_date?: string | null;
  currency: CurrencyCode; 
  subtotal: number; 
  tax_total: number; 
  total: number;
  status: 'open' | 'paid' | 'void';
  journal_id?: string | null; 
  created_at: string;
}

export interface Payment {
  id: string; 
  org_id: string; 
  kind: 'ar_receipt' | 'ap_disbursement';
  partner_id?: string | null; 
  payment_date: string; 
  amount: number;
  currency: CurrencyCode; 
  method?: string | null; 
  memo?: string | null;
  journal_id?: string | null; 
  created_at: string;
}

export interface TrialBalanceEntry {
  org_id: string;
  account_id: string;
  code: string;
  name: string;
  type: CoaType;
  debits: number;
  credits: number;
  balance: number;
}