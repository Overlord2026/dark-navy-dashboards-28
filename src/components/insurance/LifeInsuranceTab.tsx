
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Heart, Trash2, FileText, Upload, CheckCircle, XCircle } from "lucide-react";
import { useInsuranceStore } from "@/hooks/useInsuranceStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { zReq, zEnum } from "@/lib/zod-utils";
import { InsurancePolicyCard } from "./InsurancePolicyCard";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";

const POLICY_TYPES = ["term-life", "permanent-life"] as const;
const FREQUENCY_OPTIONS = ["monthly", "quarterly", "annually"] as const;

const formSchema = z.object({
  name: zReq("Policy name is required"),
  type: zEnum(POLICY_TYPES),
  provider: zReq("Provider name is required"),
  premium: z.number().min(0),
  frequency: zEnum(FREQUENCY_OPTIONS),
  coverageAmount: z.number().min(0),
  startDate: z.string(),
  endDate: z.string().optional(),
  beneficiaries: z.string().optional(),
  policyNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const LifeInsuranceTab = () => {
  const { policies, addPolicy, removePolicy } = useInsuranceStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  
  const lifeInsurancePolicies = policies.filter(
    policy => policy.type === "term-life" || policy.type === "permanent-life"
  );
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "term-life",
      provider: "",
      premium: 0,
      frequency: "annually",
      coverageAmount: 0,
      startDate: new Date().toISOString().split('T')[0],
      policyNumber: "",
    },
  });
  
  const onSubmit = (data: FormValues) => {
    addPolicy({
      id: `policy-${Date.now()}`,
      name: data.name,
      type: data.type,
      provider: data.provider,
      premium: data.premium,
      frequency: data.frequency,
      coverageAmount: data.coverageAmount,
      startDate: data.startDate,
      endDate: data.endDate,
      beneficiaries: data.beneficiaries,
      policyNumber: data.policyNumber,
      documents: [],
    });
    
    setIsAddDialogOpen(false);
    form.reset();
    
    toast.success("Policy added", {
      description: `${data.name} has been added to your life insurance policies.`,
    });
  };
  
  const handleFileUpload = (file: File) => {
    if (!selectedPolicyId) return;
    
    // In a real app, this would upload the file to storage
    // and add a reference to the policy
    toast.success("Document uploaded", {
      description: `${file.name} has been attached to your policy.`,
    });
    
    setIsUploadingDocument(false);
    setSelectedPolicyId(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Life Insurance</h2>
          <p className="text-muted-foreground">
            Manage your term and permanent life insurance policies
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Policy
        </Button>
      </div>
      
      {lifeInsurancePolicies.length === 0 ? (
        <Card className="p-8 flex flex-col items-center justify-center text-center">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Life Insurance Policies</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            You haven't added any life insurance policies yet. Add your first policy to
            start tracking your coverage.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Life Insurance Policy
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lifeInsurancePolicies.map((policy) => (
            <InsurancePolicyCard
              key={policy.id}
              policy={policy}
              onRemove={() => removePolicy(policy.id)}
              onUploadDocument={() => {
                setSelectedPolicyId(policy.id);
                setIsUploadingDocument(true);
              }}
            />
          ))}
        </div>
      )}
      
      {/* Add Policy Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Life Insurance Policy</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Term Life 20" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="term-life">Term Life</SelectItem>
                          <SelectItem value="permanent-life">Permanent Life</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Provider</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Prudential" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="policyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="premium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Premium Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="coverageAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coverage Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Term policies)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="beneficiaries"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Beneficiaries</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Jane Doe (Primary), John Doe (Secondary)" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the names of the policy beneficiaries
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Policy</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Upload Document Dialog */}
      <Dialog open={isUploadingDocument} onOpenChange={setIsUploadingDocument}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Upload Policy Document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload documents related to this policy such as policy declarations, 
              beneficiary forms, or premium statements.
            </p>
            
            <FileUpload
              onFileChange={handleFileUpload}
              accept="application/pdf,image/*,.doc,.docx"
              className="w-full"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadingDocument(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
