import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Play,
  Download,
  MapPin,
  Star,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface Webinar {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: number;
  attendees: number;
  maxAttendees: number;
  type: 'live' | 'recorded';
  state?: string;
  rating: number;
  topics: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
}

const webinars: Webinar[] = [
  {
    id: '1',
    title: 'Florida Residency Masterclass',
    description: 'Complete guide to establishing Florida residency and avoiding common pitfalls.',
    instructor: 'Sarah Johnson, CPA',
    date: '2024-02-15',
    time: '2:00 PM EST',
    duration: 90,
    attendees: 247,
    maxAttendees: 500,
    type: 'live',
    state: 'Florida',
    rating: 4.9,
    topics: ['Domicile establishment', 'Documentation requirements', 'Tax implications', 'Common mistakes'],
    level: 'Beginner',
    price: 0
  },
  {
    id: '2',
    title: 'Texas Business Relocation Strategies',
    description: 'Moving your business to Texas: legal, tax, and operational considerations.',
    instructor: 'Michael Chen, Attorney',
    date: '2024-02-20',
    time: '3:00 PM CST',
    duration: 120,
    attendees: 89,
    maxAttendees: 300,
    type: 'live',
    state: 'Texas',
    rating: 4.8,
    topics: ['Business formation', 'Tax benefits', 'Legal requirements', 'Timeline planning'],
    level: 'Intermediate',
    price: 49
  },
  {
    id: '3',
    title: 'Multi-State Tax Planning for High Net Worth',
    description: 'Advanced strategies for managing tax obligations across multiple states.',
    instructor: 'David Rodriguez, CFP',
    date: '2024-01-10',
    time: 'Recorded',
    duration: 75,
    attendees: 523,
    maxAttendees: 0,
    type: 'recorded',
    rating: 4.7,
    topics: ['State tax planning', 'Trust structures', 'Audit protection', 'Estate planning'],
    level: 'Advanced',
    price: 0
  },
  {
    id: '4',
    title: 'Tennessee Residency: Music City Benefits',
    description: 'Why Tennessee is becoming the go-to state for retirees and high earners.',
    instructor: 'Lisa Thompson, CFP',
    date: '2024-02-25',
    time: '1:00 PM CST',
    duration: 60,
    attendees: 156,
    maxAttendees: 400,
    type: 'live',
    state: 'Tennessee',
    rating: 4.6,
    topics: ['No income tax benefits', 'Cost of living', 'Lifestyle considerations'],
    level: 'Beginner',
    price: 0
  }
];

interface RegistrationFormProps {
  webinar: Webinar;
  onSubmit: (data: any) => void;
}

function RegistrationForm({ webinar, onSubmit }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentState: '',
    targetState: webinar.state || '',
    experience: 'beginner'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill in required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input 
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input 
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currentState">Current State</Label>
          <Input 
            id="currentState"
            value={formData.currentState}
            onChange={(e) => setFormData({...formData, currentState: e.target.value})}
            placeholder="e.g., New York"
          />
        </div>
        <div>
          <Label htmlFor="targetState">Target State</Label>
          <Input 
            id="targetState"
            value={formData.targetState}
            onChange={(e) => setFormData({...formData, targetState: e.target.value})}
            placeholder="e.g., Florida"
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        {webinar.type === 'live' ? (
          <>
            <Calendar className="h-4 w-4 mr-2" />
            Register for Webinar
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            Watch Recording
          </>
        )}
      </Button>
    </form>
  );
}

export function WebinarHub() {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const liveWebinars = webinars.filter(w => w.type === 'live');
  const recordedWebinars = webinars.filter(w => w.type === 'recorded');

  const handleRegistration = (webinarId: string, formData: any) => {
    const webinar = webinars.find(w => w.id === webinarId);
    
    if (webinar?.type === 'live') {
      toast.success(`Successfully registered for "${webinar.title}". Check your email for the meeting link.`);
    } else {
      toast.success(`Access granted to "${webinar?.title}". Starting playback...`);
    }
    
    // Track registration
    console.log('Webinar registration:', { webinarId, formData, timestamp: new Date() });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Residency Seminars & Webinars</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn from experts through live seminars and recorded sessions. 
          Get practical guidance on state residency, tax planning, and relocation strategies.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming Live
          </TabsTrigger>
          <TabsTrigger value="recorded">
            <Video className="h-4 w-4 mr-2" />
            On-Demand Library
          </TabsTrigger>
          <TabsTrigger value="host">
            <Users className="h-4 w-4 mr-2" />
            Host Your Own
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {liveWebinars.map((webinar) => (
              <WebinarCard 
                key={webinar.id} 
                webinar={webinar} 
                onRegister={(formData) => handleRegistration(webinar.id, formData)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recorded" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {recordedWebinars.map((webinar) => (
              <WebinarCard 
                key={webinar.id} 
                webinar={webinar} 
                onRegister={(formData) => handleRegistration(webinar.id, formData)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="host">
          <HostWebinarSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface WebinarCardProps {
  webinar: Webinar;
  onRegister: (formData: any) => void;
}

function WebinarCard({ webinar, onRegister }: WebinarCardProps) {
  const isLive = webinar.type === 'live';
  const spotsLeft = webinar.maxAttendees - webinar.attendees;
  
  return (
    <Card className={`relative overflow-hidden ${isLive ? 'border-primary/20' : ''}`}>
      {isLive && spotsLeft < 50 && (
        <Badge className="absolute top-3 right-3 bg-red-500">
          Only {spotsLeft} spots left
        </Badge>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{webinar.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {webinar.duration} min
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {webinar.attendees} {isLive ? 'registered' : 'watched'}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {webinar.rating}
              </div>
            </div>
          </div>
          
          <Badge 
            variant={webinar.level === 'Beginner' ? 'secondary' : 
                    webinar.level === 'Intermediate' ? 'default' : 'destructive'}
          >
            {webinar.level}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{webinar.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Instructor:</span>
            <span>{webinar.instructor}</span>
          </div>
          
          {isLive && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{webinar.date} at {webinar.time}</span>
            </div>
          )}
          
          {webinar.state && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>Focus: {webinar.state} Residency</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {webinar.topics.map((topic) => (
            <Badge key={topic} variant="outline" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="text-lg font-semibold">
            {webinar.price === 0 ? 'Free' : `$${webinar.price}`}
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                {isLive ? (
                  <>
                    <Calendar className="h-4 w-4" />
                    Register Now
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Watch Now
                  </>
                )}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{webinar.title}</DialogTitle>
                <DialogDescription>
                  {isLive 
                    ? 'Register for this live webinar and receive a calendar invite with the meeting link.'
                    : 'Get instant access to this recorded session and downloadable materials.'
                  }
                </DialogDescription>
              </DialogHeader>
              <RegistrationForm webinar={webinar} onSubmit={onRegister} />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function HostWebinarSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Host Your Own Residency Seminar</CardTitle>
          <CardDescription>
            White-labeled seminar platform for financial advisors and attorneys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What's Included</h3>
              <div className="space-y-2">
                {[
                  'Professional presentation slides',
                  'Handout materials and checklists',
                  'Registration and marketing tools',
                  'Follow-up email sequences',
                  'Lead capture and CRM integration',
                  'Continuing education credits'
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Seminar Topics Available</h3>
              <div className="space-y-2">
                {[
                  'Florida Residency for Retirees',
                  'Texas Business Relocation Benefits',
                  'Estate Planning Across State Lines',
                  'Tax Strategies for Multi-State Clients',
                  'Snowbird Planning Essentials'
                ].map((topic) => (
                  <div key={topic} className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-primary" />
                    <span className="text-sm">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center pt-6">
            <Button size="lg">
              <Users className="h-5 w-5 mr-2" />
              Request Seminar Kit
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Available for qualified financial professionals
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}