import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Goal } from "./GoalsList";

export interface GoalFormData {
  name: string;
  owner: string;
  dateOfBirth?: Date;
  targetRetirementAge?: number;
  planningHorizonAge?: number;
  type: string;
  targetDate?: Date;
  targetAmount?: number;
  description?: string;
  purchasePrice?: number;
  financingMethod?: string;
  annualAppreciation?: string;
  studentName?: string;
  startYear?: number;
  endYear?: number;
  tuitionEstimate?: number;
  destination?: string;
  estimatedCost?: number;
  amountDesired?: number;
  repeats?: string;
  annualInflationType?: string;
  annualInflationRate?: number;
}

interface GoalDetailsSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  goal?: Goal;
  onSave: (goalData: GoalFormData) => void;
  title: string;
  onTitleUpdate?: (name: string, owner: string) => void;
  isDialog?: boolean;
}

export function GoalDetailsSidePanel({
  isOpen,
  onClose,
  onCancel,
  goal,
  onSave,
  title,
  onTitleUpdate,
  isDialog = false
}: GoalDetailsSidePanelProps) {
  const [formData, setFormData] = useState<GoalFormData>({
    name: goal?.name || goal?.title || "",
    owner: goal?.owner || "",
    dateOfBirth: goal?.dateOfBirth,
    targetRetirementAge: goal?.targetRetirementAge,
    planningHorizonAge: goal?.planningHorizonAge,
    type: goal?.type || "",
    targetDate: goal?.targetDate,
    targetAmount: goal?.targetAmount,
    description: goal?.description || "",
    purchasePrice: goal?.purchasePrice,
    financingMethod: goal?.financingMethod || "",
    annualAppreciation: goal?.annualAppreciation || "None",
    studentName: goal?.studentName || "",
    startYear: goal?.startYear,
    endYear: goal?.endYear,
    tuitionEstimate: goal?.tuitionEstimate,
    destination: goal?.destination || "",
    estimatedCost: goal?.estimatedCost,
    amountDesired: goal?.amountDesired,
    repeats: goal?.repeats || "None",
    annualInflationType: goal?.annualInflationType || "None",
    annualInflationRate: goal?.annualInflationRate || 0,
  });

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDobPickerOpen, setIsDobPickerOpen] = useState(false);

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name || goal.title || "",
        owner: goal.owner || "",
        dateOfBirth: goal.dateOfBirth,
        targetRetirementAge: goal.targetRetirementAge,
        planningHorizonAge: goal.planningHorizonAge,
        type: goal.type || "",
        targetDate: goal.targetDate,
        targetAmount: goal.targetAmount,
        description: goal.description || "",
        purchasePrice: goal.purchasePrice,
        financingMethod: goal.financingMethod || "",
        annualAppreciation: goal.annualAppreciation || "None",
        studentName: goal.studentName || "",
        startYear: goal.startYear,
        endYear: goal.endYear,
        tuitionEstimate: goal.tuitionEstimate,
        destination: goal.destination || "",
        estimatedCost: goal.estimatedCost,
        amountDesired: goal.amountDesired,
        repeats: goal.repeats || "None",
        annualInflationType: goal.annualInflationType || "None",
        annualInflationRate: goal.annualInflationRate || 0,
      });
    }
  }, [goal]);

  useEffect(() => {
    if (onTitleUpdate && formData.name && formData.owner) {
      onTitleUpdate(formData.name, formData.owner);
    }
  }, [formData.name, formData.owner, onTitleUpdate]);

  const handleInputChange = (field: keyof GoalFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderGoalSpecificFields = () => {
    switch (formData.type) {
      case "Asset Purchase":
      case "Home Purchase":
      case "Vehicle":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={formData.purchasePrice || ""}
                onChange={(e) => handleInputChange("purchasePrice", parseFloat(e.target.value) || 0)}
                placeholder="Enter purchase price"
              />
            </div>
            
            <div>
              <Label htmlFor="financingMethod">Financing Method</Label>
              <Select value={formData.financingMethod} onValueChange={(value) => handleInputChange("financingMethod", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select financing method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Loan">Loan</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(formData.type === "Asset Purchase" || formData.type === "Home Purchase") && (
              <div>
                <Label htmlFor="annualAppreciation">Annual Appreciation</Label>
                <Select value={formData.annualAppreciation} onValueChange={(value) => handleInputChange("annualAppreciation", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appreciation rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="2%">2%</SelectItem>
                    <SelectItem value="3%">3%</SelectItem>
                    <SelectItem value="4%">4%</SelectItem>
                    <SelectItem value="5%">5%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      case "Education":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                value={formData.studentName || ""}
                onChange={(e) => handleInputChange("studentName", e.target.value)}
                placeholder="Enter student name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startYear">Start Year</Label>
                <Input
                  id="startYear"
                  type="number"
                  value={formData.startYear || ""}
                  onChange={(e) => handleInputChange("startYear", parseInt(e.target.value) || undefined)}
                  placeholder="e.g., 2025"
                />
              </div>
              <div>
                <Label htmlFor="endYear">End Year</Label>
                <Input
                  id="endYear"
                  type="number"
                  value={formData.endYear || ""}
                  onChange={(e) => handleInputChange("endYear", parseInt(e.target.value) || undefined)}
                  placeholder="e.g., 2029"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="tuitionEstimate">Tuition Estimate</Label>
              <Input
                id="tuitionEstimate"
                type="number"
                value={formData.tuitionEstimate || ""}
                onChange={(e) => handleInputChange("tuitionEstimate", parseFloat(e.target.value) || 0)}
                placeholder="Enter estimated tuition"
              />
            </div>
          </div>
        );

      case "Vacation":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={formData.destination || ""}
                onChange={(e) => handleInputChange("destination", e.target.value)}
                placeholder="Enter destination"
              />
            </div>
            
            <div>
              <Label htmlFor="estimatedCost">Estimated Cost</Label>
              <Input
                id="estimatedCost"
                type="number"
                value={formData.estimatedCost || ""}
                onChange={(e) => handleInputChange("estimatedCost", parseFloat(e.target.value) || 0)}
                placeholder="Enter estimated cost"
              />
            </div>
          </div>
        );

      case "Cash Reserve":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="amountDesired">Target Amount</Label>
              <Input
                id="amountDesired"
                type="number"
                value={formData.amountDesired || ""}
                onChange={(e) => handleInputChange("amountDesired", parseFloat(e.target.value) || 0)}
                placeholder="Enter target amount"
              />
            </div>
            
            <div>
              <Label htmlFor="annualAppreciation">Annual Appreciation</Label>
              <Select value={formData.annualAppreciation} onValueChange={(value) => handleInputChange("annualAppreciation", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select appreciation rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="1%">1%</SelectItem>
                  <SelectItem value="2%">2%</SelectItem>
                  <SelectItem value="3%">3%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="repeats">Repeats</Label>
              <Select value={formData.repeats} onValueChange={(value) => handleInputChange("repeats", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select repeat frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input
                id="targetAmount"
                type="number"
                value={formData.targetAmount || ""}
                onChange={(e) => handleInputChange("targetAmount", parseFloat(e.target.value) || 0)}
                placeholder="Enter target amount"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {!isDialog && (
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Basic Information Section - Always shown */}
          <div>
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goalName">Goal Name</Label>
                <Input
                  id="goalName"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter goal name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => handleInputChange("owner", e.target.value)}
                  placeholder="Enter owner name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="goalType">Goal Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Retirement">Retirement</SelectItem>
                    <SelectItem value="Home Purchase">Home Purchase</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Vacation">Vacation</SelectItem>
                    <SelectItem value="Vehicle">Vehicle</SelectItem>
                    <SelectItem value="Cash Reserve">Cash Reserve</SelectItem>
                    <SelectItem value="Asset Purchase">Asset Purchase</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter goal description"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Retirement Details Section - Always shown */}
          <div>
            <h3 className="text-lg font-medium mb-4">Retirement Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Popover open={isDobPickerOpen} onOpenChange={setIsDobPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : "Select date of birth"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) => {
                        handleInputChange("dateOfBirth", date);
                        setIsDobPickerOpen(false);
                      }}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1940}
                      toYear={2010}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="targetRetirementAge">Target Retirement Age</Label>
                <Input
                  id="targetRetirementAge"
                  type="number"
                  value={formData.targetRetirementAge || ""}
                  onChange={(e) => handleInputChange("targetRetirementAge", parseInt(e.target.value) || undefined)}
                  placeholder="Enter target retirement age"
                  min="50"
                  max="85"
                />
              </div>
              
              <div>
                <Label htmlFor="planningHorizonAge">Planning Horizon Age</Label>
                <Input
                  id="planningHorizonAge"
                  type="number"
                  value={formData.planningHorizonAge || ""}
                  onChange={(e) => handleInputChange("planningHorizonAge", parseInt(e.target.value) || undefined)}
                  placeholder="Enter planning horizon age"
                  min="50"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Goal Details Section - Always shown */}
          <div>
            <h3 className="text-lg font-medium mb-4">Goal Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="targetDate">Target Date</Label>
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.targetDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.targetDate ? format(formData.targetDate, "PPP") : "Select target date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.targetDate}
                      onSelect={(date) => {
                        handleInputChange("targetDate", date);
                        setIsDatePickerOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {renderGoalSpecificFields()}
              
              <div>
                <Label htmlFor="annualInflationType">Annual Inflation</Label>
                <Select value={formData.annualInflationType} onValueChange={(value) => handleInputChange("annualInflationType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inflation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="General">General (2%)</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.annualInflationType === "Custom" && (
                <div>
                  <Label htmlFor="annualInflationRate">Custom Inflation Rate (%)</Label>
                  <Input
                    id="annualInflationRate"
                    type="number"
                    value={formData.annualInflationRate || ""}
                    onChange={(e) => handleInputChange("annualInflationRate", parseFloat(e.target.value) || 0)}
                    placeholder="Enter inflation rate"
                    min="0"
                    max="20"
                    step="0.1"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 p-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {goal ? "Update Goal" : "Save Goal"}
          </Button>
        </div>
      </form>
    </div>
  );
}
