import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Star,
  CalendarPlus,
  CheckCircle 
} from "lucide-react";
import { toast } from "sonner";

interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  type: "live" | "on-demand" | "vip";
  maxAttendees?: number;
  currentAttendees: number;
  instructor: string;
  isRegistered?: boolean;
}

const workshops: Workshop[] = [
  {
    id: "1",
    title: "Advanced Estate Planning Strategies for HNW Families",
    description: "Explore sophisticated trust structures, tax optimization, and multi-generational wealth transfer techniques.",
    date: "2024-02-15",
    time: "2:00 PM",
    duration: "90 min",
    type: "vip",
    maxAttendees: 25,
    currentAttendees: 18,
    instructor: "Sarah Johnson, CFP®"
  },
  {
    id: "2",
    title: "Private Market Opportunities in 2024",
    description: "Navigate private equity, real estate, and alternative investments for sophisticated portfolios.",
    date: "2024-02-20",
    time: "7:00 PM",
    duration: "60 min",
    type: "live",
    maxAttendees: 50,
    currentAttendees: 32,
    instructor: "Michael Chen, CFA"
  },
  {
    id: "3",
    title: "Building Your Family Office Blueprint",
    description: "Complete workshop series covering governance, investment strategy, and next-gen preparation.",
    date: "Available Now",
    time: "Self-paced",
    duration: "4 hours",
    type: "on-demand",
    currentAttendees: 127,
    instructor: "David Rodriguez, CFP®"
  }
];

export function WorkshopHub() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    company: ""
  });

  const handleRegistration = (workshop: Workshop) => {
    if (!registrationData.name || !registrationData.email) {
      toast.error("Please fill in your name and email to register");
      return;
    }

    // In a real implementation, this would integrate with your CRM/calendar system
    toast.success(`Successfully registered for "${workshop.title}"`);
    setSelectedWorkshop(null);
    setRegistrationData({ name: "", email: "", company: "" });
  };

  const getWorkshopBadge = (type: Workshop["type"]) => {
    switch (type) {
      case "vip":
        return <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">VIP Exclusive</Badge>;
      case "live":
        return <Badge variant="destructive">Live Workshop</Badge>;
      case "on-demand":
        return <Badge variant="secondary">On-Demand</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Exclusive Workshops & Masterclasses</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join our CFP® professionals for deep-dive sessions on advanced wealth management strategies. 
          Limited seats available for personalized attention.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workshops.map((workshop) => (
          <Card key={workshop.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  {getWorkshopBadge(workshop.type)}
                  <CardTitle className="text-lg">{workshop.title}</CardTitle>
                </div>
                {workshop.type === "vip" && <Star className="h-5 w-5 text-amber-500" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {workshop.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{workshop.date}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{workshop.time} • {workshop.duration}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {workshop.currentAttendees} registered
                    {workshop.maxAttendees && ` • ${workshop.maxAttendees - workshop.currentAttendees} spots left`}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-3">
                  Instructor: {workshop.instructor}
                </p>
                
                {workshop.isRegistered ? (
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Registered
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setSelectedWorkshop(workshop)} 
                    className="w-full"
                    variant={workshop.type === "vip" ? "default" : "outline"}
                  >
                    {workshop.type === "on-demand" ? (
                      <>
                        <Video className="h-4 w-4 mr-2" />
                        Watch Now
                      </>
                    ) : (
                      <>
                        <CalendarPlus className="h-4 w-4 mr-2" />
                        Register Now
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Registration Modal */}
      {selectedWorkshop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Register for Workshop</CardTitle>
              <p className="text-sm text-muted-foreground">{selectedWorkshop.title}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  value={registrationData.company}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Your company name"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedWorkshop(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleRegistration(selectedWorkshop)}
                  className="flex-1"
                >
                  Save My Seat
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                By registering, you agree to receive workshop updates and educational content. 
                No sales calls - educational content only.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}