
import React, { useState } from "react";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Mail, 
  Star, 
  ExternalLink, 
  Clock, 
  DollarSign, 
  Award, 
  BookOpen,
  MessageSquare,
  FileText,
  UserCheck
} from "lucide-react";
import { MarketplaceListing } from "@/hooks/useMarketplace";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MarketplaceListingDetailsProps {
  listing: MarketplaceListing;
}

export function MarketplaceListingDetails({ listing }: MarketplaceListingDetailsProps) {
  // Added state for consultation scheduling
  const [consultationDate, setConsultationDate] = useState<string>("");
  
  const formatPrice = () => {
    if (!listing.price) {
      return listing.priceType === "contact" 
        ? "Contact for pricing" 
        : "Custom pricing";
    }
    
    switch (listing.priceType) {
      case "monthly":
        return `$${listing.price}/month`;
      case "annual":
        return `$${listing.price}/year`;
      case "one-time":
        return `$${listing.price}`;
      default:
        return `$${listing.price}`;
    }
  };
  
  // Sample professional profile data that would come from the API in a real implementation
  const professionalProfile = {
    name: listing.provider.name,
    title: listing.category === "wealth-management" ? "Wealth Management Advisor" :
           listing.category === "tax-planning" ? "Tax Planning Specialist" :
           listing.category === "estate-planning" ? "Estate Planning Attorney" :
           listing.category === "concierge-services" ? "Lifestyle Concierge" :
           "Family Governance Consultant",
    photo: listing.provider.logo,
    biography: `With over 15 years of experience in ${listing.title.toLowerCase()}, our team provides exceptional service tailored to high-net-worth individuals and families. We take a holistic approach to understanding your unique needs and delivering customized solutions.`,
    credentials: [
      "Certified Financial Planner (CFP®)",
      "Chartered Financial Analyst (CFA)",
      "MBA, Stanford University",
      "BS in Finance, University of Pennsylvania"
    ],
    specializations: [
      "Multi-generational wealth planning",
      "Tax-efficient investment strategies",
      "Alternative investment opportunities",
      "Family office structure optimization"
    ],
    services: [
      {
        name: "Initial Consultation",
        description: "A comprehensive assessment of your current situation and goals",
        price: "Complimentary"
      },
      {
        name: "Customized Strategy Development",
        description: "Development of tailored solutions for your specific needs",
        price: "$5,000 - $15,000"
      },
      {
        name: "Ongoing Advisory Services",
        description: "Continuous management and adjustment of your portfolio and strategy",
        price: "Based on assets under management"
      }
    ],
    pricingModel: listing.priceType === "one-time" ? "Fixed Project Fee" :
                  listing.priceType === "custom" ? "Custom Quote Based on Requirements" :
                  "Custom Quote Based on Requirements",
    testimonials: [
      {
        author: "Jonathan D.",
        text: "The team's expertise has been invaluable in optimizing our family's wealth strategy. Highly recommended.",
        rating: 5
      },
      {
        author: "Sarah M.",
        text: "Professional, knowledgeable, and attentive to our specific needs. Excellent service.",
        rating: 5
      }
    ]
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="border-none shadow-none">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-bold">{listing.title}</CardTitle>
              <CardDescription className="text-base">
                {listing.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0 space-y-6">
              <div className="flex items-center space-x-2">
                <Avatar className="h-12 w-12">
                  {professionalProfile.photo ? (
                    <AvatarImage src={professionalProfile.photo} alt={professionalProfile.name} />
                  ) : (
                    <AvatarFallback>{professionalProfile.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{professionalProfile.name}</p>
                  <p className="text-sm text-muted-foreground">{professionalProfile.title}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {formatPrice()}
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {listing.priceType === "one-time" ? "One-time fee" : "Subscription"}
                </Badge>
              </div>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="professional">Professional Profile</TabsTrigger>
                  <TabsTrigger value="services">Services & Pricing</TabsTrigger>
                  <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Service Overview</h3>
                    <p className="text-muted-foreground">
                      {listing.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">What's Included</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Personalized service tailored to your needs</li>
                      <li>Regular updates and communications</li>
                      <li>Expert guidance and support</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Service Details</h3>
                    <p className="text-muted-foreground">
                      Detailed information about this service will be provided during your initial consultation.
                    </p>
                  </div>
                </TabsContent>
                
                {/* New Professional Profile Tab */}
                <TabsContent value="professional" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Biography</h3>
                    <p className="text-muted-foreground">
                      {professionalProfile.biography}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Credentials & Education</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {professionalProfile.credentials.map((credential, index) => (
                        <li key={index}>{credential}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Areas of Specialization</h3>
                    <div className="flex flex-wrap gap-2">
                      {professionalProfile.specializations.map((specialization, index) => (
                        <Badge key={index} variant="secondary" className="text-xs py-1">
                          {specialization}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                {/* New Services & Pricing Tab */}
                <TabsContent value="services" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Services Offered</h3>
                    <div className="space-y-4">
                      {professionalProfile.services.map((service, index) => (
                        <div key={index} className="p-4 border rounded-md">
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-muted-foreground my-2">{service.description}</p>
                          <div className="flex items-center text-sm mt-2">
                            <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{service.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Pricing Model</h3>
                    <p className="text-muted-foreground">
                      <span className="font-medium">{professionalProfile.pricingModel}:</span> {formatPrice()}
                    </p>
                  </div>
                </TabsContent>
                
                {/* New Testimonials Tab */}
                <TabsContent value="testimonials" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Client Testimonials</h3>
                    <div className="space-y-4">
                      {professionalProfile.testimonials.map((testimonial, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-md">
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < testimonial.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} 
                              />
                            ))}
                          </div>
                          <p className="text-sm italic mb-2">"{testimonial.text}"</p>
                          <p className="text-sm font-medium">— {testimonial.author}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Get Started</CardTitle>
              <CardDescription>
                Learn more about this service or inquire directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">
                {formatPrice()}
              </p>
              
              <div className="space-y-2">
                <Button className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  Inquire About Service
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Consultation
                </Button>
                <Button variant="ghost" className="w-full gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Visit Provider Website
                </Button>
              </div>
              
              {/* Added scheduling section */}
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Available Consultation Times</h4>
                <div className="grid grid-cols-2 gap-2">
                  {["Today 2PM", "Today 4PM", "Tomorrow 10AM", "Tomorrow 1PM"].map((time, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => setConsultationDate(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                {consultationDate && (
                  <div className="mt-3 p-2 bg-primary/10 rounded text-xs">
                    Selected: <span className="font-medium">{consultationDate}</span>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground text-center mt-4">
                By inquiring, you agree to our marketplace terms and conditions
              </div>
            </CardContent>
            
            <CardFooter className="flex-col gap-2 pt-0">
              <div className="w-full flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  <span>Top Provider</span>
                </div>
                <div className="flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-green-500" />
                  <span>Verified</span>
                </div>
              </div>
            </CardFooter>
          </Card>
          
          {/* New Credentials Card */}
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Credentials & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Award className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Certified Professional</h4>
                  <p className="text-xs text-muted-foreground">
                    All credentials verified and up-to-date
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <BookOpen className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Advanced Education</h4>
                  <p className="text-xs text-muted-foreground">
                    Graduate degree in relevant field
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Service Guarantee</h4>
                  <p className="text-xs text-muted-foreground">
                    Satisfaction guaranteed or money back
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Responsive Communication</h4>
                  <p className="text-xs text-muted-foreground">
                    24-hour response time guaranteed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
