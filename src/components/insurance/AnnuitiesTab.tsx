import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { useInsuranceStore } from "@/hooks/useInsuranceStore";
import { InsurancePolicyCard } from "./InsurancePolicyCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Policy name is required" }),
  provider: z.string().min(2, { message: "Provider name is required" }),
  premium: z.number().min(0),
  frequency: z.enum(["monthly", "quarterly", "annually"]),
  coverageAmount: z.number().min(0),
  startDate: z.string(),
  endDate: z.string().optional(),
  policyNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const AnnuitiesTab = () => {
  const { policies, addPolicy, removePolicy } = useInsuranceStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  
  const annuityPolicies = policies.filter(policy => policy.type === "annuity");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
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
      type: "annuity",
      provider: data.provider,
      premium: data.premium,
      frequency: data.frequency,
      coverageAmount: data.coverageAmount,
      coverage: data.coverageAmount,
      status: "active",
      startDate: data.startDate,
      endDate: data.endDate || "",
      renewalDate: new Date(new Date(data.startDate).setFullYear(new Date(data.startDate).getFullYear() + 1)).toISOString().split('T')[0],
      policyNumber: data.policyNumber || "",
      documents: [],
    });
    
    setIsAddDialogOpen(false);
    form.reset();
    
    toast.success("Annuity added", {
      description: `${data.name} has been added to your annuities.`,
    });
  };
  
  const handleFileUpload = (file: File) => {
    if (!selectedPolicyId) return;
    
    // In a real app, this would upload the file to storage
    // and add a reference to the policy
    toast.success("Document uploaded", {
      description: `${file.name} has been attached to your annuity.`,
    });
    
    setIsUploadingDocument(false);
    setSelectedPolicyId(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Annuities</h2>
          <p className="text-muted-foreground">
            Manage your annuity contracts and payments
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Annuity
        </Button>
      </div>
      
      {annuityPolicies.length === 0 ? (
        <Card className="p-8 flex flex-col items-center justify-center text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Annuities</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            You haven't added any annuities yet. Add your first annuity to
            start tracking your retirement income.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Annuity
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {annuityPolicies.map((policy) => (
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
      
      {/* Add Annuity Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Annuity</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annuity Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Retirement Annuity" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Northwestern Mutual" {...field} />
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
                      <FormLabel>Premium/Contribution</FormLabel>
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
                      <FormLabel>Annuity Value</FormLabel>
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
                      <FormLabel>Maturity Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional - when the annuity matures
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Annuity</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Upload Document Dialog */}
      <Dialog open={isUploadingDocument} onOpenChange={setIsUploadingDocument}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Upload Annuity Document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload documents related to this annuity such as policy declarations, 
              beneficiary forms, or statements.
            </p>
            
            <Button 
              variant="outline" 
              className="w-full h-[120px] border-dashed flex flex-col gap-2"
              onClick={() => handleFileUpload(new File([], "sample-document.pdf"))}
            >
              <FileText className="h-8 w-8 mb-2" />
              <span>Click to upload document</span>
              <span className="text-xs text-muted-foreground">
                PDF, Word, or Image files
              </span>
            </Button>
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
