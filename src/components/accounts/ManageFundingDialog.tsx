
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Banknote, Plus, CreditCard, Wallet, PlusCircle, AlertCircle, Check, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUpload } from "@/components/ui/file-upload";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FundingAccount } from "@/hooks/useAccountManagement";

interface ManageFundingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: FundingAccount[];
  onRemoveAccount: (id: string) => boolean;
  onSetPrimary: (id: string) => boolean;
  onAddAccount: (account: Omit<FundingAccount, "id">) => FundingAccount;
}

const accountSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountTitle: z.string().min(1, "Account title is required"),
  accountNumber: z.string().min(4, "Account number is required"),
  routingNumber: z.string().min(9, "Routing number must be 9 digits").max(9),
  accountType: z.string().min(1, "Account type is required"),
});

export const ManageFundingDialog = ({ 
  isOpen, 
  onClose, 
  accounts,
  onRemoveAccount,
  onSetPrimary,
  onAddAccount
}: ManageFundingDialogProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("manage");
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      bankName: "",
      accountTitle: "",
      accountNumber: "",
      routingNumber: "",
      accountType: "",
    },
  });

  const handleFileChange = (file: File) => {
    setVerificationFile(file);
  };

  const onSubmit = (values: z.infer<typeof accountSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Create a new account name that mimics the format of existing accounts
      const accountName = `${values.bankName} ${values.accountType.charAt(0).toUpperCase() + values.accountType.slice(1)} ****${values.accountNumber.slice(-4)}`;
      
      onAddAccount({
        name: accountName,
        type: values.accountType,
      });
      
      form.reset();
      setVerificationFile(null);
      setIsAddingAccount(false);
      setActiveTab("manage");
    } catch (error) {
      console.error("Error adding account:", error);
      toast({
        title: "Error",
        description: "Failed to add account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAccount = (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmRemoveAccount = () => {
    if (confirmDeleteId) {
      onRemoveAccount(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const handleSetPrimary = (id: string) => {
    onSetPrimary(id);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Funding Accounts</DialogTitle>
            <DialogDescription>
              Add, edit, or remove accounts used for transfers and payments
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manage">Manage Accounts</TabsTrigger>
              <TabsTrigger value="add">Add Account</TabsTrigger>
            </TabsList>

            <TabsContent value="manage" className="py-4">
              {accounts.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    These accounts are currently set up as funding sources for transfers and payments.
                  </p>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium">{account.name}</TableCell>
                          <TableCell className="capitalize">{account.type}</TableCell>
                          <TableCell>
                            {account.isPrimary && (
                              <span className="inline-flex items-center rounded-full bg-green-100/10 px-2 py-1 text-xs font-medium text-green-500">
                                <Check className="mr-1 h-3 w-3" />
                                Primary
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {!account.isPrimary && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleSetPrimary(account.id)}
                                >
                                  Set Primary
                                </Button>
                              )}
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRemoveAccount(account.id)}
                              >
                                <Trash2 className="mr-1 h-4 w-4" />
                                Remove
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Button onClick={() => setActiveTab("add")} className="w-full mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Account
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">No funding accounts</h3>
                  <p className="text-center text-muted-foreground">
                    You haven't added any funding accounts yet. Add one to enable transfers and payments.
                  </p>
                  <Button onClick={() => setActiveTab("add")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Account
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="add" className="py-4">
              <div className="space-y-4">
                {!isAddingAccount ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setIsAddingAccount(true)}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Connect Bank Account
                        </CardTitle>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground pt-1">
                          Link checking or savings account for funding
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setIsAddingAccount(true)}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Add Credit Card
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground pt-1">
                          Use a credit card for funding purposes
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="accountTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter account title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="accountType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select account type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="checking">Checking</SelectItem>
                                  <SelectItem value="savings">Savings</SelectItem>
                                  <SelectItem value="credit">Credit Card</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
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
                              <FormLabel>Account Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter account number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="routingNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Routing Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter routing number" {...field} />
                              </FormControl>
                              <FormMessage />
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

                      <div className="flex justify-end space-x-3 pt-2">
                        <Button 
                          variant="outline" 
                          type="button" 
                          onClick={() => setIsAddingAccount(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Saving..." : "Save Account"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="mr-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the account from your funding sources. Any automatic transfers or payments using this account will need to be updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveAccount}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
