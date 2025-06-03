
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types/property";
import { Building, ArrowUp, Home, DollarSign } from "lucide-react";

interface PropertySummaryProps {
  properties: Property[];
}

export const PropertySummary: React.FC<PropertySummaryProps> = ({ properties }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTotalValue = (): number => {
    return properties.reduce((total, property) => total + property.currentValue, 0);
  };

  const getOriginalCost = (): number => {
    return properties.reduce((total, property) => total + property.originalCost, 0);
  };

  const getTotalAppreciation = (): number => {
    const totalValue = getTotalValue();
    const originalCost = getOriginalCost();
    return originalCost > 0 ? ((totalValue - originalCost) / originalCost) * 100 : 0;
  };

  const getPropertyCount = (type: string): number => {
    return properties.filter(property => property.type === type).length;
  };

  const getMonthlyRentalIncome = (): number => {
    return properties
      .filter(property => property.type === 'rental' && property.rental)
      .reduce((total, property) => total + (property.rental?.monthlyIncome || 0), 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-card">
        <CardContent className="p-4 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Portfolio Value</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(getTotalValue())}</h3>
            </div>
            <div className="p-2 rounded-md bg-primary/10">
              <Building className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <ArrowUp className={`h-4 w-4 ${getTotalAppreciation() >= 0 ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
            <span className={getTotalAppreciation() >= 0 ? 'text-green-500' : 'text-red-500'}>
              {Math.abs(getTotalAppreciation()).toFixed(2)}%
            </span>
            <span className="text-muted-foreground ml-1">from original cost</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardContent className="p-4 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Properties</p>
              <h3 className="text-2xl font-bold mt-1">{properties.length}</h3>
            </div>
            <div className="p-2 rounded-md bg-blue-500/10">
              <Home className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Primary: </span>
              <span className="font-medium">{getPropertyCount('primary')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Vacation: </span>
              <span className="font-medium">{getPropertyCount('vacation')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Rental: </span>
              <span className="font-medium">{getPropertyCount('rental')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Business: </span>
              <span className="font-medium">{getPropertyCount('business')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardContent className="p-4 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Rental Income</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(getMonthlyRentalIncome())}</h3>
            </div>
            <div className="p-2 rounded-md bg-green-500/10">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">Annual:</span>
            <span className="font-medium">{formatCurrency(getMonthlyRentalIncome() * 12)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardContent className="p-4 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Appreciation</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(getTotalValue() - getOriginalCost())}</h3>
            </div>
            <div className="p-2 rounded-md bg-yellow-500/10">
              <ArrowUp className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">Original cost:</span>
            <span className="font-medium">{formatCurrency(getOriginalCost())}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
