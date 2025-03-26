
import { useState, useEffect, useRef } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { 
  FileTextIcon, 
  FolderIcon, 
  UploadIcon, 
  PlusIcon, 
  ChevronRightIcon,
  ChevronUpIcon,
  ArrowUpIcon 
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const documentCategories = [
  { id: "farther-records", name: "Farther Records", active: true },
  { id: "manually-tracked-assets", name: "Manually-Tracked Assets" },
  { id: "business-ownership", name: "Business Ownership" },
  { id: "education", name: "Education" },
  { id: "employer-agreements", name: "Employer Agreements" },
  { id: "estate-planning", name: "Estate Planning" },
  { id: "insurance-policies", name: "Insurance Policies" },
  { id: "leases", name: "Leases" },
  { id: "other", name: "Other" },
  { id: "property-ownership", name: "Property Ownership" },
  { id: "statements", name: "Statements" },
  { id: "taxes", name: "Taxes" },
  { id: "trusts", name: "Trusts" },
  { id: "vehicles", name: "Vehicles" },
];

const sampleFolders = [
  { id: "1", name: "Signed Documents", type: "folder", date: "2025-02-10", size: "453kB" },
];

const Documents = () => {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("farther-records");
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (activeCategory === "farther-records") {
        setDocuments(sampleFolders);
      } else {
        setDocuments([]);
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setLoading(true);
    setActiveCategory(categoryId);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          toast({
            title: "Upload complete",
            description: `Successfully uploaded ${files[0].name}`,
          });
          
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  const activeCategoryName = documentCategories.find(cat => cat.id === activeCategory)?.name || "";

  const renderContent = () => {
    if (loading) {
      return (
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
      );
    }

    if (documents.length === 0) {
      const emptyMessage = activeCategory === "manually-tracked-assets" 
        ? `There are no files in ${activeCategoryName}`
        : `You haven't uploaded any files to ${activeCategoryName}`;

      return (
        <div className="flex flex-col items-center justify-center py-16">
          <h3 className="text-xl font-medium mb-2">No files</h3>
          <p className="text-muted-foreground text-center mb-6">{emptyMessage}</p>
          {activeCategory !== "manually-tracked-assets" && (
            <Button onClick={handleUploadClick} className="bg-white hover:bg-white/90 text-black">
              <UploadIcon className="h-4 w-4 mr-2" />
              Upload
            </Button>
          )}
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[500px]">Name</TableHead>
            <TableHead className="text-right">Created</TableHead>
            <TableHead className="text-right">Type</TableHead>
            <TableHead className="text-right">Size</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} className="hover:bg-sidebar-accent/30">
              <TableCell className="font-medium flex items-center">
                <div className="mr-3 p-2 bg-amber-500/10 rounded-md">
                  <FolderIcon className="h-5 w-5 text-amber-400" />
                </div>
                <div className="flex items-center">
                  {doc.name}
                  {doc.type === "folder" && (
                    <ChevronRightIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">{new Date(doc.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right capitalize">{doc.type}</TableCell>
              <TableCell className="text-right">{doc.size}</TableCell>
              <TableCell className="text-right">•••</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <ThreeColumnLayout 
      activeMainItem="documents" 
      activeSecondaryItem={activeCategory} 
      title="Documents"
      secondaryMenuItems={documentCategories}
    >
      <div className="max-w-full mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-lg">
            <span className="text-white font-medium">Documents</span>
            <ChevronRightIcon className="h-5 w-5 mx-1 text-muted-foreground" />
            <span className="text-white font-medium">{activeCategoryName}</span>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-accent/50 hover:bg-accent/10 hover:text-white">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button onClick={handleUploadClick} className="bg-accent hover:bg-accent/90">
              <UploadIcon className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {isUploading && (
          <div className="p-4 bg-card rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Uploading...</span>
              <span className="text-sm">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        <div className="bg-card border border-border/50 rounded-lg overflow-hidden">
          {renderContent()}
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange}
        multiple 
      />
    </ThreeColumnLayout>
  );
};

export default Documents;
