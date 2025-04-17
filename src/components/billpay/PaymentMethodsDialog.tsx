import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { PaymentMethod } from '@/types/payment';

// Export this constant so it can be imported in other files
export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-1',
    name: 'Primary Checking',
    type: 'bank_account',
    accountNumber: '****6789',
    routingNumber: '123456789',
    bankName: 'Chase Bank',
    isDefault: true
  },
  {
    id: 'pm-2',
    name: 'Personal Credit Card',
    type: 'credit_card',
    cardNumber: '****4321',
    expiryDate: '05/25',
    cardholderName: 'Thomas Brady',
    isDefault: false
  }
];

interface PaymentMethodsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethods: PaymentMethod[];
  onPaymentMethodsChange: (paymentMethods: PaymentMethod[]) => void;
}

export const PaymentMethodsDialog: React.FC<PaymentMethodsDialogProps> = ({
  open,
  onOpenChange,
  paymentMethods,
  onPaymentMethodsChange,
}) => {
  const [newPaymentMethod, setNewPaymentMethod] = useState<Omit<PaymentMethod, 'id'>>({
    name: '',
    type: 'bank_account',
    accountNumber: '',
    routingNumber: '',
    bankName: '',
    isDefault: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPaymentMethod(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPaymentMethod = () => {
    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      ...newPaymentMethod,
    };
    onPaymentMethodsChange([...paymentMethods, newMethod]);
    setNewPaymentMethod({
      name: '',
      type: 'bank_account',
      accountNumber: '',
      routingNumber: '',
      bankName: '',
      isDefault: false,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={newPaymentMethod.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <select
              id="type"
              name="type"
              value={newPaymentMethod.type}
              onChange={(e) => handleInputChange(e)}
              className="col-span-3 bg-background border rounded px-3 py-2"
            >
              <option value="bank_account">Bank Account</option>
              <option value="credit_card">Credit Card</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="accountNumber" className="text-right">
              Account Number
            </Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              value={newPaymentMethod.accountNumber}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="routingNumber" className="text-right">
              Routing Number
            </Label>
            <Input
              id="routingNumber"
              name="routingNumber"
              value={newPaymentMethod.routingNumber}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bankName" className="text-right">
              Bank Name
            </Label>
            <Input
              id="bankName"
              name="bankName"
              value={newPaymentMethod.bankName}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <Button type="submit" onClick={handleAddPaymentMethod}>Add Payment Method</Button>
      </DialogContent>
    </Dialog>
  );
};
