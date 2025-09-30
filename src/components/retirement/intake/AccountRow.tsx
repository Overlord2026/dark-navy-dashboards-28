import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import type { InvestmentAccount } from '@/types/retirement';

interface AccountRowProps {
  account: InvestmentAccount;
  onChange: (account: InvestmentAccount) => void;
  onRemove: () => void;
  showRemove: boolean;
}

export function AccountRow({ account, onChange, onRemove, showRemove }: AccountRowProps) {
  const handleChange = (field: keyof InvestmentAccount, value: any) => {
    onChange({ ...account, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-card">
      <div>
        <Label className="text-xs">Account Type</Label>
        <Select
          value={account.type}
          onValueChange={(value) => {
            const taxStatus = 
              value === 'roth_ira' || value === 'hsa' ? 'tax_free' :
              value === 'brokerage' ? 'after_tax' : 'pre_tax';
            onChange({ 
              ...account, 
              type: value as InvestmentAccount['type'],
              taxStatus
            });
          }}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="401k">401(k)</SelectItem>
            <SelectItem value="traditional_ira">Traditional IRA</SelectItem>
            <SelectItem value="roth_ira">Roth IRA</SelectItem>
            <SelectItem value="brokerage">Brokerage</SelectItem>
            <SelectItem value="403b">403(b)</SelectItem>
            <SelectItem value="457b">457(b)</SelectItem>
            <SelectItem value="hsa">HSA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs">Balance ($)</Label>
        <Input
          type="number"
          value={account.balance}
          onChange={(e) => handleChange('balance', parseFloat(e.target.value) || 0)}
          className="h-9"
        />
      </div>

      <div>
        <Label className="text-xs">Annual Contribution ($)</Label>
        <Input
          type="number"
          value={account.annualContribution}
          onChange={(e) => handleChange('annualContribution', parseFloat(e.target.value) || 0)}
          className="h-9"
        />
      </div>

      <div>
        <Label className="text-xs">Expected Return (%)</Label>
        <Input
          type="number"
          step="0.1"
          value={account.expectedReturn * 100}
          onChange={(e) => handleChange('expectedReturn', (parseFloat(e.target.value) || 0) / 100)}
          className="h-9"
        />
      </div>

      <div className="flex items-end">
        {showRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-9 w-full"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
