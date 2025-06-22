
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays, isBefore, isAfter } from "date-fns";
import { AlertTriangle, Calendar, CheckCircle, Clock, FileText, Plus, Trash2 } from "lucide-react";
import { useBusinessFilings, BusinessFiling } from "@/hooks/useBusinessFilings";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Define the form schema for business filing
const businessFilingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
  business_name: z.string().min(1, { message: "Business name is required" }),
  due_date: z.date({ required_error: "Due date is required" }),
  reminder_days: z.number().min(0).max(90),
  filing_type: z.string().min(1, { message: "Filing type is required" }),
  recurring: z.boolean().default(false),
  recurring_period: z.string().optional(),
  completed: z.boolean().default(false),
});

type BusinessFilingForm = z.infer<typeof businessFilingSchema>;

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "overdue" | "completed">("all");
  const { filings, isLoading, addFiling, deleteFiling, toggleComplete } = useBusinessFilings();
  const isMobile = useIsMobile();
  
  const form = useForm<BusinessFilingForm>({
    resolver: zodResolver(businessFilingSchema),
    defaultValues: {
      name: "",
      description: "",
      business_name: "",
      due_date: undefined,
      reminder_days: 30,
      filing_type: "",
      recurring: false,
      recurring_period: "",
      completed: false
    }
  });

  const onSubmit = async (data: BusinessFilingForm) => {
    try {
      // Transform the form data to match the expected type
      const filingData: Omit<BusinessFiling, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
        name: data.name,
        description: data.description || undefined,
        business_name: data.business_name,
        due_date: data.due_date,
        reminder_days: data.reminder_days,
        filing_type: data.filing_type,
        recurring: data.recurring,
        recurring_period: data.recurring_period || undefined,
        completed: data.completed
      };
      
      await addFiling(filingData);
      setIsAddDialogOpen(false);
      form.reset();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleDeleteFiling = async (id: string) => {
    await deleteFiling(id);
  };

  const handleToggleComplete = async (id: string) => {
    await toggleComplete(id);
  };

  // Filter filings based on selected status
  const filteredFilings = filings.filter(filing => {
    const today = new Date();
    
    switch(filterStatus) {
      case "upcoming":
        return !filing.completed && isAfter(filing.due_date, today);
      case "overdue":
        return !filing.completed && isBefore(filing.due_date, today);
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
    if (isBefore(filing.due_date, today)) return "overdue";
    
    // Calculate if within reminder period
    const reminderDate = addDays(filing.due_date, -filing.reminder_days);
    if (isAfter(today, reminderDate)) return "upcoming";
    
    return "scheduled";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading business filings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={cn(
        "flex items-center justify-between",
        isMobile && "flex-col gap-4 items-start"
      )}>
        <h2 className={cn(
          "font-semibold",
          isMobile ? "text-lg" : "text-xl"
        )}>Business Filings & Alerts</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className={cn(isMobile && "w-full text-sm")}>
              <Plus className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} /> Add New Filing
            </Button>
          </DialogTrigger>
          <DialogContent className={cn(
            "sm:max-w-[550px]",
            isMobile && "mx-4 max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto"
          )}>
            <DialogHeader>
              <DialogTitle className={cn(isMobile && "text-lg")}>Add New Business Filing</DialogTitle>
              <DialogDescription className={cn(isMobile && "text-sm")}>
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
                      <FormLabel className={cn(isMobile && "text-sm")}>Filing Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Annual Report" 
                          {...field} 
                          className={cn(isMobile && "text-sm")}
                        />
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
                      <FormLabel className={cn(isMobile && "text-sm")}>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Brief description" 
                          {...field} 
                          className={cn(isMobile && "text-sm")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(isMobile && "text-sm")}>Business Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Business name" 
                          {...field} 
                          className={cn(isMobile && "text-sm")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className={cn(
                  "grid gap-4",
                  isMobile ? "grid-cols-1" : "grid-cols-2"
                )}>
                  <FormField
                    control={form.control}
                    name="filing_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(isMobile && "text-sm")}>Filing Type</FormLabel>
                        <FormControl>
                          <select
                            className={cn(
                              "w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                              isMobile && "text-sm"
                            )}
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
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(isMobile && "text-sm")}>Due Date</FormLabel>
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
                  name="reminder_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(isMobile && "text-sm")}>Reminder (Days Before)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          max={90} 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          className={cn(isMobile && "text-sm")}
                        />
                      </FormControl>
                      <FormDescription className={cn(isMobile && "text-xs")}>
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
                    <FormItem className={cn(
                      "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4",
                      isMobile && "p-3"
                    )}>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className={cn(isMobile && "text-sm")}>Recurring Filing</FormLabel>
                        <FormDescription className={cn(isMobile && "text-xs")}>
                          Is this a recurring filing that happens on a regular schedule?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {form.watch("recurring") && (
                  <FormField
                    control={form.control}
                    name="recurring_period"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(isMobile && "text-sm")}>Recurrence Period</FormLabel>
                        <FormControl>
                          <select
                            className={cn(
                              "w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                              isMobile && "text-sm"
                            )}
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
                
                <DialogFooter className={cn(isMobile && "flex-col space-y-2")}>
                  <Button 
                    type="submit" 
                    className={cn(isMobile && "w-full text-sm")}
                  >
                    Save Filing
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className={cn(isMobile && "text-lg")}>Your Business Filings</CardTitle>
          <CardDescription className={cn(isMobile && "text-sm")}>
            Track important business filings, deadlines, and compliance requirements.
          </CardDescription>
          <div className={cn(
            "flex space-x-2 mt-2",
            isMobile && "flex-wrap gap-2"
          )}>
            <Button 
              variant={filterStatus === "all" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilterStatus("all")}
              className={cn(isMobile && "text-xs px-2")}
            >
              All
            </Button>
            <Button 
              variant={filterStatus === "upcoming" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilterStatus("upcoming")}
              className={cn(isMobile && "text-xs px-2")}
            >
              Upcoming
            </Button>
            <Button 
              variant={filterStatus === "overdue" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilterStatus("overdue")}
              className={cn(
                filterStatus === "overdue" ? "" : "border-red-600 text-red-600 hover:bg-red-600/10",
                isMobile && "text-xs px-2"
              )}
            >
              Overdue
            </Button>
            <Button 
              variant={filterStatus === "completed" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilterStatus("completed")}
              className={cn(isMobile && "text-xs px-2")}
            >
              Completed
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFilings.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
              <h3 className={cn(
                "mt-4 font-medium",
                isMobile ? "text-base" : "text-lg"
              )}>No filings found</h3>
              <p className={cn(
                "mt-2 text-muted-foreground",
                isMobile ? "text-sm" : ""
              )}>
                {filterStatus === "all" 
                  ? "You haven't added any business filings yet." 
                  : `No ${filterStatus} filings match your criteria.`}
              </p>
              <Button 
                variant="outline" 
                className={cn(
                  "mt-4",
                  isMobile && "text-sm"
                )}
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} /> Add Your First Filing
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {isMobile ? (
                // Mobile card layout
                <div className="space-y-4">
                  {filteredFilings.map((filing) => {
                    const status = getFilingStatus(filing);
                    return (
                      <Card key={filing.id} className="p-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {filing.name}
                                {filing.recurring && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {filing.recurring_period}
                                  </Badge>
                                )}
                              </div>
                              {filing.description && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {filing.description}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground mt-1">
                                {filing.business_name} • {filing.filing_type}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs">
                              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                              {format(filing.due_date, "MMM d, yyyy")}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {status === "completed" && (
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                                  <CheckCircle className="h-2 w-2 mr-1" /> Done
                                </Badge>
                              )}
                              {status === "overdue" && (
                                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">
                                  <AlertTriangle className="h-2 w-2 mr-1" /> Overdue
                                </Badge>
                              )}
                              {status === "upcoming" && (
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">
                                  <Clock className="h-2 w-2 mr-1" /> Due Soon
                                </Badge>
                              )}
                              {status === "scheduled" && (
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
                                  Scheduled
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleComplete(filing.id!)}
                              title={filing.completed ? "Mark as incomplete" : "Mark as completed"}
                              className="text-xs"
                            >
                              <CheckCircle className={`h-3 w-3 ${filing.completed ? "text-green-500" : "text-muted-foreground"}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFiling(filing.id!)}
                              title="Delete filing"
                              className="text-xs"
                            >
                              <Trash2 className="h-3 w-3 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                // Desktop table layout
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
                    {filteredFilings.map((filing) => {
                      const status = getFilingStatus(filing);
                      return (
                        <TableRow key={filing.id}>
                          <TableCell className="font-medium">
                            <div>
                              {filing.name}
                              {filing.recurring && (
                                <Badge variant="outline" className="ml-2">
                                  {filing.recurring_period}
                                </Badge>
                              )}
                            </div>
                            {filing.description && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {filing.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{filing.business_name}</TableCell>
                          <TableCell>{filing.filing_type}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              {format(filing.due_date, "MMM d, yyyy")}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3 inline mr-1" />
                              Reminder: {filing.reminder_days} days before
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
                                onClick={() => handleToggleComplete(filing.id!)}
                                title={filing.completed ? "Mark as incomplete" : "Mark as completed"}
                              >
                                <CheckCircle className={`h-4 w-4 ${filing.completed ? "text-green-500" : "text-muted-foreground"}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteFiling(filing.id!)}
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
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className={cn(
            "text-muted-foreground",
            isMobile ? "text-xs" : "text-sm"
          )}>
            Showing {filteredFilings.length} of {filings.length} filings
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className={cn(isMobile && "text-lg")}>Filing Calendar</CardTitle>
          <CardDescription className={cn(isMobile && "text-sm")}>
            View your upcoming business filings on a timeline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filings
              .filter(filing => !filing.completed)
              .sort((a, b) => a.due_date.getTime() - b.due_date.getTime())
              .slice(0, 5)
              .map((filing) => {
                const today = new Date();
                const daysUntilDue = Math.ceil((filing.due_date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isOverdue = daysUntilDue < 0;
                const reminderDate = addDays(filing.due_date, -filing.reminder_days);
                const isWithinReminder = isAfter(today, reminderDate);
                
                return (
                  <div 
                    key={filing.id} 
                    className={cn(
                      "p-4 rounded-lg border flex items-center space-x-4",
                      isOverdue 
                        ? "bg-red-500/10 border-red-500/30" 
                        : isWithinReminder 
                          ? "bg-amber-500/10 border-amber-500/30"
                          : "bg-blue-500/5 border-blue-500/20",
                      isMobile && "flex-col space-x-0 space-y-3 items-start"
                    )}
                  >
                    <div className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0",
                      isOverdue 
                        ? "bg-red-500/20 text-red-500" 
                        : isWithinReminder 
                          ? "bg-amber-500/20 text-amber-500"
                          : "bg-blue-500/20 text-blue-500",
                      isMobile && "h-10 w-10"
                    )}>
                      {isOverdue 
                        ? <AlertTriangle className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
                        : isWithinReminder 
                          ? <Clock className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
                          : <Calendar className={cn(isMobile ? "h-5 w-5" : "h-6 w-6")} />
                      }
                    </div>
                    <div className={cn("flex-1", isMobile && "w-full")}>
                      <h4 className={cn(
                        "font-medium",
                        isMobile ? "text-sm" : ""
                      )}>
                        {filing.name}
                        <span className={cn(
                          "font-normal ml-2 opacity-70",
                          isMobile ? "text-xs" : "text-sm"
                        )}>
                          ({filing.business_name})
                        </span>
                      </h4>
                      <div className={cn(
                        "mt-1",
                        isMobile ? "text-xs" : "text-sm"
                      )}>
                        {isOverdue 
                          ? `Overdue by ${Math.abs(daysUntilDue)} days` 
                          : `Due in ${daysUntilDue} days`
                        }
                        <span className="mx-2">•</span>
                        {format(filing.due_date, "MMMM d, yyyy")}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleComplete(filing.id!)}
                      className={cn(isMobile && "w-full text-sm")}
                    >
                      Mark Complete
                    </Button>
                  </div>
                );
              })}
              
            {filings.filter(filing => !filing.completed).length === 0 && (
              <div className="text-center py-6">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 opacity-50" />
                <h3 className={cn(
                  "mt-4 font-medium",
                  isMobile ? "text-base" : "text-lg"
                )}>All caught up!</h3>
                <p className={cn(
                  "mt-2 text-muted-foreground",
                  isMobile ? "text-sm" : ""
                )}>
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
