
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Home, Building, MapPin, TrendingUp } from "lucide-react";
import { useSupabaseProperties } from "@/hooks/useSupabaseProperties";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const PropertySummaryCard = () => {
  const { properties, loading } = useSupabaseProperties();
  const navigate = useNavigate();

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

  const getTotalEquity = () => {
    return properties.reduce((total, property) => {
      const mortgageBalance = property.rental?.monthlyExpenses || 0;
      return total + property.currentValue;
    }, 0);
  };

  const getMonthlyIncome = () => {
    return properties
      .filter(p => p.rental?.monthlyIncome)
      .reduce((total, property) => total + (property.rental?.monthlyIncome || 0), 0);
  };

  const getPropertyIcon = (type: string) => {
    switch(type) {
      case 'primary':
      case 'vacation':
        return <Home className="h-5 w-5" />;
      case 'rental':
      case 'business':
        return <Building className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <DashboardCard title="Properties" className="animate-pulse">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </DashboardCard>
    );
  }

  if (properties.length === 0) {
    return (
      <DashboardCard title="Properties" icon={<Home className="h-5 w-5" />}>
        <div className="text-center py-4">
          <p className="text-gray-500 mb-4">No properties added yet</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/client-properties')}
          >
            Add Property
          </Button>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard 
      title="Properties" 
      icon={<Home className="h-5 w-5" />}
      footer={
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full"
          onClick={() => navigate('/client-properties')}
        >
          View All Properties
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="text-lg font-semibold">{formatCurrency(getTotalValue())}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Income</p>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(getMonthlyIncome())}
            </p>
          </div>
        </div>

        {/* Property Count by Type */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Portfolio ({properties.length} properties)</p>
          <div className="space-y-1">
            {['primary', 'vacation', 'rental', 'business'].map(type => {
              const count = properties.filter(p => p.type === type).length;
              if (count === 0) return null;
              
              return (
                <div key={type} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {getPropertyIcon(type)}
                    <span className="capitalize">{type}</span>
                  </div>
                  <span className="text-gray-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Properties */}
        {properties.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Recent</p>
            {properties.slice(0, 2).map(property => (
              <div key={property.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  {getPropertyIcon(property.type)}
                  <span className="font-medium">{property.name}</span>
                </div>
                <span className="text-gray-500">{formatCurrency(property.currentValue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
