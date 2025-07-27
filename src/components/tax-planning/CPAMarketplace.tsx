import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Calendar, MessageSquare, Shield, Award, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { analytics } from "@/lib/analytics";

interface TaxProfessional {
  id: string;
  name: string;
  credentials: string[];
  location: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  specialties: string[];
  bio: string;
  avatar?: string;
  verified: boolean;
  yearsExperience: number;
  availableSlots: string[];
}

const mockProfessionals: TaxProfessional[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    credentials: ['CPA', 'CFP'],
    location: 'New York, NY',
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 250,
    specialties: ['High Net Worth', 'International Tax', 'Estate Planning'],
    bio: 'Specialized in complex tax situations for high-net-worth individuals and families. 15+ years experience with international taxation and estate planning.',
    verified: true,
    yearsExperience: 15,
    availableSlots: ['Tomorrow 2:00 PM', 'Thursday 10:00 AM', 'Friday 3:00 PM']
  },
  {
    id: '2',
    name: 'Michael Chen',
    credentials: ['CPA', 'EA'],
    location: 'San Francisco, CA',
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 200,
    specialties: ['Small Business', 'Startup Tax', 'R&D Credits'],
    bio: 'Helping entrepreneurs and small businesses navigate complex tax regulations. Expert in startup taxation and R&D credit optimization.',
    verified: true,
    yearsExperience: 12,
    availableSlots: ['Today 4:00 PM', 'Wednesday 11:00 AM', 'Thursday 1:00 PM']
  },
  {
    id: '3',
    name: 'Lisa Rodriguez',
    credentials: ['EA', 'MST'],
    location: 'Austin, TX',
    rating: 4.7,
    reviewCount: 156,
    hourlyRate: 180,
    specialties: ['State Tax', 'Multi-State Planning', 'Real Estate'],
    bio: 'State tax planning specialist with extensive experience in multi-state taxation and real estate investment strategies.',
    verified: true,
    yearsExperience: 10,
    availableSlots: ['Wednesday 9:00 AM', 'Thursday 2:00 PM', 'Friday 11:00 AM']
  }
];

export function CPAMarketplace() {
  const [selectedProfessional, setSelectedProfessional] = useState<TaxProfessional | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const handleConnect = (professional: TaxProfessional) => {
    setSelectedProfessional(professional);
    setShowContactForm(true);
    
    analytics.track('cpa_profile_viewed', {
      professional_id: professional.id,
      professional_name: professional.name,
      hourly_rate: professional.hourlyRate,
      specialties: professional.specialties
    });
  };

  const handleSubmitContact = () => {
    analytics.track('cpa_contact_submitted', {
      professional_id: selectedProfessional?.id,
      professional_name: selectedProfessional?.name,
      contact_method: 'marketplace_form'
    });

    // In production, this would submit to backend
    console.log('Contact request submitted:', {
      professional: selectedProfessional,
      name: contactName,
      email: contactEmail,
      message: contactMessage
    });

    setShowContactForm(false);
    setContactMessage('');
    setContactName('');
    setContactEmail('');
  };

  const handleScheduleCall = (professional: TaxProfessional) => {
    analytics.track('cpa_schedule_attempted', {
      professional_id: professional.id,
      professional_name: professional.name
    });
    
    // In production, would integrate with scheduling system
    window.open("https://calendly.com/tonygomes/talk-with-tony", "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Connect with Tax Professionals</h2>
        <p className="text-muted-foreground">
          Find verified CPAs, EAs, and tax attorneys to help optimize your tax strategy
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockProfessionals.map((professional) => (
          <Card key={professional.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={professional.avatar} />
                    <AvatarFallback>
                      {professional.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{professional.name}</h3>
                      {professional.verified && (
                        <Shield className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex gap-1">
                        {professional.credentials.map(cred => (
                          <Badge key={cred} variant="secondary" className="text-xs">
                            {cred}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{professional.location}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{professional.rating}</span>
                    <span className="text-muted-foreground">({professional.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{professional.yearsExperience}y exp</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">${professional.hourlyRate}/hr</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-1">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {professional.specialties.map(specialty => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {professional.bio}
                </p>
                
                <div className="space-y-2 pt-2">
                  <Button 
                    onClick={() => handleScheduleCall(professional)}
                    className="w-full"
                    size="sm"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule Call
                  </Button>
                  <Button 
                    onClick={() => handleConnect(professional)}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {selectedProfessional?.name}</DialogTitle>
            <DialogDescription>
              Send a message to connect with this tax professional
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Your Name</Label>
              <Input 
                id="contact-name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input 
                id="contact-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea 
                id="contact-message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Describe your tax planning needs..."
                rows={4}
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowContactForm(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmitContact}
              disabled={!contactName || !contactEmail || !contactMessage}
            >
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}