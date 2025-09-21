import React, { useState } from 'react';
import SecondaryNav from '@/components/layout/SecondaryNav';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search, MapPin, Star, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const attorneys = [
  { id: '1', name: 'Jane Smith, Esq.', title: 'Estate Planning Attorney', rating: 4.8, location: 'New York, NY', years: '12+ years', areas: ['Estate', 'Probate', 'Trust'] },
  { id: '2', name: 'Robert Johnson, JD', title: 'Probate Specialist', rating: 4.7, location: 'Los Angeles, CA', years: '15+ years', areas: ['Probate', 'Trust', 'Tax Law'] },
  { id: '3', name: 'Sarah Williams, Esq.', title: 'Trust & Estate Attorney', rating: 4.9, location: 'Chicago, IL', years: '8+ years', areas: ['Trust', 'Estate', 'Family Law'] }
];

const practiceAreas = ['All', 'Estate Planning', 'Probate', 'Trust Law', 'Tax Law', 'Family Law'];

export default function AttorneyMarketplace() {
  const [selectedArea, setSelectedArea] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAttorneys = attorneys.filter(attorney => {
    const matchesArea = selectedArea === 'All' || attorney.areas.some(area => area.toLowerCase().includes(selectedArea.toLowerCase()));
    const matchesSearch = searchQuery === '' || attorney.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesArea && matchesSearch;
  });

  return (
    <>
      <SecondaryNav />
      <div className="min-h-screen bg-background" style={{ paddingTop: '120px' }}>
        
        
        <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <section className="bfo-card p-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Find Expert Estate Planning Attorneys</h1>
            <p className="text-xl text-muted-foreground">
              Connect with licensed attorneys specializing in estate planning and probate law
            </p>
          </section>

          <section className="bfo-card p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, location, or practice area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button className="gold-button">Search Attorneys</Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {practiceAreas.map(area => (
                <Badge
                  key={area}
                  variant={area === selectedArea ? "default" : "outline"}
                  className={`cursor-pointer ${
                    area === selectedArea 
                      ? 'bg-bfo-gold text-black' 
                      : 'border-bfo-gold text-bfo-gold hover:bg-bfo-gold/10'
                  }`}
                  onClick={() => setSelectedArea(area)}
                >
                  {area}
                </Badge>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttorneys.map(attorney => (
              <Card key={attorney.id} className="bfo-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Scale className="h-8 w-8 text-bfo-gold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{attorney.name}</h3>
                      <p className="text-sm text-muted-foreground">{attorney.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{attorney.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{attorney.location}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>{attorney.years} experience</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {attorney.areas.map(area => (
                      <Badge key={area} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button asChild className="w-full gold-button">
                    <Link to={`/marketplace/attorneys/${attorney.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          </div>
        </div>
      </div>
    </>
  );
}