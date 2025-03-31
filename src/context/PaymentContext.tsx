
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

interface PaymentContextType {
  initiatePayment: (projectId: string, amount: number, milestoneId: string) => Promise<void>;
  releaseEscrow: (milestoneId: string) => Promise<void>;
  requestReleaseApproval: (milestoneId: string) => Promise<void>;
  trackPayment: (paymentId: string) => any;
  payments: Payment[];
  milestones: Milestone[];
  projects: Project[];
  communications: Communication[];
  addMilestone: (milestone: Milestone) => void;
  updateMilestone: (milestone: Milestone) => void;
  completeMilestone: (milestoneId: string) => Promise<void>;
  addCommunication: (communication: Communication) => void;
  addFeedback: (feedback: Feedback) => Promise<void>;
  getFeedbackForProject: (projectId: string) => Feedback[];
  getProjectById: (projectId: string) => Project | undefined;
  getMilestonesForProject: (projectId: string) => Milestone[];
  getCommunicationsForProject: (projectId: string) => Communication[];
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
  completedDate?: string;
  attachments?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  clientId: string;
  providerId: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
}

export interface Communication {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
  readStatus: boolean;
}

export interface Feedback {
  id: string;
  projectId: string;
  providerId: string;
  clientId: string;
  rating: number;
  comments: string;
  createdAt: string;
  milestoneId?: string;
  isPublic: boolean;
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
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
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
    {
      id: "milestone_3",
      projectId: "proj_2",
      title: "Financial Analysis",
      description: "Complete financial analysis and recommendations",
      amount: 6000,
      status: "completed",
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const mockProjects: Project[] = [
    {
      id: "proj_1",
      title: "Wealth Management Strategy",
      description: "Comprehensive wealth management strategy for high net worth family",
      clientId: "client_1",
      providerId: "provider_1",
      status: "active",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      totalAmount: 25000,
    },
    {
      id: "proj_2",
      title: "Estate Planning",
      description: "Complete estate planning and trust setup",
      clientId: "client_2",
      providerId: "provider_2",
      status: "active",
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      totalAmount: 18000,
    },
  ];

  const mockCommunications: Communication[] = [
    {
      id: "comm_1",
      projectId: "proj_1",
      senderId: "provider_1",
      senderName: "John Advisor",
      message: "I've reviewed your requirements and will start working on the strategy document tomorrow.",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      readStatus: true,
    },
    {
      id: "comm_2",
      projectId: "proj_1",
      senderId: "client_1",
      senderName: "Robert Client",
      message: "Great, looking forward to seeing the draft. Do you need any additional information from me?",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      readStatus: true,
    },
    {
      id: "comm_3",
      projectId: "proj_1",
      senderId: "provider_1",
      senderName: "John Advisor",
      message: "I've attached the first draft of the strategy. Please review and provide feedback.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      attachments: ["Strategy_Draft_v1.pdf"],
      readStatus: false,
    },
  ];

  const mockFeedback: Feedback[] = [
    {
      id: "feedback_1",
      projectId: "proj_2",
      providerId: "provider_2",
      clientId: "client_2",
      rating: 4,
      comments: "Very professional and thorough. Would recommend.",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      milestoneId: "milestone_3",
      isPublic: true,
    },
  ];

  React.useEffect(() => {
    // Initialize with mock data
    setPayments(mockPayments);
    setMilestones(mockMilestones);
    setProjects(mockProjects);
    setCommunications(mockCommunications);
    setFeedback(mockFeedback);
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
      
      // Update milestone status
      setMilestones(prev => 
        prev.map(milestone => 
          milestone.id === milestoneId 
            ? { ...milestone, status: 'approved', completedDate: new Date().toISOString() } 
            : milestone
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
      
      // Update milestone status to completed (awaiting approval)
      setMilestones(prev => 
        prev.map(milestone => 
          milestone.id === milestoneId 
            ? { ...milestone, status: 'completed', completedDate: new Date().toISOString() } 
            : milestone
        )
      );
      
      toast.success("Release approval request sent to client");
    } catch (error) {
      console.error("Error requesting release approval:", error);
      toast.error("Failed to request release approval");
    } finally {
      setIsLoading(false);
    }
  };

  const addMilestone = (milestone: Milestone) => {
    setMilestones(prev => [...prev, milestone]);
  };

  const updateMilestone = (milestone: Milestone) => {
    setMilestones(prev => 
      prev.map(m => m.id === milestone.id ? milestone : m)
    );
  };

  const completeMilestone = async (milestoneId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update milestone status to completed
      setMilestones(prev => 
        prev.map(milestone => 
          milestone.id === milestoneId 
            ? { 
                ...milestone, 
                status: 'completed', 
                completedDate: new Date().toISOString() 
              } 
            : milestone
        )
      );
      
      toast.success("Milestone marked as completed");
    } catch (error) {
      console.error("Error completing milestone:", error);
      toast.error("Failed to complete milestone");
    } finally {
      setIsLoading(false);
    }
  };

  const addCommunication = (communication: Communication) => {
    setCommunications(prev => [...prev, {
      ...communication,
      id: `comm_${Date.now()}`,
      timestamp: new Date().toISOString(),
      readStatus: false
    }]);
  };

  const addFeedback = async (newFeedback: Feedback) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFeedback(prev => [...prev, {
        ...newFeedback,
        id: `feedback_${Date.now()}`,
        createdAt: new Date().toISOString()
      }]);
      
      toast.success("Feedback submitted successfully");
    } catch (error) {
      console.error("Error adding feedback:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setIsLoading(false);
    }
  };

  const getFeedbackForProject = (projectId: string) => {
    return feedback.filter(f => f.projectId === projectId);
  };

  const getProjectById = (projectId: string) => {
    return projects.find(project => project.id === projectId);
  };

  const getMilestonesForProject = (projectId: string) => {
    return milestones.filter(milestone => milestone.projectId === projectId);
  };

  const getCommunicationsForProject = (projectId: string) => {
    return communications.filter(comm => comm.projectId === projectId);
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
      milestones,
      projects,
      communications,
      addMilestone,
      updateMilestone,
      completeMilestone,
      addCommunication,
      addFeedback,
      getFeedbackForProject,
      getProjectById,
      getMilestonesForProject,
      getCommunicationsForProject,
      isLoading
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

