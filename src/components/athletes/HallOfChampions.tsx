import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Play, Heart, Share2, Trophy, Star, Search, Filter, Crown, Eye, Users } from 'lucide-react';
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

// Top 100 Athletes Database
const TOP_100_ATHLETES = {
  NBA: [
    'Michael Jordan', 'Magic Johnson', 'LeBron James', 'Shaquille O\'Neal', 'Steph Curry',
    'Kareem Abdul-Jabbar', 'Bill Russell', 'Larry Bird', 'Kevin Durant', 'Giannis Antetokounmpo',
    'Kobe Bryant', 'Tim Duncan', 'Dirk Nowitzki', 'Dwyane Wade', 'Chris Paul'
  ],
  NFL: [
    'Tom Brady', 'Peyton Manning', 'Jerry Rice', 'Emmitt Smith', 'Deion Sanders',
    'Patrick Mahomes', 'Joe Montana', 'Aaron Rodgers', 'Ray Lewis', 'Russell Wilson',
    'Drew Brees', 'Brett Favre', 'Calvin Johnson', 'Randy Moss', 'Adrian Peterson'
  ],
  MLB: [
    'Derek Jeter', 'Ken Griffey Jr.', 'Barry Bonds', 'Shohei Ohtani', 'Mike Trout',
    'Mariano Rivera', 'Albert Pujols', 'Alex Rodriguez', 'Manny Ramirez', 'David Ortiz'
  ],
  Soccer: [
    'David Beckham', 'Lionel Messi', 'Cristiano Ronaldo', 'Megan Rapinoe', 'Abby Wambach',
    'Mia Hamm', 'Hope Solo', 'Alex Morgan', 'Carli Lloyd', 'Julie Foudy'
  ],
  Tennis: [
    'Serena Williams', 'Venus Williams', 'Roger Federer', 'Rafael Nadal', 'Novak Djokovic',
    'Andre Agassi', 'Pete Sampras', 'John McEnroe', 'Billie Jean King', 'Martina Navratilova'
  ],
  Boxing: [
    'Mike Tyson', 'Floyd Mayweather', 'Oscar De La Hoya', 'Manny Pacquiao', 'Canelo Alvarez', 'Laila Ali'
  ],
  UFC: [
    'Conor McGregor', 'Ronda Rousey', 'Anderson Silva', 'Georges St-Pierre', 'Amanda Nunes', 'Israel Adesanya'
  ],
  Olympic: [
    'Michael Phelps', 'Simone Biles', 'Usain Bolt', 'Allyson Felix', 'Katie Ledecky', 'Carl Lewis'
  ],
  Golf: [
    'Tiger Woods', 'Phil Mickelson', 'Rory McIlroy', 'Annika Sorenstam', 'Jack Nicklaus'
  ]
};

const mockChampions: Champion[] = [
  {
    id: '1',
    name: 'Michael Jordan',
    sport: 'NBA',
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
    sport: 'NBA',
    achievements: ['5x NBA Champion', 'Hall of Fame', 'Business Mogul'],
    profileImage: '/placeholder-athlete.jpg',
    tipText: 'On resilience: Every setback is a setup for a comeback. Believe in yourself.',
    charityDonation: 'Magic Johnson Foundation',
    status: 'live',
    views: 12350,
    likes: 645
  },
  {
    id: '3',
    name: 'Abby Wambach',
    sport: 'Soccer',
    achievements: ['2x Olympic Gold', 'World Cup Champion', 'Leading Goal Scorer'],
    profileImage: '/placeholder-athlete.jpg',
    tipText: 'Women in sports: Break barriers. Your success opens doors for the next generation.',
    charityDonation: 'Women\'s Sports Foundation',
    status: 'live',
    views: 8920,
    likes: 523
  },
  {
    id: '4',
    name: 'Tom Brady',
    sport: 'NFL',
    achievements: ['7x Super Bowl Champion', 'Greatest QB of All Time'],
    profileImage: '/placeholder-athlete.jpg',
    status: 'recorded',
    charityDonation: 'TB12 Foundation'
  },
  {
    id: '5',
    name: 'Serena Williams',
    sport: 'Tennis',
    achievements: ['23x Grand Slam Champion', 'Olympic Gold', 'Entrepreneur'],
    profileImage: '/placeholder-athlete.jpg',
    status: 'pending'
  },
  {
    id: '6',
    name: 'LeBron James',
    sport: 'NBA',
    achievements: ['4x NBA Champion', 'Lakers Legend', 'Social Activist'],
    profileImage: '/placeholder-athlete.jpg',
    status: 'pending'
  }
];

export const HallOfChampions: React.FC = () => {
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [filter, setFilter] = useState<'all' | 'live' | 'recorded' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState<string>('all');

  const filteredChampions = mockChampions.filter(champion => {
    const matchesStatus = filter === 'all' || champion.status === filter;
    const matchesSearch = champion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         champion.sport.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = sportFilter === 'all' || champion.sport === sportFilter;
    return matchesStatus && matchesSearch && matchesSport;
  });

  const availableSports = ['all', ...Array.from(new Set(mockChampions.map(c => c.sport)))];

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
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-navy via-navy-light to-emerald-900 text-white rounded-xl p-8 md:p-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-4 right-4 text-gold opacity-20"
        >
          <Crown className="h-16 w-16" />
        </motion.div>
        
        <div className="relative z-10 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="h-10 w-10 text-gold" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Hall of Champions™
            </h1>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Trophy className="h-10 w-10 text-gold" />
            </motion.div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-3xl font-semibold text-gold-light"
          >
            "Wisdom for the Next Generation"
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto"
          >
            Legendary athletes sharing their most valuable insights to empower the next generation. 
            Every message creates impact and drives charitable giving to causes that matter.
          </motion.p>

          {/* Stats Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-wrap justify-center gap-8 py-6"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">{mockChampions.filter(c => c.status === 'live').length}</div>
              <div className="text-sm text-white/70">Champions Contributing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">$25,000+</div>
              <div className="text-sm text-white/70">Donated to Charities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">50,000+</div>
              <div className="text-sm text-white/70">Athletes Inspired</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Find by League, Era, Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            {availableSports.map(sport => (
              <option key={sport} value={sport}>
                {sport === 'all' ? 'All Sports' : sport}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex justify-center gap-2 flex-wrap">
        {(['all', 'live', 'recorded', 'pending'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
            size="sm"
            className={filter === status ? 'bg-gold hover:bg-gold/90' : ''}
          >
            {status === 'live' && <Play className="h-3 w-3 mr-1" />}
            {status === 'recorded' && <Trophy className="h-3 w-3 mr-1" />}
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredChampions.map((champion) => (
          <motion.div key={champion.id} variants={cardVariants}>
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-gold/30 hover:scale-105 bg-gradient-to-br from-background to-background/50"
                  onClick={() => setSelectedChampion(champion)}>
              <CardHeader className="relative p-6">
                {/* Status Badge */}
                <Badge 
                  variant={champion.status === 'live' ? 'default' : 
                          champion.status === 'recorded' ? 'secondary' : 'outline'}
                  className={`absolute top-4 right-4 ${
                    champion.status === 'live' ? 'bg-green-500 animate-pulse' : 
                    champion.status === 'recorded' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}
                >
                  {champion.status === 'live' && <Play className="h-3 w-3 mr-1" />}
                  {champion.status === 'live' ? 'LIVE' : 
                   champion.status === 'recorded' ? 'RECORDED' : 'PENDING'}
                </Badge>

                {/* Avatar with Golden Laurel Animation */}
                <div className="relative mx-auto w-28 h-28">
                  <Avatar className="w-28 h-28 border-4 border-gold/30 shadow-lg">
                    <AvatarImage src={champion.profileImage} alt={champion.name} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-gold/20 to-gold/10">
                      {champion.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {champion.status === 'live' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-2 -right-2"
                    >
                      <Crown className="h-10 w-10 text-gold fill-gold/50" />
                    </motion.div>
                  )}
                  {champion.status === 'recorded' && (
                    <div className="absolute -top-1 -right-1">
                      <Star className="h-8 w-8 text-blue-500 fill-blue-500/50" />
                    </div>
                  )}
                </div>

                <div className="text-center space-y-3">
                  <CardTitle className="text-xl font-bold">{champion.name}</CardTitle>
                  <Badge variant="outline" className="bg-navy/10 text-navy border-navy/20">
                    {champion.sport}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 p-6">
                {/* Achievements */}
                <div className="space-y-2">
                  {champion.achievements.slice(0, 2).map((achievement, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                      <Trophy className="h-3 w-3 text-gold flex-shrink-0" />
                      <span className="truncate">{achievement}</span>
                    </div>
                  ))}
                </div>

                {/* "1-Minute Tip" Preview */}
                {champion.tipText && (
                  <div className="bg-gradient-to-r from-gold/5 to-gold/10 p-3 rounded-lg border border-gold/20">
                    <div className="text-xs font-semibold text-gold mb-1">1-Minute Tip:</div>
                    <blockquote className="text-sm italic text-foreground/80">
                      "{champion.tipText.substring(0, 60)}..."
                    </blockquote>
                  </div>
                )}

                {/* Charity Badge */}
                {champion.charityDonation && (
                  <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-700 p-2 rounded-lg border border-emerald-200">
                    <Heart className="h-3 w-3 text-emerald-500" />
                    <span className="font-medium">Supports:</span>
                    <span className="truncate">{champion.charityDonation}</span>
                  </div>
                )}

                {/* Stats for Live Videos */}
                {champion.status === 'live' && (
                  <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-gold/20">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {champion.views?.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {champion.likes}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    className={`flex-1 ${champion.status === 'live' ? 'bg-gold hover:bg-gold/90' : ''}`}
                    variant={champion.status === 'live' ? 'default' : 'outline'}
                  >
                    {champion.status === 'live' ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Watch
                      </>
                    ) : champion.status === 'recorded' ? (
                      'Coming Soon'
                    ) : (
                      'Invited'
                    )}
                  </Button>
                  
                  {champion.status === 'live' && (
                    <Button size="sm" variant="outline" className="px-3">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Call-to-Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Your Message */}
        <Card className="text-center p-8 border-dashed border-2 border-gold/30 bg-gradient-to-br from-gold/5 to-gold/10 hover:border-gold/50 transition-colors">
          <CardContent>
            <Crown className="h-12 w-12 text-gold mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gold">Add Your Message</h3>
            <p className="text-muted-foreground mb-4">
              Are you a legend ready to inspire the next generation?
            </p>
            <Button className="bg-gold hover:bg-gold/90">
              <Trophy className="h-4 w-4 mr-2" />
              Submit Your Wisdom
            </Button>
          </CardContent>
        </Card>

        {/* See All Champions */}
        <Card className="text-center p-8 border-dashed border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 hover:border-blue-400 transition-colors">
          <CardContent>
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-blue-700">See All Champions</h3>
            <p className="text-muted-foreground mb-4">
              Explore our complete directory of legendary athletes
            </p>
            <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
              <Search className="h-4 w-4 mr-2" />
              Browse All
            </Button>
          </CardContent>
        </Card>
      </div>

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