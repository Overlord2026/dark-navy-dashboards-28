
import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ModelPortfolioDialog from "./ModelPortfolioDialog";

// Sample portfolio data
const samplePortfolios = [
  {
    id: "1",
    name: "Core Growth 60/40",
    type: "Strategic",
    taxStatus: "Tax-Aware",
    assignedAccounts: 2,
    tradingGroups: 1
  },
  {
    id: "2",
    name: "Income Focus 40/60",
    type: "Income",
    taxStatus: "Tax-Exempt",
    assignedAccounts: 3,
    tradingGroups: 2
  },
  {
    id: "3",
    name: "Aggressive Growth 80/20",
    type: "Strategic",
    taxStatus: "Taxable",
    assignedAccounts: 1,
    tradingGroups: 1
  }
];

const ModelPortfoliosTab: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Your Model Portfolios</h3>
        <Button onClick={openDialog} className="bg-primary hover:bg-primary/90">
          Pick a Model Portfolio
        </Button>
      </div>
      
      <Table className="border border-gray-800 rounded-md overflow-hidden">
        <TableHeader className="bg-[#1a283e]">
          <TableRow>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Type</TableHead>
            <TableHead className="text-white">Tax Status</TableHead>
            <TableHead className="text-white">Assigned to Accounts</TableHead>
            <TableHead className="text-white">Trading Groups Applied</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {samplePortfolios.map((portfolio) => (
            <TableRow key={portfolio.id} className="hover:bg-[#1a283e]/50 cursor-pointer border-t border-gray-800">
              <TableCell className="font-medium text-white">{portfolio.name}</TableCell>
              <TableCell className="text-gray-300">{portfolio.type}</TableCell>
              <TableCell className="text-gray-300">{portfolio.taxStatus}</TableCell>
              <TableCell className="text-gray-300">{portfolio.assignedAccounts}</TableCell>
              <TableCell className="text-gray-300">{portfolio.tradingGroups}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <ModelPortfolioDialog isOpen={isDialogOpen} onClose={closeDialog} />
    </div>
  );
};

export default ModelPortfoliosTab;
