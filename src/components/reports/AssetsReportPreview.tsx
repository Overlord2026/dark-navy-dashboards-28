
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useAssetReport } from "@/hooks/useAssetReport";
import { AssetEntry } from "@/types/assetReport";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AssetsReportPreviewProps {
  formatCurrency: (amount: number) => string;
}

export const AssetsReportPreview: React.FC<AssetsReportPreviewProps> = ({ formatCurrency }) => {
  const { assets, addAsset, updateAsset, deleteAsset, getTotalValue } = useAssetReport();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-500/10 rounded-md">
          <div className="text-sm text-blue-700 dark:text-blue-400">Total Assets</div>
          <div className="text-2xl font-bold">{formatCurrency(getTotalValue())}</div>
        </div>
        <div className="p-4 bg-green-500/10 rounded-md">
          <div className="text-sm text-green-700 dark:text-green-400">Asset Count</div>
          <div className="text-2xl font-bold">{assets.length}</div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>
                  <Input
                    value={asset.name}
                    onChange={(e) => updateAsset(asset.id, { name: e.target.value })}
                    placeholder="Enter asset name"
                    className="bg-transparent border-none hover:bg-background/50"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={asset.type}
                    onValueChange={(value: AssetEntry['type']) => 
                      updateAsset(asset.id, { type: value })
                    }
                  >
                    <SelectTrigger className="bg-transparent border-none hover:bg-background/50">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="vehicle">Vehicle</SelectItem>
                      <SelectItem value="property">Property</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    value={asset.owner}
                    onChange={(e) => updateAsset(asset.id, { owner: e.target.value })}
                    placeholder="Enter owner"
                    className="bg-transparent border-none hover:bg-background/50"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    value={asset.value || ''}
                    onChange={(e) => updateAsset(asset.id, { value: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter value"
                    className="bg-transparent border-none hover:bg-background/50 text-right"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAsset(asset.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete asset</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={addAsset}
          variant="outline"
        >
          Add Asset
        </Button>
      </div>
    </div>
  );
};
