
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useLiabilityReport, LiabilityEntry } from "@/hooks/useLiabilityReport";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LiabilitiesReportPreviewProps {
  formatCurrency: (amount: number) => string;
}

export const LiabilitiesReportPreview: React.FC<LiabilitiesReportPreviewProps> = ({ formatCurrency }) => {
  const { 
    liabilities, 
    addLiability, 
    updateLiability, 
    deleteLiability, 
    getTotalLiabilities, 
    getAverageInterestRate 
  } = useLiabilityReport();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-red-500/10 rounded-md">
          <div className="text-sm text-red-700 dark:text-red-400">Total Liabilities</div>
          <div className="text-2xl font-bold">{formatCurrency(getTotalLiabilities())}</div>
        </div>
        <div className="p-4 bg-orange-500/10 rounded-md">
          <div className="text-sm text-orange-700 dark:text-orange-400">Average Interest Rate</div>
          <div className="text-2xl font-bold">
            {liabilities.length > 0 ? getAverageInterestRate().toFixed(2) : "0.00"}%
          </div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Liability</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liabilities.map((liability) => (
              <TableRow key={liability.id}>
                <TableCell>
                  <Input
                    value={liability.name}
                    onChange={(e) => updateLiability(liability.id, { name: e.target.value })}
                    placeholder="Enter liability name"
                    className="bg-transparent border-none hover:bg-background/50"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={liability.type}
                    onValueChange={(value: LiabilityEntry['type']) => 
                      updateLiability(liability.id, { type: value })
                    }
                  >
                    <SelectTrigger className="bg-transparent border-none hover:bg-background/50">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mortgage">Mortgage</SelectItem>
                      <SelectItem value="auto">Auto Loan</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="revolving">Credit Card</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={liability.interestRate}
                    onChange={(e) => updateLiability(liability.id, { 
                      interestRate: parseFloat(e.target.value) || 0 
                    })}
                    placeholder="Enter rate"
                    className="bg-transparent border-none hover:bg-background/50 w-20"
                  />
                  <span className="ml-1">%</span>
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    value={liability.balance || ''}
                    onChange={(e) => updateLiability(liability.id, { 
                      balance: parseFloat(e.target.value) || 0 
                    })}
                    placeholder="Enter balance"
                    className="bg-transparent border-none hover:bg-background/50 text-right"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteLiability(liability.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete liability</p>
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
          onClick={addLiability}
          variant="outline"
        >
          Add Liability
        </Button>
      </div>
    </div>
  );
};
