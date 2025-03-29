
import React, { useState, useMemo } from "react";
import { useProfessionals } from "@/hooks/useProfessionals";
import { ProfessionalDetailsSheet } from "./ProfessionalDetailsSheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Phone, Mail, Building, User } from "lucide-react";
import { Professional, ProfessionalType } from "@/types/professional";

export function ProfessionalsDirectory() {
  const { professionals } = useProfessionals();
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const professionalTypes = useMemo(() => {
    const types = new Set<string>();
    professionals.forEach(pro => types.add(pro.type));
    return Array.from(types);
  }, [professionals]);

  const filteredProfessionals = useMemo(() => {
    return professionals.filter(pro => {
      const matchesSearch = 
        searchQuery === "" || 
        pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pro.company && pro.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        pro.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === "all" || pro.type === activeTab;
      
      return matchesSearch && matchesTab;
    });
  }, [professionals, searchQuery, activeTab]);

  const handleOpenDetails = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search professionals..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex flex-wrap h-auto">
          <TabsTrigger value="all" className="mb-1">All</TabsTrigger>
          {professionalTypes.map(type => (
            <TabsTrigger key={type} value={type} className="mb-1">
              {type}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
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
                {searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Add professionals to start building your directory"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ProfessionalDetailsSheet
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        professional={selectedProfessional}
      />
    </div>
  );
}
