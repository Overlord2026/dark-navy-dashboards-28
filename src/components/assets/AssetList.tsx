
import React, { useState } from "react";
import { useNetWorth, Asset } from "@/context/NetWorthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2, 
  ExternalLink, 
  Home, 
  Car, 
  Sailboat, 
  Wallet, 
  Coins, 
  BarChart3, 
  Archive, 
  Palette, 
  Diamond, 
  Trophy, 
  Package 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { EditAssetDialog } from "./EditAssetDialog";
import { DeleteAssetDialog } from "./DeleteAssetDialog";

interface AssetListProps {
  filter: string;
}

export const AssetList: React.FC<AssetListProps> = ({ filter }) => {
  const { assets, getAssetsByCategory } = useNetWorth();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const getFilteredAssets = () => {
    if (filter === "all") {
      return assets;
    }
    return getAssetsByCategory(filter);
  };
  
  const getAssetIcon = (type: Asset['type']) => {
    switch (type) {
      case 'property':
        return <Home className="h-5 w-5 text-blue-400" />;
      case 'vehicle':
        return <Car className="h-5 w-5 text-green-400" />;
      case 'boat':
        return <Sailboat className="h-5 w-5 text-cyan-400" />;
      case 'cash':
        return <Wallet className="h-5 w-5 text-yellow-400" />;
      case 'digital':
        return <Coins className="h-5 w-5 text-purple-400" />;
      case 'investment':
        return <BarChart3 className="h-5 w-5 text-indigo-400" />;
      case 'retirement':
        return <Archive className="h-5 w-5 text-red-400" />;
      case 'art':
        return <Palette className="h-5 w-5 text-pink-400" />;
      case 'antique':
        return <Trophy className="h-5 w-5 text-amber-400" />;
      case 'jewelry':
        return <Diamond className="h-5 w-5 text-violet-400" />;
      case 'collectible':
        return <Package className="h-5 w-5 text-orange-400" />;
      default:
        return <Package className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getAssetTypeName = (type: Asset['type']) => {
    switch (type) {
      case 'property':
        return 'Real Estate';
      case 'vehicle':
        return 'Vehicle';
      case 'boat':
        return 'Boat';
      case 'cash':
        return 'Cash';
      case 'digital':
        return 'Digital Asset';
      case 'investment':
        return 'Investment';
      case 'retirement':
        return 'Retirement';
      case 'art':
        return 'Art';
      case 'antique':
        return 'Antique';
      case 'jewelry':
        return 'Jewelry';
      case 'collectible':
        return 'Collectible';
      default:
        return 'Other';
    }
  };
  
  const filteredAssets = getFilteredAssets();
  
  return (
    <div className="space-y-4">
      {filteredAssets.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No assets found in this category.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-4 border-b border-border">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {getAssetIcon(asset.type)}
                    <h3 className="text-lg font-medium ml-2">{asset.name}</h3>
                  </div>
                  <Badge variant="outline">{getAssetTypeName(asset.type)}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Value:</span>
                    <span className="font-semibold">{formatCurrency(asset.value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner:</span>
                    <span>{asset.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{new Date(asset.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  
                  {asset.details && (
                    <div className="border-t border-border pt-3 mt-3">
                      {asset.details.year && asset.details.make && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Year/Make:</span>
                          <span>{asset.details.year} {asset.details.make}</span>
                        </div>
                      )}
                      {asset.details.model && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Model:</span>
                          <span>{asset.details.model}</span>
                        </div>
                      )}
                      {asset.details.location && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span>{asset.details.location}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedAsset(asset);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedAsset(asset);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <EditAssetDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        asset={selectedAsset} 
      />
      
      <DeleteAssetDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
        asset={selectedAsset} 
      />
    </div>
  );
};
