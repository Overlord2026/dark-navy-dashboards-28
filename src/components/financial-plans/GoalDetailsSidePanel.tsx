
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
import { Goal } from "@/hooks/useFinancialPlansState";
import { ScrollArea } from "@/components/ui/scroll-area";

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
}

interface ValidationErrors {
  [key: string]: string;
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
  const [formData, setFormData] = useState<GoalFormData>({
    name: "",
    type: "",
    owner: "",
    targetDate: undefined,
    targetAmount: undefined,
    description: "",
    annualInflationType: "None",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const owners = ["Antonio Gomez", "Maria Gomez", "Joint"];

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

  const appreciationOptions = [
    "None",
    "1%",
    "2%",
    "3%",
    "4%",
    "5%"
  ];

  const inflationTypeOptions = [
    "None",
    "General",
    "Custom"
  ];

  const financingOptions = [
    "Cash",
    "Loan",
    "Mortgage",
    "Other"
  ];

  const repeatsOptions = [
    "None",
    "Monthly",
    "Quarterly",
    "Yearly"
  ];

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
        purchasePrice: goal.purchasePrice,
        financingMethod: goal.financingMethod || "Cash",
        annualAppreciation: goal.annualAppreciation || "None",
        studentName: goal.studentName,
        startYear: goal.startYear,
        endYear: goal.endYear,
        tuitionEstimate: goal.tuitionEstimate,
        destination: goal.destination,
        estimatedCost: goal.estimatedCost,
        amountDesired: goal.amountDesired,
        repeats: goal.repeats || "None",
        annualInflationType: goal.annualInflationType || "None",
        annualInflationRate: goal.annualInflationRate,
      });
      setErrors({});
    } else {
      setFormData({
        name: "",
        type: "",
        owner: "Antonio Gomez",
        targetDate: undefined,
        targetAmount: undefined,
        description: "",
        financingMethod: "Cash",
        annualAppreciation: "None",
        repeats: "None",
        annualInflationType: "None",
      });
      setErrors({});
    }
  }, [goal]);

  useEffect(() => {
    if (onTitleUpdate && formData.name && formData.owner) {
      onTitleUpdate(formData.name, formData.owner);
    }
  }, [formData.name, formData.owner, onTitleUpdate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "targetAmount" || name === "purchasePrice" || name === "tuitionEstimate" || 
        name === "startYear" || name === "endYear" || name === "estimatedCost" || 
        name === "amountDesired" || name === "targetRetirementAge" || name === "planningHorizonAge" ||
        name === "annualInflationRate") {
      
      if (value === "") {
        setFormData(prev => ({ ...prev, [name]: undefined }));
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        return;
      }

      const numValue = Number(value);
      
      if (isNaN(numValue)) {
        setErrors(prev => ({ ...prev, [name]: "Please enter a valid number" }));
        return;
      }
      
      if ((name === "startYear" || name === "endYear") && (numValue < 2000 || numValue > 2100)) {
        setErrors(prev => ({ ...prev, [name]: "Year must be between 2000 and 2100" }));
        return;
      }
      
      if ((name === "targetRetirementAge" || name === "planningHorizonAge") && (numValue < 0 || numValue > 120)) {
        setErrors(prev => ({ ...prev, [name]: "Age must be between 0 and 120" }));
        return;
      }
      
      if ((name === "purchasePrice" || name === "targetAmount" || name === "tuitionEstimate" || 
           name === "estimatedCost" || name === "amountDesired") && numValue < 0) {
        setErrors(prev => ({ ...prev, [name]: "Amount cannot be negative" }));
        return;
      }
      
      if (name === "annualInflationRate" && (numValue < 0 || numValue > 100)) {
        setErrors(prev => ({ ...prev, [name]: "Rate must be between 0 and 100" }));
        return;
      }
      
      setFormData(prev => ({ ...prev, [name]: numValue }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (name === "name" && onTitleUpdate) {
      onTitleUpdate(value, formData.owner);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "annualInflationType") {
      if (value === "None") {
        setFormData(prev => ({ ...prev, annualInflationRate: 0 }));
      } else if (value === "General") {
        setFormData(prev => ({ ...prev, annualInflationRate: 2 }));
      }
    }
    
    if (name === "owner" && onTitleUpdate) {
      onTitleUpdate(formData.name, value);
    }

    if (name === "type" && (!formData.name || formData.name === formData.type)) {
      const newName = value;
      setFormData(prev => ({ ...prev, name: newName }));
      
      if (onTitleUpdate) {
        onTitleUpdate(newName, formData.owner);
      }
    }
  };

  const handleDateChange = (date: Date | undefined, fieldName: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: date }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.type) {
      newErrors.type = "Goal type is required";
    }
    
    if (!formData.owner) {
      newErrors.owner = "Owner is required";
    }
    
    if (formData.targetAmount !== undefined && (isNaN(formData.targetAmount) || formData.targetAmount < 0)) {
      newErrors.targetAmount = "Please enter a valid positive amount";
    }
    
    if (formData.purchasePrice !== undefined && (isNaN(formData.purchasePrice) || formData.purchasePrice < 0)) {
      newErrors.purchasePrice = "Please enter a valid positive amount";
    }
    
    if (formData.tuitionEstimate !== undefined && (isNaN(formData.tuitionEstimate) || formData.tuitionEstimate < 0)) {
      newErrors.tuitionEstimate = "Please enter a valid positive amount";
    }
    
    if (formData.startYear !== undefined && (formData.startYear < 2000 || formData.startYear > 2100)) {
      newErrors.startYear = "Year must be between 2000 and 2100";
    }
    
    if (formData.endYear !== undefined && (formData.endYear < 2000 || formData.endYear > 2100)) {
      newErrors.endYear = "Year must be between 2000 and 2100";
    }
    
    if (formData.startYear && formData.endYear && formData.startYear > formData.endYear) {
      newErrors.endYear = "End year must be after start year";
    }
    
    if (formData.targetRetirementAge !== undefined && (isNaN(formData.targetRetirementAge) || formData.targetRetirementAge < 0 || formData.targetRetirementAge > 120)) {
      newErrors.targetRetirementAge = "Age must be between 0 and 120";
    }
    
    if (formData.planningHorizonAge !== undefined && (isNaN(formData.planningHorizonAge) || formData.planningHorizonAge < 0 || formData.planningHorizonAge > 120)) {
      newErrors.planningHorizonAge = "Age must be between 0 and 120";
    }
    
    if (formData.amountDesired !== undefined && (isNaN(formData.amountDesired) || formData.amountDesired < 0)) {
      newErrors.amountDesired = "Please enter a valid positive amount";
    }
    
    if (formData.annualInflationRate !== undefined && 
        (isNaN(formData.annualInflationRate) || formData.annualInflationRate < 0 || formData.annualInflationRate > 100)) {
      newErrors.annualInflationRate = "Inflation rate must be between 0 and 100";
    }
    
    if (formData.annualInflationType === "Custom" && 
        (formData.annualInflationRate === undefined || 
         isNaN(formData.annualInflationRate) || 
         formData.annualInflationRate < 0 || 
         formData.annualInflationRate > 100)) {
      newErrors.annualInflationRate = "Please enter a valid inflation rate between 0 and 100";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const renderAnnualInflationFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="annualInflationType">Annual Inflation</Label>
        <Select
          value={formData.annualInflationType || "None"}
          onValueChange={(value) => handleSelectChange("annualInflationType", value)}
        >
          <SelectTrigger id="annualInflationType" className="bg-[#1A1A3A] border-gray-700">
            <SelectValue placeholder="Select inflation type" />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A3A] border-gray-700">
            {inflationTypeOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {formData.annualInflationType === "Custom" && (
        <div className="space-y-2">
          <Label htmlFor="annualInflationRate">Custom Inflation (%)</Label>
          <Input
            id="annualInflationRate"
            name="annualInflationRate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formData.annualInflationRate ?? ""}
            onChange={handleInputChange}
            className={`bg-[#1A1A3A] border-gray-700 ${errors.annualInflationRate ? 'border-[#FF4D4D] focus-visible:ring-[#FF4D4D]' : ''}`}
            required
          />
          {errors.annualInflationRate && (
            <p className="text-xs text-[#FF4D4D] mt-1">{errors.annualInflationRate}</p>
          )}
        </div>
      )}
    </>
  );

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
                className={`bg-[#1A1A3A] border-gray-700 ${errors.purchasePrice ? 'border-[#FF4D4D] focus-visible:ring-[#FF4D4D]' : ''}`}
              />
              {errors.purchasePrice && (
                <p className="text-xs text-[#FF4D4D] mt-1">{errors.purchasePrice}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="financingMethod">Financing Method</Label>
              <Select
                value={formData.financingMethod || "Cash"}
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
                value={formData.annualAppreciation || "None"}
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
            {renderAnnualInflationFields()}
          </>
        );
      case "Cash Reserve":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="amountDesired">Target Amount</Label>
              <Input
                id="amountDesired"
                name="amountDesired"
                type="number"
                value={formData.amountDesired || ""}
                onChange={handleInputChange}
                className={`bg-[#1A1A3A] border-gray-700 ${errors.amountDesired ? 'border-[#FF4D4D] focus-visible:ring-[#FF4D4D]' : ''}`}
              />
              {errors.amountDesired && (
                <p className="text-xs text-[#FF4D4D] mt-1">{errors.amountDesired}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="annualAppreciation">Annual Appreciation</Label>
              <Select
                value={formData.annualAppreciation || "None"}
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
            <div className="space-y-2">
              <Label htmlFor="repeats">Repeats</Label>
              <Select
                value={formData.repeats || "None"}
                onValueChange={(value) => handleSelectChange("repeats", value)}
              >
                <SelectTrigger id="repeats" className="bg-[#1A1A3A] border-gray-700">
                  <SelectValue placeholder="Select repeat frequency" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A3A] border-gray-700">
                  {repeatsOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {renderAnnualInflationFields()}
          </>
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
                className={`bg-[#1A1A3A] border-gray-700 ${errors.tuitionEstimate ? 'border-[#FF4D4D] focus-visible:ring-[#FF4D4D]' : ''}`}
              />
              {errors.tuitionEstimate && (
                <p className="text-xs text-[#FF4D4D] mt-1">{errors.tuitionEstimate}</p>
              )}
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
                  className={`bg-[#1A1A3A] border-gray-700 ${errors.startYear ? 'border-[#FF4D4D] focus-visible:ring-[#FF4D4D]' : ''}`}
                />
                {errors.startYear && (
                  <p className="text-xs text-[#FF4D4D] mt-1">{errors.startYear}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endYear">End Year</Label>
                <Input
                  id="endYear"
                  name="endYear"
                  type="number"
                  value={formData.endYear || ""}
                  onChange={handleInputChange}
                  className={`bg-[#1A1A3A] border-gray-700 ${errors.endYear ? 'border-[#FF4D4D] focus-visible:ring-[#FF4D4D]' : ''}`}
                />
                {errors.endYear && (
                  <p className="text-xs text-[#FF4D4D] mt-1">{errors.endYear}</p>
                )}
              </div>
            </div>
            {renderAnnualInflationFields()}
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
                className={`bg-[#1A1A3A] border-gray-700 ${errors.estimatedCost ? 'border-[#FF4D4D] focus-visible:ring-[#FF4D4D]' : ''}`}
              />
              {errors.estimatedCost && (
                <p className="text-xs text-[#FF4D4D] mt-1">{errors.estimatedCost}</p>
              )}
            </div>
            {renderAnnualInflationFields()}
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
                className={`bg-[#1A1A3A] border-gray-700 ${errors.purchasePrice ? 'border-[#FF4D4D] focus-visible:ring-[#FF4D4D]' : ''}`}
              />
              {errors.purchasePrice && (
                <p className="text-xs text-[#FF4D4D] mt-1">{errors.purchasePrice}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="financingMethod">Financing Method</Label>
              <Select
                value={formData.financingMethod || "Cash"}
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
            {renderAnnualInflationFields()}
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
                className={`bg-[#1A1A3A] border-gray-700 ${errors.purchasePrice ? 'border-[#FF4D4D] focus-visible:ring-[#FF4D4D]' : ''}`}
              />
              {errors.purchasePrice && (
                <p className="text-xs text-[#FF4D4D] mt-1">{errors.purchasePrice}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="financingMethod">Financing Method</Label>
              <Select
                value={formData.financingMethod || "Cash"}
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
                value={formData.annualAppreciation || "None"}
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
            {renderAnnualInflationFields()}
          </>
        );
      case "Land":
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
                className={`bg-[#1A1A3A] border-gray-700 ${errors.purchasePrice ? 'border-[#FF4D4D] focus-visible:ring-[#FF4D4D]' : ''}`}
              />
              {errors.purchasePrice && (
                <p className="text-xs text-[#FF4D4D] mt-1">{errors.purchasePrice}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="financingMethod">Financing Method</Label>
              <Select
                value={formData.financingMethod || "Cash"}
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
                value={formData.annualAppreciation || "None"}
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
            {renderAnnualInflationFields()}
          </>
        );
      default:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input
                id="targetAmount"
                name="targetAmount"
                type="number"
                value={formData.targetAmount || ""}
                onChange={handleInputChange}
                className={`bg-[#1A1A3A] border-gray-700 ${errors.targetAmount ? 'border-[#FF4D4D] focus-visible:ring-[#FF4D4D]' : ''}`}
              />
              {errors.targetAmount && (
                <p className="text-xs text-[#FF4D4D] mt-1">{errors.targetAmount}</p>
              )}
            </div>
            {renderAnnualInflationFields()}
          </>
        );
    }
  };

  const showRetirementFields = formData.type === "Retirement";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        className="w-full sm:max-w-[540px] overflow-y-auto bg-[#0F0F2D] text-white border-l border-gray-800 animate-slide-in-right" 
        side="right"
      >
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
                  <SelectTrigger id="owner" className={`bg-[#1A1A3A] border-gray-700 ${errors.owner ? 'border-[#FF4D4D]' : ''}`}>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A3A] border-gray-700">
                    {owners.map(owner => (
                      <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.owner && (
                  <p className="text-xs text-[#FF4D4D] mt-1">{errors.owner}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Goal Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger id="type" className={`bg-[#1A1A3A] border-gray-700 ${errors.type ? 'border-[#FF4D4D]' : ''}`}>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A3A] border-gray-700 max-h-[300px]">
                    {goalTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-xs text-[#FF4D4D] mt-1">{errors.type}</p>
                )}
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
              
              {formData.type && renderGoalFields()}
              
              {formData.type !== "Education" && (
                <div className="space-y-2">
                  <Label htmlFor="targetDate">Target Date</Label>
                  <DatePicker
                    date={formData.targetDate}
                    onSelect={(date) => handleDateChange(date, "targetDate")}
                    className="bg-[#1A1A3A] border-gray-700"
                  />
                </div>
              )}
              
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
                      className={`bg-[#1A1A3A] border-gray-700 ${errors.targetRetirementAge ? 'border-[#FF4D4D] focus-visible:ring-[#FF4D4D]' : ''}`}
                    />
                    {errors.targetRetirementAge && (
                      <p className="text-xs text-[#FF4D4D] mt-1">{errors.targetRetirementAge}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planningHorizonAge">Planning Horizon (Years)</Label>
                    <Input
                      id="planningHorizonAge"
                      name="planningHorizonAge"
                      type="number"
                      value={formData.planningHorizonAge || ""}
                      onChange={handleInputChange}
                      className={`bg-[#1A1A3A] border-gray-700 ${errors.planningHorizonAge ? 'border-[#FF4D4D] focus-visible:ring-[#FF4D4D]' : ''}`}
                    />
                    {errors.planningHorizonAge && (
                      <p className="text-xs text-[#FF4D4D] mt-1">{errors.planningHorizonAge}</p>
                    )}
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
