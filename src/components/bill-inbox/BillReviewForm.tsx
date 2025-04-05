
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ParsedBillData } from "./FileUploadProcessor";
import { AIConfidenceIndicator, ConfidenceLevel } from "./AIConfidenceIndicator";
import { Calendar, CreditCard, DollarSign, Building, Home, FileText, Tag, Brain } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface BillReviewFormProps {
  parsedData: ParsedBillData;
  onConfirm: (data: BillFormData) => void;
  onCancel: () => void;
}

export interface BillFormData {
  vendorName: string;
  amount: number;
  dueDate: string;
  category: string;
  rememberVendor: boolean;
  billImage?: string;
}

export function BillReviewForm({ parsedData, onConfirm, onCancel }: BillReviewFormProps) {
  const [formData, setFormData] = useState<BillFormData>({
    vendorName: parsedData.vendorName.value,
    amount: parsedData.amount.value,
    dueDate: parsedData.dueDate.value,
    category: parsedData.category.value,
    rememberVendor: true,
    billImage: parsedData.billImage
  });

  const getConfidenceLevel = (score: number): ConfidenceLevel => {
    if (score >= 90) return "high";
    if (score >= 70) return "medium";
    return "low";
  };

  const handleInputChange = (field: keyof BillFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onConfirm(formData);
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    "Utilities": <Home className="h-4 w-4" />,
    "Rent/Mortgage": <Building className="h-4 w-4" />,
    "Insurance": <FileText className="h-4 w-4" />,
    "Credit Card": <CreditCard className="h-4 w-4" />,
    "Entertainment": <FileText className="h-4 w-4" />,
    "Other": <Tag className="h-4 w-4" />
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Review AI-Extracted Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="vendorName">Vendor Name</Label>
              <AIConfidenceIndicator 
                level={getConfidenceLevel(parsedData.vendorName.confidence)} 
                score={parsedData.vendorName.confidence} 
                className="w-1/3"
              />
            </div>
            <Input
              id="vendorName"
              value={formData.vendorName}
              onChange={(e) => handleInputChange("vendorName", e.target.value)}
              className={getConfidenceLevel(parsedData.vendorName.confidence) === "low" ? "border-red-300" : ""}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Amount</Label>
              <AIConfidenceIndicator 
                level={getConfidenceLevel(parsedData.amount.confidence)} 
                score={parsedData.amount.confidence} 
                className="w-1/3"
              />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", parseFloat(e.target.value))}
                className={`pl-9 ${getConfidenceLevel(parsedData.amount.confidence) === "low" ? "border-red-300" : ""}`}
              />
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="dueDate">Due Date</Label>
              <AIConfidenceIndicator 
                level={getConfidenceLevel(parsedData.dueDate.confidence)} 
                score={parsedData.dueDate.confidence} 
                className="w-1/3"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    getConfidenceLevel(parsedData.dueDate.confidence) === "low" ? "border-red-300" : ""
                  }`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(new Date(formData.dueDate), "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                  onSelect={(date) => handleInputChange("dueDate", date ? format(date, "yyyy-MM-dd") : "")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="category">Category</Label>
              <AIConfidenceIndicator 
                level={getConfidenceLevel(parsedData.category.confidence)} 
                score={parsedData.category.confidence} 
                className="w-1/3"
              />
            </div>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger id="category" className={getConfidenceLevel(parsedData.category.confidence) === "low" ? "border-red-300" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Utilities">
                  <div className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Utilities
                  </div>
                </SelectItem>
                <SelectItem value="Rent/Mortgage">
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    Rent/Mortgage
                  </div>
                </SelectItem>
                <SelectItem value="Insurance">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Insurance
                  </div>
                </SelectItem>
                <SelectItem value="Credit Card">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Credit Card
                  </div>
                </SelectItem>
                <SelectItem value="Entertainment">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Entertainment
                  </div>
                </SelectItem>
                <SelectItem value="Other">
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    Other
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rememberVendor"
              checked={formData.rememberVendor}
              onCheckedChange={(checked) => handleInputChange("rememberVendor", !!checked)}
            />
            <Label htmlFor="rememberVendor">Learn from my changes to improve future scans</Label>
          </div>

          {parsedData.billImage && (
            <div>
              <Label className="mb-2 block">Bill Image Preview</Label>
              <div className="border rounded p-2">
                <img 
                  src={parsedData.billImage} 
                  alt="Bill Preview" 
                  className="max-h-60 mx-auto object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Confirm and Save</Button>
      </CardFooter>
    </Card>
  );
}
