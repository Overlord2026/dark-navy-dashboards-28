
import React from "react";
import { Property } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import { 
  Home,
  Building, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  Umbrella,
  Briefcase
} from "lucide-react";

interface PropertySummaryProps {
  properties: Property[];
}

export const PropertySummary: React.FC<PropertySummaryProps> = ({ properties }) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  if (properties.length === 0) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getTotalValue = () => {
    return properties.reduce((total, property) => total + property.currentValue, 0);
  };
  
  const getTotalInvestment = () => {
    return properties.reduce((total, property) => {
      const improvements = property.improvements.reduce((sum, imp) => sum + imp.cost, 0);
      return total + property.originalCost + improvements;
    }, 0);
  };
  
  const getTotalAppreciation = () => {
    return getTotalValue() - getTotalInvestment();
  };
  
  const getAppreciationPercentage = () => {
    const investment = getTotalInvestment();
    if (investment === 0) return 0;
    return (getTotalAppreciation() / investment) * 100;
  };
  
  const getMonthlyRentalIncome = () => {
    return properties
      .filter(property => property.type === "rental" && property.rental)
      .reduce((total, property) => total + (property.rental?.monthlyIncome || 0), 0);
  };
  
  const getMonthlyRentalExpenses = () => {
    return properties
      .filter(property => property.type === "rental" && property.rental)
      .reduce((total, property) => total + (property.rental?.monthlyExpenses || 0), 0);
  };
  
  const getNetRentalIncome = () => {
    return getMonthlyRentalIncome() - getMonthlyRentalExpenses();
  };
  
  const countPropertiesByType = (type: Property["type"]) => {
    return properties.filter(property => property.type === type).length;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800 shadow-inner shadow-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">Portfolio Value</p>
                <p className="text-2xl font-bold">{formatCurrency(getTotalValue())}</p>
                <div className="flex items-center mt-1 text-xs text-green-500">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>{formatCurrency(getTotalAppreciation())}</span>
                  <span className="ml-1">({getAppreciationPercentage().toFixed(1)}%)</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800 shadow-inner shadow-purple-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300">Monthly Rental Income</p>
                <p className="text-2xl font-bold">{formatCurrency(getNetRentalIncome())}</p>
                <div className="flex items-center mt-1 text-xs">
                  <span className="text-gray-400">
                    Income: {formatCurrency(getMonthlyRentalIncome())}
                  </span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800 shadow-inner shadow-teal-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-300">Properties</p>
                <p className="text-2xl font-bold">{properties.length}</p>
                <div className="flex items-center mt-1 text-xs text-gray-400 space-x-2">
                  <div className="flex items-center">
                    <Home className="h-3 w-3 mr-1 text-blue-400" />
                    <span>{countPropertiesByType("primary")}</span>
                  </div>
                  <div className="flex items-center">
                    <Umbrella className="h-3 w-3 mr-1 text-teal-400" />
                    <span>{countPropertiesByType("vacation")}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-3 w-3 mr-1 text-purple-400" />
                    <span>{countPropertiesByType("rental")}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-3 w-3 mr-1 text-amber-400" />
                    <span>{countPropertiesByType("business")}</span>
                  </div>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-teal-900/30 flex items-center justify-center text-teal-400">
                <Building className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800 shadow-inner shadow-amber-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-300">Total Investment</p>
                <p className="text-2xl font-bold">{formatCurrency(getTotalInvestment())}</p>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <span>
                    Across {properties.length} properties
                  </span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
