import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X, Target, User, DollarSign, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Goal } from "./GoalsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    <div className="space-y-8 max-h-[80vh] overflow-y-auto p-1">
      {/* Basic Information Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-purple-200">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg">
            <Target className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
            Goal Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Goal Name
            </Label>
            <Input 
              id="name" 
              value={name} 
              onChange={handleNameChange} 
              placeholder="e.g. Retirement, New Home, Vacation"
              className="h-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="owner" className="text-sm font-medium text-gray-700">
              Owner
            </Label>
            <Input 
              id="owner" 
              value={owner} 
              onChange={handleOwnerChange} 
              placeholder="e.g. Antonio, Maria"
              className="h-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium text-gray-700">Goal Type</Label>
          <Select value={type} onValueChange={handleTypeChange}>
            <SelectTrigger className="h-10 focus:ring-2 focus:ring-purple-500">
              <SelectValue placeholder="Select a goal type" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg">
              <SelectItem value="Retirement">🏖️ Retirement</SelectItem>
              <SelectItem value="Asset Purchase">📈 Asset Purchase</SelectItem>
              <SelectItem value="Home Purchase">🏠 Home Purchase</SelectItem>
              <SelectItem value="Vehicle">🚗 Vehicle</SelectItem>
              <SelectItem value="Education">🎓 Education</SelectItem>
              <SelectItem value="Vacation">✈️ Vacation</SelectItem>
              <SelectItem value="Cash Reserve">💰 Cash Reserve</SelectItem>
              <SelectItem value="Other">📋 Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Financial Details Section */}
      {type && type !== "Retirement" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-emerald-200">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              Financial Details
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Target Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-10 pl-3 text-left font-normal",
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
                <PopoverContent className="w-auto p-0 bg-white border shadow-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={targetDate}
                    onSelect={handleTargetDateChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount" className="text-sm font-medium text-gray-700">
                Target Amount
              </Label>
              <Input
                id="targetAmount"
                type="number"
                placeholder="e.g. 100,000"
                value={targetAmount.toString()}
                onChange={handleTargetAmountChange}
                className="h-10 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Type-specific Details */}
      {(type === "Asset Purchase" || type === "Home Purchase" || type === "Vehicle") && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-blue-200">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-700 bg-clip-text text-transparent">
              Purchase Details
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchasePrice" className="text-sm font-medium text-gray-700">Purchase Price</Label>
              <Input
                id="purchasePrice"
                type="number"
                placeholder="e.g. 500,000"
                value={purchasePrice.toString()}
                onChange={handlePurchasePriceChange}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="financingMethod" className="text-sm font-medium text-gray-700">Financing Method</Label>
              <Select value={financingMethod} onValueChange={handleFinancingMethodChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select financing" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg">
                  <SelectItem value="Cash">💵 Cash</SelectItem>
                  {type === "Home Purchase" ? (
                    <SelectItem value="Mortgage">🏦 Mortgage</SelectItem>
                  ) : type === "Vehicle" ? (
                    <>
                      <SelectItem value="Loan">💳 Loan</SelectItem>
                      <SelectItem value="Lease">📄 Lease</SelectItem>
                    </>
                  ) : (
                    <SelectItem value="Loan">💳 Loan</SelectItem>
                  )}
                  <SelectItem value="Other">📋 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(type === "Asset Purchase" || type === "Home Purchase") && (
            <div className="space-y-2">
              <Label htmlFor="annualAppreciation" className="text-sm font-medium text-gray-700">Annual Appreciation</Label>
              <Select value={annualAppreciation} onValueChange={handleAnnualAppreciationChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select appreciation rate" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg">
                  <SelectItem value="None">📊 None</SelectItem>
                  {type === "Home Purchase" ? (
                    <>
                      <SelectItem value="Low">📈 Low (3%)</SelectItem>
                      <SelectItem value="Medium">📈 Medium (6%)</SelectItem>
                      <SelectItem value="High">📈 High (9%)</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Low">📈 Low (2%)</SelectItem>
                      <SelectItem value="Medium">📈 Medium (5%)</SelectItem>
                      <SelectItem value="High">📈 High (8%)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Education Details */}
      {type === "Education" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-amber-200">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent">
              🎓 Education Details
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentName" className="text-sm font-medium text-gray-700">Student Name</Label>
              <Input
                id="studentName"
                type="text"
                placeholder="e.g. John Doe"
                value={studentName}
                onChange={handleStudentNameChange}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tuitionEstimate" className="text-sm font-medium text-gray-700">Annual Tuition Estimate</Label>
              <Input
                id="tuitionEstimate"
                type="number"
                placeholder="e.g. 20,000"
                value={tuitionEstimate.toString()}
                onChange={handleTuitionEstimateChange}
                className="h-10"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startYear" className="text-sm font-medium text-gray-700">Start Year</Label>
                <Input
                  id="startYear"
                  type="number"
                  placeholder="e.g. 2024"
                  value={startYear.toString()}
                  onChange={handleStartYearChange}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endYear" className="text-sm font-medium text-gray-700">End Year</Label>
                <Input
                  id="endYear"
                  type="number"
                  placeholder="e.g. 2028"
                  value={endYear.toString()}
                  onChange={handleEndYearChange}
                  className="h-10"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vacation Details */}
      {type === "Vacation" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-sky-200">
            <div className="p-2 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              ✈️ Vacation Details
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-medium text-gray-700">Destination</Label>
              <Input
                id="destination"
                type="text"
                placeholder="e.g. Paris, Tokyo, Maldives"
                value={destination}
                onChange={handleDestinationChange}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedCost" className="text-sm font-medium text-gray-700">Estimated Cost</Label>
              <Input
                id="estimatedCost"
                type="number"
                placeholder="e.g. 5,000"
                value={estimatedCost.toString()}
                onChange={handleEstimatedCostChange}
                className="h-10"
              />
            </div>
          </div>
        </div>
      )}

      {/* Cash Reserve Details */}
      {type === "Cash Reserve" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-green-200">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
              💰 Cash Reserve Details
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amountDesired" className="text-sm font-medium text-gray-700">Amount Desired</Label>
              <Input
                id="amountDesired"
                type="number"
                placeholder="e.g. 10,000"
                value={amountDesired.toString()}
                onChange={handleAmountDesiredChange}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="repeats" className="text-sm font-medium text-gray-700">Contribution Frequency</Label>
              <Select value={repeats} onValueChange={handleRepeatsChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg">
                  <SelectItem value="Monthly">📅 Monthly</SelectItem>
                  <SelectItem value="Quarterly">📅 Quarterly</SelectItem>
                  <SelectItem value="Annually">📅 Annually</SelectItem>
                  <SelectItem value="None">❌ None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualAppreciation" className="text-sm font-medium text-gray-700">Annual Appreciation</Label>
              <Select value={annualAppreciation} onValueChange={handleAnnualAppreciationChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select appreciation rate" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg">
                  <SelectItem value="None">📊 None</SelectItem>
                  <SelectItem value="Low">📈 Low (1%)</SelectItem>
                  <SelectItem value="Medium">📈 Medium (2%)</SelectItem>
                  <SelectItem value="High">📈 High (3%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Retirement Details */}
      {type === "Retirement" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-rose-200">
            <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-700 bg-clip-text text-transparent">
              🏖️ Retirement Planning
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-10 pl-3 text-left font-normal",
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
                <PopoverContent className="w-auto p-0 bg-white border shadow-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={dateOfBirth}
                    onSelect={handleDateOfBirthChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetRetirementAge" className="text-sm font-medium text-gray-700">Target Retirement Age</Label>
                <Input
                  id="targetRetirementAge"
                  type="number"
                  placeholder="e.g. 65"
                  value={targetRetirementAge.toString()}
                  onChange={handleRetirementAgeChange}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="planningHorizonAge" className="text-sm font-medium text-gray-700">Planning Horizon (Years)</Label>
                <Input
                  id="planningHorizonAge"
                  type="number"
                  placeholder="e.g. 30"
                  value={planningHorizonAge.toString()}
                  onChange={handlePlanningHorizonAgeChange}
                  className="h-10"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Information Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
          <div className="p-2 bg-gradient-to-r from-slate-500 to-gray-600 rounded-xl shadow-lg">
            <Target className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-gray-700 bg-clip-text text-transparent">
            📝 Additional Information
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your goal in more detail..."
              value={description}
              onChange={handleDescriptionChange}
              className="min-h-[100px] resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="annualInflationType" className="text-sm font-medium text-gray-700">Annual Inflation</Label>
            <Select value={annualInflationType} onValueChange={handleAnnualInflationTypeChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select inflation type" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                <SelectItem value="None">❌ None</SelectItem>
                <SelectItem value="General">📊 General (2%)</SelectItem>
                <SelectItem value="Custom">⚙️ Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {annualInflationType === "Custom" && (
            <div className="space-y-2">
              <Label htmlFor="annualInflationRate" className="text-sm font-medium text-gray-700">Custom Inflation Rate (%)</Label>
              <Input
                id="annualInflationRate"
                type="number"
                placeholder="e.g. 3"
                value={annualInflationRate.toString()}
                onChange={handleAnnualInflationRateChange}
                className="h-10"
              />
            </div>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 pb-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="px-6 py-2 h-10"
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={handleSave}
          className="px-6 py-2 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
        >
          Save Goal
        </Button>
      </div>
    </div>
  );

  if (isDialog) {
    return <FormContent />;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full max-w-4xl overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <SheetTitle className="text-2xl font-bold">{title}</SheetTitle>
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
