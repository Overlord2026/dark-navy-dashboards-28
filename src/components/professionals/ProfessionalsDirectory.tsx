
import React, { useState, useMemo } from "react";
import { useProfessionals } from "@/context/ProfessionalsContext";
import { ProfessionalDetailsSheet } from "./ProfessionalDetailsSheet";
import { ProfessionalCategories } from "./ProfessionalCategories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Building, User, Loader2 } from "lucide-react";
import { Professional } from "@/types/professional";

export function ProfessionalsDirectory() {
  const { professionals, loading } = useProfessionals();
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProfessionals = useMemo(() => {
    return professionals.filter(pro => {
      const matchesCategory = activeCategory === "all" || pro.type === activeCategory;
      return matchesCategory;
    });
  }, [professionals, activeCategory]);

  const handleOpenDetails = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsDetailsOpen(true);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading professionals...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfessionalCategories 
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-4">
          {activeCategory === "all" 
            ? "All Professionals" 
            : `${activeCategory} Directory`}
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({filteredProfessionals.length} {filteredProfessionals.length === 1 ? "professional" : "professionals"})
          </span>
        </h2>

        {filteredProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfessionals.map((professional) => (
              <Card 
                key={professional.id} 
                className="hover:border-primary transition-colors cursor-pointer"
                onClick={() => handleOpenDetails(professional)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="font-medium line-clamp-1">{professional.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {professional.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm space-y-1">
                      {professional.company && (
                        <div className="flex items-center text-muted-foreground">
                          <Building className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{professional.company}</span>
                        </div>
                      )}
                      
                      {professional.phone && (
                        <div className="flex items-center text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{professional.phone}</span>
                        </div>
                      )}
                      
                      {professional.email && (
                        <div className="flex items-center text-muted-foreground">
                          <Mail className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{professional.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-xs border border-input hover:bg-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetails(professional);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No professionals found</h3>
            <p className="text-muted-foreground mt-1">
              {activeCategory === "all" 
                ? "Add professionals to start building your directory"
                : `No professionals found in the ${activeCategory} category`
              }
            </p>
          </div>
        )}
      </div>

      <ProfessionalDetailsSheet
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        professional={selectedProfessional}
      />
    </div>
  );
}
