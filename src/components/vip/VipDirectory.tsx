import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Crown, 
  Star, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Filter,
  Search,
  Grid3X3,
  List,
  Calendar,
  Award,
  Users,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VipProfile {
  id: string;
  slug: string;
  name: string;
  firm: string;
  persona_type: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  specialty?: string;
  location?: string;
  invite_status: string;
  activated_at?: string;
  persona_group: string;
  batch_name: string;
  created_at: string;
}

interface VipDirectoryProps {
  showPublicOnly?: boolean;
  allowBooking?: boolean;
}

const PERSONA_DISPLAY_NAMES = {
  advisor: 'Financial Advisor',
  attorney: 'Legal Counsel', 
  cpa: 'CPA',
  accountant: 'Accountant',
  insurance_agent: 'Insurance Professional',
  consultant: 'Consultant',
  coach: 'Coach',
  healthcare_consultant: 'Healthcare Consultant'
};

const PERSONA_COLORS = {
  advisor: 'bg-blue-100 text-blue-800',
  attorney: 'bg-purple-100 text-purple-800',
  cpa: 'bg-emerald-100 text-emerald-800',
  accountant: 'bg-emerald-100 text-emerald-800',
  insurance_agent: 'bg-orange-100 text-orange-800',
  consultant: 'bg-indigo-100 text-indigo-800',
  coach: 'bg-pink-100 text-pink-800',
  healthcare_consultant: 'bg-teal-100 text-teal-800'
};

export const VipDirectory: React.FC<VipDirectoryProps> = ({
  showPublicOnly = false,
  allowBooking = true
}) => {
  const [profiles, setProfiles] = useState<VipProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadProfiles();
  }, [showPublicOnly]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('vip_invites').select('*');
      
      if (showPublicOnly) {
        query = query.eq('invite_status', 'activated');
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProfiles(data || []);
      
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast.error('Failed to load VIP directory');
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = !searchTerm || 
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (profile.specialty && profile.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (profile.location && profile.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPersona = selectedPersona === 'all' || profile.persona_type === selectedPersona;
    const matchesStatus = selectedStatus === 'all' || profile.invite_status === selectedStatus;
    const matchesBatch = selectedBatch === 'all' || profile.batch_name === selectedBatch;
    
    return matchesSearch && matchesPersona && matchesStatus && matchesBatch;
  });

  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'firm':
        return a.firm.localeCompare(b.firm);
      case 'persona':
        return a.persona_type.localeCompare(b.persona_type);
      case 'activated':
        if (!a.activated_at && !b.activated_at) return 0;
        if (!a.activated_at) return 1;
        if (!b.activated_at) return -1;
        return new Date(b.activated_at).getTime() - new Date(a.activated_at).getTime();
      case 'recent':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const uniquePersonas = [...new Set(profiles.map(p => p.persona_type))];
  const uniqueBatches = [...new Set(profiles.map(p => p.batch_name))];
  const uniqueStatuses = [...new Set(profiles.map(p => p.invite_status))];

  const getPersonaIcon = (personaType: string) => {
    switch (personaType) {
      case 'advisor': return <TrendingUp className="h-4 w-4" />;
      case 'attorney': return <Award className="h-4 w-4" />;
      case 'cpa': 
      case 'accountant': return <Users className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const handleBookConsult = (profile: VipProfile) => {
    if (profile.linkedin_url) {
      window.open(profile.linkedin_url, '_blank');
    } else {
      // Could implement a booking modal here
      toast.info('Booking system not yet implemented');
    }
  };

  const handleSendMessage = (profile: VipProfile) => {
    const subject = `Introduction via Family Office Marketplace`;
    const body = `Hi ${profile.name},\n\nI found your profile on the Family Office Marketplace and would like to connect.\n\nBest regards`;
    window.open(`mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-gold" />
          <div>
            <h1 className="text-3xl font-bold">
              {showPublicOnly ? 'Meet Our Founding Professionals' : 'VIP Directory'}
            </h1>
            <p className="text-muted-foreground">
              {showPublicOnly 
                ? 'Connect with our founding member professionals' 
                : 'Complete directory of VIP invitations and activations'
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-gold" />
              <span className="text-sm font-medium">Total VIPs</span>
            </div>
            <div className="text-2xl font-bold mt-1">{profiles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium">Activated</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {profiles.filter(p => p.invite_status === 'activated').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Personas</span>
            </div>
            <div className="text-2xl font-bold mt-1">{uniquePersonas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Batches</span>
            </div>
            <div className="text-2xl font-bold mt-1">{uniqueBatches.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, firm, specialty, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedPersona} onValueChange={setSelectedPersona}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Personas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Personas</SelectItem>
                {uniquePersonas.map(persona => (
                  <SelectItem key={persona} value={persona}>
                    {PERSONA_DISPLAY_NAMES[persona as keyof typeof PERSONA_DISPLAY_NAMES] || persona}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!showPublicOnly && (
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="firm">Firm A-Z</SelectItem>
                <SelectItem value="persona">Persona</SelectItem>
                <SelectItem value="activated">Recently Activated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Directory */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {sortedProfiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full ${viewMode === 'list' ? 'hover:shadow-md' : 'hover:shadow-lg'} transition-shadow`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-gradient-to-r from-gold to-yellow-500 text-navy font-medium">
                        <Crown className="h-3 w-3 mr-1" />
                        Founding
                      </Badge>
                      {profile.invite_status === 'activated' && (
                        <Badge className="bg-emerald-100 text-emerald-800">
                          <Star className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-lg">{profile.name}</h3>
                    <p className="text-muted-foreground">{profile.firm}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-foreground rounded-full flex items-center justify-center">
                    {getPersonaIcon(profile.persona_type)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <Badge 
                    className={PERSONA_COLORS[profile.persona_type as keyof typeof PERSONA_COLORS] || 'bg-gray-100 text-gray-800'}
                  >
                    {PERSONA_DISPLAY_NAMES[profile.persona_type as keyof typeof PERSONA_DISPLAY_NAMES] || profile.persona_type}
                  </Badge>
                  
                  {profile.specialty && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      {profile.specialty}
                    </div>
                  )}
                  
                  {profile.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  )}
                  
                  {allowBooking && (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={() => handleBookConsult(profile)}
                      >
                        {profile.linkedin_url ? (
                          <>
                            <Linkedin className="h-4 w-4 mr-1" />
                            Connect
                          </>
                        ) : (
                          <>
                            <Calendar className="h-4 w-4 mr-1" />
                            Book
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendMessage(profile)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      {profile.phone && (
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {sortedProfiles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No VIP profiles found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedPersona !== 'all' || selectedStatus !== 'all' 
                ? 'Try adjusting your filters to see more results'
                : 'No VIP profiles have been created yet'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};