
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FileText, Shield, Heart, Home, Car, Umbrella } from "lucide-react";
import { useInsuranceStore } from "@/hooks/useInsuranceStore";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const PersonalInsuranceDashboard = () => {
  const { 
    policies, 
    policyTypes, 
    totalPremium, 
    totalCoverage 
  } = useInsuranceStore();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const isMobile = useIsMobile();

  // Group policies by type for the summary
  const policyCountByType = policies.reduce((acc, policy) => {
    acc[policy.type] = (acc[policy.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
      )}>
        <Card className={cn(
          "flex flex-col items-center justify-center text-center",
          isMobile ? "p-3" : "p-4"
        )}>
          <h3 className={cn(
            "font-medium mb-1",
            isMobile ? "text-base" : "text-lg"
          )}>Total Policies</h3>
          <p className={cn(
            "font-bold",
            isMobile ? "text-2xl" : "text-3xl"
          )}>{policies.length}</p>
          <p className={cn(
            "text-muted-foreground mt-2",
            isMobile ? "text-xs" : "text-sm"
          )}>Across {Object.keys(policyCountByType).length} categories</p>
        </Card>
        
        <Card className={cn(
          "flex flex-col items-center justify-center text-center",
          isMobile ? "p-3" : "p-4"
        )}>
          <h3 className={cn(
            "font-medium mb-1",
            isMobile ? "text-base" : "text-lg"
          )}>Annual Premiums</h3>
          <p className={cn(
            "font-bold",
            isMobile ? "text-2xl" : "text-3xl"
          )}>${totalPremium.toLocaleString()}</p>
          <p className={cn(
            "text-muted-foreground mt-2",
            isMobile ? "text-xs" : "text-sm"
          )}>Total yearly cost</p>
        </Card>
        
        <Card className={cn(
          "flex flex-col items-center justify-center text-center",
          isMobile ? "p-3" : "p-4"
        )}>
          <h3 className={cn(
            "font-medium mb-1",
            isMobile ? "text-base" : "text-lg"
          )}>Total Coverage</h3>
          <p className={cn(
            "font-bold",
            isMobile ? "text-2xl" : "text-3xl"
          )}>${totalCoverage.toLocaleString()}</p>
          <p className={cn(
            "text-muted-foreground mt-2",
            isMobile ? "text-xs" : "text-sm"
          )}>Combined protection</p>
        </Card>
      </div>
      
      <h3 className={cn(
        "font-medium mb-3",
        isMobile ? "text-lg" : "text-xl"
      )}>Policy Types</h3>
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        <PolicyTypeCard 
          title="Life Insurance" 
          count={policyCountByType['term-life'] || 0 + policyCountByType['permanent-life'] || 0} 
          icon={<Heart className={cn("text-red-500", isMobile ? "h-6 w-6" : "h-8 w-8")} />} 
          href="#life" 
        />
        <PolicyTypeCard 
          title="Annuities" 
          count={policyCountByType['annuity'] || 0} 
          icon={<FileText className={cn("text-blue-500", isMobile ? "h-6 w-6" : "h-8 w-8")} />} 
          href="#annuities" 
        />
        <PolicyTypeCard 
          title="Health Insurance" 
          count={policyCountByType['health'] || 0 + policyCountByType['long-term-care'] || 0} 
          icon={<Shield className={cn("text-green-500", isMobile ? "h-6 w-6" : "h-8 w-8")} />} 
          href="#health" 
        />
        <PolicyTypeCard 
          title="Property Insurance" 
          count={policyCountByType['homeowners'] || 0 + policyCountByType['auto'] || 0} 
          icon={<Home className={cn("text-amber-500", isMobile ? "h-6 w-6" : "h-8 w-8")} />} 
          href="#property" 
        />
        <PolicyTypeCard 
          title="Umbrella Policies" 
          count={policyCountByType['umbrella'] || 0} 
          icon={<Umbrella className={cn("text-purple-500", isMobile ? "h-6 w-6" : "h-8 w-8")} />} 
          href="#umbrella" 
        />
        <Card className={cn(
          "flex items-center justify-center",
          isMobile ? "p-3" : "p-4"
        )}>
          <Button 
            variant="outline" 
            className={cn(
              "w-full h-full flex flex-col gap-4",
              isMobile ? "py-6 gap-2" : "py-8 gap-4"
            )}
            onClick={() => setIsUploadDialogOpen(true)}
          >
            <Upload className={cn(
              "text-gray-500",
              isMobile ? "h-6 w-6" : "h-8 w-8"
            )} />
            <span className={isMobile ? "text-sm" : ""}>Upload Policy Documents</span>
          </Button>
        </Card>
      </div>
      
      <UploadDocumentDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
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
  const isMobile = useIsMobile();
  
  return (
    <Card className="overflow-hidden">
      <a href={href} className={cn("block h-full", isMobile ? "p-3" : "p-4")}>
        <div className={cn(
          "flex items-center gap-4",
          isMobile ? "gap-3" : "gap-4"
        )}>
          <div className={cn(
            "bg-background rounded-full",
            isMobile ? "p-2" : "p-3"
          )}>
            {icon}
          </div>
          <div>
            <h4 className={cn(
              "font-medium",
              isMobile ? "text-sm" : ""
            )}>{title}</h4>
            <p className={cn(
              "text-muted-foreground",
              isMobile ? "text-xs" : "text-sm"
            )}>
              {count} {count === 1 ? 'policy' : 'policies'}
            </p>
          </div>
        </div>
      </a>
    </Card>
  );
};
