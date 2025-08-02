import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Play, Video, Download, ExternalLink } from 'lucide-react';

interface Webinar {
  id: string;
  title: string;
  description: string;
  speaker: {
    name: string;
    title: string;
    company: string;
    image?: string;
  };
  date: string;
  duration: number;
  attendees: number;
  type: 'live' | 'recorded';
  category: string;
  registrationRequired: boolean;
  recordingUrl?: string;
  materials?: string[];
}

const upcomingWebinars: Webinar[] = [
  {
    id: '1',
    title: 'Private Credit Strategies in Rising Rate Environment',
    description: 'Explore how private credit managers are adapting to higher interest rates and what opportunities this creates for family offices.',
    speaker: {
      name: 'Sarah Mitchell',
      title: 'Managing Director',
      company: 'Apollo Global Management'
    },
    date: '2024-02-15T14:00:00Z',
    duration: 60,
    attendees: 0,
    type: 'live',
    category: 'Credit',
    registrationRequired: true
  },
  {
    id: '2',
    title: 'Infrastructure Investing: Trends and Opportunities',
    description: 'A deep dive into infrastructure investing including renewable energy, digital infrastructure, and transportation projects.',
    speaker: {
      name: 'Michael Chen',
      title: 'Senior Partner',
      company: 'Brookfield Asset Management'
    },
    date: '2024-02-22T15:00:00Z',
    duration: 45,
    attendees: 0,
    type: 'live',
    category: 'Infrastructure',
    registrationRequired: true
  },
  {
    id: '3',
    title: 'ESG Integration in Private Markets',
    description: 'Learn how leading managers are incorporating environmental, social, and governance factors into investment decisions.',
    speaker: {
      name: 'Jennifer Walsh',
      title: 'Head of Sustainable Investing',
      company: 'KKR & Co.'
    },
    date: '2024-03-01T13:00:00Z',
    duration: 50,
    attendees: 0,
    type: 'live',
    category: 'ESG',
    registrationRequired: true
  }
];

const recordedWebinars: Webinar[] = [
  {
    id: '4',
    title: 'Private Equity Outlook 2024: Navigating Market Volatility',
    description: 'Industry leaders discuss the private equity landscape, exit strategies, and value creation in uncertain markets.',
    speaker: {
      name: 'David Thompson',
      title: 'Co-Founder & Managing Partner',
      company: 'Carlyle Group'
    },
    date: '2024-01-18T14:00:00Z',
    duration: 55,
    attendees: 247,
    type: 'recorded',
    category: 'Private Equity',
    registrationRequired: false,
    recordingUrl: '#',
    materials: ['Presentation Slides', 'Market Data', 'Q&A Transcript']
  },
  {
    id: '5',
    title: 'Real Estate Opportunities in Secondary Markets',
    description: 'Exploring real estate investment opportunities beyond gateway cities, including emerging markets and specialized sectors.',
    speaker: {
      name: 'Lisa Rodriguez',
      title: 'Chief Investment Officer',
      company: 'Blackstone Real Estate'
    },
    date: '2024-01-11T15:30:00Z',
    duration: 40,
    attendees: 189,
    type: 'recorded',
    category: 'Real Estate',
    registrationRequired: false,
    recordingUrl: '#',
    materials: ['Market Analysis', 'Case Studies', 'Investment Framework']
  },
  {
    id: '6',
    title: 'Venture Capital: Early Stage vs Growth Investing',
    description: 'Comparing investment strategies, risk profiles, and returns across different stages of venture capital investing.',
    speaker: {
      name: 'Alex Park',
      title: 'General Partner',
      company: 'Andreessen Horowitz'
    },
    date: '2024-01-04T16:00:00Z',
    duration: 45,
    attendees: 156,
    type: 'recorded',
    category: 'Venture Capital',
    registrationRequired: false,
    recordingUrl: '#',
    materials: ['Portfolio Examples', 'Due Diligence Checklist']
  }
];

export const InvestmentWebinars = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const handleRegister = (webinarId: string, title: string) => {
    console.log(`Registration for webinar: ${title} (${webinarId})`);
    // Handle registration logic
  };

  const handleWatchRecording = (webinarId: string, title: string) => {
    console.log(`Watching recording: ${title} (${webinarId})`);
    // Handle viewing logic
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const WebinarCard = ({ webinar }: { webinar: Webinar }) => (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{webinar.title}</CardTitle>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {webinar.description}
            </p>
          </div>
          <Badge className={webinar.type === 'live' ? 'bg-success' : 'bg-secondary'}>
            {webinar.type === 'live' ? 'Live' : 'Recorded'}
          </Badge>
        </div>

        {/* Speaker Info */}
        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
            {webinar.speaker.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 className="font-semibold">{webinar.speaker.name}</h4>
            <p className="text-sm text-muted-foreground">
              {webinar.speaker.title}, {webinar.speaker.company}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Webinar Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{formatDate(webinar.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{webinar.duration} minutes</span>
          </div>
          {webinar.type === 'recorded' && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{webinar.attendees} attendees</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {webinar.category}
            </Badge>
          </div>
        </div>

        {/* Materials (for recorded webinars) */}
        {webinar.materials && (
          <div>
            <h5 className="font-semibold text-sm mb-2">Available Materials</h5>
            <div className="flex flex-wrap gap-2">
              {webinar.materials.map((material, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  {material}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {webinar.type === 'live' ? (
            <Button 
              className="flex-1 bg-gold-premium text-primary hover:bg-gold-dark"
              onClick={() => handleRegister(webinar.id, webinar.title)}
            >
              Register Now
            </Button>
          ) : (
            <>
              <Button 
                className="flex-1 bg-gold-premium text-primary hover:bg-gold-dark"
                onClick={() => handleWatchRecording(webinar.id, webinar.title)}
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Recording
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Investment Education Webinars</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Join industry leaders and investment professionals for exclusive insights on private markets, 
          alternative investments, and wealth management strategies.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gold-dark">24</div>
          <div className="text-sm text-muted-foreground">Webinars This Year</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gold-dark">1,200+</div>
          <div className="text-sm text-muted-foreground">Total Attendees</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gold-dark">45</div>
          <div className="text-sm text-muted-foreground">Expert Speakers</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gold-dark">8.9/10</div>
          <div className="text-sm text-muted-foreground">Average Rating</div>
        </Card>
      </div>

      {/* Webinars Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Webinars</TabsTrigger>
          <TabsTrigger value="recorded">Recorded Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingWebinars.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingWebinars.map((webinar) => (
                <WebinarCard key={webinar.id} webinar={webinar} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Upcoming Webinars</h3>
              <p className="text-muted-foreground">
                Check back soon for new webinar announcements, or explore our recorded sessions.
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recorded" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recordedWebinars.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Host a Webinar CTA */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h3 className="text-2xl font-bold">Share Your Expertise</h3>
          <p className="text-lg opacity-90">
            Are you an investment professional with insights to share? Join our speaker network 
            and present to an engaged audience of family offices and high-net-worth investors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gold-premium text-primary hover:bg-gold-dark font-semibold"
            >
              Apply to Speak
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10"
            >
              View Speaker Guidelines
            </Button>
          </div>
        </div>
      </Card>

      {/* Newsletter Signup */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Stay Informed</h3>
          <p className="text-muted-foreground">
            Get notified about upcoming webinars and receive exclusive content from our expert speakers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
            />
            <Button className="bg-gold-premium text-primary hover:bg-gold-dark">
              Subscribe
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};