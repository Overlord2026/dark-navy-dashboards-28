import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Crown, 
  Sparkles, 
  Share2, 
  ExternalLink,
  Linkedin,
  Globe,
  Trophy,
  Star,
  Award,
  Users,
  Calendar,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface VipMember {
  id: string;
  name: string;
  firm?: string;
  persona_type: string;
  email: string;
  linkedin_url?: string;
  website?: string;
  avatar_url?: string;
  joined_at: string;
  referral_count: number;
  badge_level: 'founding' | 'charter' | 'pioneer';
  specialties?: string[];
  bio?: string;
  location?: string;
}

const PERSONA_COLORS = {
  advisor: 'from-blue-400 to-blue-600',
  attorney: 'from-purple-400 to-purple-600',
  accountant: 'from-emerald-400 to-emerald-600',
  property_manager: 'from-cyan-400 to-cyan-600',
  healthcare_influencer: 'from-teal-400 to-teal-600',
  family_office: 'from-amber-400 to-amber-600',
  insurance_agent: 'from-orange-400 to-orange-600',
  coach: 'from-pink-400 to-pink-600',
  consultant: 'from-indigo-400 to-indigo-600'
};

const PERSONA_DISPLAY_NAMES = {
  advisor: 'Financial Advisor',
  attorney: 'Legal Counsel', 
  accountant: 'CPA',
  property_manager: 'Property Manager',
  healthcare_influencer: 'Health Influencer',
  family_office: 'Family Office',
  insurance_agent: 'Insurance Expert',
  coach: 'Family Coach',
  consultant: 'Consultant'
};

export function VipWallDisplay() {
  const [members, setMembers] = useState<VipMember[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [newMemberAnimation, setNewMemberAnimation] = useState<string | null>(null);

  useEffect(() => {
    loadVipMembers();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Randomly add a new member for demo
      if (Math.random() > 0.98) {
        addNewMember();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadVipMembers = async () => {
    try {
      // TODO: Replace with actual Supabase call
      const mockMembers: VipMember[] = [
        {
          id: '1',
          name: 'John Smith',
          firm: 'Smith Wealth Management',
          persona_type: 'advisor',
          email: 'john@smithwealth.com',
          linkedin_url: 'https://linkedin.com/in/johnsmith',
          website: 'https://smithwealth.com',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          joined_at: '2024-01-15T14:20:00Z',
          referral_count: 3,
          badge_level: 'founding',
          specialties: ['Estate Planning', 'Tax Strategy'],
          bio: 'Helping families preserve wealth for generations',
          location: 'New York, NY'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          firm: 'Johnson Legal Group',
          persona_type: 'attorney',
          email: 'sarah@johnsonlegal.com',
          linkedin_url: 'https://linkedin.com/in/sarahjohnson',
          avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ab?w=150&h=150&fit=crop&crop=face',
          joined_at: '2024-01-16T09:45:00Z',
          referral_count: 2,
          badge_level: 'founding',
          specialties: ['Estate Law', 'Trust Administration'],
          bio: 'Expert in complex estate planning structures',
          location: 'Los Angeles, CA'
        },
        {
          id: '3',
          name: 'Michael Chen',
          firm: 'Chen CPA Services',
          persona_type: 'accountant',
          email: 'michael@chencpa.com',
          joined_at: '2024-01-17T11:30:00Z',
          referral_count: 1,
          badge_level: 'charter',
          specialties: ['Family Office Tax', 'International Tax'],
          bio: 'Specialized tax planning for multi-generational wealth',
          location: 'San Francisco, CA'
        },
        {
          id: '4',
          name: 'Lisa Rodriguez',
          firm: 'Rodriguez Property Management',
          persona_type: 'property_manager',
          email: 'lisa@rodriguezpm.com',
          joined_at: '2024-01-18T16:15:00Z',
          referral_count: 0,
          badge_level: 'pioneer',
          specialties: ['Luxury Properties', 'Investment Real Estate'],
          bio: 'Premium property management for HNW families',
          location: 'Miami, FL'
        },
        {
          id: '5',
          name: 'Dr. James Wilson',
          firm: 'Wilson Longevity Institute',
          persona_type: 'healthcare_influencer',
          email: 'james@wilsonlongevity.com',
          website: 'https://wilsonlongevity.com',
          linkedin_url: 'https://linkedin.com/in/drjameswilson',
          avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
          joined_at: '2024-01-19T13:20:00Z',
          referral_count: 4,
          badge_level: 'founding',
          specialties: ['Longevity Medicine', 'Preventive Health'],
          bio: 'Pioneering healthspan optimization for wealthy families',
          location: 'Boston, MA'
        }
      ];
      
      setMembers(mockMembers);
    } catch (error) {
      console.error('Error loading VIP members:', error);
      toast.error('Failed to load VIP members');
    } finally {
      setLoading(false);
    }
  };

  const addNewMember = () => {
    const newMember: VipMember = {
      id: `new-${Date.now()}`,
      name: 'New Member',
      firm: 'Example Firm',
      persona_type: 'advisor',
      email: 'new@example.com',
      joined_at: new Date().toISOString(),
      referral_count: 0,
      badge_level: 'charter'
    };
    
    setMembers(prev => [newMember, ...prev]);
    setNewMemberAnimation(newMember.id);
    
    // Clear animation after 3 seconds
    setTimeout(() => {
      setNewMemberAnimation(null);
    }, 3000);
  };

  const shareProfile = (member: VipMember) => {
    const shareText = `🎉 Proud to be part of the Family Office Marketplace™ as a Founding ${PERSONA_DISPLAY_NAMES[member.persona_type as keyof typeof PERSONA_DISPLAY_NAMES]}! Join me in this exclusive community. #FamilyOffice #FoundingMember`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Family Office Marketplace™ - Founding Member',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Share text copied to clipboard!');
    }
  };

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'founding': return 'from-amber-400 to-orange-500';
      case 'charter': return 'from-purple-400 to-indigo-500';
      case 'pioneer': return 'from-emerald-400 to-teal-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getBadgeIcon = (level: string) => {
    switch (level) {
      case 'founding': return <Crown className="h-3 w-3" />;
      case 'charter': return <Star className="h-3 w-3" />;
      case 'pioneer': return <Trophy className="h-3 w-3" />;
      default: return <Award className="h-3 w-3" />;
    }
  };

  const filteredMembers = members.filter(member => 
    filter === 'all' || member.persona_type === filter
  );

  const membersByPersona = members.reduce((acc, member) => {
    const persona = member.persona_type;
    if (!acc[persona]) acc[persona] = [];
    acc[persona].push(member);
    return acc;
  }, {} as Record<string, VipMember[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-amber-100 to-orange-100">
            <Crown className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            VIP Founding Members Wall
          </h1>
          <div className="p-3 rounded-full bg-gradient-to-r from-amber-100 to-orange-100">
            <Sparkles className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Meet the exclusive founding members who are shaping the future of family office services
        </p>
        
        {/* Stats */}
        <div className="flex justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-amber-600">{members.length}</div>
            <div className="text-sm text-muted-foreground">Founding Members</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">
              {members.reduce((sum, m) => sum + m.referral_count, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Referrals</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {Object.keys(membersByPersona).length}
            </div>
            <div className="text-sm text-muted-foreground">Professions</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className="rounded-full"
        >
          <Users className="h-4 w-4 mr-2" />
          All Members ({members.length})
        </Button>
        {Object.entries(membersByPersona).map(([persona, personaMembers]) => (
          <Button
            key={persona}
            variant={filter === persona ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(persona)}
            className="rounded-full"
          >
            {PERSONA_DISPLAY_NAMES[persona as keyof typeof PERSONA_DISPLAY_NAMES]} ({personaMembers.length})
          </Button>
        ))}
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden ${
                newMemberAnimation === member.id ? 'animate-pulse' : ''
              }`}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-amber-200">
                {/* Badge Overlay */}
                <div className="absolute top-4 right-4 z-10">
                  <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${getBadgeColor(member.badge_level)} text-white text-xs font-medium flex items-center gap-1`}>
                    {getBadgeIcon(member.badge_level)}
                    {member.badge_level === 'founding' ? 'Founding' : 
                     member.badge_level === 'charter' ? 'Charter' : 'Pioneer'}
                  </div>
                </div>

                {/* Sparkle animation for new members */}
                {newMemberAnimation === member.id && (
                  <div className="absolute inset-0 pointer-events-none">
                    <Sparkles className="absolute top-2 left-2 h-4 w-4 text-amber-400 animate-bounce" />
                    <Sparkles className="absolute top-6 right-8 h-3 w-3 text-orange-400 animate-bounce delay-100" />
                    <Sparkles className="absolute bottom-4 left-6 h-3 w-3 text-amber-500 animate-bounce delay-200" />
                  </div>
                )}

                <CardHeader className="text-center space-y-4">
                  {/* Avatar */}
                  <div className="flex justify-center">
                    <div className={`p-1 rounded-full bg-gradient-to-r ${PERSONA_COLORS[member.persona_type as keyof typeof PERSONA_COLORS] || 'from-gray-400 to-gray-600'}`}>
                      <Avatar className="h-20 w-20 border-4 border-white">
                        <AvatarImage src={member.avatar_url} alt={member.name} />
                        <AvatarFallback className="text-lg font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  {/* Name and Firm */}
                  <div>
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    {member.firm && (
                      <p className="text-muted-foreground">{member.firm}</p>
                    )}
                  </div>

                  {/* Persona Badge */}
                  <Badge 
                    variant="outline" 
                    className={`bg-gradient-to-r ${PERSONA_COLORS[member.persona_type as keyof typeof PERSONA_COLORS]} text-white border-0`}
                  >
                    {PERSONA_DISPLAY_NAMES[member.persona_type as keyof typeof PERSONA_DISPLAY_NAMES]}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Bio */}
                  {member.bio && (
                    <p className="text-sm text-muted-foreground text-center italic">
                      "{member.bio}"
                    </p>
                  )}

                  {/* Specialties */}
                  {member.specialties && member.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex justify-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-emerald-600">{member.referral_count}</div>
                      <div className="text-muted-foreground">Referrals</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">
                        {new Date(member.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-muted-foreground">Joined</div>
                    </div>
                  </div>

                  {/* Location */}
                  {member.location && (
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      {member.location}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 justify-center">
                    {member.linkedin_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {member.website && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={member.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => shareProfile(member)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4 py-12">
        <div className="p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
          <Crown className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Want to Join the Founding Members?</h2>
          <p className="text-muted-foreground mb-6">
            Limited spots available for qualified professionals
          </p>
          <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
            Apply for Founding Membership
          </Button>
        </div>
      </div>
    </div>
  );
}