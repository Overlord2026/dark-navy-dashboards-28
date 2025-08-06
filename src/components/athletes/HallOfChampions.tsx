import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Heart, Share2, Trophy, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Champion {
  id: string;
  name: string;
  sport: string;
  achievements: string[];
  profileImage: string;
  videoUrl?: string;
  tipText?: string;
  charityDonation?: string;
  status: 'pending' | 'recorded' | 'live';
  views?: number;
  likes?: number;
}

const mockChampions: Champion[] = [
  {
    id: '1',
    name: 'Michael Jordan',
    sport: 'Basketball',
    achievements: ['6x NBA Champion', 'Hall of Fame', 'Olympic Gold'],
    profileImage: '/placeholder-athlete.jpg',
    videoUrl: 'https://example.com/mj-video',
    tipText: 'Success isn\'t given. It\'s earned. In the gym, on the court, and in life.',
    charityDonation: 'Boys & Girls Club',
    status: 'live',
    views: 15420,
    likes: 892
  },
  {
    id: '2',
    name: 'Magic Johnson',
    sport: 'Basketball',
    achievements: ['5x NBA Champion', 'Hall of Fame', 'Business Mogul'],
    profileImage: '/placeholder-athlete.jpg',
    status: 'recorded',
    charityDonation: 'Magic Johnson Foundation'
  },
  {
    id: '3',
    name: 'Serena Williams',
    sport: 'Tennis',
    achievements: ['23x Grand Slam Champion', 'Olympic Gold', 'Entrepreneur'],
    profileImage: '/placeholder-athlete.jpg',
    status: 'pending'
  }
];

export const HallOfChampions: React.FC = () => {
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [filter, setFilter] = useState<'all' | 'live' | 'recorded' | 'pending'>('all');

  const filteredChampions = mockChampions.filter(champion => 
    filter === 'all' || champion.status === filter
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2"
        >
          <Trophy className="h-8 w-8 text-gold" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            Hall of Champions
          </h1>
          <Trophy className="h-8 w-8 text-gold" />
        </motion.div>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Legendary athletes sharing their wisdom with the next generation. 
          Every message creates impact and drives charitable giving.
        </p>

        {/* Stats Banner */}
        <div className="flex justify-center gap-6 py-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gold">{mockChampions.filter(c => c.status === 'live').length}</div>
            <div className="text-sm text-muted-foreground">Champions Contributing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-500">$25,000+</div>
            <div className="text-sm text-muted-foreground">Donated to Charities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">50,000+</div>
            <div className="text-sm text-muted-foreground">Athletes Inspired</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2">
        {(['all', 'live', 'recorded', 'pending'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
            size="sm"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <Badge variant="secondary" className="ml-2">
                {mockChampions.filter(c => c.status === status).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Champions Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredChampions.map((champion) => (
          <motion.div key={champion.id} variants={cardVariants}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-gold/20"
                  onClick={() => setSelectedChampion(champion)}>
              <CardHeader className="relative">
                {/* Status Badge */}
                <Badge 
                  variant={champion.status === 'live' ? 'default' : 
                          champion.status === 'recorded' ? 'secondary' : 'outline'}
                  className="absolute top-4 right-4"
                >
                  {champion.status === 'live' && <Play className="h-3 w-3 mr-1" />}
                  {champion.status === 'live' ? 'LIVE' : 
                   champion.status === 'recorded' ? 'RECORDED' : 'PENDING'}
                </Badge>

                {/* Avatar with Laurel */}
                <div className="relative mx-auto w-24 h-24">
                  <Avatar className="w-24 h-24 border-4 border-gold/20">
                    <AvatarImage src={champion.profileImage} alt={champion.name} />
                    <AvatarFallback className="text-xl font-bold">
                      {champion.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {champion.status === 'live' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-2 -right-2"
                    >
                      <Star className="h-8 w-8 text-gold fill-gold" />
                    </motion.div>
                  )}
                </div>

                <div className="text-center space-y-2">
                  <CardTitle className="text-xl">{champion.name}</CardTitle>
                  <Badge variant="outline">{champion.sport}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Achievements */}
                <div className="space-y-1">
                  {champion.achievements.slice(0, 2).map((achievement, idx) => (
                    <div key={idx} className="text-sm text-muted-foreground flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-gold" />
                      {achievement}
                    </div>
                  ))}
                </div>

                {/* Preview Tip */}
                {champion.tipText && (
                  <blockquote className="text-sm italic border-l-4 border-gold pl-3 text-muted-foreground">
                    "{champion.tipText.substring(0, 80)}..."
                  </blockquote>
                )}

                {/* Charity Badge */}
                {champion.charityDonation && (
                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                    <Heart className="h-3 w-3" />
                    Supports: {champion.charityDonation}
                  </div>
                )}

                {/* Stats */}
                {champion.status === 'live' && (
                  <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>{champion.views?.toLocaleString()} views</span>
                    <span>{champion.likes} likes</span>
                  </div>
                )}

                {/* CTA */}
                <Button 
                  className="w-full"
                  variant={champion.status === 'live' ? 'default' : 'outline'}
                >
                  {champion.status === 'live' ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Watch Message
                    </>
                  ) : champion.status === 'recorded' ? (
                    'Coming Soon'
                  ) : (
                    'Invited to Contribute'
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Champion CTA for Admins */}
      <Card className="text-center p-8 border-dashed border-2">
        <CardContent>
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Invite More Legends</h3>
          <p className="text-muted-foreground mb-4">
            Know a champion who could inspire the next generation?
          </p>
          <Button>
            <Share2 className="h-4 w-4 mr-2" />
            Suggest a Champion
          </Button>
        </CardContent>
      </Card>

      {/* Champion Modal placeholder */}
      {selectedChampion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
             onClick={() => setSelectedChampion(null)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={selectedChampion.profileImage} />
                  <AvatarFallback>
                    {selectedChampion.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {selectedChampion.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedChampion.status === 'live' && selectedChampion.videoUrl ? (
                <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
                  <Play className="h-16 w-16 text-white" />
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p>Champion video coming soon!</p>
                </div>
              )}
              
              {selectedChampion.tipText && (
                <blockquote className="text-lg italic text-center p-4 border rounded-lg">
                  "{selectedChampion.tipText}"
                </blockquote>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};