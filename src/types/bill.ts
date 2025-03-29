
export type BillStatus = "Paid" | "Upcoming" | "Overdue" | "Pending";
export type BillCategory = 
  | "Housing" 
  | "Utilities" 
  | "Insurance" 
  | "Subscriptions" 
  | "Healthcare" 
  | "Transportation" 
  | "Loans" 
  | "Credit Card" 
  | "Education" 
  | "Other";

export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: BillCategory;
  status: BillStatus;
  paymentAccount?: string;
  recurring?: boolean;
  recurringPeriod?: "Weekly" | "Monthly" | "Quarterly" | "Annually";
  autoPay?: boolean;
  notes?: string;
  provider?: string;
};

export type BillOptimizationInsight = {
  id: string;
  billId: string;
  title: string;
  description: string;
  potentialSavings: number;
  actionType: "Review" | "Switch Provider" | "Negotiate" | "Eliminate";
  recommended: boolean;
  relevantProviders?: string[];
};
