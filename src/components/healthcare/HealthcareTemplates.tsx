import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DocumentItem } from "@/types/document";
import { auditLog } from "@/services/auditLog/auditLogService";

// Template definitions
const healthcareTemplates = [
  {
    id: "hipaa-authorization",
    name: "HIPAA Authorization Form",
    description: "Standard form authorizing the release of protected health information",
    category: "medical-records",
    type: "legal"
  },
  {
    id: "advance-directive",
    name: "Advance Healthcare Directive",
    description: "Legal document specifying healthcare wishes if you're unable to communicate",
    category: "medical-records",
    type: "legal"
  },
  {
    id: "living-will",
    name: "Living Will",
    description: "Document specifying medical treatments you would or would not want",
    category: "medical-records",
    type: "legal"
  },
  {
    id: "medication-list",
    name: "Medication Tracking List",
    description: "Template for tracking current medications, dosages, and schedules",
    category: "prescriptions",
    type: "document"
  },
  {
    id: "emergency-contacts",
    name: "Emergency Medical Contacts",
    description: "List of emergency contacts and healthcare providers",
    category: "physicians",
    type: "document"
  },
  {
    id: "insurance-claim",
    name: "Healthcare Insurance Claim Form",
    description: "Standard form for submitting healthcare insurance claims",
    category: "insurance-coverage",
    type: "financial"
  }
];

interface HealthcareTemplatesProps {
  onAddDocument: (document: DocumentItem) => void;
}

export const HealthcareTemplates: React.FC<HealthcareTemplatesProps> = ({
  onAddDocument
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof healthcareTemplates[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleTemplateSelect = (template: typeof healthcareTemplates[0]) => {
    setSelectedTemplate(template);
    setIsDialogOpen(true);
  };
  
  const handleDownloadTemplate = () => {
    if (!selectedTemplate) return;
    
    // In a real app, this would download an actual file template
    // For demo purposes, we're just showing a toast
    toast({
      title: "Template downloaded",
      description: `${selectedTemplate.name} has been downloaded`
    });
    
    setIsDialogOpen(false);
  };
  
  const handleAddToVault = () => {
    if (!selectedTemplate) return;
    
    // Create a new document from the template
    const newDocument: DocumentItem = {
      id: `template-${Math.random().toString(36).substring(2, 9)}`,
      name: selectedTemplate.name,
      type: selectedTemplate.type as any,
      category: selectedTemplate.category,
      created: new Date().toISOString(),
      size: "0 KB",
      encrypted: true,
      isPrivate: true,
      uploadedBy: "Tom Brady", // In a real app, this would be the current user
      permissions: [
        {
          userId: "Tom Brady",
          userName: "Tom Brady",
          accessLevel: "full",
          grantedAt: new Date().toISOString()
        }
      ]
    };
    
    onAddDocument(newDocument);
    
    auditLog.log(
      "Tom Brady", // In a real app, this would be the current user
      "document_creation",
      "success",
      {
        resourceId: newDocument.id,
        resourceType: "healthcare_template",
        details: {
          action: "template_create",
          templateName: selectedTemplate.name,
          category: selectedTemplate.category
        }
      }
    );
    
    toast({
      title: "Template added to vault",
      description: `${selectedTemplate.name} has been added to your healthcare documents`
    });
    
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Healthcare Document Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthcareTemplates.map(template => (
              <div 
                key={template.id}
                className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors"
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Choose how you'd like to use this template:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div>
                  <h4 className="font-medium">Download Template</h4>
                  <p className="text-sm text-muted-foreground">Download and fill out offline</p>
                </div>
                <Button variant="outline" onClick={handleDownloadTemplate} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between border p-3 rounded-md">
                <div>
                  <h4 className="font-medium">Add to Vault</h4>
                  <p className="text-sm text-muted-foreground">Create an editable document in your vault</p>
                </div>
                <Button onClick={handleAddToVault} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add to Vault
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
