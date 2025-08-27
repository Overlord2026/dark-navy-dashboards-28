import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Star, Clock, Globe, Award, Phone, Mail, ExternalLink } from 'lucide-react';
import { listAgents, type AgentProfile, type QuoteFilters } from '@/services/marketplace';

export function AgentsPage() {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [filters, setFilters] = useState<QuoteFilters>({
    state: searchParams.get('state') || '',
    specialty: searchParams.get('specialty')?.split(',').filter(Boolean) || [],
    languages: searchParams.get('languages')?.split(',').filter(Boolean) || [],
    max_sla_hours: searchParams.get('max_sla_hours') ? parseInt(searchParams.get('max_sla_hours')!) : undefined,
    min_rating: searchParams.get('min_rating') ? parseFloat(searchParams.get('min_rating')!) : undefined
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAgents();
  }, [filters]);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const data = await listAgents(filters);
      setAgents(data);
    } catch (error) {
      console.error('Failed to load agents:', error);
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<QuoteFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    
    // Update URL params
    const params = new URLSearchParams();
    if (updated.state) params.set('state', updated.state);
    if (updated.specialty?.length) params.set('specialty', updated.specialty.join(','));
    if (updated.languages?.length) params.set('languages', updated.languages.join(','));
    if (updated.max_sla_hours) params.set('max_sla_hours', updated.max_sla_hours.toString());
    if (updated.min_rating) params.set('min_rating', updated.min_rating.toString());
    
    setSearchParams(params);
  };

  const filteredAgents = agents.filter(agent => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      agent.business_name.toLowerCase().includes(query) ||
      agent.specialties.some(s => s.toLowerCase().includes(query)) ||
      agent.states_licensed.some(s => s.toLowerCase().includes(query))
    );
  });

  const specialtyOptions = [
    'auto', 'home', 'life', 'commercial', 'umbrella', 'motorcycle', 
    'boat', 'rv', 'renters', 'condo', 'flood', 'earthquake'
  ];

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Chinese', 'Japanese', 'Korean', 'Russian', 'Arabic'
  ];

  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Insurance Agents Directory</h1>
              <p className="text-muted-foreground">Find licensed insurance professionals in your area</p>
            </div>
            <Link to="/quotes/start">
              <Button className="flex items-center gap-2">
                Get Quotes
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Search by name, specialty, or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Select 
                  value={filters.state} 
                  onValueChange={(value) => updateFilters({ state: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All States</SelectItem>
                    {stateOptions.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={filters.specialty?.[0] || ''} 
                  onValueChange={(value) => updateFilters({ specialty: value ? [value] : [] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Specialties</SelectItem>
                    {specialtyOptions.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={filters.languages?.[0] || ''} 
                  onValueChange={(value) => updateFilters({ languages: value ? [value] : [] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Languages</SelectItem>
                    {languageOptions.map(language => (
                      <SelectItem key={language} value={language}>{language}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={filters.max_sla_hours?.toString() || ''} 
                  onValueChange={(value) => updateFilters({ max_sla_hours: value ? parseInt(value) : undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Response Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Time</SelectItem>
                    <SelectItem value="1">Within 1 hour</SelectItem>
                    <SelectItem value="4">Within 4 hours</SelectItem>
                    <SelectItem value="24">Within 24 hours</SelectItem>
                    <SelectItem value="48">Within 48 hours</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={filters.min_rating?.toString() || ''} 
                  onValueChange={(value) => updateFilters({ min_rating: value ? parseFloat(value) : undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Min Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Rating</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    <SelectItem value="3.0">3.0+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${filteredAgents.length} agents found`}
            </p>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {agent.profile_image_url ? (
                      <img 
                        src={agent.profile_image_url} 
                        alt={agent.business_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-lg font-semibold">
                          {agent.business_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{agent.business_name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{agent.rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">
                          ({agent.reviews_count} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Award className="h-3 w-3" />
                        {agent.years_experience} years experience
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {agent.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {agent.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{agent.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* States & Languages */}
                  <div className="mb-4 space-y-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span className="text-muted-foreground">Licensed in:</span>
                      <span>{agent.states_licensed.slice(0, 3).join(', ')}</span>
                      {agent.states_licensed.length > 3 && (
                        <span className="text-muted-foreground">+{agent.states_licensed.length - 3}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-muted-foreground">Response time:</span>
                      <span>{agent.sla_hours}h</span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex gap-2 mb-4">
                    {agent.contact_methods.phone && (
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <a href={`tel:${agent.contact_methods.phone}`}>
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </a>
                      </Button>
                    )}
                    {agent.contact_methods.email && (
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <a href={`mailto:${agent.contact_methods.email}`}>
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* View Profile */}
                  <Link to={`/agents/${agent.slug}`}>
                    <Button className="w-full" variant="default">
                      View Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAgents.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No agents found matching your criteria.</p>
              <p className="text-sm">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}