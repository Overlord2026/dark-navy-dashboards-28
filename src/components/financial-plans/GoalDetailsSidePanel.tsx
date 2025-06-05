import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Goal {
  id: string;
  title?: string;
  name?: string;
  type?: string;
  priority?: string;
  targetDate?: Date;
  targetAmount?: number;
  currentAmount?: number;
  owner?: string;
  description?: string;
  purchasePrice?: number;
  financingMethod?: string;
  annualAppreciation?: string;
  dateOfBirth?: Date;
  targetRetirementAge?: number;
  planningHorizonAge?: number;
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
  isNew?: boolean;
}

export interface GoalFormData {
  name: string;
  type: string;
  priority: string;
  targetDate?: Date | undefined;
  targetAmount?: number;
  currentAmount?: number;
  owner: string;
  description?: string;
  purchasePrice?: number;
  financingMethod?: string;
  annualAppreciation?: string;
  dateOfBirth?: Date;
  targetRetirementAge?: number;
  planningHorizonAge?: number;
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
    name: goal?.name || '',
    type: goal?.type || 'Retirement',
    priority: goal?.priority || 'Medium',
    targetDate: goal?.targetDate || undefined,
    targetAmount: goal?.targetAmount || undefined,
    currentAmount: goal?.currentAmount || undefined,
    owner: goal?.owner || '',
    description: goal?.description || '',
    purchasePrice: goal?.purchasePrice || undefined,
    financingMethod: goal?.financingMethod || '',
    annualAppreciation: goal?.annualAppreciation || '',
    dateOfBirth: goal?.dateOfBirth || undefined,
    targetRetirementAge: goal?.targetRetirementAge || undefined,
    planningHorizonAge: goal?.planningHorizonAge || undefined,
    studentName: goal?.studentName || '',
    startYear: goal?.startYear || undefined,
    endYear: goal?.endYear || undefined,
    tuitionEstimate: goal?.tuitionEstimate || undefined,
    destination: goal?.destination || '',
    estimatedCost: goal?.estimatedCost || undefined,
    amountDesired: goal?.amountDesired || undefined,
    repeats: goal?.repeats || '',
    annualInflationType: goal?.annualInflationType || '',
    annualInflationRate: goal?.annualInflationRate || undefined,
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name || '',
        type: goal.type || 'Retirement',
        priority: goal.priority || 'Medium',
        targetDate: goal.targetDate || undefined,
        targetAmount: goal.targetAmount || undefined,
        currentAmount: goal.currentAmount || undefined,
        owner: goal.owner || '',
        description: goal.description || '',
        purchasePrice: goal.purchasePrice || undefined,
        financingMethod: goal.financingMethod || '',
        annualAppreciation: goal.annualAppreciation || '',
        dateOfBirth: goal.dateOfBirth || undefined,
        targetRetirementAge: goal.targetRetirementAge || undefined,
        planningHorizonAge: goal.planningHorizonAge || undefined,
        studentName: goal.studentName || '',
        startYear: goal.startYear || undefined,
        endYear: goal.endYear || undefined,
        tuitionEstimate: goal.tuitionEstimate || undefined,
        destination: goal.destination || '',
        estimatedCost: goal.estimatedCost || undefined,
        amountDesired: goal.amountDesired || undefined,
        repeats: goal.repeats || '',
        annualInflationType: goal.annualInflationType || '',
        annualInflationRate: goal.annualInflationRate || undefined,
      });
    }
  }, [goal]);

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handlePriorityChange = (value: string) => {
    setFormData(prev => ({ ...prev, priority: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, targetDate: date }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!isOpen && !isDialog) return null;

  const content = (
    <div className={cn(
      "space-y-6",
      isDialog ? "h-full" : "h-full overflow-y-auto"
    )}>
      {!isDialog && (
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name *</Label>
                <Input
                  id="goal-name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    onTitleUpdate?.(e.target.value, formData.owner);
                  }}
                  placeholder="Enter goal name"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goal-owner">Owner</Label>
                <Input
                  id="goal-owner"
                  value={formData.owner}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, owner: e.target.value }));
                    onTitleUpdate?.(formData.name, e.target.value);
                  }}
                  placeholder="Goal owner"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-type">Goal Type *</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select goal type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto z-50">
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
          </CardContent>
        </Card>

        {/* Retirement Goal */}
        {formData.type === 'Retirement' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Retirement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-of-birth">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dateOfBirth}
                        onSelect={(date) => handleDateChange(date)}
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-retirement-age">Target Retirement Age</Label>
                  <Input
                    id="target-retirement-age"
                    type="number"
                    value={formData.targetRetirementAge || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetRetirementAge: parseInt(e.target.value) }))}
                    placeholder="Enter target age"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="planning-horizon">Planning Horizon (Years)</Label>
                <Input
                  id="planning-horizon"
                  type="number"
                  value={formData.planningHorizonAge || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, planningHorizonAge: parseInt(e.target.value) }))}
                  placeholder="Enter planning horizon"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Asset Purchase Goal */}
        {formData.type === 'Asset Purchase' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Asset Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purchase-price">Purchase Price</Label>
                <Input
                  id="purchase-price"
                  type="number"
                  value={formData.purchasePrice || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: parseFloat(e.target.value) }))}
                  placeholder="Enter purchase price"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="financing-method">Financing Method</Label>
                <Input
                  id="financing-method"
                  type="text"
                  value={formData.financingMethod || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, financingMethod: e.target.value }))}
                  placeholder="Enter financing method"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual-appreciation">Annual Appreciation</Label>
                <Select value={formData.annualAppreciation} onValueChange={(value) => setFormData(prev => ({ ...prev, annualAppreciation: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select appreciation rate" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto z-50">
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="3%">3%</SelectItem>
                    <SelectItem value="5%">5%</SelectItem>
                    <SelectItem value="7%">7%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Home Purchase Goal */}
        {formData.type === 'Home Purchase' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Home Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purchase-price">Purchase Price</Label>
                <Input
                  id="purchase-price"
                  type="number"
                  value={formData.purchasePrice || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: parseFloat(e.target.value) }))}
                  placeholder="Enter purchase price"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="financing-method">Financing Method</Label>
                <Input
                  id="financing-method"
                  type="text"
                  value={formData.financingMethod || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, financingMethod: e.target.value }))}
                  placeholder="Enter financing method"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual-appreciation">Annual Appreciation</Label>
                <Select value={formData.annualAppreciation} onValueChange={(value) => setFormData(prev => ({ ...prev, annualAppreciation: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select appreciation rate" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto z-50">
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="3%">3%</SelectItem>
                    <SelectItem value="5%">5%</SelectItem>
                    <SelectItem value="7%">7%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vehicle Goal */}
        {formData.type === 'Vehicle' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purchase-price">Purchase Price</Label>
                <Input
                  id="purchase-price"
                  type="number"
                  value={formData.purchasePrice || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: parseFloat(e.target.value) }))}
                  placeholder="Enter purchase price"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="financing-method">Financing Method</Label>
                <Input
                  id="financing-method"
                  type="text"
                  value={formData.financingMethod || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, financingMethod: e.target.value }))}
                  placeholder="Enter financing method"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Education Goal */}
        {formData.type === 'Education' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Education Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-name">Student Name</Label>
                <Input
                  id="student-name"
                  type="text"
                  value={formData.studentName || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                  placeholder="Enter student name"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-year">Start Year</Label>
                  <Input
                    id="start-year"
                    type="number"
                    value={formData.startYear || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, startYear: parseInt(e.target.value) }))}
                    placeholder="Enter start year"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-year">End Year</Label>
                  <Input
                    id="end-year"
                    type="number"
                    value={formData.endYear || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, endYear: parseInt(e.target.value) }))}
                    placeholder="Enter end year"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tuition-estimate">Tuition Estimate</Label>
                <Input
                  id="tuition-estimate"
                  type="number"
                  value={formData.tuitionEstimate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, tuitionEstimate: parseFloat(e.target.value) }))}
                  placeholder="Enter tuition estimate"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vacation Goal */}
        {formData.type === 'Vacation' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vacation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  type="text"
                  value={formData.destination || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                  placeholder="Enter destination"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated-cost">Estimated Cost</Label>
                <Input
                  id="estimated-cost"
                  type="number"
                  value={formData.estimatedCost || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: parseFloat(e.target.value) }))}
                  placeholder="Enter estimated cost"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cash Reserve Goal */}
        {formData.type === 'Cash Reserve' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cash Reserve Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount-desired">Amount Desired</Label>
                <Input
                  id="amount-desired"
                  type="number"
                  value={formData.amountDesired || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, amountDesired: parseFloat(e.target.value) }))}
                  placeholder="Enter amount desired"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual-appreciation">Annual Appreciation</Label>
                <Select value={formData.annualAppreciation} onValueChange={(value) => setFormData(prev => ({ ...prev, annualAppreciation: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select appreciation rate" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto z-50">
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="3%">3%</SelectItem>
                    <SelectItem value="5%">5%</SelectItem>
                    <SelectItem value="7%">7%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repeats">Repeats</Label>
                <Select value={formData.repeats} onValueChange={(value) => setFormData(prev => ({ ...prev, repeats: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select repeat frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto z-50">
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Common Goal Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Goal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target-amount">Target Amount</Label>
              <Input
                id="target-amount"
                type="number"
                value={formData.targetAmount || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: parseFloat(e.target.value) }))}
                placeholder="Enter target amount"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter goal description"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annual-inflation">Annual Inflation</Label>
              <Select value={formData.annualInflationType} onValueChange={(value) => setFormData(prev => ({ ...prev, annualInflationType: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select inflation type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto z-50">
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="General">General (2%)</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.annualInflationType === "Custom" && (
              <div className="space-y-2">
                <Label htmlFor="annual-inflation-rate">Annual Inflation Rate (%)</Label>
                <Input
                  id="annual-inflation-rate"
                  type="number"
                  value={formData.annualInflationRate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, annualInflationRate: parseFloat(e.target.value) }))}
                  placeholder="Enter custom inflation rate"
                  className="w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
            {goal ? 'Update Goal' : 'Add Goal'}
          </Button>
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  if (isDialog) {
    return content;
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-50 w-96 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out border-l",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <ScrollArea className="h-full">
        <div className="p-6">
          {content}
        </div>
      </ScrollArea>
    </div>
  );
}
