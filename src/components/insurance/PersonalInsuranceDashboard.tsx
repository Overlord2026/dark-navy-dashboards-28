
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FileText, Shield, Heart, Home, Car, Umbrella } from "lucide-react";
import { useInsuranceStore } from "@/hooks/useInsuranceStore";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";

export const PersonalInsuranceDashboard = () => {
  const { 
    policies, 
    policyTypes, 
    totalPremium, 
    totalCoverage 
  } = useInsuranceStore();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  // Group policies by type for the summary
  const policyCountByType = policies.reduce((acc, policy) => {
    acc[policy.type] = (acc[policy.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium mb-1">Total Policies</h3>
          <p className="text-3xl font-bold">{policies.length}</p>
          <p className="text-sm text-muted-foreground mt-2">Across {Object.keys(policyCountByType).length} categories</p>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium mb-1">Annual Premiums</h3>
          <p className="text-3xl font-bold">${totalPremium.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-2">Total yearly cost</p>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium mb-1">Total Coverage</h3>
          <p className="text-3xl font-bold">${totalCoverage.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-2">Combined protection</p>
        </Card>
      </div>
      
      <h3 className="text-xl font-medium mb-3">Policy Types</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PolicyTypeCard 
          title="Life Insurance" 
          count={policyCountByType['term-life'] || 0 + policyCountByType['permanent-life'] || 0} 
          icon={<Heart className="h-8 w-8 text-red-500" />} 
          href="#life" 
        />
        <PolicyTypeCard 
          title="Annuities" 
          count={policyCountByType['annuity'] || 0} 
          icon={<FileText className="h-8 w-8 text-blue-500" />} 
          href="#annuities" 
        />
        <PolicyTypeCard 
          title="Health Insurance" 
          count={policyCountByType['health'] || 0 + policyCountByType['long-term-care'] || 0} 
          icon={<Shield className="h-8 w-8 text-green-500" />} 
          href="#health" 
        />
        <PolicyTypeCard 
          title="Property Insurance" 
          count={policyCountByType['homeowners'] || 0 + policyCountByType['auto'] || 0} 
          icon={<Home className="h-8 w-8 text-amber-500" />} 
          href="#property" 
        />
        <PolicyTypeCard 
          title="Umbrella Policies" 
          count={policyCountByType['umbrella'] || 0} 
          icon={<Umbrella className="h-8 w-8 text-purple-500" />} 
          href="#umbrella" 
        />
        <Card className="p-4 flex items-center justify-center">
          <Button variant="outline" className="w-full h-full flex flex-col py-8 gap-4" onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="h-8 w-8 text-gray-500" />
            <span>Upload Policy Documents</span>
          </Button>
        </Card>
      </div>
      
      <UploadDocumentDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onFileUpload={() => {}}
        activeCategory={activeCategory}
        documentCategories={policyTypes.map(type => ({ id: type.id, name: type.name }))}
      />
    </div>
  );
};

interface PolicyTypeCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  href: string;
}

const PolicyTypeCard = ({ title, count, icon, href }: PolicyTypeCardProps) => {
  return (
    <Card className="overflow-hidden">
      <a href={href} className="block p-4 h-full">
        <div className="flex items-center gap-4">
          <div className="bg-background rounded-full p-3">
            {icon}
          </div>
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">
              {count} {count === 1 ? 'policy' : 'policies'}
            </p>
          </div>
        </div>
      </a>
    </Card>
  );
};
