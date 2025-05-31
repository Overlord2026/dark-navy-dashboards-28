
import React from "react";
import { useSupabaseAssets } from "@/hooks/useSupabaseAssets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { 
  Home, 
  Car, 
  Wallet, 
  BarChart3, 
  Archive, 
  Palette 
} from "lucide-react";

export const SupabaseAssetsSummary: React.FC = () => {
  const { assets, getTotalValue, getAssetsByType, loading } = useSupabaseAssets();

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Loading summary...</p>
        </CardContent>
      </Card>
    );
  }

  const totalValue = getTotalValue();
  const propertyValue = getAssetsByType('property').reduce((sum, asset) => sum + Number(asset.value), 0);
  const vehicleValue = getAssetsByType('vehicle').reduce((sum, asset) => sum + Number(asset.value), 0);
  const cashValue = getAssetsByType('cash').reduce((sum, asset) => sum + Number(asset.value), 0);
  const investmentValue = getAssetsByType('investment').reduce((sum, asset) => sum + Number(asset.value), 0);
  const retirementValue = getAssetsByType('retirement').reduce((sum, asset) => sum + Number(asset.value), 0);
  const artValue = getAssetsByType('art').reduce((sum, asset) => sum + Number(asset.value), 0);

  const summaryCards = [
    {
      title: "Total Assets",
      value: totalValue,
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Real Estate",
      value: propertyValue,
      icon: <Home className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Vehicles",
      value: vehicleValue,
      icon: <Car className="h-5 w-5" />,
      color: "text-orange-600"
    },
    {
      title: "Cash & Investments",
      value: cashValue + investmentValue,
      icon: <Wallet className="h-5 w-5" />,
      color: "text-purple-600"
    },
    {
      title: "Retirement",
      value: retirementValue,
      icon: <Archive className="h-5 w-5" />,
      color: "text-red-600"
    },
    {
      title: "Art & Collectibles",
      value: artValue,
      icon: <Palette className="h-5 w-5" />,
      color: "text-pink-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {summaryCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={card.color}>{card.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(card.value)}
            </div>
            <p className="text-xs text-muted-foreground">
              {assets.length} total assets
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
