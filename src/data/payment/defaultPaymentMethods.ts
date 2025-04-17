
import { PaymentMethod } from "@/components/billpay/PaymentMethodsDialog";

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "card-1", 
    name: "Personal Visa", 
    type: "card", 
    lastFour: "4242", 
    expiry: "12/25", 
    isDefault: true
  },
  {
    id: "bank-1", 
    name: "Chase Checking", 
    type: "bank", 
    lastFour: "7890", 
    isDefault: false
  }
];
