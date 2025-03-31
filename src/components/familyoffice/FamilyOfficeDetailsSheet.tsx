
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FamilyOffice, TeamMember } from "@/types/familyoffice";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Star, 
  MessageSquare, 
  Mail, 
  Briefcase,
  Check,
  Link
} from "lucide-react";
import { toast } from "sonner";

interface FamilyOfficeDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  familyOffice: FamilyOffice | null;
}

export function FamilyOfficeDetailsSheet({ 
  isOpen, 
  onOpenChange, 
  familyOffice 
}: FamilyOfficeDetailsSheetProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!familyOffice) return null;
  
  const handleContactRequest = () => {
    toast.success("Contact request sent successfully!", {
      description: `A representative from ${familyOffice.name} will reach out to you soon.`
    });
  };
  
  const handleScheduleMeeting = () => {
    toast.success("Meeting request sent!", {
      description: "You'll receive a confirmation email with meeting details shortly."
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl p-0 overflow-y-auto">
        <div className="p-6">
          <SheetHeader className="text-left mb-4">
            <div className="flex justify-between items-start">
              <div>
                <SheetTitle className="text-2xl">{familyOffice.name}</SheetTitle>
                <SheetDescription className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {familyOffice.location}
                </SheetDescription>
              </div>
              <TierBadge tier={familyOffice.tier} />
            </div>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">About</h3>
                <p className="text-sm text-muted-foreground">
                  {familyOffice.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Founded</h4>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {familyOffice.foundedYear}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Clients Served</h4>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {familyOffice.clientCount}+ clients
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Assets Under Management</h4>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ${familyOffice.aum}B+
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Minimum Assets</h4>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ${familyOffice.minimumAssets}M+
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Wealth Tiers Served</h3>
                <div className="flex flex-wrap gap-2">
                  {familyOffice.wealthTiers.includes('emerging') && (
                    <Badge variant="outline">Emerging Wealth ($1M-$5M)</Badge>
                  )}
                  {familyOffice.wealthTiers.includes('affluent') && (
                    <Badge variant="outline">Affluent ($5M-$10M)</Badge>
                  )}
                  {familyOffice.wealthTiers.includes('hnw') && (
                    <Badge variant="outline">High-Net-Worth ($10M-$30M)</Badge>
                  )}
                  {familyOffice.wealthTiers.includes('uhnw') && (
                    <Badge variant="outline">Ultra-High-Net-Worth ($30M+)</Badge>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Key Services</h3>
                <div className="flex flex-wrap gap-2">
                  {familyOffice.services.map(service => (
                    <Badge key={service.id} variant="secondary">{service.name}</Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="services" className="space-y-6">
              <p className="text-sm text-muted-foreground">
                {familyOffice.name} offers a comprehensive suite of services tailored to high-net-worth individuals and families.
              </p>
              
              <div className="space-y-4">
                {familyOffice.services.map(service => (
                  <Card key={service.id}>
                    <CardContent className="p-4">
                      <h3 className="font-medium flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {service.description}
                      </p>
                      {service.highlights && (
                        <div className="mt-3">
                          <h4 className="text-xs font-medium uppercase text-muted-foreground mb-2">Key Features</h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {service.highlights.map((highlight, idx) => (
                              <li key={idx} className="text-sm flex items-start">
                                <Check className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-6">
              <h3 className="font-medium mb-2">Leadership Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {familyOffice.team.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium">Client Reviews</h3>
                  <p className="text-sm text-muted-foreground">
                    {familyOffice.reviewCount} verified reviews
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold mr-2">{familyOffice.rating.toFixed(1)}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(familyOffice.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {familyOffice.reviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{review.clientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium">{review.clientName}</h4>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{review.comment}</p>
                    {review.response && (
                      <div className="mt-3 pl-3 border-l-2 border-muted">
                        <p className="text-xs font-medium">Response from {familyOffice.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{review.response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <Separator />
        
        <div className="p-6 bg-muted/40">
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleContactRequest} className="gap-2">
              <Mail className="h-4 w-4" />
              Request Contact
            </Button>
            <Button variant="outline" onClick={handleScheduleMeeting} className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
          
          {familyOffice.website && (
            <div className="mt-4">
              <Button variant="ghost" className="w-full text-sm gap-2" asChild>
                <a href={familyOffice.website} target="_blank" rel="noopener noreferrer">
                  <Link className="h-4 w-4" />
                  Visit Website
                </a>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function TierBadge({ tier }: { tier: 'foundational' | 'intermediate' | 'advanced' }) {
  let color = "bg-blue-100 text-blue-800";
  let label = "Foundational";
  
  if (tier === 'intermediate') {
    color = "bg-purple-100 text-purple-800";
    label = "Intermediate";
  } else if (tier === 'advanced') {
    color = "bg-green-100 text-green-800";
    label = "Advanced";
  }
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex items-start space-x-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={member.image} alt={member.name} />
        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="font-medium">{member.name}</h4>
        <p className="text-sm text-muted-foreground">{member.title}</p>
        <p className="text-sm mt-1 line-clamp-3">{member.bio}</p>
      </div>
    </div>
  );
}
