import { useState, useEffect } from 'react';
import { useFeatureFlags } from '@/lib/featureFlags';
import { useGate } from '@/hooks/useGate';
import { supabase } from '@/integrations/supabase/client';
import { analytics } from '@/lib/analytics';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { CalendarDays, Clock, DollarSign, User } from 'lucide-react';

interface Athlete {
  id: string;
  athlete_name: string;
  sport: string;
  school: string;
  bio: string;
  hourly_rate: number;
  profile_image_url?: string;
  session_types: string[];
}

interface BookingRequest {
  athlete_id: string;
  session_type: string;
  requested_duration: number;
  preferred_date: string;
  preferred_time: string;
  message: string;
  client_age?: number;
  parent_consent: boolean;
}

export default function NILPage() {
  const flags = useFeatureFlags();
  const { allowed } = useGate('nil_booking');
  const { userProfile } = useAuth();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<BookingRequest>({
    athlete_id: '',
    session_type: '',
    requested_duration: 60,
    preferred_date: '',
    preferred_time: '',
    message: '',
    client_age: undefined,
    parent_consent: false
  });

  if (!flags.nil_booking_v1 || !allowed) return null;

  useEffect(() => {
    fetchAthletes();
  }, []);

  const fetchAthletes = async () => {
    try {
      const { data, error } = await supabase
        .from('nil_athletes')
        .select('*')
        .eq('compliance_status', 'approved')
        .eq('is_available', true);

      if (error) throw error;
      setAthletes(data || []);
    } catch (error) {
      console.error('Error fetching athletes:', error);
      toast({
        title: "Error",
        description: "Failed to load athletes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAthlete) return;

    try {
      const totalCost = selectedAthlete.hourly_rate * (bookingData.requested_duration / 60);
      
      const { error } = await supabase
        .from('nil_booking_requests')
        .insert({
          ...bookingData,
          athlete_id: selectedAthlete.id,
          client_user_id: userProfile?.id || '',
          total_cost: totalCost
        });

      if (error) throw error;

      analytics.track('nil_booking.request_submitted', {
        athlete_id: selectedAthlete.id,
        session_type: bookingData.session_type,
        duration: bookingData.requested_duration
      });

      toast({
        title: "Booking Request Submitted",
        description: "The athlete will review your request and respond soon."
      });

      setIsBookingModalOpen(false);
      setBookingData({
        athlete_id: '',
        session_type: '',
        requested_duration: 60,
        preferred_date: '',
        preferred_time: '',
        message: '',
        client_age: undefined,
        parent_consent: false
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Error",
        description: "Failed to submit booking request",
        variant: "destructive"
      });
    }
  };

  const openBookingModal = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setBookingData(prev => ({ ...prev, athlete_id: athlete.id }));
    setIsBookingModalOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading athletes...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Name, Image & Likeness (NIL)</h1>
        <p className="text-sm text-muted-foreground">
          Request a 1:1 session with an athlete (education + compliance first).
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {athletes.map((athlete) => (
          <Card key={athlete.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{athlete.athlete_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{athlete.school}</p>
                  <Badge variant="secondary" className="mt-1">{athlete.sport}</Badge>
                </div>
                {athlete.profile_image_url && (
                  <img 
                    src={athlete.profile_image_url} 
                    alt={athlete.athlete_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{athlete.bio}</p>
              
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4" />
                <span>${athlete.hourly_rate}/hour</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {athlete.session_types.map((type) => (
                  <Badge key={type} variant="outline" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>

              <Button 
                onClick={() => openBookingModal(athlete)}
                className="w-full"
              >
                Request Session
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {athletes.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No athletes available at the moment.</p>
        </div>
      )}

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Session with {selectedAthlete?.athlete_name}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <Label htmlFor="session-type">Session Type</Label>
              <Select 
                value={bookingData.session_type} 
                onValueChange={(value) => setBookingData(prev => ({ ...prev, session_type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  {selectedAthlete?.session_types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select 
                value={bookingData.requested_duration.toString()} 
                onValueChange={(value) => setBookingData(prev => ({ ...prev, requested_duration: parseInt(value) }))}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingData.preferred_date}
                  onChange={(e) => setBookingData(prev => ({ ...prev, preferred_date: e.target.value }))}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={bookingData.preferred_time}
                  onChange={(e) => setBookingData(prev => ({ ...prev, preferred_time: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Tell the athlete what you'd like to focus on..."
                value={bookingData.message}
                onChange={(e) => setBookingData(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="age">Your Age</Label>
              <Input
                id="age"
                type="number"
                min="13"
                max="100"
                value={bookingData.client_age || ''}
                onChange={(e) => setBookingData(prev => ({ ...prev, client_age: parseInt(e.target.value) || undefined }))}
                placeholder="Optional"
              />
            </div>

            {selectedAthlete && (
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span>Estimated Cost:</span>
                  <span className="font-semibold">
                    ${(selectedAthlete.hourly_rate * (bookingData.requested_duration / 60)).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsBookingModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}