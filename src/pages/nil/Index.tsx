import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, StarOff, TrendingUp, Users, Trophy, Clock } from 'lucide-react';
import { recordReceipt } from '@/features/receipts/record';
import { hash } from '@/lib/canonical';
import { toast } from 'sonner';
import NILLayout from '@/components/nil/NILLayout';
import NilReceiptsStrip from '@/components/nil/NilReceiptsStrip';
import type { DecisionRDS } from '@/features/receipts/types';

interface AthleteData {
  rank: number;
  name: string;
  school: string;
  sport: string;
  followers: number;
  engagement7d: number;
  indexScore: number;
  trend: 'up' | 'down' | 'stable';
  id: string;
}

// Demo data for Top 25 of 500
const DEMO_ATHLETES: AthleteData[] = [
  { rank: 1, name: 'Sarah Chen', school: 'Stanford University', sport: 'Basketball', followers: 487000, engagement7d: 12.4, indexScore: 947, trend: 'up', id: 'athlete_1' },
  { rank: 2, name: 'Marcus Williams', school: 'Duke University', sport: 'Football', followers: 523000, engagement7d: 11.8, indexScore: 932, trend: 'stable', id: 'athlete_2' },
  { rank: 3, name: 'Emma Rodriguez', school: 'UCLA', sport: 'Soccer', followers: 345000, engagement7d: 15.2, indexScore: 918, trend: 'up', id: 'athlete_3' },
  { rank: 4, name: 'Tyler Johnson', school: 'University of Texas', sport: 'Baseball', followers: 234000, engagement7d: 9.7, indexScore: 903, trend: 'down', id: 'athlete_4' },
  { rank: 5, name: 'Olivia Kim', school: 'USC', sport: 'Volleyball', followers: 198000, engagement7d: 14.1, indexScore: 897, trend: 'up', id: 'athlete_5' },
  { rank: 6, name: 'Jake Anderson', school: 'Ohio State', sport: 'Football', followers: 412000, engagement7d: 8.9, indexScore: 885, trend: 'stable', id: 'athlete_6' },
  { rank: 7, name: 'Sophia Martinez', school: 'University of Florida', sport: 'Swimming', followers: 156000, engagement7d: 16.8, indexScore: 871, trend: 'up', id: 'athlete_7' },
  { rank: 8, name: 'Alex Thompson', school: 'Michigan', sport: 'Track & Field', followers: 189000, engagement7d: 11.3, indexScore: 858, trend: 'stable', id: 'athlete_8' },
  { rank: 9, name: 'Mia Davis', school: 'Georgia', sport: 'Gymnastics', followers: 267000, engagement7d: 13.6, indexScore: 844, trend: 'up', id: 'athlete_9' },
  { rank: 10, name: 'Ryan O\'Connor', school: 'Notre Dame', sport: 'Football', followers: 334000, engagement7d: 7.4, indexScore: 831, trend: 'down', id: 'athlete_10' },
  { rank: 11, name: 'Zoe Wilson', school: 'UNC Chapel Hill', sport: 'Basketball', followers: 223000, engagement7d: 12.9, indexScore: 818, trend: 'up', id: 'athlete_11' },
  { rank: 12, name: 'Noah Brown', school: 'Alabama', sport: 'Football', followers: 398000, engagement7d: 6.8, indexScore: 805, trend: 'down', id: 'athlete_12' },
  { rank: 13, name: 'Ava Garcia', school: 'Arizona State', sport: 'Softball', followers: 145000, engagement7d: 15.7, indexScore: 792, trend: 'up', id: 'athlete_13' },
  { rank: 14, name: 'Ethan Miller', school: 'Penn State', sport: 'Wrestling', followers: 87000, engagement7d: 18.3, indexScore: 779, trend: 'up', id: 'athlete_14' },
  { rank: 15, name: 'Isabella Taylor', school: 'Oregon', sport: 'Track & Field', followers: 176000, engagement7d: 10.5, indexScore: 766, trend: 'stable', id: 'athlete_15' },
  { rank: 16, name: 'Caleb Jones', school: 'Clemson', sport: 'Football', followers: 289000, engagement7d: 8.1, indexScore: 753, trend: 'stable', id: 'athlete_16' },
  { rank: 17, name: 'Grace Lee', school: 'Washington', sport: 'Rowing', followers: 94000, engagement7d: 14.2, indexScore: 740, trend: 'up', id: 'athlete_17' },
  { rank: 18, name: 'Mason Clark', school: 'LSU', sport: 'Baseball', followers: 167000, engagement7d: 9.4, indexScore: 727, trend: 'down', id: 'athlete_18' },
  { rank: 19, name: 'Luna White', school: 'Colorado', sport: 'Skiing', followers: 203000, engagement7d: 11.7, indexScore: 714, trend: 'stable', id: 'athlete_19' },
  { rank: 20, name: 'Diego Lopez', school: 'Miami', sport: 'Tennis', followers: 132000, engagement7d: 16.1, indexScore: 701, trend: 'up', id: 'athlete_20' },
  { rank: 21, name: 'Harper Adams', school: 'Virginia Tech', sport: 'Soccer', followers: 178000, engagement7d: 12.3, indexScore: 688, trend: 'stable', id: 'athlete_21' },
  { rank: 22, name: 'Austin Wright', school: 'TCU', sport: 'Golf', followers: 156000, engagement7d: 8.7, indexScore: 675, trend: 'down', id: 'athlete_22' },
  { rank: 23, name: 'Chloe Turner', school: 'Baylor', sport: 'Basketball', followers: 214000, engagement7d: 13.4, indexScore: 662, trend: 'up', id: 'athlete_23' },
  { rank: 24, name: 'Blake Hill', school: 'Auburn', sport: 'Football', followers: 287000, engagement7d: 7.9, indexScore: 649, trend: 'stable', id: 'athlete_24' },
  { rank: 25, name: 'Aria Scott', school: 'Kentucky', sport: 'Equestrian', followers: 119000, engagement7d: 15.3, indexScore: 636, trend: 'up', id: 'athlete_25' }
];

export default function IndexPage() {
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());

  const handleWatchToggle = async (athlete: AthleteData) => {
    const isWatching = watchlist.has(athlete.id);
    const newWatchlist = new Set(watchlist);
    
    if (isWatching) {
      newWatchlist.delete(athlete.id);
    } else {
      newWatchlist.add(athlete.id);
    }
    
    setWatchlist(newWatchlist);

    try {
      // Create Decision-RDS receipt for index watch action
      const watchReceipt: DecisionRDS = {
        id: `rds_index_watch_${Date.now()}`,
        type: 'Decision-RDS',
        action: 'index.watch',
        policy_version: 'NIL-2025.01',
        inputs_hash: await hash({ 
          athlete_id: athlete.id, 
          athlete_name: athlete.name,
          action: isWatching ? 'unwatch' : 'watch'
        }),
        reasons: [isWatching ? 'ATHLETE_UNWATCHED' : 'ATHLETE_WATCHED'],
        result: 'approve',
        anchor_ref: null,
        ts: new Date().toISOString()
      };

      recordReceipt(watchReceipt);
      
      toast.success(isWatching ? 'Removed from watchlist' : 'Added to watchlist', {
        description: `${athlete.name} • Receipt generated`,
        action: {
          label: 'View Receipt',
          onClick: () => window.location.href = '/nil/receipts'
        }
      });
    } catch (error) {
      console.error('Failed to create watch receipt:', error);
      toast.error('Failed to log watch action');
    }
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const watchedCount = watchlist.size;

  return (
    <NILLayout title="NIL Index" description="Top 500 athlete rankings and engagement analytics">
      <div className="space-y-6 pb-16">
        {/* Header with Update Badge */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">NIL Index</h1>
            <p className="text-white/70">Top 25 of 500 • Engagement & influence rankings</p>
          </div>
          <div className="flex items-center gap-3">
            {watchedCount > 0 && (
              <Badge variant="outline" className="border-bfo-gold/40 text-bfo-gold">
                {watchedCount} Watched
              </Badge>
            )}
            <Badge className="bg-bfo-gold/20 text-bfo-gold border-bfo-gold/30">
              <Clock className="h-3 w-3 mr-1" />
              Updated weekly
            </Badge>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-bfo-gold" />
                <div>
                  <p className="text-2xl font-bold text-white">500</p>
                  <p className="text-sm text-white/60">Total Athletes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-bfo-gold" />
                <div>
                  <p className="text-2xl font-bold text-white">23.4M</p>
                  <p className="text-sm text-white/60">Total Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-bfo-gold" />
                <div>
                  <p className="text-2xl font-bold text-white">11.8%</p>
                  <p className="text-sm text-white/60">Avg Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rankings Table */}
        <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
          <CardHeader className="border-b border-bfo-gold/30">
            <CardTitle className="text-white font-semibold">Top 25 Athletes</CardTitle>
            <CardDescription className="text-white/70">
              Ranked by engagement, influence, and marketability metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-bfo-gold/20 hover:bg-transparent">
                    <TableHead className="text-white font-medium">Rank</TableHead>
                    <TableHead className="text-white font-medium">Athlete</TableHead>
                    <TableHead className="text-white font-medium">School</TableHead>
                    <TableHead className="text-white font-medium">Followers</TableHead>
                    <TableHead className="text-white font-medium">Last 7d Engagement</TableHead>
                    <TableHead className="text-white font-medium">Index Score</TableHead>
                    <TableHead className="text-white font-medium">Watch</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DEMO_ATHLETES.map((athlete) => (
                    <TableRow 
                      key={athlete.id} 
                      className="border-bfo-gold/20 hover:bg-bfo-gold/5"
                    >
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-2">
                          #{athlete.rank}
                          {getTrendIcon(athlete.trend)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{athlete.name}</p>
                          <p className="text-sm text-white/60">{athlete.sport}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-white/80">{athlete.school}</TableCell>
                      <TableCell className="text-white/80 font-medium">
                        {formatFollowers(athlete.followers)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-white/80 font-medium">{athlete.engagement7d}%</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              athlete.engagement7d > 12 ? 'border-green-500/40 text-green-400' :
                              athlete.engagement7d > 8 ? 'border-yellow-500/40 text-yellow-400' :
                              'border-red-500/40 text-red-400'
                            }`}
                          >
                            {athlete.engagement7d > 12 ? 'High' : athlete.engagement7d > 8 ? 'Medium' : 'Low'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-bfo-gold font-bold text-lg">{athlete.indexScore}</span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleWatchToggle(athlete)}
                          className="p-2 hover:bg-bfo-gold/20"
                        >
                          {watchlist.has(athlete.id) ? (
                            <Star className="h-4 w-4 text-bfo-gold fill-current" />
                          ) : (
                            <StarOff className="h-4 w-4 text-white/40 hover:text-bfo-gold" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Methodology */}
        <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
          <CardHeader className="border-b border-bfo-gold/30">
            <CardTitle className="text-white font-semibold">Index Methodology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-white mb-2">Engagement (40%)</h4>
                <p className="text-white/70">
                  Likes, comments, shares, and story interactions across all platforms
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Reach (35%)</h4>
                <p className="text-white/70">
                  Total followers, story views, and audience growth rate
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Brand Safety (25%)</h4>
                <p className="text-white/70">
                  Content quality, compliance history, and professional conduct
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <NilReceiptsStrip />
    </NILLayout>
  );
}