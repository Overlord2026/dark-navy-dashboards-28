
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Package } from "lucide-react";
import { useOtherAssets, OtherAsset } from "@/hooks/useOtherAssets";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const OtherAssetsList = () => {
  const { assets, loading, deleteAsset } = useOtherAssets();
  const isMobile = useIsMobile();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<OtherAsset | null>(null);

  const handleDeleteClick = (asset: OtherAsset) => {
    setAssetToDelete(asset);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (assetToDelete) {
      await deleteAsset(assetToDelete.id);
      setDeleteDialogOpen(false);
      setAssetToDelete(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getAssetTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'annuities': 'Annuities',
      'vehicle': 'Vehicle',
      'collectible': 'Collectible',
      'insurance_policy': 'Insurance Policy',
      'other': 'Other'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Loading other assets...</p>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No other assets added yet.</p>
        <p className="text-sm text-muted-foreground">Add your first asset to start tracking.</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <div className="space-y-4">
          {assets.map((asset) => (
            <Card key={asset.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{asset.name}</h4>
                  <Badge variant="outline" className="mt-1">
                    {getAssetTypeLabel(asset.type)}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-green-600">
                    {formatCurrency(asset.value)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner:</span>
                  <span>{asset.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{getAssetTypeLabel(asset.type)}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteClick(asset)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{assetToDelete?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete Asset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">
                  {asset.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getAssetTypeLabel(asset.type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {asset.owner}
                </TableCell>
                <TableCell className="text-right font-semibold text-green-600">
                  {formatCurrency(asset.value)}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteClick(asset)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{assetToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Asset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
