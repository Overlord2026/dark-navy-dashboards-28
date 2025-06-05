import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Goal } from "./GoalsList";

export interface GoalFormData {
  name: string;
  owner: string;
  type: string;
  targetDate?: Date;
  targetAmount?: number;
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
  const [name, setName] = useState(goal?.name || "");
  const [owner, setOwner] = useState(goal?.owner || "");
  const [type, setType] = useState(goal?.type || "");
  const [targetDate, setTargetDate] = useState<Date | undefined>(goal?.targetDate);
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount || 0);
  const [description, setDescription] = useState(goal?.description || "");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(goal?.dateOfBirth);
  const [targetRetirementAge, setTargetRetirementAge] = useState(goal?.targetRetirementAge || 0);
  const [planningHorizonAge, setPlanningHorizonAge] = useState(goal?.planningHorizonAge || 0);
  
  const [purchasePrice, setPurchasePrice] = useState(goal?.purchasePrice || 0);
  const [financingMethod, setFinancingMethod] = useState(goal?.financingMethod || "Cash");
  const [annualAppreciation, setAnnualAppreciation] = useState(goal?.annualAppreciation || "None");
  
  const [studentName, setStudentName] = useState(goal?.studentName || "");
  const [startYear, setStartYear] = useState(goal?.startYear || new Date().getFullYear());
  const [endYear, setEndYear] = useState(goal?.endYear || new Date().getFullYear() + 4);
  const [tuitionEstimate, setTuitionEstimate] = useState(goal?.tuitionEstimate || 0);
  
  const [destination, setDestination] = useState(goal?.destination || "");
  const [estimatedCost, setEstimatedCost] = useState(goal?.estimatedCost || 0);
  
  const [amountDesired, setAmountDesired] = useState(goal?.amountDesired || 0);
  const [repeats, setRepeats] = useState(goal?.repeats || "Monthly");
  
  const [annualInflationType, setAnnualInflationType] = useState(goal?.annualInflationType || "None");
  const [annualInflationRate, setAnnualInflationRate] = useState(goal?.annualInflationRate || 2);

  useEffect(() => {
    if (goal) {
      setName(goal.name || "");
      setOwner(goal.owner || "");
      setType(goal.type || "");
      setTargetDate(goal.targetDate);
      setTargetAmount(goal.targetAmount || 0);
      setDescription(goal.description || "");
      setDateOfBirth(goal.dateOfBirth);
      setTargetRetirementAge(goal.targetRetirementAge || 0);
      setPlanningHorizonAge(goal.planningHorizonAge || 0);
      setPurchasePrice(goal.purchasePrice || 0);
      setFinancingMethod(goal.financingMethod || "Cash");
      setAnnualAppreciation(goal.annualAppreciation || "None");
      setStudentName(goal.studentName || "");
      setStartYear(goal.startYear || new Date().getFullYear());
      setEndYear(goal.endYear || new Date().getFullYear() + 4);
      setTuitionEstimate(goal.tuitionEstimate || 0);
      setDestination(goal.destination || "");
      setEstimatedCost(goal.estimatedCost || 0);
      setAmountDesired(goal.amountDesired || 0);
      setRepeats(goal.repeats || "Monthly");
      setAnnualInflationType(goal.annualInflationType || "None");
      setAnnualInflationRate(goal.annualInflationRate || 2);
    }
  }, [goal]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    onTitleUpdate?.(e.target.value, owner);
  };

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwner(e.target.value);
    onTitleUpdate?.(name, e.target.value);
  };

  const handleTypeChange = (value: string) => {
    setType(value);
  };

  const handleTargetDateChange = (date: Date | undefined) => {
    setTargetDate(date);
  };

  const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTargetAmount(isNaN(value) ? 0 : value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleDateOfBirthChange = (date: Date | undefined) => {
    setDateOfBirth(date);
  };

  const handleRetirementAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setTargetRetirementAge(isNaN(value) ? 0 : value);
  };

  const handlePlanningHorizonAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPlanningHorizonAge(isNaN(value) ? 0 : value);
  };
  
  const handlePurchasePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPurchasePrice(isNaN(value) ? 0 : value);
  };
  
  const handleFinancingMethodChange = (value: string) => {
    setFinancingMethod(value);
  };
  
  const handleAnnualAppreciationChange = (value: string) => {
    setAnnualAppreciation(value);
  };
  
  const handleStudentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentName(e.target.value);
  };
  
  const handleStartYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setStartYear(isNaN(value) ? new Date().getFullYear() : value);
  };
  
  const handleEndYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setEndYear(isNaN(value) ? new Date().getFullYear() + 4 : value);
  };
  
  const handleTuitionEstimateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTuitionEstimate(isNaN(value) ? 0 : value);
  };
  
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
  };
  
  const handleEstimatedCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setEstimatedCost(isNaN(value) ? 0 : value);
  };
  
  const handleAmountDesiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmountDesired(isNaN(value) ? 0 : value);
  };
  
  const handleRepeatsChange = (value: string) => {
    setRepeats(value);
  };
  
  const handleAnnualInflationTypeChange = (value: string) => {
    setAnnualInflationType(value);
  };
  
  const handleAnnualInflationRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAnnualInflationRate(isNaN(value) ? 2 : value);
  };

  const handleSave = () => {
    const goalData: GoalFormData = {
      name,
      owner,
      type,
      targetDate,
      targetAmount,
      description,
      dateOfBirth,
      targetRetirementAge,
      planningHorizonAge,
      purchasePrice,
      financingMethod,
      annualAppreciation,
      studentName,
      startYear,
      endYear,
      tuitionEstimate,
      destination,
      estimatedCost,
      amountDesired,
      repeats,
      annualInflationType,
      annualInflationRate,
    };
    onSave(goalData);
  };

  const FormContent = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">Goal Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={handleNameChange} 
          placeholder="e.g. Retirement" 
        />
      </div>
      
      <div>
        <Label htmlFor="owner">Owner</Label>
        <Input 
          id="owner" 
          value={owner} 
          onChange={handleOwnerChange} 
          placeholder="e.g. Antonio" 
        />
      </div>
      
      <div>
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Retirement">Retirement</SelectItem>
            <SelectItem value="Asset Purchase">Asset Purchase</SelectItem>
            <SelectItem value="Home Purchase">Home Purchase</SelectItem>
            <SelectItem value="Vehicle">Vehicle</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Vacation">Vacation</SelectItem>
            <SelectItem value="Cash Reserve">Cash Reserve</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {type !== "Retirement" && (
        <div>
          <Label>Target Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !targetDate && "text-muted-foreground"
                )}
              >
                {targetDate ? (
                  format(targetDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={targetDate}
                onSelect={handleTargetDateChange}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      {type !== "Retirement" && (
        <div>
          <Label htmlFor="targetAmount">Target Amount</Label>
          <Input
            id="targetAmount"
            type="number"
            placeholder="e.g. 100000"
            value={targetAmount.toString()}
            onChange={handleTargetAmountChange}
          />
        </div>
      )}
      
      {type === "Asset Purchase" && (
        <>
          <div>
            <Label htmlFor="purchasePrice">Purchase Price</Label>
            <Input
              id="purchasePrice"
              type="number"
              placeholder="e.g. 500000"
              value={purchasePrice.toString()}
              onChange={handlePurchasePriceChange}
            />
          </div>
          
          <div>
            <Label htmlFor="financingMethod">Financing Method</Label>
            <Select value={financingMethod} onValueChange={handleFinancingMethodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Loan">Loan</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="annualAppreciation">Annual Appreciation</Label>
            <Select value={annualAppreciation} onValueChange={handleAnnualAppreciationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Low">Low (2%)</SelectItem>
                <SelectItem value="Medium">Medium (5%)</SelectItem>
                <SelectItem value="High">High (8%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      
      {type === "Home Purchase" && (
        <>
          <div>
            <Label htmlFor="purchasePrice">Purchase Price</Label>
            <Input
              id="purchasePrice"
              type="number"
              placeholder="e.g. 500000"
              value={purchasePrice.toString()}
              onChange={handlePurchasePriceChange}
            />
          </div>
          
          <div>
            <Label htmlFor="financingMethod">Financing Method</Label>
            <Select value={financingMethod} onValueChange={handleFinancingMethodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Mortgage">Mortgage</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="annualAppreciation">Annual Appreciation</Label>
            <Select value={annualAppreciation} onValueChange={handleAnnualAppreciationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Low">Low (3%)</SelectItem>
                <SelectItem value="Medium">Medium (6%)</SelectItem>
                <SelectItem value="High">High (9%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      
      {type === "Vehicle" && (
        <>
          <div>
            <Label htmlFor="purchasePrice">Purchase Price</Label>
            <Input
              id="purchasePrice"
              type="number"
              placeholder="e.g. 30000"
              value={purchasePrice.toString()}
              onChange={handlePurchasePriceChange}
            />
          </div>
          
          <div>
            <Label htmlFor="financingMethod">Financing Method</Label>
            <Select value={financingMethod} onValueChange={handleFinancingMethodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Loan">Loan</SelectItem>
                <SelectItem value="Lease">Lease</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      
      {type === "Education" && (
        <>
          <div>
            <Label htmlFor="studentName">Student Name</Label>
            <Input
              id="studentName"
              type="text"
              placeholder="e.g. John Doe"
              value={studentName}
              onChange={handleStudentNameChange}
            />
          </div>
          
          <div>
            <Label htmlFor="tuitionEstimate">Tuition Estimate</Label>
            <Input
              id="tuitionEstimate"
              type="number"
              placeholder="e.g. 20000"
              value={tuitionEstimate.toString()}
              onChange={handleTuitionEstimateChange}
            />
          </div>
          
          <div className="flex space-x-2">
            <div>
              <Label htmlFor="startYear">Start Year</Label>
              <Input
                id="startYear"
                type="number"
                placeholder="e.g. 2024"
                value={startYear.toString()}
                onChange={handleStartYearChange}
              />
            </div>
            
            <div>
              <Label htmlFor="endYear">End Year</Label>
              <Input
                id="endYear"
                type="number"
                placeholder="e.g. 2028"
                value={endYear.toString()}
                onChange={handleEndYearChange}
              />
            </div>
          </div>
        </>
      )}
      
      {type === "Vacation" && (
        <>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              type="text"
              placeholder="e.g. Paris"
              value={destination}
              onChange={handleDestinationChange}
            />
          </div>
          
          <div>
            <Label htmlFor="estimatedCost">Estimated Cost</Label>
            <Input
              id="estimatedCost"
              type="number"
              placeholder="e.g. 5000"
              value={estimatedCost.toString()}
              onChange={handleEstimatedCostChange}
            />
          </div>
        </>
      )}
      
      {type === "Cash Reserve" && (
        <>
          <div>
            <Label htmlFor="amountDesired">Amount Desired</Label>
            <Input
              id="amountDesired"
              type="number"
              placeholder="e.g. 10000"
              value={amountDesired.toString()}
              onChange={handleAmountDesiredChange}
            />
          </div>
          
          <div>
            <Label htmlFor="annualAppreciation">Annual Appreciation</Label>
            <Select value={annualAppreciation} onValueChange={handleAnnualAppreciationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Low">Low (1%)</SelectItem>
                <SelectItem value="Medium">Medium (2%)</SelectItem>
                <SelectItem value="High">High (3%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="repeats">Repeats</Label>
            <Select value={repeats} onValueChange={handleRepeatsChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Annually">Annually</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {type === "Retirement" && (
        <>
          <div>
            <Label>Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !dateOfBirth && "text-muted-foreground"
                  )}
                >
                  {dateOfBirth ? (
                    format(dateOfBirth, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateOfBirth}
                  onSelect={handleDateOfBirthChange}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="targetRetirementAge">Target Retirement Age</Label>
            <Input
              id="targetRetirementAge"
              type="number"
              placeholder="e.g. 65"
              value={targetRetirementAge.toString()}
              onChange={handleRetirementAgeChange}
            />
          </div>
          
          <div>
            <Label htmlFor="planningHorizonAge">Planning Horizon (Years)</Label>
            <Input
              id="planningHorizonAge"
              type="number"
              placeholder="e.g. 30"
              value={planningHorizonAge.toString()}
              onChange={handlePlanningHorizonAgeChange}
            />
          </div>
        </>
      )}
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your goal"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      
      <div>
        <Label htmlFor="annualInflationType">Annual Inflation</Label>
        <Select value={annualInflationType} onValueChange={handleAnnualInflationTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a rate" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">None</SelectItem>
            <SelectItem value="General">General (2%)</SelectItem>
            <SelectItem value="Custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {annualInflationType === "Custom" && (
        <div>
          <Label htmlFor="annualInflationRate">Custom Inflation Rate (%)</Label>
          <Input
            id="annualInflationRate"
            type="number"
            placeholder="e.g. 3"
            value={annualInflationRate.toString()}
            onChange={handleAnnualInflationRateChange}
          />
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );

  if (isDialog) {
    return <FormContent />;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full max-w-2xl overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <SheetTitle className="text-xl font-semibold">{title}</SheetTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        <FormContent />
      </SheetContent>
    </Sheet>
  );
}
