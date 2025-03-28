import React, { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Goal } from "./GoalsList";
import { ScrollArea } from "@/components/ui/scroll-area";

// Goal form data interfaces
export interface GoalFormData {
  name: string;
  type: string;
  priority?: string;
  targetDate?: Date;
  targetAmount?: number;
  owner: string;
  description?: string;
  dateOfBirth?: Date;
  targetRetirementAge?: number;
  planningHorizonAge?: number;
  // Asset Purchase fields
  purchasePrice?: number;
  financingMethod?: string;
  annualAppreciation?: string;
  // Education fields
  studentName?: string;
  startYear?: number;
  endYear?: number;
  tuitionEstimate?: number;
  // Vacation fields
  destination?: string;
  estimatedCost?: number;
  // Cash Reserve fields
  amountDesired?: number;
  // Other fields as needed
}

interface GoalDetailsSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  goal?: Goal;
  onSave: (goalData: GoalFormData) => void;
  title: string;
  onTitleUpdate?: (name: string, owner: string) => void;
}

export const GoalDetailsSidePanel = ({
  isOpen,
  onClose,
  onCancel,
  goal,
  onSave,
  title,
  onTitleUpdate
}: GoalDetailsSidePanelProps) => {
  // Initialize form data state
  const [formData, setFormData] = useState<GoalFormData>({
    name: "",
    type: "",
    owner: "",
    targetDate: undefined,
    targetAmount: undefined,
    description: "",
  });

  // Define owner options
  const owners = ["Antonio Gomez", "Maria Gomez", "Joint"];

  // Define goal types
  const goalTypes = [
    "Asset Purchase",
    "Cash Reserve",
    "Education",
    "Gift",
    "Home Improvement",
    "Home Purchase",
    "Investment Property",
    "Land",
    "Legacy",
    "Other",
    "Retirement",
    "Vacation",
    "Vacation Home",
    "Vehicle",
    "Wedding"
  ];

  // Annual appreciation options for real estate
  const appreciationOptions = [
    "None",
    "1%",
    "2%",
    "3%",
    "4%",
    "5%"
  ];

  // Financing method options
  const financingOptions = [
    "Cash",
    "Loan",
    "Mortgage",
    "Lease"
  ];

  // Load goal data when goal changes
  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.title || goal.name || "",
        type: goal.type || goal.priority || "",
        owner: goal.owner || "Antonio Gomez",
        targetDate: goal.targetDate,
        targetAmount: goal.targetAmount,
        description: goal.description || "",
        dateOfBirth: goal.dateOfBirth,
        targetRetirementAge: goal.targetRetirementAge,
        planningHorizonAge: goal.planningHorizonAge,
        // Asset Purchase fields
        purchasePrice: goal.purchasePrice,
        financingMethod: goal.financingMethod,
        annualAppreciation: goal.annualAppreciation,
        // Education fields
        studentName: goal.studentName,
        startYear: goal.startYear,
        endYear: goal.endYear,
        tuitionEstimate: goal.tuitionEstimate,
        // Vacation fields
        destination: goal.destination,
        estimatedCost: goal.estimatedCost,
        // Cash Reserve fields
        amountDesired: goal.amountDesired,
      });
    } else {
      // Reset form for new goal
      setFormData({
        name: "",
        type: "",
        owner: "Antonio Gomez",
        targetDate: undefined,
        targetAmount: undefined,
        description: "",
      });
    }
  }, [goal]);

  // Update title when name or owner changes
  useEffect(() => {
    if (onTitleUpdate && formData.name && formData.owner) {
      onTitleUpdate(formData.name, formData.owner);
    }
  }, [formData.name, formData.owner, onTitleUpdate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // For number fields, convert to number
    if (name === "targetAmount" || name === "purchasePrice" || name === "tuitionEstimate" || 
        name === "startYear" || name === "endYear" || name === "estimatedCost" || name === "amountDesired") {
      const numValue = value === "" ? undefined : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // If name is updated, update the panel title
    if (name === "name" && onTitleUpdate) {
      onTitleUpdate(value, formData.owner);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If owner is updated, update the panel title
    if (name === "owner" && onTitleUpdate) {
      onTitleUpdate(formData.name, value);
    }

    // For new goals, set initial name based on type
    if (name === "type" && (!formData.name || formData.name === formData.type)) {
      const newName = value;
      setFormData(prev => ({ ...prev, name: newName }));
      
      // Update panel title
      if (onTitleUpdate) {
        onTitleUpdate(newName, formData.owner);
      }
    }
  };

  const handleDateChange = (date: Date | undefined, fieldName: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: date }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  // Determine which fields to display based on goal type
  const renderGoalFields = () => {
    switch (formData.type) {
      case "Asset Purchase":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice || ""}
                onChange={handleInputChange}
                className="bg-[#1A1A3A] border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="financingMethod">Financing Method</Label>
              <Select
                value={formData.financingMethod || ""}
                onValueChange={(value) => handleSelectChange("financingMethod", value)}
              >
                <SelectTrigger id="financingMethod" className="bg-[#1A1A3A] border-gray-700">
                  <SelectValue placeholder="Select financing method" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A3A] border-gray-700">
                  {financingOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="annualAppreciation">Annual Appreciation</Label>
              <Select
                value={formData.annualAppreciation || ""}
                onValueChange={(value) => handleSelectChange("annualAppreciation", value)}
              >
                <SelectTrigger id="annualAppreciation" className="bg-[#1A1A3A] border-gray-700">
                  <SelectValue placeholder="Select appreciation rate" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A3A] border-gray-700">
                  {appreciationOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case "Cash Reserve":
        return (
          <div className="space-y-2">
            <Label htmlFor="amountDesired">Amount Desired</Label>
            <Input
              id="amountDesired"
              name="amountDesired"
              type="number"
              value={formData.amountDesired || ""}
              onChange={handleInputChange}
              className="bg-[#1A1A3A] border-gray-700"
            />
          </div>
        );
      case "Education":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                name="studentName"
                value={formData.studentName || ""}
                onChange={handleInputChange}
                className="bg-[#1A1A3A] border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tuitionEstimate">Tuition Estimate</Label>
              <Input
                id="tuitionEstimate"
                name="tuitionEstimate"
                type="number"
                value={formData.tuitionEstimate || ""}
                onChange={handleInputChange}
                className="bg-[#1A1A3A] border-gray-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startYear">Start Year</Label>
                <Input
                  id="startYear"
                  name="startYear"
                  type="number"
                  value={formData.startYear || ""}
                  onChange={handleInputChange}
                  className="bg-[#1A1A3A] border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endYear">End Year</Label>
                <Input
                  id="endYear"
                  name="endYear"
                  type="number"
                  value={formData.endYear || ""}
                  onChange={handleInputChange}
                  className="bg-[#1A1A3A] border-gray-700"
                />
              </div>
            </div>
          </>
        );
      case "Vacation":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                name="destination"
                value={formData.destination || ""}
                onChange={handleInputChange}
                className="bg-[#1A1A3A] border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost</Label>
              <Input
                id="estimatedCost"
                name="estimatedCost"
                type="number"
                value={formData.estimatedCost || ""}
                onChange={handleInputChange}
                className="bg-[#1A1A3A] border-gray-700"
              />
            </div>
          </>
        );
      case "Vehicle":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice || ""}
                onChange={handleInputChange}
                className="bg-[#1A1A3A] border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="financingMethod">Financing Method</Label>
              <Select
                value={formData.financingMethod || ""}
                onValueChange={(value) => handleSelectChange("financingMethod", value)}
              >
                <SelectTrigger id="financingMethod" className="bg-[#1A1A3A] border-gray-700">
                  <SelectValue placeholder="Select financing method" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A3A] border-gray-700">
                  {financingOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case "Home Purchase":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice || ""}
                onChange={handleInputChange}
                className="bg-[#1A1A3A] border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="financingMethod">Financing Method</Label>
              <Select
                value={formData.financingMethod || ""}
                onValueChange={(value) => handleSelectChange("financingMethod", value)}
              >
                <SelectTrigger id="financingMethod" className="bg-[#1A1A3A] border-gray-700">
                  <SelectValue placeholder="Select financing method" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A3A] border-gray-700">
                  {financingOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="annualAppreciation">Annual Appreciation</Label>
              <Select
                value={formData.annualAppreciation || ""}
                onValueChange={(value) => handleSelectChange("annualAppreciation", value)}
              >
                <SelectTrigger id="annualAppreciation" className="bg-[#1A1A3A] border-gray-700">
                  <SelectValue placeholder="Select appreciation rate" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A3A] border-gray-700">
                  {appreciationOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );
      default:
        // For other goal types, we'll show the default target amount
        return (
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount</Label>
            <Input
              id="targetAmount"
              name="targetAmount"
              type="number"
              value={formData.targetAmount || ""}
              onChange={handleInputChange}
              className="bg-[#1A1A3A] border-gray-700"
            />
          </div>
        );
    }
  };

  // Show retirement-specific fields for Retirement goal type
  const showRetirementFields = formData.type === "Retirement";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto bg-[#0F0F2D] text-white border-l border-gray-800" side="right">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Select
                  value={formData.owner}
                  onValueChange={(value) => handleSelectChange("owner", value)}
                >
                  <SelectTrigger id="owner" className="bg-[#1A1A3A] border-gray-700">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A3A] border-gray-700">
                    {owners.map(owner => (
                      <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Goal Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger id="type" className="bg-[#1A1A3A] border-gray-700">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A3A] border-gray-700 max-h-[300px]">
                    {goalTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-[#1A1A3A] border-gray-700"
                />
              </div>
              
              {/* Render type-specific fields */}
              {formData.type && renderGoalFields()}
              
              {/* Show target date for all goals except Education */}
              {formData.type !== "Education" && (
                <div className="space-y-2">
                  <Label htmlFor="targetDate">Target Date</Label>
                  <DatePicker
                    date={formData.targetDate}
                    onSelect={(date) => handleDateChange(date, "targetDate")}
                    className="bg-[#1A1A3A] border-gray-700 w-full"
                  />
                </div>
              )}
              
              {/* Retirement-specific fields */}
              {showRetirementFields && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="targetRetirementAge">Target Retirement Age</Label>
                    <Input
                      id="targetRetirementAge"
                      name="targetRetirementAge"
                      type="number"
                      value={formData.targetRetirementAge || ""}
                      onChange={handleInputChange}
                      className="bg-[#1A1A3A] border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planningHorizonAge">Planning Horizon (Years)</Label>
                    <Input
                      id="planningHorizonAge"
                      name="planningHorizonAge"
                      type="number"
                      value={formData.planningHorizonAge || ""}
                      onChange={handleInputChange}
                      className="bg-[#1A1A3A] border-gray-700"
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  className="bg-[#1A1A3A] border-gray-700 min-h-20"
                />
              </div>
            </div>
          </ScrollArea>
          
          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-800">
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-gray-700 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90"
            >
              Save
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
