import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Star, MapPin, Clock, DollarSign, Mail, Calendar, MessageSquare, Award, CheckCircle, Users } from 'lucide-react';
import { toast } from 'sonner';

interface AdvisorMatch {
  id: string;
  advisor: {
    id: string;
    name: string;
    firm_name: string;
    email: string;
    phone?: string;
    license_states: string[];
    specializations: string[];
    expertise_areas: string[];
    years_experience: number;
    hourly_rate: number;
    availability_status: string;
    calendly_url?: string;
    bio: string;
    certifications: string[];
    average_rating: number;
    total_reviews: number;
    is_verified: boolean;
  };
  match_score: number;
  ai_reasoning: string;
  expertise_match_details: any;
  availability_match: boolean;
  license_match: boolean;
  budget_match: boolean;
  recommended_order: number;
}

interface AdvisorMatchResultsProps {
  matches: AdvisorMatch[];
  complexityScore: number;
  onSendMessage: (advisorId: string, message: string, subject: string) => void;
  onBookMeeting: (advisorId: string) => void;
  loading?: boolean;
}

export function AdvisorMatchResults({ 
  matches, 
  complexityScore, 
  onSendMessage, 
  onBookMeeting,
  loading = false 
}: AdvisorMatchResultsProps) {
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messageSubject, setMessageSubject] = useState('');

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    return 'Potential Match';
  };

  const formatRate = (rate: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(rate);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleSendMessage = () => {
    if (!selectedAdvisor || !messageText.trim() || !messageSubject.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    onSendMessage(selectedAdvisor, messageText, messageSubject);
    setMessageText('');
    setMessageSubject('');
    setSelectedAdvisor(null);
    toast.success('Message sent successfully!');
  };

  const handleBookMeeting = (advisorId: string, calendlyUrl?: string) => {
    if (calendlyUrl) {
      window.open(calendlyUrl, '_blank');
    } else {
      onBookMeeting(advisorId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Finding your perfect tax specialist...</p>
        </div>
      </div>
    );
  }

  if (!matches.length) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No matches found</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't find specialists matching your criteria. Try adjusting your preferences.
          </p>
          <Button variant="outline">Modify Search</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Your Tax Specialist Matches</h2>
        <p className="text-muted-foreground">
          Based on your complexity score of {complexityScore}/10, here are your top matches:
        </p>
      </div>

      <div className="grid gap-6">
        {matches.map((match) => (
          <Card key={match.id} className="relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge 
                variant="secondary" 
                className={`${getMatchColor(match.match_score)} border-current`}
              >
                {match.match_score}% Match
              </Badge>
            </div>

            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg font-semibold bg-primary/10">
                    {getInitials(match.advisor.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{match.advisor.name}</CardTitle>
                    {match.advisor.is_verified && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  
                  <CardDescription className="text-base">
                    {match.advisor.firm_name}
                  </CardDescription>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{match.advisor.average_rating}/5</span>
                      <span>({match.advisor.total_reviews} reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{match.advisor.years_experience} years</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatRate(match.advisor.hourly_rate)}/hr</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">{getMatchLabel(match.match_score)}</h4>
                <p className="text-sm text-muted-foreground">{match.ai_reasoning}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="font-medium mb-2">Specializations</h5>
                  <div className="flex flex-wrap gap-2">
                    {match.advisor.specializations.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Expertise Areas</h5>
                  <div className="flex flex-wrap gap-2">
                    {match.advisor.expertise_areas.map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">
                        {area.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Licensed in</h5>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{match.advisor.license_states.join(', ')}</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Certifications</h5>
                  <div className="flex flex-wrap gap-2">
                    {match.advisor.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">About</h5>
                  <p className="text-sm text-muted-foreground">{match.advisor.bio}</p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`h-2 w-2 rounded-full ${match.license_match ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>License Match</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`h-2 w-2 rounded-full ${match.budget_match ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>Budget Match</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`h-2 w-2 rounded-full ${match.availability_match ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>Available</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedAdvisor(match.advisor.id)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Message to {match.advisor.name}</DialogTitle>
                      <DialogDescription>
                        Introduce yourself and explain what you're looking for.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-md"
                          placeholder="e.g., Tax planning consultation request"
                          value={messageSubject}
                          onChange={(e) => setMessageSubject(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <Textarea
                          placeholder="Hi, I'm looking for help with..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <Button onClick={handleSendMessage} className="w-full">
                        Send Message
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  className="flex-1"
                  onClick={() => handleBookMeeting(match.advisor.id, match.advisor.calendly_url)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}