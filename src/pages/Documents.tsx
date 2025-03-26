
import { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/button";
import { FolderIcon, FileTextIcon, DownloadIcon, ShareIcon, PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const documentCategories = [
  {
    id: "recent",
    title: "Recent Documents",
    documents: [
      { id: "1", name: "Q1_Financial_Report.pdf", date: "2025-03-15", type: "PDF", size: "2.4 MB" },
      { id: "2", name: "Annual_Compliance_Review.docx", date: "2025-03-10", type: "DOCX", size: "1.8 MB" },
      { id: "3", name: "Investment_Strategy_2025.xlsx", date: "2025-03-05", type: "XLSX", size: "3.2 MB" },
    ]
  },
  {
    id: "tax",
    title: "Tax Documents",
    documents: [
      { id: "4", name: "W2_Forms_2024.pdf", date: "2025-02-15", type: "PDF", size: "1.5 MB" },
      { id: "5", name: "1099_Statements.pdf", date: "2025-02-10", type: "PDF", size: "2.1 MB" },
    ]
  }
];

const Documents = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThreeColumnLayout activeMainItem="documents" title="Documents">
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center w-full">
            <div className="h-8 w-48 bg-card rounded-md mb-6"></div>
            <div className="w-full max-w-5xl space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-card rounded-lg w-full"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">All Documents</h1>
            <Button className="bg-accent hover:bg-accent/90">
              <PlusIcon className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
          
          {documentCategories.map((category) => (
            <DashboardCard key={category.id} title={category.title}>
              <div className="space-y-1">
                {category.documents.map((doc) => (
                  <div key={doc.id} className="p-3 hover:bg-sidebar-accent/30 rounded-md transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 p-2 bg-accent/10 rounded-md">
                          <FileTextIcon className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(doc.date).toLocaleDateString()} • {doc.type} • {doc.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ShareIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          ))}
          
          <DashboardCard title="Folder Structure">
            <div className="space-y-1">
              <div className="p-3 hover:bg-sidebar-accent/30 rounded-md transition-colors">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-amber-500/10 rounded-md">
                    <FolderIcon className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Financial Reports</p>
                    <p className="text-xs text-muted-foreground">8 files • Last updated 3 days ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 hover:bg-sidebar-accent/30 rounded-md transition-colors">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-amber-500/10 rounded-md">
                    <FolderIcon className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Tax Documents</p>
                    <p className="text-xs text-muted-foreground">12 files • Last updated 1 week ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 hover:bg-sidebar-accent/30 rounded-md transition-colors">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-amber-500/10 rounded-md">
                    <FolderIcon className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Investment Records</p>
                    <p className="text-xs text-muted-foreground">5 files • Last updated 2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      )}
    </ThreeColumnLayout>
  );
};

export default Documents;
