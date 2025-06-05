
import React from "react";
import { useSupabaseProperties } from "@/hooks/useSupabaseProperties";
import { formatCurrency } from "@/lib/formatters";
import { Building, Home, DollarSign, TrendingUp } from "lucide-react";
import { Property } from "@/types/property";

export const PropertySection: React.FC = () => {
  const { properties, loading } = useSupabaseProperties();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Building className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Properties</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

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

  const getRecentProperties = (): Property[] => {
    return properties
      .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
      .slice(0, 3);
  };

  const totalValue = getTotalValue();
  const totalAppreciation = getTotalAppreciation();
  const monthlyRentalIncome = getMonthlyRentalIncome();
  const recentProperties = getRecentProperties();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Building className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Properties</h3>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-6">
          <Home className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No properties added yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add your first property to see it here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Property Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="font-semibold">{formatCurrency(totalValue)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Properties</p>
              <p className="font-semibold">{properties.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Monthly Income</p>
              <p className="font-semibold">{formatCurrency(monthlyRentalIncome)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Appreciation</p>
              <p className={`font-semibold flex items-center justify-center gap-1 ${totalAppreciation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="h-3 w-3" />
                {Math.abs(totalAppreciation).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Property Types Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Primary:</span>
              <span>{getPropertyCount('primary')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vacation:</span>
              <span>{getPropertyCount('vacation')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rental:</span>
              <span>{getPropertyCount('rental')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Business:</span>
              <span>{getPropertyCount('business')}</span>
            </div>
          </div>

          {/* Recent Properties */}
          {recentProperties.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent Properties</h4>
              <div className="space-y-2">
                {recentProperties.map((property) => (
                  <div key={property.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Home className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{property.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">({property.type})</span>
                    </div>
                    <span className="font-medium">{formatCurrency(property.currentValue)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monthly Income Summary */}
          {monthlyRentalIncome > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Monthly Rental Income</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">{formatCurrency(monthlyRentalIncome)}</p>
                <p className="text-xs text-muted-foreground">Annual: {formatCurrency(monthlyRentalIncome * 12)}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
