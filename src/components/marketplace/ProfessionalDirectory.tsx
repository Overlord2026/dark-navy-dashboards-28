import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Calendar,
  MessageSquare,
  Edit,
  Verified,
  Globe,
  Users,
  Building2,
  Phone,
  Mail,
  Clock,
  Award,
  TrendingUp,
  Shield,
  FileText,
  Home,
  Calculator,
  Scale
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

interface Professional {
  id: string;
  name: string;
  title: string;
  firm: string;
  type: 'advisor' | 'cpa' | 'attorney' | 'consultant' | 'insurance' | 'real-estate';
  location: string;
  state: string;
  rating: number;
  reviews: number;
  verified: boolean;
  imageUrl: string;
  specialties: string[];
  languages: string[];
  clientTypes: ('individual' | 'family' | 'business')[];
  minAssets?: string;
  hourlyRate?: string;
  responseTime: string;
  bio: string;
  experience: number;
  credentials: string[];
  availability: 'available' | 'busy' | 'booked';
  lastActive: string;
  phone?: string;
  email?: string;
  calendlyUrl?: string;
  linkedIn?: string;
  website?: string;
}

const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Jennifer Walsh',
    title: 'Senior Portfolio Manager',
    firm: 'Walsh Wealth Management',
    type: 'advisor',
    location: 'Boston, MA',
    state: 'MA',
    rating: 4.9,
    reviews: 89,
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    specialties: ['ESG Investing', 'Risk Management', 'Tax Planning', 'Estate Planning'],
    languages: ['English', 'Spanish'],
    clientTypes: ['family', 'individual'],
    minAssets: '$3M+',
    responseTime: '< 3 hours',
    bio: 'Jennifer specializes in sustainable investing and comprehensive wealth management for high-net-worth families.',
    experience: 15,
    credentials: ['CFP', 'CFA', 'CIMA'],
    availability: 'available',
    lastActive: '2 hours ago',
    phone: '+1 (617) 555-0123',
    email: 'jennifer@walshwealth.com',
    calendlyUrl: 'https://calendly.com/jennifer-walsh'
  },
  {
    id: '2',
    name: 'David Kim',
    title: 'International Tax Specialist',
    firm: 'Kim Tax Advisory',
    type: 'cpa',
    location: 'Los Angeles, CA',
    state: 'CA',
    rating: 4.8,
    reviews: 124,
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
    specialties: ['Cross-Border Tax', 'FBAR Compliance', 'Treaty Planning', 'International Business'],
    languages: ['English', 'Korean', 'Mandarin'],
    clientTypes: ['individual', 'family', 'business'],
    hourlyRate: '$450/hr',
    responseTime: '< 4 hours',
    bio: 'David helps international families and businesses navigate complex cross-border tax obligations.',
    experience: 12,
    credentials: ['CPA', 'EA', 'MT'],
    availability: 'available',
    lastActive: '1 hour ago',
    phone: '+1 (323) 555-0456',
    email: 'david@kimtax.com'
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    title: 'Estate Planning Counsel',
    firm: 'Rodriguez Law Group',
    type: 'attorney',
    location: 'Miami, FL',
    state: 'FL',
    rating: 5.0,
    reviews: 67,
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400',
    specialties: ['Dynasty Trusts', 'International Estate', 'Philanthropy', 'Asset Protection'],
    languages: ['English', 'Spanish', 'Portuguese'],
    clientTypes: ['family', 'individual'],
    hourlyRate: '$750/hr',
    responseTime: '< 6 hours',
    bio: 'Maria focuses on sophisticated estate planning strategies for ultra-high-net-worth families.',
    experience: 18,
    credentials: ['JD', 'LLM Tax', 'ACTEC'],
    availability: 'busy',
    lastActive: '4 hours ago',
    phone: '+1 (305) 555-0789',
    email: 'maria@rodriguezlaw.com'
  },
  {
    id: '4',
    name: 'Thomas Anderson',
    title: 'Family Office Consultant',
    firm: 'Anderson Consulting',
    type: 'consultant',
    location: 'Dallas, TX',
    state: 'TX',
    rating: 4.7,
    reviews: 156,
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400',
    specialties: ['Family Governance', 'Next-Gen Planning', 'Investment Committee', 'Succession Planning'],
    languages: ['English'],
    clientTypes: ['family', 'business'],
    hourlyRate: '$500/hr',
    responseTime: '< 5 hours',
    bio: 'Thomas helps ultra-wealthy families establish governance structures and prepare the next generation.',
    experience: 20,
    credentials: ['MBA', 'CFA', 'FFI'],
    availability: 'available',
    lastActive: '30 minutes ago',
    phone: '+1 (214) 555-0345',
    email: 'thomas@andersonconsulting.com'
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    title: 'Private Risk Advisor',
    firm: 'Johnson Insurance Solutions',
    type: 'insurance',
    location: 'Greenwich, CT',
    state: 'CT',
    rating: 4.6,
    reviews: 78,
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=400',
    specialties: ['PPLI', 'Estate Liquidity', 'Executive Benefits', 'Captive Insurance'],
    languages: ['English', 'French'],
    clientTypes: ['individual', 'family', 'business'],
    responseTime: '< 4 hours',
    bio: 'Sarah specializes in sophisticated insurance strategies for wealth preservation and transfer.',
    experience: 14,
    credentials: ['ChFC', 'CLU', 'CPCU'],
    availability: 'available',
    lastActive: '1 hour ago',
    phone: '+1 (203) 555-0567',
    email: 'sarah@johnsoninsurance.com'
  },
  {
    id: '6',
    name: 'Michael Chen',
    title: 'Luxury Real Estate Advisor',
    firm: 'Chen Properties Group',
    type: 'real-estate',
    location: 'San Francisco, CA',
    state: 'CA',
    rating: 4.8,
    reviews: 92,
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    specialties: ['Luxury Residential', 'Commercial Investment', '1031 Exchanges', 'International Property'],
    languages: ['English', 'Mandarin', 'Cantonese'],
    clientTypes: ['individual', 'family', 'business'],
    responseTime: '< 2 hours',
    bio: 'Michael helps high-net-worth clients with luxury real estate acquisitions and investment strategies.',
    experience: 16,
    credentials: ['REALTOR®', 'CRS', 'CIPS'],
    availability: 'available',
    lastActive: '45 minutes ago',
    phone: '+1 (415) 555-0890',
    email: 'michael@chenproperties.com'
  }
];

const professionalTypeIcons = {
  advisor: TrendingUp,
  cpa: Calculator,
  attorney: Scale,
  consultant: Users,
  insurance: Shield,
  'real-estate': Home
};

const professionalTypeLabels = {
  advisor: 'Financial Advisor',
  cpa: 'CPA',
  attorney: 'Attorney',
  consultant: 'Consultant',
  insurance: 'Insurance Specialist',
  'real-estate': 'Real Estate Agent'
};

export function ProfessionalDirectory() {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedClientType, setSelectedClientType] = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');

  const userRole = userProfile?.role || 'client';
  const isProfessional = ['advisor', 'accountant', 'attorney', 'consultant'].includes(userRole);

  // Extract unique values for filters
  const uniqueLocations = [...new Set(mockProfessionals.map(p => p.state))].sort();
  const uniqueLanguages = [...new Set(mockProfessionals.flatMap(p => p.languages))].sort();
  const uniqueSpecialties = [...new Set(mockProfessionals.flatMap(p => p.specialties))].sort();

  const filteredProfessionals = useMemo(() => {
    let filtered = mockProfessionals.filter(professional => {
      const matchesSearch = searchTerm === '' || 
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || professional.type === selectedType;
      const matchesLocation = selectedLocation === 'all' || professional.state === selectedLocation;
      const matchesLanguage = selectedLanguage === 'all' || professional.languages.includes(selectedLanguage);
      const matchesClientType = selectedClientType === 'all' || professional.clientTypes.includes(selectedClientType as any);
      const matchesSpecialty = selectedSpecialty === 'all' || professional.specialties.includes(selectedSpecialty);
      
      return matchesSearch && matchesType && matchesLocation && matchesLanguage && matchesClientType && matchesSpecialty;
    });

    // Sort professionals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedType, selectedLocation, selectedLanguage, selectedClientType, selectedSpecialty, sortBy]);

  const ProfessionalCard = ({ professional }: { professional: Professional }) => {
    const TypeIcon = professionalTypeIcons[professional.type];
    
    return (
      <Card className="cursor-pointer hover-scale transition-all duration-200 border-border/50 h-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-16 h-16 border-2 border-border">
                  <AvatarImage src={professional.imageUrl} alt={professional.name} />
                  <AvatarFallback>
                    {professional.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{professional.name}</h3>
                    {professional.verified && (
                      <Verified className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-muted-foreground">{professional.title}</p>
                  <p className="font-medium text-sm">{professional.firm}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-2">
                  <TypeIcon className="w-3 h-3 mr-1" />
                  {professionalTypeLabels[professional.type]}
                </Badge>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  professional.availability === 'available' ? 'bg-green-100 text-green-700' :
                  professional.availability === 'busy' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {professional.availability}
                </div>
              </div>
            </div>

            {/* Location and Rating */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {professional.location}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{professional.rating}</span>
                  <span className="text-muted-foreground">({professional.reviews})</span>
                </div>
              </div>
              <div className="text-muted-foreground">
                <Clock className="w-4 h-4 inline mr-1" />
                {professional.responseTime}
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {professional.bio}
            </p>

            {/* Specialties */}
            <div>
              <div className="text-xs text-muted-foreground mb-2">Specialties</div>
              <div className="flex flex-wrap gap-1">
                {professional.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {professional.specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{professional.specialties.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Languages and Client Types */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-muted-foreground mb-1">Languages</div>
                <div>{professional.languages.join(', ')}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Client Types</div>
                <div className="capitalize">{professional.clientTypes.join(', ')}</div>
              </div>
            </div>

            {/* Credentials and Experience */}
            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="text-muted-foreground">Experience</div>
                <div className="font-medium">{professional.experience} years</div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground">Credentials</div>
                <div className="font-medium">{professional.credentials.join(', ')}</div>
              </div>
            </div>

            {/* Pricing */}
            {(professional.minAssets || professional.hourlyRate) && (
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium">
                  {professional.minAssets || professional.hourlyRate}
                </div>
                <div className="text-xs text-muted-foreground">
                  {professional.minAssets ? 'Minimum Assets' : 'Hourly Rate'}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              {isProfessional ? (
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Edit className="w-3 h-3" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Award className="w-3 h-3" />
                    Manage Reviews
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    className="gap-1"
                    onClick={() => navigate(`/marketplace/booking/${professional.id}`)}
                  >
                    <Calendar className="w-3 h-3" />
                    Book Consultation
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Message
                  </Button>
                </div>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full gap-1"
                onClick={() => navigate(`/marketplace/professional/${professional.id}`)}
              >
                <FileText className="w-3 h-3" />
                View Full Profile
              </Button>
            </div>

            {/* Contact Info (for professionals) */}
            {isProfessional && (
              <div className="border-t pt-3 space-y-1 text-xs">
                {professional.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    <span>{professional.phone}</span>
                  </div>
                )}
                {professional.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    <span>{professional.email}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Professional Directory</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with verified professionals across financial advisory, tax, legal, consulting, insurance, and real estate services.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter Professionals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, firm, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Professional Type" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="advisor">Financial Advisor</SelectItem>
                <SelectItem value="cpa">CPA</SelectItem>
                <SelectItem value="attorney">Attorney</SelectItem>
                <SelectItem value="consultant">Consultant</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="all">All Specialties</SelectItem>
                {uniqueSpecialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="all">All Languages</SelectItem>
                {uniqueLanguages.map(language => (
                  <SelectItem key={language} value={language}>{language}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedClientType} onValueChange={setSelectedClientType}>
              <SelectTrigger>
                <SelectValue placeholder="Client Type" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="all">All Client Types</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="experience">Most Experience</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {filteredProfessionals.length} professionals found
            </div>
            <Button variant="outline" size="sm" onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedLocation('all');
              setSelectedLanguage('all');
              setSelectedClientType('all');
              setSelectedSpecialty('all');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Professional Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessionals.map((professional) => (
          <ProfessionalCard key={professional.id} professional={professional} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProfessionals.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No professionals found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or clearing filters to see more results.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedLocation('all');
              setSelectedLanguage('all');
              setSelectedClientType('all');
              setSelectedSpecialty('all');
            }}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Load More */}
      {filteredProfessionals.length > 0 && (
        <div className="text-center">
          <Button variant="outline" size="lg" className="gap-2">
            <Users className="w-5 h-5" />
            Load More Professionals
          </Button>
        </div>
      )}
    </div>
  );
}