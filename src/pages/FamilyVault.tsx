
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { DocumentUploadForm } from "@/components/vault/DocumentUploadForm";
import { VaultSuggestionsPanel } from "@/components/vault/VaultSuggestionsPanel";
import { VaultDocument } from "@/types/vault";
import { notifyAdvisor } from "@/services/advisorNotifier";
import { toast } from "sonner";

const FamilyVault: React.FC = () => {
  const [isNotifying, setIsNotifying] = useState(false);
  
  const handleNotifyAdvisor = async (documents: VaultDocument[]): Promise<void> => {
    setIsNotifying(true);
    
    try {
      // Format document data for the notification
      const payload = {
        documents: documents.map(doc => ({
          type: doc.documentType,
          description: doc.description,
          fileName: doc.fileName,
          fileSize: doc.fileSize,
          uploadDate: doc.uploadDate
        })),
        timestamp: new Date().toISOString()
      };
      
      // Use the shared service to notify the advisor
      await notifyAdvisor('vault_update', payload);
      
      toast.success("Advisor notified successfully", {
        description: "Your advisor has been notified about your document uploads"
      });
    } catch (error) {
      console.error("Error notifying advisor:", error);
      toast.error("Failed to notify advisor", {
        description: "Please try again later"
      });
    } finally {
      setIsNotifying(false);
    }
  };
  
  return (
    <ThreeColumnLayout title="Family Vault">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-white">Family Vault</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#0F1E3A] p-6 rounded-lg border border-[#2A3E5C] mb-6">
              <h2 className="text-xl font-medium mb-4 text-white">Document Upload</h2>
              <p className="text-gray-400 mb-6">
                Upload important documents to your Family Vault. These documents will be securely stored
                and can be shared with your advisor to assist with estate and financial planning.
              </p>
              
              <DocumentUploadForm onNotify={handleNotifyAdvisor} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <VaultSuggestionsPanel />
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default FamilyVault;
