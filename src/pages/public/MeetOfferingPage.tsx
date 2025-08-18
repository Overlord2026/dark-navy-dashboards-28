import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarPicker } from '@/modules/scheduler/CalendarPicker';
import { schedulerApi } from '@/modules/scheduler/schedulerApi';
import { buildICS, downloadICS } from '@/modules/scheduler/utils/ics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, Download, User, Shield } from 'lucide-react';

export default function MeetOfferingPage() {
  const [offering, setOffering] = useState<any>(null);
  const [windows, setWindows] = useState<any[]>([]);
  const [selectedWindowId, setSelectedWindowId] = useState<string>('');
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
  const [notes, setNotes] = useState('');
  const [confirmedAdult, setConfirmedAdult] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      loadOffering();
    }
  }, [slug]);

  const loadOffering = async () => {
    if (!slug) return;

    try {
      const [offeringData, windowsData] = await Promise.all([
        schedulerApi.getPublicOffering(slug),
        schedulerApi.getPublicWindows(slug) // This needs to be fixed
      ]);

      setOffering(offeringData);
      setWindows(windowsData || []);
    } catch (error) {
      console.error('Error loading offering:', error);
    }
  };

  const handleBooking = async () => {
    if (!selectedWindowId || !contactInfo.name || !contactInfo.email) return;

    try {
      setIsSubmitting(true);
      
      const booking = await schedulerApi.createBooking({
        window_id: selectedWindowId,
        contact_info: contactInfo,
        notes,
        confirmed_adult: confirmedAdult,
        agreed_to_terms: agreedToTerms
      });

      setBooking(booking);
      
      // Generate and download ICS
      const selectedWindow = windows.find(w => w.id === selectedWindowId);
      if (selectedWindow) {
        const icsEvent = {
          uid: booking.id,
          title: offering.title,
          description: offering.description || '',
          startTime: new Date(selectedWindow.start_time),
          endTime: new Date(selectedWindow.end_time),
          location: offering.location_details || 'Virtual Session',
          organizer: { name: 'NIL Session', email: 'sessions@familyofficemarketplace.com' },
          attendee: { name: contactInfo.name, email: contactInfo.email }
        };
        
        const icsContent = buildICS(icsEvent);
        downloadICS(icsContent, `${offering.title}-${booking.id}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!offering) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (booking) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p>Your session with {offering.title} has been booked.</p>
            <Button onClick={() => window.location.href = '/me/bookings'}>
              <Calendar className="h-4 w-4 mr-2" />
              View My Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{offering.title}</CardTitle>
            <div className="flex gap-2">
              <Badge>{offering.offering_type === 'one_on_one' ? '1-on-1' : 'Group'}</Badge>
              <Badge variant="outline">{offering.location_type}</Badge>
            </div>
          </div>
          {offering.description && (
            <p className="text-muted-foreground">{offering.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{offering.duration_minutes} minutes</span>
              </div>
              {offering.price && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">${offering.price}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{offering.location_details || 'Details provided after booking'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Book Your Session</h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anything you'd like to discuss..."
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="adult" 
                      checked={confirmedAdult} 
                      onCheckedChange={setConfirmedAdult} 
                    />
                    <Label htmlFor="adult" className="text-sm">
                      I confirm I am 18 years of age or older
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the <a href="/legal/nil-terms" className="text-primary hover:underline">NIL Terms</a>
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CalendarPicker
        windows={windows}
        selectedWindowId={selectedWindowId}
        onSelectWindow={setSelectedWindowId}
      />

      <div className="text-center">
        <Button
          onClick={handleBooking}
          disabled={!selectedWindowId || !contactInfo.name || !contactInfo.email || !confirmedAdult || !agreedToTerms || isSubmitting}
          size="lg"
        >
          {isSubmitting ? 'Booking...' : 'Book Session'}
        </Button>
      </div>
    </div>
  );
}