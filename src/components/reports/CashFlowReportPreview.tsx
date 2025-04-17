
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, PlusCircle } from "lucide-react";
import { useCashFlowReport, CashFlowEntry } from "@/hooks/useCashFlowReport";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CashFlowReportPreviewProps {
  formatCurrency: (amount: number) => string;
}

export const CashFlowReportPreview: React.FC<CashFlowReportPreviewProps> = ({ formatCurrency }) => {
  const { 
    entries, 
    timeframe, 
    setTimeframe, 
    addEntry, 
    updateEntry, 
    deleteEntry, 
    getTotalIncome, 
    getTotalExpenses, 
    getNetCashFlow 
  } = useCashFlowReport();
  
  const incomeEntries = entries.filter(entry => entry.type === 'income');
  const expenseEntries = entries.filter(entry => entry.type === 'expense');
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Report Timeframe</h3>
        <Select 
          value={timeframe.type} 
          onValueChange={(value) => {
            const multiplier = 
              value === 'monthly' ? 1 : 
              value === 'quarterly' ? 3 : 
              value === 'annual' ? 12 : 
              value === 'ytd' ? 4 : 1;
              
            setTimeframe({ type: value as any, multiplier });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-500/10 rounded-md">
          <div className="text-sm text-green-700 dark:text-green-400">Total Income</div>
          <div className="text-2xl font-bold">{formatCurrency(getTotalIncome() * timeframe.multiplier)}</div>
        </div>
        <div className="p-4 bg-red-500/10 rounded-md">
          <div className="text-sm text-red-700 dark:text-red-400">Total Expenses</div>
          <div className="text-2xl font-bold">{formatCurrency(getTotalExpenses() * timeframe.multiplier)}</div>
        </div>
        <div className="p-4 bg-blue-500/10 rounded-md">
          <div className="text-sm text-blue-700 dark:text-blue-400">Net Cash Flow</div>
          <div className="text-2xl font-bold">{formatCurrency(getNetCashFlow() * timeframe.multiplier)}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-md font-medium">Income Sources</h4>
            <Button 
              onClick={() => addEntry('income')} 
              size="sm" 
              variant="ghost"
              className="h-8 flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" /> Add
            </Button>
          </div>
          
          <div className="space-y-3">
            {incomeEntries.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground">
                No income sources added. Click 'Add' to create one.
              </div>
            ) : (
              incomeEntries.map((entry) => (
                <div key={entry.id} className="border rounded-md p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        value={entry.name}
                        onChange={(e) => updateEntry(entry.id, { name: e.target.value })}
                        placeholder="Income source name"
                        className="bg-transparent border-none hover:bg-background/50 text-sm font-medium"
                      />
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        value={entry.amount || ''}
                        onChange={(e) => updateEntry(entry.id, { 
                          amount: parseFloat(e.target.value) || 0 
                        })}
                        placeholder="Amount"
                        className="bg-transparent border-none hover:bg-background/50 text-right"
                      />
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteEntry(entry.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete entry</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-md font-medium">Expense Categories</h4>
            <Button 
              onClick={() => addEntry('expense')} 
              size="sm" 
              variant="ghost"
              className="h-8 flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" /> Add
            </Button>
          </div>
          
          <div className="space-y-3">
            {expenseEntries.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground">
                No expenses added. Click 'Add' to create one.
              </div>
            ) : (
              expenseEntries.map((entry) => (
                <div key={entry.id} className="border rounded-md p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        value={entry.name}
                        onChange={(e) => updateEntry(entry.id, { name: e.target.value })}
                        placeholder="Expense category name"
                        className="bg-transparent border-none hover:bg-background/50 text-sm font-medium"
                      />
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        value={entry.amount || ''}
                        onChange={(e) => updateEntry(entry.id, { 
                          amount: parseFloat(e.target.value) || 0 
                        })}
                        placeholder="Amount"
                        className="bg-transparent border-none hover:bg-background/50 text-right"
                      />
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteEntry(entry.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete entry</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
