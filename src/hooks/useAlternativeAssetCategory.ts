
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";
import { mockOfferings, getCategoryDetails, Offering } from "@/services/investments/mockInvestmentData";

export const useAlternativeAssetCategory = (categoryId: string | undefined) => {
  const navigate = useNavigate();
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryDescription, setCategoryDescription] = useState<string>("");
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    if (categoryId) {
      const categoryDetails = getCategoryDetails(categoryId);
      setCategoryName(categoryDetails.name);
      setCategoryDescription(categoryDetails.description);
    }
    
    if (categoryId && mockOfferings[categoryId as keyof typeof mockOfferings]) {
      setOfferings(mockOfferings[categoryId as keyof typeof mockOfferings]);
    } else {
      setOfferings([]);
    }
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [categoryId]);

  useEffect(() => {
    if (!isLoading && categoryId && !mockOfferings[categoryId as keyof typeof mockOfferings]) {
      navigate("/investments");
      toast.error("Investment category not found");
    }
  }, [categoryId, isLoading, navigate]);

  const handleUserAction = (actionType: string, assetName: string) => {
    const userId = "current-user";
    
    if (actionType === "like") {
      auditLog.log(
        userId,
        "document_access",
        "success",
        {
          resourceType: "investment_offering",
          resourceId: assetName,
          details: {
            action: "expressed_interest",
            category: categoryId
          }
        }
      );
      
      toast.success(`You've expressed interest in ${assetName}`, {
        description: "Your advisor will be notified about your interest.",
      });
    }
  };

  const handleDownloadFactSheet = () => {
    toast.success(`Downloading fact sheet for ${categoryName}`, {
      description: "Your download will begin shortly.",
    });
  };
  
  const handleCategoryInterest = () => {
    const userId = "current-user";
    
    auditLog.log(
      userId,
      "investment_category_interest",
      "success",
      {
        resourceType: "investment_category",
        resourceId: categoryId,
        details: {
          action: "expressed_interest",
          category: categoryId
        }
      }
    );
  };

  return {
    offerings,
    isLoading,
    categoryName,
    categoryDescription,
    scheduleMeetingOpen,
    setScheduleMeetingOpen,
    handleUserAction,
    handleDownloadFactSheet,
    handleCategoryInterest
  };
};
