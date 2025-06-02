
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { PlusCircle, Building, Link2 } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const FundingAccounts = () => {
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showAddManualModal, setShowAddManualModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [verificationFile, setVerificationFile] = useState<File | null>(null);

  // Sample linked accounts - in a real app, this would come from an API or context
  const linkedAccounts = [
    { id: "acc1", name: "Chase Checking ****4582" },
    { id: "acc2", name: "Bank of America Savings ****7839" },
    { id: "acc3", name: "Wells Fargo Money Market ****9214" }
  ];

  // Account types for dropdown
  const accountTypes = ["Checking", "Savings", "Money Market", "Other"];

  // States for dropdown
  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
    "New Hampshire", "New Jersey", "New Mexico", "New York", 
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
    "West Virginia", "Wisconsin", "Wyoming"
  ];

  // Form setup
  const form = useForm({
    defaultValues: {
      bankName: "",
      accountHolderName: "",
      accountTitle: "",
      accountType: "",
      bankCity: "",
      bankState: "",
      accountNumber: "",
      routingNumber: "",
    },
  });

  const handleSelectAccount = (account: string) => {
    setSelectedAccount(account);
  };

  const handleSaveSelectedAccount = () => {
    if (selectedAccount) {
      const accountName = linkedAccounts.find(acc => acc.id === selectedAccount)?.name;
      toast.success(`Account ${accountName} selected as funding account`);
      setShowSelectModal(false);
      // Reset selection after closing
      setSelectedAccount(null);
    }
  };

  const handleFileChange = (file: File) => {
    setVerificationFile(file);
    console.log("Verification file selected:", file.name);
  };

  const handleManualAccountSubmit = (values: any) => {
    console.log("Manual account form values:", values);
    console.log("Verification file:", verificationFile);
    
    // In a real app, you would send this data to your backend
    toast.success("Account added successfully");
    setShowAddManualModal(false);
    form.reset();
    setVerificationFile(null);
  };

  return (
    <ThreeColumnLayout title="Cash Management - Funding Accounts">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Cash Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your funding accounts for transfers and payments.
          </p>
        </div>

        {/* Funding Accounts Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Funding Accounts</CardTitle>
              <CardDescription>
                Select or add a funding account to use for transfers and payments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Funding accounts are used to fund your transfers, payments, and investments. 
                  You can select an existing linked account or add a new one manually.
                </p>
                
                <Button 
                  className="w-full md:w-auto mt-4 flex items-center" 
                  onClick={() => setShowSelectModal(true)}
                >
                  <Link2 className="mr-2 h-4 w-4" />
                  Select a Funding Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Select Account Modal */}
        <Dialog open={showSelectModal} onOpenChange={setShowSelectModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Select a Funding Account</DialogTitle>
              <DialogDescription>
                Please select a linked institution from the dropdown.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account">Select an account</Label>
                  <Select value={selectedAccount || ""} onValueChange={handleSelectAccount}>
                    <SelectTrigger id="account">
                      <SelectValue placeholder="Select an account..." />
                    </SelectTrigger>
                    <SelectContent>
                      {linkedAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  If you need to add a new account, go to the{" "}
                  <Link to="/client-accounts" className="text-primary hover:underline">
                    Accounts section
                  </Link>{" "}
                  and click Add Account.
                </p>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row justify-between items-center">
              <Button 
                variant="outline" 
                type="button" 
                className="w-full sm:w-auto" 
                onClick={() => {
                  setShowSelectModal(false);
                  setShowAddManualModal(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Account Manually
              </Button>
              <div className="flex gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setShowSelectModal(false)}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleSaveSelectedAccount}
                  disabled={!selectedAccount}
                  className="flex-1 sm:flex-none"
                >
                  Save
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Manual Account Modal */}
        <Dialog open={showAddManualModal} onOpenChange={setShowAddManualModal}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Account Manually</DialogTitle>
              <DialogDescription>
                Enter the details of your funding account.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleManualAccountSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bank name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountHolderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account holder name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="accountTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account title" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accountTypes.map((type) => (
                              <SelectItem key={type} value={type.toLowerCase()}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bankCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bank city" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bankState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank State</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account #</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing #</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter routing number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Verification</Label>
                  <FileUpload
                    onFileChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSize={10 * 1024 * 1024}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a bank statement or voided check associated with this funding account.
                  </p>
                </div>

                <DialogFooter className="pt-4">
                  <Button variant="outline" type="button" onClick={() => setShowAddManualModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </ThreeColumnLayout>
  );
};

export default FundingAccounts;
