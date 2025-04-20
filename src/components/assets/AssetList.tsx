import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNetWorth } from "@/contexts/NetWorthContext";

export function AssetList() {
  const { assets } = useNetWorth();

  return (
    <div className="container mx-auto">
      <Table>
        <TableCaption>A list of your assets.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Asset Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">{asset.assetType}</TableCell>
              <TableCell>{asset.description}</TableCell>
              <TableCell>${asset.value.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
