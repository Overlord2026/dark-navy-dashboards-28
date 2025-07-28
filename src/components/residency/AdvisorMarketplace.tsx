import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Award,
  Users,
  Calendar,
  Crown,
  MessageCircle
} from 'lucide-react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { FeatureAccessIndicator } from '@/components/navigation/FeatureAccessIndicator';
import { toast } from 'sonner';

interface Advisor {
  id: string;
  name: string;
  title: string;
  firm: string;
  specialties: string[];
  states: string[];
  rating: number;
  reviewCount: number;
  experience: number;
  image: string;
  location: string;
  phone: string;
  email: string;
  certifications: string[];
  description: string;
  languages: string[];
  featured: boolean;
  responseTime: string;
  consultationFee: number;
}

const advisors: Advisor[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Tax Attorney',
    firm: 'Johnson & Associates',
    specialties: ['Florida Residency', 'Estate Planning', 'Tax Law'],
    states: ['Florida', 'New York', 'Connecticut'],
    rating: 4.9,
    reviewCount: 127,
    experience: 15,
    image: '/api/placeholder/100/100',
    location: 'Miami, FL',
    phone: '(305) 555-0123',
    email: 'sarah@johnsonlaw.com',
    certifications: ['J.D.', 'LL.M. Taxation', 'CPA'],
    description: 'Specializing in high-net-worth client relocations to Florida with comprehensive tax planning strategies.',
    languages: ['English', 'Spanish'],
    featured: true,
    responseTime: '< 2 hours',
    consultationFee: 350
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Certified Financial Planner',
    firm: 'Texas Wealth Advisors',
    specialties: ['Texas Relocation', 'Business Formation', 'Investment Planning'],
    states: ['Texas', 'California', 'Illinois'],
    rating: 4.8,
    reviewCount: 89,
    experience: 12,
    image: '/api/placeholder/100/100',
    location: 'Austin, TX',
    phone: '(512) 555-0456',
    email: 'michael@txwealth.com',
    certifications: ['CFP', 'ChFC', 'CIMA'],
    description: 'Helping entrepreneurs and executives relocate their businesses and personal assets to Texas.',
    languages: ['English', 'Mandarin'],
    featured: true,
    responseTime: '< 4 hours',
    consultationFee: 250
  },
  {
    id: '3',
    name: 'David Rodriguez',
    title: 'Estate Planning Attorney',
    firm: 'Rodriguez Legal Group',
    specialties: ['Multi-State Planning', 'Trust Law', 'Asset Protection'],
    states: ['Nevada', 'Wyoming', 'Delaware'],
    rating: 4.7,
    reviewCount: 156,
    experience: 18,
    image: '/api/placeholder/100/100',
    location: 'Las Vegas, NV',
    phone: '(702) 555-0789',
    email: 'david@rlglaw.com',
    certifications: ['J.D.', 'LL.M. Estate Planning'],
    description: 'Expert in complex multi-jurisdictional estate planning and asset protection strategies.',
    languages: ['English', 'Spanish'],
    featured: false,
    responseTime: '< 6 hours',
    consultationFee: 400
  }
];

interface ConnectFormProps {
  advisor: Advisor;
  onSubmit: (data: any) => void;
}

function ConnectForm({ advisor, onSubmit }: ConnectFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentState: '',
    targetState: '',
    timeframe: '',
    assets: '',
    message: '',
    preferredContact: 'email'
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
      <div className="grid grid-cols-2 gap-4">
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
          <Label htmlFor="email">Email *</Label>
          <Input 
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
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
          <Select 
            value={formData.targetState} 
            onValueChange={(value) => setFormData({...formData, targetState: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target state" />
            </SelectTrigger>
            <SelectContent>
              {advisor.states.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="timeframe">Relocation Timeframe</Label>
          <Select 
            value={formData.timeframe} 
            onValueChange={(value) => setFormData({...formData, timeframe: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="immediate">Immediate (&lt; 3 months)</SelectItem>
            <SelectItem value="short">Short-term (3-6 months)</SelectItem>
            <SelectItem value="medium">Medium-term (6-12 months)</SelectItem>
            <SelectItem value="long">Long-term (&gt; 1 year)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="assets">Approximate Assets</Label>
          <Select 
            value={formData.assets} 
            onValueChange={(value) => setFormData({...formData, assets: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="500k-1m">$500K - $1M</SelectItem>
              <SelectItem value="1m-5m">$1M - $5M</SelectItem>
              <SelectItem value="5m-10m">$5M - $10M</SelectItem>
              <SelectItem value="10m+">$10M+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="message">Additional Details</Label>
        <Textarea 
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          placeholder="Tell us about your specific needs, concerns, or questions..."
          rows={3}
        />
      </div>

      <div>
        <Label>Preferred Contact Method</Label>
        <Select 
          value={formData.preferredContact} 
          onValueChange={(value) => setFormData({...formData, preferredContact: value})}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Consultation Fee:</strong> ${advisor.consultationFee}/hour
          <br />
          <strong>Response Time:</strong> {advisor.responseTime}
        </p>
      </div>

      <Button type="submit" className="w-full">
        <MessageCircle className="h-4 w-4 mr-2" />
        Send Connection Request
      </Button>
    </form>
  );
}

export function AdvisorMarketplace() {
  const { checkFeatureAccess } = useSubscriptionAccess();
  const [searchState, setSearchState] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  
  const hasAccess = checkFeatureAccess('elite');

  if (!hasAccess) {
    return (
      <div className="text-center py-12 space-y-6">
        <Crown className="h-16 w-16 text-primary mx-auto" />
        <div>
          <h3 className="text-2xl font-bold mb-2">Premium Advisor Marketplace</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Connect with verified residency specialists and tax attorneys. 
            Upgrade to access our curated advisor network.
          </p>
        </div>
        <FeatureAccessIndicator feature="advisor_marketplace" />
      </div>
    );
  }

  const filteredAdvisors = advisors.filter(advisor => {
    const matchesState = !searchState || advisor.states.some(state => 
      state.toLowerCase().includes(searchState.toLowerCase())
    );
    const matchesSpecialty = !selectedSpecialty || advisor.specialties.some(specialty =>
      specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
    );
    return matchesState && matchesSpecialty;
  });

  const featuredAdvisors = filteredAdvisors.filter(advisor => advisor.featured);
  const otherAdvisors = filteredAdvisors.filter(advisor => !advisor.featured);

  const handleConnect = (advisorId: string, formData: any) => {
    const advisor = advisors.find(a => a.id === advisorId);
    toast.success(`Connection request sent to ${advisor?.name}. They will contact you within ${advisor?.responseTime}.`);
    
    // Track advisor connection
    console.log('Advisor connection:', { advisorId, formData, timestamp: new Date() });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Residency Specialist Network</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with verified attorneys, CPAs, and financial advisors who specialize 
          in state residency planning and relocation strategies.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <div className="flex-1">
          <Input
            placeholder="Search by state (e.g., Florida, Texas)"
            value={searchState}
            onChange={(e) => setSearchState(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Specialties</SelectItem>
              <SelectItem value="residency">Residency Planning</SelectItem>
              <SelectItem value="tax">Tax Law</SelectItem>
              <SelectItem value="estate">Estate Planning</SelectItem>
              <SelectItem value="business">Business Formation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Featured Advisors */}
      {featuredAdvisors.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Featured Specialists
          </h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {featuredAdvisors.map((advisor) => (
              <AdvisorCard 
                key={advisor.id} 
                advisor={advisor} 
                onConnect={(formData) => handleConnect(advisor.id, formData)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Advisors */}
      {otherAdvisors.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">All Specialists</h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {otherAdvisors.map((advisor) => (
              <AdvisorCard 
                key={advisor.id} 
                advisor={advisor} 
                onConnect={(formData) => handleConnect(advisor.id, formData)}
              />
            ))}
          </div>
        </div>
      )}

      {filteredAdvisors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No advisors found matching your criteria. Try adjusting your search.
          </p>
        </div>
      )}
    </div>
  );
}

interface AdvisorCardProps {
  advisor: Advisor;
  onConnect: (formData: any) => void;
}

function AdvisorCard({ advisor, onConnect }: AdvisorCardProps) {
  return (
    <Card className="relative overflow-hidden">
      {advisor.featured && (
        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500">
          <Crown className="h-3 w-3 mr-1" />
          Featured
        </Badge>
      )}
      
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {advisor.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">{advisor.name}</CardTitle>
            <p className="text-muted-foreground">{advisor.title}</p>
            <p className="text-sm font-medium text-primary">{advisor.firm}</p>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{advisor.rating} ({advisor.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>{advisor.experience} years</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{advisor.location}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{advisor.description}</p>
        
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium">Specialties:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {advisor.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium">States:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {advisor.states.map((state) => (
                <Badge key={state} variant="outline" className="text-xs">
                  {state}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium">Certifications:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {advisor.certifications.map((cert) => (
                <Badge key={cert} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              Consultation: ${advisor.consultationFee}/hour
            </div>
            <div className="text-sm text-muted-foreground">
              Response: {advisor.responseTime}
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Connect with {advisor.name}</DialogTitle>
                <DialogDescription>
                  Send a connection request to {advisor.name} at {advisor.firm}. 
                  They will review your information and contact you directly.
                </DialogDescription>
              </DialogHeader>
              <ConnectForm advisor={advisor} onSubmit={onConnect} />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
