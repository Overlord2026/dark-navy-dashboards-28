import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Filter,
  Search,
  MessageSquare,
  Globe,
  Award,
  Users,
  BookOpen,
  Video
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RealEstateMarketplaceProps {
  className?: string;
}

interface PropertyProfessional {
  id: string;
  name: string;
  firm: string;
  type: "realtor" | "property_manager";
  location: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  isFoundingPartner: boolean;
  isVerified: boolean;
  phone: string;
  email: string;
  website?: string;
  bio: string;
  featuredListings?: number;
}

export function RealEstateMarketplace({ className }: RealEstateMarketplaceProps) {
  const [activeTab, setActiveTab] = useState("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "realtor" | "property_manager">("all");

  // Mock data for property professionals
  const professionals: PropertyProfessional[] = [
    {
      id: "1",
      name: "Sarah Chen",
      firm: "Elite Properties Group",
      type: "realtor",
      location: "Beverly Hills, CA",
      specialties: ["Luxury Homes", "Estate Sales", "Investment Properties"],
      rating: 4.9,
      reviewCount: 47,
      isFoundingPartner: true,
      isVerified: true,
      phone: "(310) 555-0123",
      email: "sarah@eliteproperties.com",
      website: "eliteproperties.com",
      bio: "Specializing in ultra-high-net-worth family real estate transactions with 15+ years experience.",
      featuredListings: 12
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      firm: "Prestige Property Management",
      type: "property_manager",
      location: "Manhattan, NY",
      specialties: ["Portfolio Management", "Luxury Rentals", "Commercial Properties"],
      rating: 4.8,
      reviewCount: 63,
      isFoundingPartner: true,
      isVerified: true,
      phone: "(212) 555-0456",
      email: "michael@prestigepm.com",
      website: "prestigepm.com",
      bio: "Managing premium property portfolios for family offices and HNW individuals across NYC.",
      featuredListings: 28
    },
    {
      id: "3",
      name: "Jennifer Walsh",
      firm: "Coastal Realty Partners",
      type: "realtor",
      location: "Malibu, CA",
      specialties: ["Oceanfront Properties", "Vacation Homes", "Estate Planning"],
      rating: 4.7,
      reviewCount: 34,
      isFoundingPartner: false,
      isVerified: true,
      phone: "(310) 555-0789",
      email: "jennifer@coastalrealty.com",
      bio: "Expert in coastal luxury properties and vacation estate transactions.",
      featuredListings: 8
    }
  ];

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = searchQuery === "" || 
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.firm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === "all" || prof.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const foundingPartners = professionals.filter(p => p.isFoundingPartner);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real Estate Professionals</h1>
          <p className="text-muted-foreground">Connect with verified realtors and property managers</p>
        </div>
        <Button>
          <Building2 className="h-4 w-4 mr-2" />
          Add Property Request
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="featured">Featured Partners</TabsTrigger>
          <TabsTrigger value="add-property">Add Property</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, firm, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={selectedType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedType === "realtor" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType("realtor")}
                  >
                    Realtors
                  </Button>
                  <Button
                    variant={selectedType === "property_manager" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType("property_manager")}
                  >
                    Property Managers
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Directory */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((professional) => (
              <Card key={professional.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{professional.name}</CardTitle>
                        {professional.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{professional.firm}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {professional.location}
                      </p>
                    </div>
                    {professional.isFoundingPartner && (
                      <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Founding
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.floor(professional.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{professional.rating}</span>
                    <span className="text-sm text-muted-foreground">({professional.reviewCount} reviews)</span>
                  </div>

                  <p className="text-sm text-muted-foreground">{professional.bio}</p>

                  <div className="flex flex-wrap gap-1">
                    {professional.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  {professional.featuredListings && (
                    <p className="text-xs text-muted-foreground">
                      {professional.featuredListings} active listings
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Consultation
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    {professional.website && (
                      <Button size="sm" variant="outline">
                        <Globe className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Founding Partner Spotlight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {foundingPartners.map((partner) => (
                  <Card key={partner.id} className="border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{partner.name}</h3>
                          <p className="text-muted-foreground">{partner.firm}</p>
                        </div>
                        <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white">
                          Founding Partner
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{partner.bio}</p>
                      <div className="flex items-center gap-4">
                        <Button size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-property" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Property to Portfolio</CardTitle>
              <p className="text-sm text-muted-foreground">
                Connect your property with a trusted professional or request proposals
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-medium mb-2">Assign to Existing Professional</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with a professional you already work with
                    </p>
                    <Button variant="outline" size="sm">Select Professional</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Search className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-medium mb-2">Find New Professional</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Browse our verified directory and book consultations
                    </p>
                    <Button variant="outline" size="sm">Browse Directory</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-medium mb-2">Request Proposals</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get multiple proposals from qualified professionals
                    </p>
                    <Button variant="outline" size="sm">Request Proposals</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Estate Planning Guides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive guides for real estate and estate planning coordination
                </p>
                <Button variant="outline" size="sm">Access Library</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Market Analysis Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Property valuation and market trend analysis tools
                </p>
                <Button variant="outline" size="sm">View Tools</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Investment Checklists
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Due diligence checklists for property investments
                </p>
                <Button variant="outline" size="sm">Download</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Upcoming Real Estate Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Real Estate Market Outlook 2024</h3>
                  <Badge>Webinar</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Join leading experts for insights on luxury real estate trends
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-sm">January 25, 2024 • 2:00 PM EST</span>
                  <Button size="sm">Register</Button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Ask a Property Manager - AMA Session</h3>
                  <Badge>Live Q&A</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Live Q&A with founding property management partners
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-sm">February 1, 2024 • 11:00 AM EST</span>
                  <Button size="sm">Join Session</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}