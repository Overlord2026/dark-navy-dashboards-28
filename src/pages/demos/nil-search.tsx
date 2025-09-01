import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Search, RotateCcw, Users, Mail, Star, MapPin, DollarSign } from 'lucide-react';
import { recordDecisionRDS } from '@/lib/rds';

interface Athlete {
  id: string;
  name: string;
  sport: string;
  school: string;
  followers: number;
  engagement: number;
  location: string;
  estimatedValue: number;
  verified: boolean;
}

const SAMPLE_ATHLETES: Athlete[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    sport: 'Basketball',
    school: 'Duke University',
    followers: 45200,
    engagement: 8.7,
    location: 'Durham, NC',
    estimatedValue: 2500,
    verified: true
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    sport: 'Football',
    school: 'University of Miami',
    followers: 89100,
    engagement: 12.3,
    location: 'Miami, FL',
    estimatedValue: 5200,
    verified: true
  },
  {
    id: '3',
    name: 'Emma Chen',
    sport: 'Soccer',
    school: 'Stanford University',
    followers: 23800,
    engagement: 15.2,
    location: 'Palo Alto, CA',
    estimatedValue: 1800,
    verified: false
  },
  {
    id: '4',
    name: 'Tyler Washington',
    sport: 'Track & Field',
    school: 'University of Oregon',
    followers: 31500,
    engagement: 9.8,
    location: 'Eugene, OR',
    estimatedValue: 2100,
    verified: true
  }
];

export default function NILSearchDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleSearch = useCallback(() => {
    setShowResults(true);
  }, []);

  const openInviteModal = useCallback((athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setInviteEmail('');
    setShowInviteModal(true);
  }, []);

  const sendInvite = useCallback(() => {
    if (!selectedAthlete || !inviteEmail) return;

    // Emit demo receipt
    const demoReceipt = {
      flow_name: 'nil_athlete_invite',
      timestamp: new Date().toISOString(),
      demo_id: `demo_${Date.now()}`,
      athlete_id: selectedAthlete.id,
      invite_method: 'email'
    };

    // Record RDS (content-free)
    recordDecisionRDS(demoReceipt);

    setShowInviteModal(false);
    toast.success("Invite sent (demo)");
  }, [selectedAthlete, inviteEmail]);

  const resetDemo = useCallback(() => {
    setSearchTerm('');
    setSportFilter('');
    setShowResults(false);
    setShowInviteModal(false);
    setSelectedAthlete(null);
    setInviteEmail('');
    toast.info("Demo reset");
  }, []);

  const filteredAthletes = SAMPLE_ATHLETES.filter(athlete => {
    const matchesSearch = !searchTerm || 
      athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = !sportFilter || athlete.sport.toLowerCase().includes(sportFilter.toLowerCase());
    return matchesSearch && matchesSport;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            NIL Athlete Search & Connect
          </h1>
          <p className="text-lg text-muted-foreground">
            Find and connect with student-athletes for your NIL partnerships
          </p>
          <Button onClick={resetDemo} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Demo
          </Button>
        </div>

        {/* Search Form */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Athletes
            </CardTitle>
            <CardDescription>
              Find student-athletes by name, school, or sport
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Name or School</Label>
                <Input
                  id="search"
                  placeholder="e.g., Duke, Sarah Johnson"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sport">Sport (Optional)</Label>
                <Input
                  id="sport"
                  placeholder="e.g., Basketball, Football"
                  value={sportFilter}
                  onChange={(e) => setSportFilter(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search Athletes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {showResults && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Search Results ({filteredAthletes.length} athletes found)</CardTitle>
              <CardDescription>
                Click "Invite" to send a collaboration request to any athlete
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAthletes.map((athlete) => (
                  <div key={athlete.id} className="border rounded-lg p-4 hover:border-primary/40 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{athlete.name}</h3>
                          {athlete.verified && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{athlete.sport} • {athlete.school}</p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => openInviteModal(athlete)}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Invite
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{athlete.followers.toLocaleString()} followers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{athlete.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>Est. ${athlete.estimatedValue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Engagement:</span>
                        <span className="font-medium">{athlete.engagement}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invite Modal */}
        <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite {selectedAthlete?.name}</DialogTitle>
              <DialogDescription>
                Send a collaboration invitation to this student-athlete
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedAthlete && (
                <div className="p-4 border rounded-lg bg-muted/10">
                  <h4 className="font-medium">{selectedAthlete.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAthlete.sport} • {selectedAthlete.school}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAthlete.followers.toLocaleString()} followers • {selectedAthlete.engagement}% engagement
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Your Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Invitation Message</Label>
                <textarea
                  id="message"
                  className="w-full h-24 px-3 py-2 border rounded-md resize-none"
                  placeholder="Hi [Name], we'd love to explore a potential NIL partnership with you..."
                  defaultValue={`Hi ${selectedAthlete?.name}, we'd love to explore a potential NIL partnership with you. Our brand aligns well with your values and audience. Let's discuss how we can work together!`}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button onClick={sendInvite} className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
                <Button variant="outline" onClick={() => setShowInviteModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}