
export interface BankAccount {
  id: string;
  name: string;
  institution: string;
  accountType: 'Checking' | 'Savings' | 'Brokerage' | '401k' | 'IRA' | 'Other';
  accountNumber: string;
  balance: number;
}
