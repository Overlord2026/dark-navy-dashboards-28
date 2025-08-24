import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  CheckCircle,
  Clock,
  MapPin,
  Trophy,
  Star,
  MessageSquare,
  Share,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

// Mock athlete data
const mockAthletes = [
  {
    id: '1',
    handle: 'sarah-thompson',
    name: 'Sarah Thompson',
    sport: 'Basketball',
    position: 'Point Guard',
    school: 'Duke University',
    classYear: 'Junior',
    region: 'North Carolina',
    avatar: '/placeholder-athlete-1.jpg',
    momentum: 'up',
    complianceCoverage: 95,
    verified: true,
    followers: 12500,
    lastActive: '2024-01-22',
    tags: ['Leadership', 'Community']
  },
  {
    id: '2',
    handle: 'mike-rodriguez',
    name: 'Mike Rodriguez',
    sport: 'Football',
    position: 'Quarterback',
    school: 'Texas A&M',
    classYear: 'Sophomore',
    region: 'Texas',
    avatar: '/placeholder-athlete-2.jpg',
    momentum: 'up',
    complianceCoverage: 88,
    verified: true,
    followers: 8200,
    lastActive: '2024-01-21',
    tags: ['Performance', 'Brand']
  },
  {
    id: '3',
    handle: 'jenny-chen',
    name: 'Jenny Chen',
    sport: 'Gymnastics',
    position: 'All-Around',
    school: 'UCLA',
    classYear: 'Senior',
    region: 'California',
    avatar: '/placeholder-athlete-3.jpg',
    momentum: 'stable',
    complianceCoverage: 92,
    verified: true,
    followers: 15800,
    lastActive: '2024-01-22',
    tags: ['Social Media', 'Fitness']
  },
  {
    id: '4',
    handle: 'alex-johnson',
    name: 'Alex Johnson',
    sport: 'Track & Field',
    position: 'Sprinter',
    school: 'Oregon',
    classYear: 'Freshman',
    region: 'Oregon',
    avatar: '/placeholder-athlete-4.jpg',
    momentum: 'up',
    complianceCoverage: 85,
    verified: false,
    followers: 3200,
    lastActive: '2024-01-20',
    tags: ['Rising Star', 'Training']
  },
  {
    id: '5',
    handle: 'maria-gonzales',
    name: 'Maria Gonzales',
    sport: 'Soccer',
    position: 'Forward',
    school: 'Stanford',
    classYear: 'Junior',
    region: 'California',
    avatar: '/placeholder-athlete-5.jpg',
    momentum: 'down',
    complianceCoverage: 90,
    verified: true,
    followers: 9800,
    lastActive: '2024-01-19',
    tags: ['International', 'Leadership']
  }
];

const NILIndex: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Get last updated timestamp
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Filter athletes based on search and filters
  const filteredAthletes = useMemo(() => {
    return mockAthletes.filter(athlete => {
      const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           athlete.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           athlete.school.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSport = selectedSport === 'all' || athlete.sport === selectedSport;
      const matchesRegion = selectedRegion === 'all' || athlete.region === selectedRegion;
      const matchesClass = selectedClass === 'all' || athlete.classYear === selectedClass;

      return matchesSearch && matchesSport && matchesRegion && matchesClass;
    });
  }, [searchQuery, selectedSport, selectedRegion, selectedClass]);

  const handleAthleteClick = (athlete: any) => {
    toast.success(`Loading ${athlete.name} profile...`);
    navigate(`/a/${athlete.handle}`);
  };

  const handleInviteClick = (athlete: any, event: React.MouseEvent) => {
    event.stopPropagation();
    toast.success(`Inviting ${athlete.name}...`);
    // Open invite modal or navigate to invite flow
    navigate(`/invite/athlete/${athlete.handle}`);
  };

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-yellow-500" />;
    }
  };

  const getComplianceBadge = (coverage: number) => {
    if (coverage >= 90) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">✓ Complete</Badge>;
    } else if (coverage >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⚠ Partial</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200">✗ Limited</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>NIL Athletes Index - Weekly Rankings & Discovery</title>
        <meta 
          name="description" 
          content="Discover and connect with top NIL athletes. Weekly rankings, compliance tracking, and verified profiles." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="/nil/index" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Trophy className="w-8 h-8 text-primary" />
                  NIL Athletes Index
                </h1>
                <p className="text-muted-foreground mt-1">
                  Weekly rankings updated {lastUpdated}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/nil')}
                className="hidden md:flex"
              >
                Back to NIL Hub
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, handle, or school..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sports</SelectItem>
                    <SelectItem value="Basketball">Basketball</SelectItem>
                    <SelectItem value="Football">Football</SelectItem>
                    <SelectItem value="Soccer">Soccer</SelectItem>
                    <SelectItem value="Track & Field">Track & Field</SelectItem>
                    <SelectItem value="Gymnastics">Gymnastics</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="California">California</SelectItem>
                    <SelectItem value="Texas">Texas</SelectItem>
                    <SelectItem value="North Carolina">North Carolina</SelectItem>
                    <SelectItem value="Oregon">Oregon</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="Freshman">Freshman</SelectItem>
                    <SelectItem value="Sophomore">Sophomore</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </header>

        {/* Results */}
        <main className="container mx-auto px-4 py-8">
          {/* Results Count and Note */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-muted-foreground">
                Showing {filteredAthletes.length} athletes
              </p>
            </div>
            <Badge variant="outline" className="hidden md:flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Quality weighted • No pay-to-rank • Sponsored labeled
            </Badge>
          </div>

          {/* Athletes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAthletes.map((athlete) => (
              <Card 
                key={athlete.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
                onClick={() => handleAthleteClick(athlete)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={athlete.avatar} alt={athlete.name} />
                        <AvatarFallback>
                          {athlete.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {athlete.name}
                          </h3>
                          {athlete.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          @{athlete.handle}
                        </p>
                      </div>
                    </div>
                    {getMomentumIcon(athlete.momentum)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className="w-4 h-4 text-muted-foreground" />
                      <span>{athlete.sport} • {athlete.position}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{athlete.school} • {athlete.classYear}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      <span>{athlete.followers.toLocaleString()} followers</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Compliance:</span>
                    {getComplianceBadge(athlete.complianceCoverage)}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {athlete.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => handleInviteClick(athlete, e)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Invite
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Share functionality
                        if (navigator.share) {
                          navigator.share({
                            title: `${athlete.name} - NIL Athlete`,
                            url: `/a/${athlete.handle}`
                          });
                        }
                      }}
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredAthletes.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No athletes found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSport('all');
                  setSelectedRegion('all');
                  setSelectedClass('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Weekly Update Info */}
          <div className="mt-12 p-6 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Weekly Rankings Update</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Rankings are updated every Monday based on verified activity, compliance status, 
              and engagement metrics. Quality-weighted signals prevent gaming—no pay-to-rank system.
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default NILIndex;