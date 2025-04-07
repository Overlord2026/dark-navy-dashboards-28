import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Download } from "lucide-react";
import { OfferingsList } from "@/components/investments/OfferingsList";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";

const mockOfferings = {
  "private-equity": [
    // ... keep existing mockOfferings data
  ],
  "private-debt": [
    // ... keep existing mockOfferings data
  ],
  "digital-assets": [
    // ... keep existing mockOfferings data
  ],
  "real-assets": [
    // ... keep existing mockOfferings data
  ]
};

const AlternativeAssetCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [offerings, setOfferings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryDescription, setCategoryDescription] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    
    if (categoryId) {
      switch(categoryId) {
        case "private-equity":
          setCategoryName("Private Equity");
          setCategoryDescription("Direct investments in private companies, leveraged buyouts, and growth capital strategies.");
          break;
        case "private-debt":
          setCategoryName("Private Debt");
          setCategoryDescription("Direct lending, mezzanine financing, and distressed debt investments across sectors.");
          break;
        case "digital-assets":
          setCategoryName("Digital Assets");
          setCategoryDescription("Cryptocurrencies, blockchain technologies, and Web3 infrastructure investments.");
          break;
        case "real-assets":
          setCategoryName("Real Assets");
          setCategoryDescription("Real estate, infrastructure, natural resources, and tangible assets with intrinsic value.");
          break;
        default:
          setCategoryName("Alternative Investments");
          setCategoryDescription("Various alternative investment strategies beyond traditional stocks and bonds.");
      }
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

  useEffect(() => {
    if (!isLoading && categoryId && !mockOfferings[categoryId as keyof typeof mockOfferings]) {
      navigate("/investments");
      toast.error("Investment category not found");
    }
  }, [categoryId, isLoading, navigate]);

  return (
    <ThreeColumnLayout activeMainItem="investments" title={categoryName}>
      <div className="space-y-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate("/investments?tab=private-market")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Investments
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{categoryName}</h1>
              <p className="text-muted-foreground mt-1">{categoryDescription}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={handleDownloadFactSheet}
            >
              <FileText className="h-4 w-4 mr-1" />
              Download Fact Sheet
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading offerings...</p>
            </div>
          ) : (
            <OfferingsList 
              offerings={offerings} 
              categoryId={categoryId || ""} 
              onLike={(assetName) => handleUserAction("like", assetName)}
              isFullView={true}
            />
          )}
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default AlternativeAssetCategory;
