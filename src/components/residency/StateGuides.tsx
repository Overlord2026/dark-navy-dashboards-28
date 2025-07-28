import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Download, 
  CheckCircle, 
  FileText, 
  DollarSign,
  Calendar,
  MapPin,
  Star,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

const getGuideTypeIcon = (type: string) => {
  switch (type) {
    case 'checklist': return CheckCircle;
    case 'timeline': return Calendar;
    case 'tax': return DollarSign;
    case 'legal': return FileText;
    default: return FileText;
  }
};

interface StateGuide {
  state: string;
  icon: string;
  annualSavings: string;
  daysRequired: number;
  keyBenefits: string[];
  guideTypes: {
    checklist: boolean;
    timeline: boolean;
    tax: boolean;
    legal: boolean;
  };
  popularity: number;
  featured: boolean;
}

const stateGuides: StateGuide[] = [
  {
    state: 'Florida',
    icon: '🌴',
    annualSavings: '$15,000+',
    daysRequired: 183,
    keyBenefits: ['No state income tax', 'Strong homestead exemption', 'No inheritance tax', 'Asset protection'],
    guideTypes: { checklist: true, timeline: true, tax: true, legal: true },
    popularity: 5,
    featured: true
  },
  {
    state: 'Texas',
    icon: '🤠',
    annualSavings: '$12,000+',
    daysRequired: 183,
    keyBenefits: ['No state income tax', 'Business-friendly', 'No inheritance tax', 'Strong property rights'],
    guideTypes: { checklist: true, timeline: true, tax: true, legal: false },
    popularity: 5,
    featured: true
  },
  {
    state: 'Tennessee',
    icon: '🎸',
    annualSavings: '$8,000+',
    daysRequired: 183,
    keyBenefits: ['No state income tax', 'Low cost of living', 'No inheritance tax on most assets'],
    guideTypes: { checklist: true, timeline: true, tax: true, legal: false },
    popularity: 4,
    featured: true
  },
  {
    state: 'Nevada',
    icon: '🎰',
    annualSavings: '$10,000+',
    daysRequired: 183,
    keyBenefits: ['No state income tax', 'Strong privacy laws', 'No inheritance tax', 'Asset protection'],
    guideTypes: { checklist: true, timeline: true, tax: true, legal: true },
    popularity: 4,
    featured: false
  },
  {
    state: 'Wyoming',
    icon: '🏔️',
    annualSavings: '$7,500+',
    daysRequired: 183,
    keyBenefits: ['No state income tax', 'Strong trust laws', 'Asset protection', 'Privacy'],
    guideTypes: { checklist: true, timeline: true, tax: true, legal: true },
    popularity: 3,
    featured: false
  },
  {
    state: 'New Hampshire',
    icon: '🍂',
    annualSavings: '$6,000+',
    daysRequired: 183,
    keyBenefits: ['No income tax on wages', 'No sales tax', 'Property tax concerns'],
    guideTypes: { checklist: true, timeline: true, tax: true, legal: false },
    popularity: 3,
    featured: false
  }
];

interface LeadCaptureFormProps {
  state: string;
  guideType: string;
  onSubmit: (email: string, name: string) => void;
}

function LeadCaptureForm({ state, guideType, onSubmit }: LeadCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error('Please fill in all fields');
      return;
    }
    onSubmit(email, name);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        <Download className="h-4 w-4 mr-2" />
        Download {state} {guideType} Guide
      </Button>
    </form>
  );
}

export function StateGuides() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuides = stateGuides.filter(guide => 
    guide.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredGuides = filteredGuides.filter(guide => guide.featured);
  const otherGuides = filteredGuides.filter(guide => !guide.featured);

  const handleDownload = (email: string, name: string, state: string, guideType: string) => {
    // Here you would capture the lead and trigger the download
    toast.success(`Sending ${state} ${guideType} guide to ${email}...`);
    
    // Track lead capture
    console.log('Lead captured:', { email, name, state, guideType, timestamp: new Date() });
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">State Residency Guides</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Download comprehensive guides with checklists, timelines, and legal requirements 
          for establishing residency in tax-advantaged states.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <Input
            placeholder="Search for a state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-center"
          />
        </div>
      </div>

      {/* Featured States */}
      {featuredGuides.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Most Popular States
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredGuides.map((guide) => (
              <StateGuideCard key={guide.state} guide={guide} onDownload={handleDownload} />
            ))}
          </div>
        </div>
      )}

      {/* Other States */}
      {otherGuides.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Other States</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {otherGuides.map((guide) => (
              <StateGuideCard key={guide.state} guide={guide} onDownload={handleDownload} />
            ))}
          </div>
        </div>
      )}

      {filteredGuides.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No states found matching your search.</p>
        </div>
      )}
    </div>
  );
}

interface StateGuideCardProps {
  guide: StateGuide;
  onDownload: (email: string, name: string, state: string, guideType: string) => void;
}

function StateGuideCard({ guide, onDownload }: StateGuideCardProps) {
  return (
    <Card className="relative overflow-hidden">
      {guide.featured && (
        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500">
          <Star className="h-3 w-3 mr-1" />
          Popular
        </Badge>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{guide.icon}</span>
          <div>
            <CardTitle className="text-xl">{guide.state}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-green-600">
                Save {guide.annualSavings}/year
              </Badge>
              <div className="flex">
                {[...Array(guide.popularity)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{guide.daysRequired} days/year minimum</span>
          </div>
          
          <div className="space-y-1">
            {guide.keyBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Object.entries(guide.guideTypes).map(([type, available]) => (
            available && (
              <Dialog key={type}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 text-xs"
                  >
                    {(() => {
                      const IconComponent = getGuideTypeIcon(type);
                      return <IconComponent className="h-3 w-3" />;
                    })()}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Download {guide.state} {type.charAt(0).toUpperCase() + type.slice(1)} Guide
                    </DialogTitle>
                    <DialogDescription>
                      Get instant access to our comprehensive {guide.state} residency {type} guide. 
                      Enter your details below to receive the download link.
                    </DialogDescription>
                  </DialogHeader>
                  <LeadCaptureForm 
                    state={guide.state}
                    guideType={type}
                    onSubmit={(email, name) => onDownload(email, name, guide.state, type)}
                  />
                </DialogContent>
              </Dialog>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
