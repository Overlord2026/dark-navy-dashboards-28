import React, { useState, useEffect } from 'react';
import { BrandHeader } from '@/components/layout/BrandHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { listAdvisors, type Pro } from '@/services/advisors';
import { Star, MapPin, Clock, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const TAGS = ['All', 'Retirement', 'Estate', 'Investment', 'Tax', 'Family Office', 'Inheritance'];

export default function MarketplaceAdvisors() {
  const [advisors, setAdvisors] = useState<Pro[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadAdvisors();
  }, []);

  const loadAdvisors = async () => {
    try {
      setLoading(true);
      const data = await listAdvisors();
      setAdvisors(data);
    } catch (error) {
      console.error('Failed to load advisors:', error);
      toast({
        title: "Unable to load advisors",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAdvisors = advisors.filter(advisor => {
    const matchesTag = selectedTag === 'All' || advisor.tags?.includes(selectedTag);
    const matchesSearch = searchQuery === '' || 
      advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (advisor.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (advisor.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header Section */}
          <section className="bfo-card p-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Find Expert Financial Advisors</h1>
            <p className="text-xl text-muted-foreground">
              Connect with certified financial professionals specializing in your needs
            </p>
          </section>

          {/* Search and Filters */}
          <section className="bfo-card p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, location, or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button 
                onClick={loadAdvisors}
                className="gold-outline-button"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Search Advisors'}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <Badge
                  key={tag}
                  variant={tag === selectedTag ? "default" : "outline"}
                  className={`cursor-pointer ${
                    tag === selectedTag 
                      ? 'bg-bfo-gold text-black' 
                      : 'border-bfo-gold text-bfo-gold hover:bg-bfo-gold/10'
                  }`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </section>

          {/* Results */}
          <section>
            {loading ? (
              <div className="bfo-card p-8 text-center">
                <p className="text-muted-foreground">Loading advisors...</p>
              </div>
            ) : filteredAdvisors.length === 0 ? (
              <div className="bfo-card p-8 text-center">
                <p className="text-muted-foreground mb-4">No advisors found matching your criteria.</p>
                <Button onClick={() => { setSelectedTag('All'); setSearchQuery(''); }} className="gold-outline-button">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAdvisors.map(advisor => (
                  <Card key={advisor.id} className="bfo-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          {advisor.avatar_url ? (
                            <img 
                              src={advisor.avatar_url} 
                              alt={advisor.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-semibold">
                              {advisor.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{advisor.name}</h3>
                          <p className="text-sm text-muted-foreground">{advisor.title || 'Financial Advisor'}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span>{advisor.rating || 'New'}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{advisor.location || 'Remote'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{advisor.years_exp || 'Experienced professional'}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(advisor.tags || []).slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {(advisor.tags || []).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(advisor.tags || []).length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <Button asChild className="w-full gold-button">
                        <Link to={`/marketplace/advisors/${advisor.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}