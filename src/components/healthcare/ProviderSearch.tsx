import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin, Star, Phone, Calendar } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  reviews: number;
  verified: boolean;
  image?: string;
  bio: string;
  experience: number;
}

interface ProviderSearchProps {
  onInviteProvider: (provider: Provider) => void;
  onBookAppointment: (provider: Provider) => void;
}

export function ProviderSearch({ onInviteProvider, onBookAppointment }: ProviderSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const mockProviders: Provider[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Primary Care',
      location: 'New York, NY',
      rating: 4.9,
      reviews: 127,
      verified: true,
      bio: 'Board-certified internal medicine physician specializing in preventive care and longevity protocols.',
      experience: 15
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      location: 'Los Angeles, CA',
      rating: 4.8,
      reviews: 89,
      verified: true,
      bio: 'Interventional cardiologist with expertise in advanced cardiac imaging and preventive cardiology.',
      experience: 12
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Longevity Medicine',
      location: 'Miami, FL',
      rating: 4.9,
      reviews: 156,
      verified: true,
      bio: 'Anti-aging specialist focused on biomarker optimization and personalized longevity protocols.',
      experience: 8
    },
    {
      id: '4',
      name: 'Dr. David Kim',
      specialty: 'Functional Medicine',
      location: 'San Francisco, CA',
      rating: 4.7,
      reviews: 203,
      verified: true,
      bio: 'Functional medicine practitioner specializing in root cause analysis and integrative health.',
      experience: 10
    }
  ];

  const specialties = [
    'Primary Care',
    'Cardiology',
    'Longevity Medicine',
    'Functional Medicine',
    'Endocrinology',
    'Neurology',
    'Preventive Medicine'
  ];

  const locations = [
    'New York, NY',
    'Los Angeles, CA',
    'Miami, FL',
    'San Francisco, CA',
    'Chicago, IL',
    'Boston, MA'
  ];

  const filteredProviders = mockProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || provider.specialty === selectedSpecialty;
    const matchesLocation = !selectedLocation || provider.location === selectedLocation;
    
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search providers by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 touch-target"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="touch-target">
              <SelectValue placeholder="All Specialties" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="">All Specialties</SelectItem>
              {specialties.map(specialty => (
                <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="touch-target">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="touch-target">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-semibold">
            {filteredProviders.length} Providers Found
          </h3>
          <Select defaultValue="rating">
            <SelectTrigger className="w-40 touch-target">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="experience">Most Experience</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProviders.map(provider => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="font-serif flex items-center gap-2">
                      {provider.name}
                      {provider.verified && (
                        <Badge className="bg-emerald text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {provider.specialty} • {provider.experience} years experience
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{provider.rating}</span>
                    <span className="text-muted-foreground">({provider.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {provider.location}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {provider.bio}
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 touch-target font-display"
                    onClick={() => onBookAppointment(provider)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="touch-target"
                    onClick={() => onInviteProvider(provider)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Invite to Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}