import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";
import { PremiumPlaceholder } from "@/components/premium/PremiumPlaceholder";
import { 
  Users, 
  Wrench, 
  Home, 
  Shield, 
  DollarSign,
  Star,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

export const PropertyMarketplace: React.FC = () => {
  const { checkFeatureAccess } = useSubscriptionAccess();
  const hasPremiumAccess = checkFeatureAccess('premium');

  if (!hasPremiumAccess) {
    return (
      <PremiumPlaceholder 
        featureId="premium_property_features" 
        featureName="Property Services Marketplace"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold">Property Managers</h3>
                <p className="text-sm text-muted-foreground">Connect with vetted property management companies</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Home className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">Real Estate Agents</h3>
                <p className="text-sm text-muted-foreground">Find agents specializing in your area</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Wrench className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-semibold">Service Providers</h3>
                <p className="text-sm text-muted-foreground">Contractors, inspectors, and maintenance services</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PremiumPlaceholder>
    );
  }

  const serviceProviders = [
    {
      id: "1",
      name: "Elite Property Management",
      type: "Property Manager",
      rating: 4.8,
      reviews: 127,
      specialties: ["Residential", "Commercial", "HOA Management"],
      location: "Los Angeles, CA",
      contact: { phone: "(555) 123-4567", email: "info@elitepm.com" },
      verified: true
    },
    {
      id: "2", 
      name: "Sarah Johnson Realty",
      type: "Real Estate Agent",
      rating: 4.9,
      reviews: 89,
      specialties: ["Luxury Homes", "Investment Properties", "First-time Buyers"],
      location: "San Francisco, CA", 
      contact: { phone: "(555) 987-6543", email: "sarah@johnsonrealty.com" },
      verified: true
    },
    {
      id: "3",
      name: "ProFix Maintenance Services",
      type: "Contractor",
      rating: 4.7,
      reviews: 203,
      specialties: ["HVAC", "Plumbing", "Electrical", "General Repairs"],
      location: "Orange County, CA",
      contact: { phone: "(555) 456-7890", email: "service@profix.com" },
      verified: true
    }
  ];

  const inviteRequests = [
    {
      id: "1",
      property: "Sunset Apartment",
      serviceType: "Property Manager", 
      status: "pending",
      sentDate: "2024-02-15",
      provider: "Elite Property Management"
    },
    {
      id: "2",
      property: "Downtown Condo",
      serviceType: "Real Estate Agent",
      status: "accepted",
      sentDate: "2024-02-10",
      provider: "Sarah Johnson Realty"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Service Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Property Managers</h3>
                <p className="text-sm text-muted-foreground">Full-service property management</p>
                <Badge variant="secondary" className="mt-1">12 Available</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Home className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Real Estate Agents</h3>
                <p className="text-sm text-muted-foreground">Buy, sell, and investment advisors</p>
                <Badge variant="secondary" className="mt-1">28 Available</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Wrench className="h-8 w-8 text-orange-500" />
              <div>
                <h3 className="font-semibold">Service Providers</h3>
                <p className="text-sm text-muted-foreground">Contractors and maintenance</p>
                <Badge variant="secondary" className="mt-1">47 Available</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Service Providers</CardTitle>
          <CardDescription>Vetted professionals with excellent ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceProviders.map((provider) => (
              <div key={provider.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      {provider.type === "Property Manager" && <Users className="h-6 w-6 text-blue-500" />}
                      {provider.type === "Real Estate Agent" && <Home className="h-6 w-6 text-green-500" />}
                      {provider.type === "Contractor" && <Wrench className="h-6 w-6 text-orange-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{provider.name}</h3>
                        {provider.verified && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{provider.type}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{provider.rating} ({provider.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{provider.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {provider.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm">
                      Invite to Property
                    </Button>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Sent Invitations</CardTitle>
          <CardDescription>Track your property service invitations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inviteRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{request.property}</h3>
                  <p className="text-sm text-muted-foreground">
                    {request.serviceType} • {request.provider}
                  </p>
                  <p className="text-xs text-muted-foreground">Sent {request.sentDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={request.status === "accepted" ? "default" : "secondary"}
                    className={request.status === "accepted" ? "bg-green-600" : ""}
                  >
                    {request.status}
                  </Badge>
                  {request.status === "pending" && (
                    <Button size="sm" variant="outline">Resend</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};