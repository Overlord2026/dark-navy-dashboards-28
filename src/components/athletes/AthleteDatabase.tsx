import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, Filter, Mail, MessageSquare, Phone, Heart,
  Trophy, Star, Crown, Users, Download, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

// Top 100 Athletes Database by League
const ATHLETE_DATABASE = {
  NBA: [
    'Michael Jordan', 'Magic Johnson', 'LeBron James', 'Shaquille O\'Neal', 'Steph Curry',
    'Kareem Abdul-Jabbar', 'Bill Russell', 'Larry Bird', 'Kevin Durant', 'Giannis Antetokounmpo',
    'Kobe Bryant', 'Tim Duncan', 'Dirk Nowitzki', 'Dwyane Wade', 'Chris Paul',
    'Russell Westbrook', 'James Harden', 'Kawhi Leonard', 'Anthony Davis', 'Paul Pierce',
    'Kevin Garnett', 'Allen Iverson', 'Steve Nash', 'Jason Kidd', 'Ray Allen'
  ],
  NFL: [
    'Tom Brady', 'Peyton Manning', 'Jerry Rice', 'Emmitt Smith', 'Deion Sanders',
    'Patrick Mahomes', 'Joe Montana', 'Aaron Rodgers', 'Ray Lewis', 'Russell Wilson',
    'Drew Brees', 'Brett Favre', 'Calvin Johnson', 'Randy Moss', 'Adrian Peterson',
    'Antonio Brown', 'Julio Jones', 'Rob Gronkowski', 'J.J. Watt', 'Von Miller',
    'Aaron Donald', 'Khalil Mack', 'Ezekiel Elliott', 'Saquon Barkley', 'Lamar Jackson'
  ],
  MLB: [
    'Derek Jeter', 'Ken Griffey Jr.', 'Barry Bonds', 'Shohei Ohtani', 'Mike Trout',
    'Mariano Rivera', 'Albert Pujols', 'Alex Rodriguez', 'Manny Ramirez', 'David Ortiz',
    'Clayton Kershaw', 'Justin Verlander', 'Pedro Martinez', 'Randy Johnson', 'Greg Maddux',
    'Tony Gwynn', 'Frank Thomas', 'Chipper Jones', 'Ivan Rodriguez', 'Roberto Clemente'
  ],
  Soccer: [
    'David Beckham', 'Lionel Messi', 'Cristiano Ronaldo', 'Megan Rapinoe', 'Abby Wambach',
    'Mia Hamm', 'Hope Solo', 'Alex Morgan', 'Carli Lloyd', 'Julie Foudy',
    'Brandi Chastain', 'Kristine Lilly', 'Landon Donovan', 'Clint Dempsey', 'Carlos Vela'
  ],
  Tennis: [
    'Serena Williams', 'Venus Williams', 'Roger Federer', 'Rafael Nadal', 'Novak Djokovic',
    'Andre Agassi', 'Pete Sampras', 'John McEnroe', 'Billie Jean King', 'Martina Navratilova',
    'Steffi Graf', 'Chris Evert', 'Jimmy Connors', 'Arthur Ashe', 'Monica Seles'
  ],
  Boxing: [
    'Mike Tyson', 'Floyd Mayweather', 'Oscar De La Hoya', 'Manny Pacquiao', 
    'Canelo Alvarez', 'Laila Ali', 'Sugar Ray Robinson', 'Muhammad Ali'
  ],
  UFC: [
    'Conor McGregor', 'Ronda Rousey', 'Anderson Silva', 'Georges St-Pierre', 
    'Amanda Nunes', 'Israel Adesanya', 'Jon Jones', 'Daniel Cormier'
  ],
  Olympic: [
    'Michael Phelps', 'Simone Biles', 'Usain Bolt', 'Allyson Felix', 'Katie Ledecky', 
    'Carl Lewis', 'Florence Griffith Joyner', 'Jesse Owens', 'Mark Spitz', 'Nadia Comaneci'
  ],
  Golf: [
    'Tiger Woods', 'Phil Mickelson', 'Rory McIlroy', 'Annika Sorenstam', 'Jack Nicklaus',
    'Arnold Palmer', 'Gary Player', 'Jordan Spieth', 'Justin Thomas', 'Brooks Koepka'
  ],
  Racing: [
    'Jimmie Johnson', 'Jeff Gordon', 'Dale Earnhardt Jr.', 'Danica Patrick', 
    'Lewis Hamilton', 'Kyle Busch', 'Kevin Harvick', 'Tony Stewart'
  ]
};

interface AthleteProfile {
  id: string;
  name: string;
  sport: string;
  status: 'pending' | 'contacted' | 'responded' | 'declined' | 'recorded';
  email?: string;
  linkedin?: string;
  agent?: string;
  charity?: string;
  priority: 'high' | 'normal' | 'low';
  estimatedReach?: number;
  lastContact?: string;
  notes?: string;
}

// Mock athlete profiles data
const createAthleteProfiles = (): AthleteProfile[] => {
  const profiles: AthleteProfile[] = [];
  let id = 1;

  Object.entries(ATHLETE_DATABASE).forEach(([sport, athletes]) => {
    athletes.forEach((name, index) => {
      profiles.push({
        id: id.toString(),
        name,
        sport,
        status: index < 2 ? 'recorded' : index < 5 ? 'responded' : index < 8 ? 'contacted' : 'pending',
        priority: index < 3 ? 'high' : index < 10 ? 'normal' : 'low',
        estimatedReach: Math.floor(Math.random() * 10000000) + 100000,
        lastContact: index < 8 ? '2024-01-15' : undefined,
        charity: index % 3 === 0 ? 'Boys & Girls Club' : index % 3 === 1 ? 'Make-A-Wish' : undefined
      });
      id++;
    });
  });

  return profiles;
};

export const AthleteDatabase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

  const athleteProfiles = createAthleteProfiles();
  
  const filteredAthletes = athleteProfiles.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         athlete.sport.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = sportFilter === 'all' || athlete.sport === sportFilter;
    const matchesStatus = statusFilter === 'all' || athlete.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || athlete.priority === priorityFilter;
    
    return matchesSearch && matchesSport && matchesStatus && matchesPriority;
  });

  const availableSports = ['all', ...Object.keys(ATHLETE_DATABASE)];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recorded': return 'bg-green-500 text-white';
      case 'responded': return 'bg-blue-500 text-white';
      case 'contacted': return 'bg-yellow-500 text-black';
      case 'declined': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 font-bold';
      case 'normal': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const statusCounts = {
    total: athleteProfiles.length,
    pending: athleteProfiles.filter(a => a.status === 'pending').length,
    contacted: athleteProfiles.filter(a => a.status === 'contacted').length,
    responded: athleteProfiles.filter(a => a.status === 'responded').length,
    recorded: athleteProfiles.filter(a => a.status === 'recorded').length,
    declined: athleteProfiles.filter(a => a.status === 'declined').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-gold" />
            Athlete Outreach Database
          </h1>
          <p className="text-muted-foreground">Top 100+ legendary athletes across all major sports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Athlete
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.total}</div>
            <div className="text-sm text-muted-foreground">Total Athletes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.recorded}</div>
            <div className="text-sm text-muted-foreground">Recorded</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{statusCounts.responded}</div>
            <div className="text-sm text-muted-foreground">Responded</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.contacted}</div>
            <div className="text-sm text-muted-foreground">Contacted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{statusCounts.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.declined}</div>
            <div className="text-sm text-muted-foreground">Declined</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Athletes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search athletes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="responded">Responded</option>
              <option value="recorded">Recorded</option>
              <option value="declined">Declined</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Priority</option>
              <option value="high">High Priority</option>
              <option value="normal">Normal Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <Button className="bg-gold hover:bg-gold/90">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Athletes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAthletes.map((athlete) => (
          <motion.div
            key={athlete.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={`/athletes/${athlete.name.toLowerCase().replace(/ /g, '-')}.jpg`} />
                      <AvatarFallback className="text-sm font-bold">
                        {athlete.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-sm">{athlete.name}</h3>
                      <Badge variant="outline" className="text-xs">{athlete.sport}</Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={`text-xs ${getStatusColor(athlete.status)}`}>
                      {athlete.status.toUpperCase()}
                    </Badge>
                    <div className={`text-xs mt-1 ${getPriorityColor(athlete.priority)}`}>
                      {athlete.priority.toUpperCase()}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <div className="space-y-2 text-xs">
                  {athlete.estimatedReach && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Reach:</span>
                      <span className="font-medium">{athlete.estimatedReach.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {athlete.charity && (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Heart className="h-3 w-3" />
                      <span className="truncate">{athlete.charity}</span>
                    </div>
                  )}
                  
                  {athlete.lastContact && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Contact:</span>
                      <span>{athlete.lastContact}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-1 mt-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedAthletes.length > 0 && (
        <Card className="border-gold/50 bg-gold/5">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {selectedAthletes.length} athletes selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Bulk Email
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};