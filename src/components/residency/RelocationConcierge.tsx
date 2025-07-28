import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Crown, 
  Star, 
  MapPin, 
  Home, 
  FileText, 
  Truck,
  DollarSign,
  Calendar,
  Phone,
  CheckCircle,
  Users,
  Building
} from 'lucide-react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { FeatureAccessIndicator } from '@/components/navigation/FeatureAccessIndicator';
import { toast } from 'sonner';

interface ConciergeService {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  rating: number;
  reviews: number;
  priceRange: string;
  location: string;
  specialties: string[];
  availability: string;
  featured: boolean;
  icon: any;
}

const conciergeServices: ConciergeService[] = [
  {
    id: '1',
    name: 'Residency Attorney Services',
    description: 'Legal guidance for establishing state residency and domicile compliance',
    category: 'Legal',
    provider: 'Premier Legal Group',
    rating: 4.9,
    reviews: 247,
    priceRange: '$500-$2,000/hour',
    location: 'Multi-state practice',
    specialties: ['Domicile law', 'Tax residency', 'Audit defense', 'Trust law'],
    availability: 'Same week',
    featured: true,
    icon: FileText
  },
  {
    id: '2',
    name: 'Executive Real Estate Services',
    description: 'Luxury home buying and selling for high-net-worth relocations',
    category: 'Real Estate',
    provider: 'Platinum Realty Group',
    rating: 4.8,
    reviews: 189,
    priceRange: 'Commission-based',
    location: 'FL, TX, TN, NV',
    specialties: ['Luxury homes', 'Investment properties', 'Market analysis', 'Concierge buying'],
    availability: '24/7',
    featured: true,
    icon: Home
  },
  {
    id: '3',
    name: 'White Glove Moving Services',
    description: 'Full-service relocation with art, wine, and luxury item specialists',
    category: 'Moving',
    provider: 'Elite Moving Solutions',
    rating: 4.7,
    reviews: 156,
    priceRange: '$5,000-$50,000+',
    location: 'Nationwide',
    specialties: ['Art handling', 'Wine cellars', 'Luxury items', 'Climate-controlled storage'],
    availability: '2-4 weeks',
    featured: false,
    icon: Truck
  },
  {
    id: '4',
    name: 'Tax & Financial Planning',
    description: 'Multi-state tax planning and financial restructuring for relocations',
    category: 'Financial',
    provider: 'Advanced Tax Strategies',
    rating: 4.9,
    reviews: 203,
    priceRange: '$300-$800/hour',
    location: 'Virtual + on-site',
    specialties: ['State tax planning', 'Entity restructuring', 'Trust planning', 'Investment strategies'],
    availability: '1-2 weeks',
    featured: true,
    icon: DollarSign
  }
];

interface RequestFormProps {
  onSubmit: (data: any) => void;
}

function RequestForm({ onSubmit }: RequestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentState: '',
    targetState: '',
    timeframe: '',
    budget: '',
    services: [] as string[],
    details: '',
    assets: '',
    urgency: 'standard'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill in required fields');
      return;
    }
    onSubmit(formData);
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              <SelectItem value="florida">Florida</SelectItem>
              <SelectItem value="texas">Texas</SelectItem>
              <SelectItem value="tennessee">Tennessee</SelectItem>
              <SelectItem value="nevada">Nevada</SelectItem>
              <SelectItem value="wyoming">Wyoming</SelectItem>
              <SelectItem value="other">Other</SelectItem>
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
          <Label htmlFor="budget">Estimated Budget</Label>
          <Select 
            value={formData.budget} 
            onValueChange={(value) => setFormData({...formData, budget: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25k-50k">$25K - $50K</SelectItem>
              <SelectItem value="50k-100k">$50K - $100K</SelectItem>
              <SelectItem value="100k-250k">$100K - $250K</SelectItem>
              <SelectItem value="250k+">$250K+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="assets">Approximate Net Worth</Label>
        <Select 
          value={formData.assets} 
          onValueChange={(value) => setFormData({...formData, assets: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m-5m">$1M - $5M</SelectItem>
            <SelectItem value="5m-10m">$5M - $10M</SelectItem>
            <SelectItem value="10m-25m">$10M - $25M</SelectItem>
            <SelectItem value="25m+">$25M+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Services Needed</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {conciergeServices.map((service) => (
            <div key={service.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={service.id}
                checked={formData.services.includes(service.id)}
                onChange={() => handleServiceToggle(service.id)}
              />
              <Label htmlFor={service.id} className="text-sm">{service.category}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="urgency">Urgency Level</Label>
        <Select 
          value={formData.urgency} 
          onValueChange={(value) => setFormData({...formData, urgency: value})}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="priority">Priority (+25% fee)</SelectItem>
            <SelectItem value="urgent">Urgent (+50% fee)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="details">Additional Details</Label>
        <Textarea 
          id="details"
          value={formData.details}
          onChange={(e) => setFormData({...formData, details: e.target.value})}
          placeholder="Tell us about your specific needs, timeline constraints, or special requirements..."
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full">
        <Crown className="h-4 w-4 mr-2" />
        Submit Concierge Request
      </Button>
    </form>
  );
}

export function RelocationConcierge() {
  const { checkFeatureAccess } = useSubscriptionAccess();
  
  const hasAccess = checkFeatureAccess('relocation_concierge');

  if (!hasAccess) {
    return (
      <div className="text-center py-12 space-y-6">
        <Crown className="h-16 w-16 text-primary mx-auto" />
        <div>
          <h3 className="text-2xl font-bold mb-2">Premium Relocation Concierge</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            White-glove relocation services with vetted professionals. 
            Legal, real estate, moving, and financial planning coordination.
          </p>
        </div>
        <FeatureAccessIndicator feature="relocation_concierge" />
      </div>
    );
  }

  const handleRequestSubmit = (formData: any) => {
    toast.success('Concierge request submitted! Our team will contact you within 24 hours to discuss your needs.');
    
    // Track concierge request
    console.log('Concierge request:', { formData, timestamp: new Date() });
  };

  const featuredServices = conciergeServices.filter(service => service.featured);
  const otherServices = conciergeServices.filter(service => !service.featured);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Premium Relocation Concierge</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          White-glove relocation services with vetted professionals. 
          We coordinate every aspect of your move to maximize tax benefits and minimize stress.
        </p>
      </div>

      {/* Quick Request CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-primary" />
            <h3 className="text-2xl font-bold">Complete Relocation Management</h3>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            From legal compliance to luxury moving services, our concierge team manages 
            every detail of your relocation to tax-advantaged states.
          </p>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">
                <Phone className="h-5 w-5 mr-2" />
                Request Concierge Services
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Premium Relocation Concierge Request</DialogTitle>
                <DialogDescription>
                  Tell us about your relocation needs and we'll connect you with our 
                  vetted network of professionals for a seamless experience.
                </DialogDescription>
              </DialogHeader>
              <RequestForm onSubmit={handleRequestSubmit} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Featured Services
          </h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      )}

      {/* Other Services */}
      {otherServices.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Additional Services</h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {otherServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      )}

      {/* Process Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">How Our Concierge Process Works</CardTitle>
          <CardDescription>
            Seamless coordination from initial consultation to successful relocation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Initial Consultation',
                description: 'Comprehensive needs assessment and custom plan development',
                icon: Users
              },
              {
                step: '2', 
                title: 'Team Assembly',
                description: 'Curated team of specialists matched to your specific requirements',
                icon: Building
              },
              {
                step: '3',
                title: 'Coordinated Execution',
                description: 'Project management of all moving parts with regular updates',
                icon: Calendar
              },
              {
                step: '4',
                title: 'Settlement Support',
                description: 'Post-move support to ensure successful transition and compliance',
                icon: CheckCircle
              }
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto font-bold">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-semibold">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                  <Icon className="h-6 w-6 text-primary mx-auto" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ServiceCardProps {
  service: ConciergeService;
}

function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;
  
  return (
    <Card className="relative overflow-hidden">
      {service.featured && (
        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500">
          <Crown className="h-3 w-3 mr-1" />
          Featured
        </Badge>
      )}
      
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{service.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{service.category}</p>
            <p className="text-sm font-medium text-primary">{service.provider}</p>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{service.rating} ({service.reviews})</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{service.location}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{service.description}</p>
        
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium">Specialties:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {service.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="font-medium">Pricing:</span>
              <span className="ml-2 text-muted-foreground">{service.priceRange}</span>
            </div>
            <div>
              <span className="font-medium">Availability:</span>
              <span className="ml-2 text-muted-foreground">{service.availability}</span>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <Phone className="h-4 w-4 mr-2" />
          Request Quote
        </Button>
      </CardContent>
    </Card>
  );
}
