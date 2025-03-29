
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  UserCircle, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Calendar, 
  Edit, 
  Trash2, 
  Star, 
  StarHalf, 
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfessionalDetailsSheet } from "@/components/professionals/ProfessionalDetailsSheet";
import { useProfessionals } from "@/hooks/useProfessionals";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProfessionalType } from "@/types/professional";
import { toast } from "sonner";

export const ProfessionalsDirectory = () => {
  const { professionals, removeProfessional } = useProfessionals();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeProfessional, setActiveProfessional] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (professionalId: string) => {
    setActiveProfessional(professionalId);
    setIsDetailsOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from your professionals?`)) {
      removeProfessional(id);
      toast.success(`${name} has been removed from your professionals`);
    }
  };

  const filteredProfessionals = professionals.filter(pro => 
    pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pro.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pro.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const professionalsByType: Record<ProfessionalType, typeof professionals> = {
    "Accountant/CPA": [],
    "Financial Advisor": [],
    "Attorney": [],
    "Realtor": [],
    "Dentist": [],
    "Physician": [],
    "Banker": [],
    "Consultant": [],
    "Service Professional": [],
    "Other": []
  };

  filteredProfessionals.forEach(professional => {
    professionalsByType[professional.type].push(professional);
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Search professionals by name, company or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {professionals.length === 0 ? (
        <Card className="border border-border/30">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No professionals added yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Add your family's professionals such as accountants, attorneys, financial advisors and doctors to keep track of their contact information.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-4 overflow-x-auto flex-nowrap whitespace-nowrap">
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.entries(professionalsByType).map(([type, pros]) => (
              pros.length > 0 && (
                <TabsTrigger key={type} value={type}>
                  {type} ({pros.length})
                </TabsTrigger>
              )
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProfessionals.length > 0 ? (
                filteredProfessionals.map(professional => (
                  <Card key={professional.id} className="h-full border border-border/30 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="mb-2">
                          {professional.type}
                        </Badge>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleViewDetails(professional.id)}
                          >
                            <FileText size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleDelete(professional.id, professional.name)}
                          >
                            <Trash2 size={16} className="text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{professional.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        {professional.company && (
                          <>{professional.company}</>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {professional.phone && (
                          <div className="flex items-center text-sm">
                            <Phone size={14} className="mr-2 text-muted-foreground" />
                            <span>{professional.phone}</span>
                          </div>
                        )}
                        {professional.email && (
                          <div className="flex items-center text-sm">
                            <Mail size={14} className="mr-2 text-muted-foreground" />
                            <span>{professional.email}</span>
                          </div>
                        )}
                        {professional.address && (
                          <div className="flex items-center text-sm">
                            <MapPin size={14} className="mr-2 text-muted-foreground" />
                            <span>{professional.address}</span>
                          </div>
                        )}
                        {professional.website && (
                          <div className="flex items-center text-sm">
                            <ExternalLink size={14} className="mr-2 text-muted-foreground" />
                            <a 
                              href={professional.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/30 flex justify-between">
                        <div className="flex">
                          {Array.from({length: Math.floor(professional.rating || 0)}).map((_, i) => (
                            <Star key={i} size={16} className="text-yellow-500" />
                          ))}
                          {professional.rating && professional.rating % 1 !== 0 && (
                            <StarHalf size={16} className="text-yellow-500" />
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDetails(professional.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No professionals match your search criteria</p>
                </div>
              )}
            </div>
          </TabsContent>

          {Object.entries(professionalsByType).map(([type, pros]) => (
            <TabsContent key={type} value={type} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pros.length > 0 ? (
                  pros.map(professional => (
                    <Card key={professional.id} className="h-full border border-border/30 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline" className="mb-2">
                            {professional.type}
                          </Badge>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => handleViewDetails(professional.id)}
                            >
                              <FileText size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => handleDelete(professional.id, professional.name)}
                            >
                              <Trash2 size={16} className="text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{professional.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          {professional.company && (
                            <>{professional.company}</>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {professional.phone && (
                            <div className="flex items-center text-sm">
                              <Phone size={14} className="mr-2 text-muted-foreground" />
                              <span>{professional.phone}</span>
                            </div>
                          )}
                          {professional.email && (
                            <div className="flex items-center text-sm">
                              <Mail size={14} className="mr-2 text-muted-foreground" />
                              <span>{professional.email}</span>
                            </div>
                          )}
                          {professional.address && (
                            <div className="flex items-center text-sm">
                              <MapPin size={14} className="mr-2 text-muted-foreground" />
                              <span>{professional.address}</span>
                            </div>
                          )}
                          {professional.website && (
                            <div className="flex items-center text-sm">
                              <ExternalLink size={14} className="mr-2 text-muted-foreground" />
                              <a 
                                href={professional.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Website
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/30 flex justify-between">
                          <div className="flex">
                            {Array.from({length: Math.floor(professional.rating || 0)}).map((_, i) => (
                              <Star key={i} size={16} className="text-yellow-500" />
                            ))}
                            {professional.rating && professional.rating % 1 !== 0 && (
                              <StarHalf size={16} className="text-yellow-500" />
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDetails(professional.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-muted-foreground">No professionals found for this category</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {activeProfessional && (
        <ProfessionalDetailsSheet
          professionalId={activeProfessional}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  );
};
