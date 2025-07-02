
import React from "react";
import { useDigitalAssets } from "@/hooks/useDigitalAssets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Coins } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function DigitalAssetsTable() {
  const { digitalAssets, loading } = useDigitalAssets();
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Loading digital assets...</p>
      </div>
    );
  }

  if (digitalAssets.length === 0) {
    return (
      <div className="text-center py-8">
        <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No digital assets added yet.</p>
        <p className="text-sm text-muted-foreground">Add your first digital asset to start tracking.</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatQuantity = (quantity: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8
    }).format(quantity);
  };

  const getAssetDisplayName = (asset: any) => {
    return asset.asset_type === 'Other' ? asset.custom_asset_type : asset.asset_type;
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {digitalAssets.map((asset) => (
          <Card key={asset.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-lg">{getAssetDisplayName(asset)}</h4>
                <Badge variant="outline" className="mt-1">
                  {asset.asset_type === 'Other' ? 'Custom' : 'Crypto'}
                </Badge>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-green-600">
                  {formatCurrency(asset.total_value)}
                </p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity:</span>
                <span>{formatQuantity(asset.quantity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price per Unit:</span>
                <span>{formatCurrency(asset.price_per_unit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Added:</span>
                <span>{new Date(asset.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Price per Unit</TableHead>
            <TableHead className="text-right">Total Value</TableHead>
            <TableHead className="text-right">Date Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {digitalAssets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">
                {getAssetDisplayName(asset)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {asset.asset_type === 'Other' ? 'Custom' : 'Crypto'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {formatQuantity(asset.quantity)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(asset.price_per_unit)}
              </TableCell>
              <TableCell className="text-right font-semibold text-green-600">
                {formatCurrency(asset.total_value)}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {new Date(asset.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
