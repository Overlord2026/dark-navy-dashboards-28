
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank_account' | 'credit_card' | 'bank' | 'card' | 'wallet';
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cardholderName?: string;
  lastFour?: string;
  expiry?: string;
  isDefault: boolean;
}
