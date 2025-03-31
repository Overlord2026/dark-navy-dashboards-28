
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FamilyOffice } from "@/types/familyoffice";
import { Trash2, AlertCircle } from "lucide-react";

interface ImportPreviewTableProps {
  data: Partial<FamilyOffice>[];
  onDataChange: (data: Partial<FamilyOffice>[]) => void;
}

export function ImportPreviewTable({ data, onDataChange }: ImportPreviewTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleCellChange = (index: number, field: keyof FamilyOffice, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onDataChange(newData);
  };

  const toggleRowSelection = (index: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedRows(newSelection);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((_, i) => i)));
    }
  };

  const deleteSelectedRows = () => {
    const newData = data.filter((_, index) => !selectedRows.has(index));
    onDataChange(newData);
    setSelectedRows(new Set());
  };

  const validateData = (officeData: Partial<FamilyOffice>): string[] => {
    const errors = [];
    if (!officeData.name || officeData.name.trim() === '') errors.push('Name is required');
    if (!officeData.location || officeData.location.trim() === '') errors.push('Location is required');
    if (!officeData.tier) errors.push('Tier is required');
    return errors;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {selectedRows.size} of {data.length} rows selected
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={deleteSelectedRows} 
            disabled={selectedRows.size === 0}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedRows.size === data.length && data.length > 0} 
                  indeterminate={selectedRows.size > 0 && selectedRows.size < data.length}
                  onCheckedChange={toggleAllRows}
                  aria-label="Select all rows"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Min Assets ($M)</TableHead>
              <TableHead>AUM ($B)</TableHead>
              <TableHead>Year Founded</TableHead>
              <TableHead>Wealth Tiers</TableHead>
              <TableHead className="w-12">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((office, index) => {
              const validationErrors = validateData(office);
              return (
                <TableRow key={index} className={validationErrors.length > 0 ? "bg-red-50" : ""}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedRows.has(index)} 
                      onCheckedChange={() => toggleRowSelection(index)}
                      aria-label={`Select row ${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={office.name || ''} 
                      onChange={(e) => handleCellChange(index, 'name', e.target.value)}
                      className={!office.name ? "border-red-300" : ""}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={office.location || ''} 
                      onChange={(e) => handleCellChange(index, 'location', e.target.value)}
                      className={!office.location ? "border-red-300" : ""}
                    />
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={office.tier} 
                      onValueChange={(value) => handleCellChange(index, 'tier', value)}
                    >
                      <SelectTrigger className={!office.tier ? "border-red-300" : ""}>
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="foundational">Foundational</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      value={office.minimumAssets || ''} 
                      onChange={(e) => handleCellChange(index, 'minimumAssets', Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      value={office.aum || ''} 
                      onChange={(e) => handleCellChange(index, 'aum', Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      value={office.foundedYear || ''} 
                      onChange={(e) => handleCellChange(index, 'foundedYear', Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={office.wealthTiers?.[0] || ''} 
                      onValueChange={(value) => handleCellChange(index, 'wealthTiers', [value])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emerging">Emerging</SelectItem>
                        <SelectItem value="affluent">Affluent</SelectItem>
                        <SelectItem value="hnw">High-Net-Worth</SelectItem>
                        <SelectItem value="uhnw">Ultra-High-Net-Worth</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {validationErrors.length > 0 ? (
                      <div className="relative group">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <div className="absolute hidden group-hover:block right-0 top-0 z-50 bg-white p-2 rounded-md shadow-md border border-red-200 w-48">
                          <p className="text-xs font-medium text-red-700 mb-1">Validation errors:</p>
                          <ul className="text-xs list-disc pl-4 text-red-600">
                            {validationErrors.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
