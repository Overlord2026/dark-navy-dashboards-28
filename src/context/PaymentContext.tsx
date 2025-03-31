
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

interface PaymentContextType {
  initiatePayment: (projectId: string, amount: number, milestoneId: string) => Promise<void>;
  releaseEscrow: (milestoneId: string) => Promise<void>;
  requestReleaseApproval: (milestoneId: string) => Promise<void>;
  trackPayment: (paymentId: string) => any;
  payments: Payment[];
  isLoading: boolean;
}

export interface Payment {
  id: string;
  projectId: string;
  milestoneId: string;
  amount: number;
  status: 'pending' | 'in-escrow' | 'completed' | 'disputed';
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'completed' | 'approved';
  dueDate: string;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mock data for demonstration
  const mockPayments: Payment[] = [
    {
      id: "pay_1",
      projectId: "proj_1",
      milestoneId: "milestone_1",
      amount: 5000,
      status: "in-escrow",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "pay_2",
      projectId: "proj_2",
      milestoneId: "milestone_2",
      amount: 7500,
      status: "completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const mockMilestones: Milestone[] = [
    {
      id: "milestone_1",
      projectId: "proj_1",
      title: "Initial Requirements Gathering",
      description: "Complete initial consultation and requirements documentation",
      amount: 5000,
      status: "in-progress",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "milestone_2",
      projectId: "proj_1",
      title: "Strategy Development",
      description: "Develop comprehensive strategy based on requirements",
      amount: 7500,
      status: "pending",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  React.useEffect(() => {
    // Initialize with mock data
    setPayments(mockPayments);
  }, []);

  const initiatePayment = async (projectId: string, amount: number, milestoneId: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call a Stripe API endpoint
      console.log(`Initiating payment of $${amount} for project ${projectId} milestone ${milestoneId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add new payment to state
      const newPayment: Payment = {
        id: `pay_${Date.now()}`,
        projectId,
        milestoneId,
        amount,
        status: 'in-escrow',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setPayments(prev => [...prev, newPayment]);
      toast.success("Payment successfully placed in escrow");
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to process payment");
    } finally {
      setIsLoading(false);
    }
  };

  const releaseEscrow = async (milestoneId: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call a backend API to release funds
      console.log(`Releasing escrow for milestone ${milestoneId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update payment status
      setPayments(prev => 
        prev.map(payment => 
          payment.milestoneId === milestoneId 
            ? { ...payment, status: 'completed', updatedAt: new Date().toISOString() } 
            : payment
        )
      );
      
      toast.success("Funds successfully released from escrow");
    } catch (error) {
      console.error("Error releasing escrow:", error);
      toast.error("Failed to release funds from escrow");
    } finally {
      setIsLoading(false);
    }
  };

  const requestReleaseApproval = async (milestoneId: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would notify the client to approve release
      console.log(`Requesting release approval for milestone ${milestoneId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Release approval request sent to client");
    } catch (error) {
      console.error("Error requesting release approval:", error);
      toast.error("Failed to request release approval");
    } finally {
      setIsLoading(false);
    }
  };

  const trackPayment = (paymentId: string) => {
    return payments.find(payment => payment.id === paymentId);
  };

  return (
    <PaymentContext.Provider value={{ 
      initiatePayment, 
      releaseEscrow, 
      requestReleaseApproval, 
      trackPayment,
      payments,
      isLoading
    }}>
      {children}
    </PaymentContext.Provider>
  );
};
