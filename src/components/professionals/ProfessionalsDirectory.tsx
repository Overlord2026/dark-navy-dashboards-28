
import React, { useState, useMemo } from "react";
import { useProfessionals } from "@/context/ProfessionalsContext";
import { ProfessionalDetailsSheet } from "./ProfessionalDetailsSheet";
import { ProfessionalCategories } from "./ProfessionalCategories";
import { ProfessionalBadges } from "./ProfessionalBadges";
import { ProfessionalActionButton } from "./ProfessionalActionButton";
import { CustomFieldsEditor } from "./CustomFieldsEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Phone, Mail, Building, User, Loader2, ChevronDown, Star } from "lucide-react";
import { Professional } from "@/types/professional";
import { StaggeredList, StaggeredItem } from "@/components/animations/StaggeredList";

export function ProfessionalsDirectory() {
  const { professionals, loading } = useProfessionals();
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedCustomFields, setExpandedCustomFields] = useState<Record<string, boolean>>({});

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
          <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfessionals.map((professional) => (
              <StaggeredItem key={professional.id}>
                <Card className="hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col h-full">
                      <div className="mb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-medium line-clamp-1">{professional.name}</h3>
                            <Badge variant="outline" className="mt-1">
                              {professional.type}
                            </Badge>
                            {professional.rating && (
                              <div className="flex items-center mt-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-muted-foreground ml-1">
                                  {professional.rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <ProfessionalBadges professional={professional} />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        {professional.company && (
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Building className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                            <span className="line-clamp-1">{professional.company}</span>
                          </div>
                        )}
                        
                        {professional.show_phone !== false && professional.phone && (
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Phone className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                            <span className="line-clamp-1">{professional.phone}</span>
                          </div>
                        )}
                        
                        {professional.show_email !== false && professional.email && (
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Mail className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                            <span className="line-clamp-1">{professional.email}</span>
                          </div>
                        )}

                        {professional.custom_fields && Object.keys(professional.custom_fields).length > 0 && (
                          <Collapsible 
                            open={expandedCustomFields[professional.id]} 
                            onOpenChange={(open) => 
                              setExpandedCustomFields(prev => ({ ...prev, [professional.id]: open }))
                            }
                          >
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-6 text-xs">
                                Additional Info
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2">
                              <CustomFieldsEditor
                                customFields={professional.custom_fields}
                                onChange={() => {}}
                                editable={false}
                              />
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <ProfessionalActionButton
                          professional={professional}
                          onRequestIntro={() => handleOpenDetails(professional)}
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-xs"
                          onClick={() => handleOpenDetails(professional)}
                        >
                          View Full Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggeredItem>
            ))}
          </StaggeredList>
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
