
import React from "react";
import { useCustomReport } from "@/hooks/useCustomReport";
import { useNetWorthReport } from "@/hooks/useNetWorthReport";
import { useCashFlowReport } from "@/hooks/useCashFlowReport";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle, ListFilter } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface CustomReportPreviewProps {
  formatCurrency: (amount: number) => string;
}

export const CustomReportPreview: React.FC<CustomReportPreviewProps> = ({ formatCurrency }) => {
  const { 
    fields, 
    customFields, 
    toggleField, 
    addCustomField, 
    updateCustomField, 
    deleteCustomField 
  } = useCustomReport();
  
  const { getTotalAssets, getTotalLiabilities, getNetWorth } = useNetWorthReport();
  const { getTotalIncome, getTotalExpenses, getNetCashFlow } = useCashFlowReport();
  
  const getValueForField = (id: string): string => {
    switch(id) {
      case 'assets':
        return formatCurrency(getTotalAssets());
      case 'liabilities':
        return formatCurrency(getTotalLiabilities());
      case 'networth':
        return formatCurrency(getNetWorth());
      case 'income':
        return formatCurrency(getTotalIncome());
      case 'expenses':
        return formatCurrency(getTotalExpenses());
      case 'cashflow':
        return formatCurrency(getNetCashFlow());
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Select Metrics to Include</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`field-${field.id}`} 
                checked={field.enabled}
                onCheckedChange={() => toggleField(field.id)}
              />
              <label 
                htmlFor={`field-${field.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {field.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {fields.some(field => field.enabled) && (
        <div>
          <h3 className="text-lg font-medium mb-3">Report Preview</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.filter(field => field.enabled).map((field) => (
                <TableRow key={field.id}>
                  <TableCell>{field.name}</TableCell>
                  <TableCell className="text-right font-mono">{getValueForField(field.id)}</TableCell>
                </TableRow>
              ))}
              
              {customFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <Input
                      value={field.name}
                      onChange={(e) => updateCustomField(field.id, { name: e.target.value })}
                      placeholder="Custom field name"
                      className="bg-transparent border-none hover:bg-background/50"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Input
                        value={field.value || ''}
                        onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
                        placeholder="Custom value"
                        className="bg-transparent border-none hover:bg-background/50 text-right max-w-[140px]"
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteCustomField(field.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete field</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-medium mb-3">Custom Fields</h3>
        <div className="space-y-3">
          {customFields.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground border border-dashed rounded-md">
              No custom fields added. Click 'Add Custom Field' to create one.
            </div>
          ) : null}
          
          <Button 
            onClick={addCustomField} 
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <PlusCircle className="h-4 w-4" /> Add Custom Field
          </Button>
        </div>
      </div>
    </div>
  );
};
