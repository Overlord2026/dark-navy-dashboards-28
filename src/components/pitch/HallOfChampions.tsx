import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Crown, Star, Plus, Users, TrendingUp, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface Champion {
  id: string;
  name: string;
  title: string;
  category: 'athlete' | 'executive' | 'advisor' | 'health' | 'influencer' | 'firm';
  status: 'reserved' | 'claimed' | 'pending' | 'active';
  avatar?: string;
  claimUrl?: string;
  achievements?: string[];
}

export function HallOfChampions() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const champions: Champion[] = [
    {
      id: 'jordan',
      name: 'Michael Jordan',
      title: 'NBA Legend & Entrepreneur',
      category: 'athlete',
      status: 'reserved',
      achievements: ['6x NBA Champion', 'Business Mogul', 'Global Icon'],
      claimUrl: '/vip/claim/michael-jordan'
    },
    {
      id: 'magic',
      name: 'Magic Johnson',
      title: 'NBA Hall of Fame & Investor',
      category: 'athlete',
      status: 'reserved',
      achievements: ['5x NBA Champion', 'Successful Investor', 'Community Leader'],
      claimUrl: '/vip/claim/magic-johnson'
    },
    {
      id: 'robbins',
      name: 'Tony Robbins',
      title: 'Performance Coach & Author',
      category: 'influencer',
      status: 'pending',
      achievements: ['Best-selling Author', 'Life Coach', 'Entrepreneur'],
      claimUrl: '/vip/claim/tony-robbins'
    },
    {
      id: 'cuban',
      name: 'Mark Cuban',
      title: 'Entrepreneur & Shark Tank Investor',
      category: 'executive',
      status: 'reserved',
      achievements: ['Dallas Mavericks Owner', 'Shark Tank', 'Tech Entrepreneur'],
      claimUrl: '/vip/claim/mark-cuban'
    },
    {
      id: 'mayo',
      name: 'Mayo Clinic',
      title: 'Premier Healthcare Institution',
      category: 'health',
      status: 'reserved',
      achievements: ['Top Hospital', 'Medical Innovation', 'Patient Care Excellence'],
      claimUrl: '/vip/claim/mayo-clinic'
    },
    {
      id: 'goldmansachs',
      name: 'Goldman Sachs',
      title: 'Global Investment Banking',
      category: 'firm',
      status: 'reserved',
      achievements: ['Investment Banking Leader', 'Wealth Management', 'Global Reach'],
      claimUrl: '/vip/claim/goldman-sachs'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Champions', icon: Users },
    { id: 'athlete', label: 'Athletes', icon: Star },
    { id: 'executive', label: 'Executives', icon: TrendingUp },
    { id: 'advisor', label: 'Advisors', icon: Users },
    { id: 'health', label: 'Healthcare', icon: Crown },
    { id: 'influencer', label: 'Influencers', icon: Star },
    { id: 'firm', label: 'Elite Firms', icon: Globe }
  ];

  const filteredChampions = champions.filter(champion => {
    const matchesCategory = selectedCategory === 'all' || champion.category === selectedCategory;
    const matchesSearch = champion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         champion.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reserved': return 'bg-gold/10 text-gold border-gold/20';
      case 'claimed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'reserved': return 'Reserved';
      case 'claimed': return 'Claimed';
      case 'pending': return 'Pending';
      case 'active': return 'Active';
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="h-8 w-8 text-gold" />
          <h2 className="text-3xl font-bold">Hall of Champions</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Elite athletes, executives, and thought leaders who are part of our founding member program.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <Input
          placeholder="Search champions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md mx-auto"
        />
        
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              <category.icon className="h-4 w-4 mr-2" />
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Champions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChampions.map((champion, index) => (
          <motion.div
            key={champion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{champion.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {champion.title}
                    </p>
                  </div>
                  <Badge className={getStatusColor(champion.status)}>
                    {getStatusLabel(champion.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {champion.achievements && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Achievements:</h4>
                    <div className="flex flex-wrap gap-1">
                      {champion.achievements.map((achievement, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  {champion.status === 'reserved' && (
                    <Button size="sm" className="flex-1">
                      <Crown className="h-4 w-4 mr-2" />
                      Claim Portal
                    </Button>
                  )}
                  {champion.status === 'claimed' && (
                    <Button variant="outline" size="sm" className="flex-1">
                      View Profile
                    </Button>
                  )}
                  {champion.status === 'pending' && (
                    <Button variant="outline" size="sm" className="flex-1" disabled>
                      Invitation Sent
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Champion */}
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Add New Champion</h3>
          <p className="text-muted-foreground mb-4">
            Reserve a spot for another elite athlete, executive, or thought leader.
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Champion
          </Button>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gold">{champions.filter(c => c.status === 'reserved').length}</div>
            <div className="text-sm text-muted-foreground">Reserved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{champions.filter(c => c.status === 'claimed').length}</div>
            <div className="text-sm text-muted-foreground">Claimed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{champions.filter(c => c.status === 'pending').length}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{champions.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}