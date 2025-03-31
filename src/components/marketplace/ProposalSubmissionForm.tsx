
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Calendar,
  Check,
  Clock,
  DollarSign,
  Upload,
  FileText,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProposalSubmissionFormProps {
  rfpId: string;
}

export function ProposalSubmissionForm({ rfpId }: ProposalSubmissionFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalData, setProposalData] = useState({
    title: "",
    description: "",
    serviceType: "",
    approachDetails: "",
    pricingType: "fixed",
    pricingAmount: "",
    timelineWeeks: "",
    milestones: [
      { title: "Initial Consultation", amount: "", description: "", dueDate: "" },
      { title: "Strategy Development", amount: "", description: "", dueDate: "" }
    ],
    supportingDocs: []
  });
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProposalData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePricingTypeChange = (value: string) => {
    setProposalData(prev => ({ ...prev, pricingType: value }));
  };
  
  const handleMilestoneChange = (index: number, field: string, value: string) => {
    setProposalData(prev => {
      const updatedMilestones = [...prev.milestones];
      updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
      return { ...prev, milestones: updatedMilestones };
    });
  };
  
  const addMilestone = () => {
    setProposalData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { title: "", amount: "", description: "", dueDate: "" }]
    }));
  };
  
  const removeMilestone = (index: number) => {
    if (proposalData.milestones.length <= 2) {
      toast.error("At least two milestones are required");
      return;
    }
    
    setProposalData(prev => {
      const updatedMilestones = [...prev.milestones];
      updatedMilestones.splice(index, 1);
      return { ...prev, milestones: updatedMilestones };
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, you would upload the files to storage
      // For now, we'll just add the file names to our state
      const fileNames = Array.from(files).map(file => file.name);
      setProposalData(prev => ({
        ...prev,
        supportingDocs: [...prev.supportingDocs, ...fileNames]
      }));
      
      // Reset the file input
      e.target.value = "";
      toast.success("Files attached successfully");
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to submit proposal
    setTimeout(() => {
      toast.success("Proposal submitted successfully!");
      setIsSubmitting(false);
      navigate("/marketplace/payments");
    }, 1500);
  };
  
  const nextStep = () => {
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const formatCurrency = (value: string) => {
    if (!value) return "";
    return `$${parseInt(value).toLocaleString()}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">Submit Your Proposal</h2>
        <div className="text-sm text-muted-foreground">
          Step {step} of 4
        </div>
      </div>
      
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Proposal Title</Label>
              <Input
                id="title"
                name="title"
                value={proposalData.title}
                onChange={handleChange}
                placeholder="Enter a clear, concise title for your proposal"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Executive Summary</Label>
              <Textarea
                id="description"
                name="description"
                value={proposalData.description}
                onChange={handleChange}
                placeholder="Provide a brief overview of your proposal and how you'll address the client's needs"
                rows={4}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Input
                id="serviceType"
                name="serviceType"
                value={proposalData.serviceType}
                onChange={handleChange}
                placeholder="E.g., Tax Planning, Wealth Management, Estate Planning"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="approachDetails">Proposed Approach & Methodology</Label>
              <Textarea
                id="approachDetails"
                name="approachDetails"
                value={proposalData.approachDetails}
                onChange={handleChange}
                placeholder="Explain your approach, methodology, and how you will deliver the requested services"
                rows={6}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={nextStep} className="gap-2">
              Continue to Pricing <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label>Pricing Structure</Label>
                  <RadioGroup 
                    value={proposalData.pricingType} 
                    onValueChange={handlePricingTypeChange}
                    className="flex flex-col space-y-2 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed" className="cursor-pointer">Fixed Fee</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hourly" id="hourly" />
                      <Label htmlFor="hourly" className="cursor-pointer">Hourly Rate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="milestone" id="milestone" />
                      <Label htmlFor="milestone" className="cursor-pointer">Milestone-Based (Escrow)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {proposalData.pricingType !== "milestone" && (
                  <div>
                    <Label htmlFor="pricingAmount">
                      {proposalData.pricingType === "fixed" ? "Total Fixed Fee" : "Hourly Rate"}
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="pricingAmount"
                        name="pricingAmount"
                        value={proposalData.pricingAmount}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder={proposalData.pricingType === "fixed" ? "10000" : "250"}
                        type="number"
                        required
                      />
                    </div>
                  </div>
                )}
                
                {proposalData.pricingType === "milestone" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Milestones & Payment Schedule</Label>
                      <Button variant="outline" size="sm" onClick={addMilestone} type="button">
                        Add Milestone
                      </Button>
                    </div>
                    
                    {proposalData.milestones.map((milestone, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="grid gap-4">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-sm">Milestone {index + 1}</h4>
                              {index >= 2 && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeMilestone(index)}
                                  className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                            
                            <div>
                              <Label htmlFor={`milestone-${index}-title`}>Title</Label>
                              <Input
                                id={`milestone-${index}-title`}
                                value={milestone.title}
                                onChange={(e) => handleMilestoneChange(index, "title", e.target.value)}
                                placeholder="Milestone Title"
                                required
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`milestone-${index}-amount`}>Amount</Label>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                  <Input
                                    id={`milestone-${index}-amount`}
                                    value={milestone.amount}
                                    onChange={(e) => handleMilestoneChange(index, "amount", e.target.value)}
                                    className="pl-10"
                                    placeholder="5000"
                                    type="number"
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`milestone-${index}-dueDate`}>Expected Completion Date</Label>
                                <Input
                                  id={`milestone-${index}-dueDate`}
                                  type="date"
                                  value={milestone.dueDate}
                                  onChange={(e) => handleMilestoneChange(index, "dueDate", e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor={`milestone-${index}-description`}>Deliverables</Label>
                              <Textarea
                                id={`milestone-${index}-description`}
                                value={milestone.description}
                                onChange={(e) => handleMilestoneChange(index, "description", e.target.value)}
                                placeholder="Describe what will be delivered in this milestone"
                                rows={2}
                                required
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="bg-muted/50 p-4 rounded-md">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Secure Milestone Payments
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        With milestone-based payments, funds for each milestone are held in secure escrow and only released
                        when the client approves the completed work. This protects both parties and ensures clear deliverables.
                      </p>
                    </div>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="timelineWeeks">Total Project Timeline (weeks)</Label>
                  <Input
                    id="timelineWeeks"
                    name="timelineWeeks"
                    value={proposalData.timelineWeeks}
                    onChange={handleChange}
                    placeholder="E.g., 4, 8, 12"
                    type="number"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep} className="gap-2">
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <Label className="block mb-2">Supporting Documents (Optional)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 text-center">
                  <Upload className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here, or click to select files
                  </p>
                  <div className="relative">
                    <Input
                      id="file-upload"
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      multiple
                    />
                    <Button variant="outline" type="button">
                      Select Files
                    </Button>
                  </div>
                </div>
              </div>
              
              {proposalData.supportingDocs.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Attached Documents:</h4>
                  <ul className="space-y-2">
                    {proposalData.supportingDocs.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Communication Options</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">Secure Messaging</h5>
                      <p className="text-xs text-muted-foreground">
                        Available within the platform
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">Consultation Call</h5>
                      <p className="text-xs text-muted-foreground">
                        Schedule a consultation with the client
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep} className="gap-2">
              Review Proposal <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Review Your Proposal
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-sm">Proposal Title</Label>
                      <p className="font-medium">{proposalData.title}</p>
                    </div>
                    
                    <div>
                      <Label className="text-muted-foreground text-sm">Service Type</Label>
                      <p className="font-medium">{proposalData.serviceType}</p>
                    </div>
                    
                    <div>
                      <Label className="text-muted-foreground text-sm">Timeline</Label>
                      <p className="font-medium">{proposalData.timelineWeeks} weeks</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-muted-foreground text-sm">Executive Summary</Label>
                    <p className="mt-1">{proposalData.description}</p>
                  </div>
                  
                  <div>
                    <Label className="text-muted-foreground text-sm">Approach & Methodology</Label>
                    <p className="mt-1">{proposalData.approachDetails}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-muted-foreground text-sm mb-2 block">Pricing Structure</Label>
                    <div className="flex items-center gap-2 font-medium">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      {proposalData.pricingType === "fixed" && 
                        <span>Fixed Fee: {formatCurrency(proposalData.pricingAmount)}</span>
                      }
                      
                      {proposalData.pricingType === "hourly" && 
                        <span>Hourly Rate: {formatCurrency(proposalData.pricingAmount)} per hour</span>
                      }
                      
                      {proposalData.pricingType === "milestone" && 
                        <span>Milestone-Based Payments (Secure Escrow)</span>
                      }
                    </div>
                    
                    {proposalData.pricingType === "milestone" && (
                      <div className="mt-4 space-y-3">
                        {proposalData.milestones.map((milestone, index) => (
                          <div key={index} className="bg-muted/30 p-3 rounded-md">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{milestone.title}</span>
                              <span className="font-medium">{formatCurrency(milestone.amount)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>Due: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : "Not specified"}</span>
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex justify-between font-medium pt-2">
                          <span>Total Project Cost:</span>
                          <span>
                            {formatCurrency(
                              proposalData.milestones
                                .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0)
                                .toString()
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {proposalData.supportingDocs.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <Label className="text-muted-foreground text-sm">Supporting Documents</Label>
                        <ul className="mt-2 space-y-1">
                          {proposalData.supportingDocs.map((doc, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm">
            <p className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">⚠️</span>
              <span>
                By submitting this proposal, you agree to the Marketplace terms and conditions.
                If your proposal is accepted and includes milestone-based payments, you acknowledge that
                payments will be held in escrow until the client approves each milestone.
              </span>
            </p>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} type="button">
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Proposal"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
