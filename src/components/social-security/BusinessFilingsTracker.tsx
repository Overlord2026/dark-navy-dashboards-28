
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays, isBefore, isAfter } from "date-fns";
import { AlertTriangle, Calendar, CheckCircle, Clock, FileText, Plus, Trash2 } from "lucide-react";

// Define the form schema for business filing
const businessFilingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
  businessName: z.string().min(1, { message: "Business name is required" }),
  dueDate: z.date({ required_error: "Due date is required" }),
  reminderDays: z.number().min(0).max(90),
  filingType: z.string().min(1, { message: "Filing type is required" }),
  recurring: z.boolean().default(false),
  recurringPeriod: z.string().optional(),
  completed: z.boolean().default(false),
});

type BusinessFiling = z.infer<typeof businessFilingSchema>;

// Default business filings for demonstration
const defaultBusinessFilings: BusinessFiling[] = [
  {
    name: "Annual Report",
    description: "Annual corporation report filing",
    businessName: "Acme Inc",
    dueDate: addDays(new Date(), 15),
    reminderDays: 30,
    filingType: "State Filing",
    recurring: true,
    recurringPeriod: "Annual",
    completed: false
  },
  {
    name: "Quarterly Tax Payment",
    description: "Estimated tax payment - Q2",
    businessName: "Smith Consulting LLC",
    dueDate: addDays(new Date(), 45),
    reminderDays: 14,
    filingType: "Tax Payment",
    recurring: true,
    recurringPeriod: "Quarterly",
    completed: false
  },
  {
    name: "Business License Renewal",
    description: "City business license renewal",
    businessName: "Main Street Retail",
    dueDate: addDays(new Date(), -5),
    reminderDays: 30,
    filingType: "License",
    recurring: true,
    recurringPeriod: "Annual",
    completed: false
  },
  {
    name: "Form 1099 Filing",
    description: "Contractor payment reporting",
    businessName: "Tech Innovations LLC",
    dueDate: addDays(new Date(), 75),
    reminderDays: 30,
    filingType: "Tax Filing",
    recurring: true,
    recurringPeriod: "Annual",
    completed: true
  }
];

const filingTypes = [
  "State Filing", 
  "Federal Filing", 
  "Tax Payment", 
  "Tax Filing", 
  "License", 
  "Permit", 
  "Registration", 
  "Report",
  "Other"
];

const recurringPeriods = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Semi-Annual",
  "Annual",
  "Biennial"
];

export const BusinessFilingsTracker = () => {
  const [filings, setFilings] = useState<BusinessFiling[]>(defaultBusinessFilings);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "overdue" | "completed">("all");
  
  const form = useForm<BusinessFiling>({
    resolver: zodResolver(businessFilingSchema),
    defaultValues: {
      name: "",
      description: "",
      businessName: "",
      dueDate: undefined,
      reminderDays: 30,
      filingType: "",
      recurring: false,
      recurringPeriod: "",
      completed: false
    }
  });

  const onSubmit = (data: BusinessFiling) => {
    setFilings([...filings, data]);
    setIsAddDialogOpen(false);
    form.reset();
    toast.success("Business filing added successfully!");
  };

  const handleDeleteFiling = (index: number) => {
    const updatedFilings = [...filings];
    updatedFilings.splice(index, 1);
    setFilings(updatedFilings);
    toast.success("Filing removed successfully");
  };

  const handleToggleComplete = (index: number) => {
    const updatedFilings = [...filings];
    updatedFilings[index].completed = !updatedFilings[index].completed;
    setFilings(updatedFilings);
    
    const actionText = updatedFilings[index].completed ? "completed" : "marked as incomplete";
    toast.success(`Filing ${actionText} successfully`);
  };

  // Filter filings based on selected status
  const filteredFilings = filings.filter(filing => {
    const today = new Date();
    
    switch(filterStatus) {
      case "upcoming":
        return !filing.completed && isAfter(filing.dueDate, today);
      case "overdue":
        return !filing.completed && isBefore(filing.dueDate, today);
      case "completed":
        return filing.completed;
      default:
        return true;
    }
  });

  // Get status of filing
  const getFilingStatus = (filing: BusinessFiling) => {
    const today = new Date();
    if (filing.completed) return "completed";
    if (isBefore(filing.dueDate, today)) return "overdue";
    
    // Calculate if within reminder period
    const reminderDate = addDays(filing.dueDate, -filing.reminderDays);
    if (isAfter(today, reminderDate)) return "upcoming";
    
    return "scheduled";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Business Filings & Alerts</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Filing
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Business Filing</DialogTitle>
              <DialogDescription>
                Add details about a business filing to track deadlines and receive reminders.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filing Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Annual Report" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Business name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="filingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filing Type</FormLabel>
                        <FormControl>
                          <select
                            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            {...field}
                          >
                            <option value="">Select type...</option>
                            {filingTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <DatePicker 
                            date={field.value} 
                            onSelect={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="reminderDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reminder (Days Before)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          max={90} 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        How many days before the due date to receive a reminder.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="recurring"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Recurring Filing</FormLabel>
                        <FormDescription>
                          Is this a recurring filing that happens on a regular schedule?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {form.watch("recurring") && (
                  <FormField
                    control={form.control}
                    name="recurringPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recurrence Period</FormLabel>
                        <FormControl>
                          <select
                            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            {...field}
                          >
                            <option value="">Select period...</option>
                            {recurringPeriods.map(period => (
                              <option key={period} value={period}>{period}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <DialogFooter>
                  <Button type="submit">Save Filing</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Business Filings</CardTitle>
          <CardDescription>
            Track important business filings, deadlines, and compliance requirements.
          </CardDescription>
          <div className="flex space-x-2 mt-2">
            <Button 
              variant={filterStatus === "all" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button 
              variant={filterStatus === "upcoming" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilterStatus("upcoming")}
            >
              Upcoming
            </Button>
            <Button 
              variant={filterStatus === "overdue" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilterStatus("overdue")}
              className={filterStatus === "overdue" ? "" : "border-red-600 text-red-600 hover:bg-red-600/10"}
            >
              Overdue
            </Button>
            <Button 
              variant={filterStatus === "completed" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilterStatus("completed")}
            >
              Completed
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFilings.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
              <h3 className="mt-4 text-lg font-medium">No filings found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {filterStatus === "all" 
                  ? "You haven't added any business filings yet." 
                  : `No ${filterStatus} filings match your criteria.`}
              </p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Your First Filing
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Filing</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFilings.map((filing, index) => {
                    const status = getFilingStatus(filing);
                    return (
                      <TableRow key={`${filing.name}-${index}`}>
                        <TableCell className="font-medium">
                          <div>
                            {filing.name}
                            {filing.recurring && (
                              <Badge variant="outline" className="ml-2">
                                {filing.recurringPeriod}
                              </Badge>
                            )}
                          </div>
                          {filing.description && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {filing.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{filing.businessName}</TableCell>
                        <TableCell>{filing.filingType}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {format(filing.dueDate, "MMM d, yyyy")}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Reminder: {filing.reminderDays} days before
                          </div>
                        </TableCell>
                        <TableCell>
                          {status === "completed" && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              <CheckCircle className="h-3 w-3 mr-1" /> Completed
                            </Badge>
                          )}
                          {status === "overdue" && (
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                              <AlertTriangle className="h-3 w-3 mr-1" /> Overdue
                            </Badge>
                          )}
                          {status === "upcoming" && (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                              <Clock className="h-3 w-3 mr-1" /> Due Soon
                            </Badge>
                          )}
                          {status === "scheduled" && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                              Scheduled
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleComplete(index)}
                              title={filing.completed ? "Mark as incomplete" : "Mark as completed"}
                            >
                              <CheckCircle className={`h-4 w-4 ${filing.completed ? "text-green-500" : "text-muted-foreground"}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteFiling(index)}
                              title="Delete filing"
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredFilings.length} of {filings.length} filings
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Filing Calendar</CardTitle>
          <CardDescription>
            View your upcoming business filings on a timeline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filings
              .filter(filing => !filing.completed)
              .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
              .slice(0, 5)
              .map((filing, index) => {
                const today = new Date();
                const daysUntilDue = Math.ceil((filing.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isOverdue = daysUntilDue < 0;
                const reminderDate = addDays(filing.dueDate, -filing.reminderDays);
                const isWithinReminder = isAfter(today, reminderDate);
                
                return (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border flex items-center space-x-4 ${
                      isOverdue 
                        ? "bg-red-500/10 border-red-500/30" 
                        : isWithinReminder 
                          ? "bg-amber-500/10 border-amber-500/30"
                          : "bg-blue-500/5 border-blue-500/20"
                    }`}
                  >
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      isOverdue 
                        ? "bg-red-500/20 text-red-500" 
                        : isWithinReminder 
                          ? "bg-amber-500/20 text-amber-500"
                          : "bg-blue-500/20 text-blue-500"
                    }`}>
                      {isOverdue 
                        ? <AlertTriangle className="h-6 w-6" />
                        : isWithinReminder 
                          ? <Clock className="h-6 w-6" />
                          : <Calendar className="h-6 w-6" />
                      }
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {filing.name}
                        <span className="text-sm font-normal ml-2 opacity-70">
                          ({filing.businessName})
                        </span>
                      </h4>
                      <div className="text-sm mt-1">
                        {isOverdue 
                          ? `Overdue by ${Math.abs(daysUntilDue)} days` 
                          : `Due in ${daysUntilDue} days`
                        }
                        <span className="mx-2">•</span>
                        {format(filing.dueDate, "MMMM d, yyyy")}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const index = filings.findIndex(f => 
                          f.name === filing.name && 
                          f.dueDate.getTime() === filing.dueDate.getTime()
                        );
                        if (index !== -1) {
                          handleToggleComplete(index);
                        }
                      }}
                    >
                      Mark Complete
                    </Button>
                  </div>
                );
              })}
              
            {filings.filter(filing => !filing.completed).length === 0 && (
              <div className="text-center py-6">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 opacity-50" />
                <h3 className="mt-4 text-lg font-medium">All caught up!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You have no upcoming business filings due.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
