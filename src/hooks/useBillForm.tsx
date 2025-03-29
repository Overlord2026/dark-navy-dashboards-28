
import { useState } from "react";
import { BillCategory, BillStatus } from "@/types/bill";
import { toast } from "sonner";

interface BillFormData {
  name: string;
  amount: string;
  dueDate: string;
  category: BillCategory;
  status: BillStatus;
  paymentAccount: string;
  recurring: boolean;
  recurringPeriod: "Weekly" | "Monthly" | "Quarterly" | "Annually";
  autoPay: boolean;
  notes: string;
  provider: string;
}

interface BillFormHook {
  formData: BillFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  handleCategoryChange: (value: BillCategory) => void;
  handleStatusChange: (value: BillStatus) => void;
  handlePeriodChange: (value: "Weekly" | "Monthly" | "Quarterly" | "Annually") => void;
  resetForm: () => void;
  validateForm: () => boolean;
}

export function useBillForm(): BillFormHook {
  const [formData, setFormData] = useState<BillFormData>({
    name: "",
    amount: "",
    dueDate: "",
    category: "" as BillCategory,
    status: "Upcoming" as BillStatus,
    paymentAccount: "",
    recurring: false,
    recurringPeriod: "Monthly",
    autoPay: false,
    notes: "",
    provider: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCategoryChange = (value: BillCategory) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleStatusChange = (value: BillStatus) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handlePeriodChange = (value: "Weekly" | "Monthly" | "Quarterly" | "Annually") => {
    setFormData((prev) => ({ ...prev, recurringPeriod: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      dueDate: "",
      category: "" as BillCategory,
      status: "Upcoming" as BillStatus,
      paymentAccount: "",
      recurring: false,
      recurringPeriod: "Monthly",
      autoPay: false,
      notes: "",
      provider: "",
    });
  };

  const validateForm = (): boolean => {
    if (!formData.name) {
      toast.error("Bill name is required");
      return false;
    }
    
    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      toast.error("Valid amount is required");
      return false;
    }
    
    if (!formData.dueDate) {
      toast.error("Due date is required");
      return false;
    }
    
    if (!formData.category) {
      toast.error("Category is required");
      return false;
    }

    return true;
  };

  return {
    formData,
    handleChange,
    handleCheckboxChange,
    handleCategoryChange,
    handleStatusChange,
    handlePeriodChange,
    resetForm,
    validateForm
  };
}
