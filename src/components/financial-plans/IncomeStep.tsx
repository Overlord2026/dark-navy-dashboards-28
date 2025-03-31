
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: "yearly" | "monthly" | "weekly";
}

interface IncomeStepProps {
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const IncomeStep = ({ onNextStep, onPrevStep }: IncomeStepProps) => {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    { id: '1', name: 'Primary Job', amount: 85000, frequency: 'yearly' },
  ]);

  const addIncomeSource = () => {
    const newSource: IncomeSource = {
      id: `source-${Date.now()}`,
      name: '',
      amount: 0,
      frequency: 'yearly'
    };
    setIncomeSources([...incomeSources, newSource]);
  };

  const updateIncomeSource = (id: string, field: keyof IncomeSource, value: any) => {
    setIncomeSources(incomeSources.map(source => 
      source.id === id ? { ...source, [field]: value } : source
    ));
  };

  const removeIncomeSource = (id: string) => {
    setIncomeSources(incomeSources.filter(source => source.id !== id));
  };

  const calculateTotalYearlyIncome = () => {
    return incomeSources.reduce((total, source) => {
      let yearlyAmount = source.amount;
      if (source.frequency === 'monthly') yearlyAmount *= 12;
      if (source.frequency === 'weekly') yearlyAmount *= 52;
      return total + yearlyAmount;
    }, 0);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Income</h2>
      <p className="text-muted-foreground">
        Capture all the income you earn and expect to earn.
      </p>
      
      <div className="space-y-4 mt-6">
        {incomeSources.map((source, index) => (
          <div key={source.id} className="p-4 border rounded-md bg-card">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{source.name || `Income Source ${index + 1}`}</h3>
              <Button variant="ghost" size="icon" onClick={() => removeIncomeSource(source.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor={`name-${source.id}`}>Description</Label>
                <Input
                  id={`name-${source.id}`}
                  value={source.name}
                  onChange={(e) => updateIncomeSource(source.id, 'name', e.target.value)}
                  placeholder="e.g. Salary, BFO Dividends"
                />
              </div>
              
              <div>
                <Label htmlFor={`amount-${source.id}`}>Amount</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    id={`amount-${source.id}`}
                    type="number"
                    value={source.amount}
                    onChange={(e) => updateIncomeSource(source.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="pl-7"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`frequency-${source.id}`}>Frequency</Label>
                <Select
                  value={source.frequency}
                  onValueChange={(value) => updateIncomeSource(source.id, 'frequency', value)}
                >
                  <SelectTrigger id={`frequency-${source.id}`}>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        
        <Button variant="outline" className="w-full" onClick={addIncomeSource}>
          <Plus className="h-4 w-4 mr-2" />
          Add Income Source
        </Button>
        
        <div className="p-4 border rounded-md bg-card mt-6">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Total Yearly Income</h3>
            <p className="text-xl font-semibold">${calculateTotalYearlyIncome().toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevStep}>Previous</Button>
        <Button onClick={onNextStep}>Next</Button>
      </div>
    </div>
  );
};
