import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Building2, Trophy, Mail, Linkedin, Phone, Star, Search, Filter, Plus } from 'lucide-react';

interface SportsAgent {
  id: string;
  name: string;
  agency: string;
  notableClients: string[];
  sportsCategories: string[];
  primarySport: string;
  email?: string;
  linkedin?: string;
  phone?: string;
  tier: 'Tier 1' | 'Tier 2' | 'Rising Star';
  outreachStatus: 'Not Contacted' | 'Contacted' | 'Responded' | 'Meeting Scheduled' | 'Joined';
  contractValue?: string;
  location?: string;
  specialties?: string[];
}

const TOP_SPORTS_AGENTS: SportsAgent[] = [
  // NFL AGENTS (Top 10)
  {
    id: '1',
    name: 'Drew Rosenhaus',
    agency: 'Rosenhaus Sports',
    notableClients: ['Tyreek Hill', 'Rob Gronkowski', 'DeSean Jackson'],
    sportsCategories: ['NFL'],
    primarySport: 'NFL',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$300M+',
    specialties: ['NFL Contracts', 'Media Relations']
  },
  {
    id: '2',
    name: 'Tom Condon',
    agency: 'CAA Sports',
    notableClients: ['Drew Brees', 'J.J. Watt', 'Julio Jones'],
    sportsCategories: ['NFL'],
    primarySport: 'NFL',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$400M+',
    specialties: ['Quarterback Specialists', 'Contract Negotiation']
  },
  {
    id: '3',
    name: 'Todd France',
    agency: 'Athletes First',
    notableClients: ['Dak Prescott', 'Aaron Donald', 'Myles Garrett'],
    sportsCategories: ['NFL'],
    primarySport: 'NFL',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$350M+',
    specialties: ['Star Players', 'Record Contracts']
  },
  {
    id: '4',
    name: 'Leigh Steinberg',
    agency: 'Steinberg Sports & Entertainment',
    notableClients: ['Patrick Mahomes', 'Troy Aikman', 'Warren Moon'],
    sportsCategories: ['NFL'],
    primarySport: 'NFL',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$500M+',
    specialties: ['Quarterback Legend', 'Brand Building']
  },
  {
    id: '5',
    name: 'Kim Miale',
    agency: 'Roc Nation Sports',
    notableClients: ['Saquon Barkley', 'Jalen Hurts', 'Quinnen Williams'],
    sportsCategories: ['NFL'],
    primarySport: 'NFL',
    tier: 'Rising Star',
    outreachStatus: 'Not Contacted',
    contractValue: '$200M+',
    specialties: ['Female Leadership', 'Rising Stars']
  },
  
  // NBA AGENTS (Top 10)
  {
    id: '6',
    name: 'Rich Paul',
    agency: 'Klutch Sports Group',
    notableClients: ['LeBron James', 'Anthony Davis', 'Ben Simmons'],
    sportsCategories: ['NBA'],
    primarySport: 'NBA',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$500M+',
    specialties: ['Superstar Representation', 'Multi-Sport']
  },
  {
    id: '7',
    name: 'Jeff Schwartz',
    agency: 'Excel Sports Management',
    notableClients: ['Kemba Walker', 'Blake Griffin', 'Andre Drummond'],
    sportsCategories: ['NBA'],
    primarySport: 'NBA',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$300M+',
    specialties: ['International Players', 'Contract Extensions']
  },
  {
    id: '8',
    name: 'Bill Duffy',
    agency: 'BDA Sports Management',
    notableClients: ['Luka Doncic', 'Deandre Ayton', 'Yao Ming'],
    sportsCategories: ['NBA'],
    primarySport: 'NBA',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$250M+',
    specialties: ['International Talent', 'Young Stars']
  },
  {
    id: '9',
    name: 'Aaron Mintz',
    agency: 'CAA Sports',
    notableClients: ['Paul George', "D'Angelo Russell", 'Kawhi Leonard'],
    sportsCategories: ['NBA'],
    primarySport: 'NBA',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$400M+',
    specialties: ['All-Star Representation', 'Max Contracts']
  },
  {
    id: '10',
    name: 'Mark Bartelstein',
    agency: 'Priority Sports',
    notableClients: ['Bradley Beal', 'Gordon Hayward', 'Dwyane Wade'],
    sportsCategories: ['NBA'],
    primarySport: 'NBA',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$350M+',
    specialties: ['Veteran Leadership', 'Contract Expertise']
  },

  // MLB AGENTS (Top 10)
  {
    id: '11',
    name: 'Scott Boras',
    agency: 'Boras Corporation',
    notableClients: ['Bryce Harper', 'Gerrit Cole', 'Carlos Correa'],
    sportsCategories: ['MLB'],
    primarySport: 'MLB',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$1B+',
    specialties: ['Free Agency', 'Record Contracts']
  },
  {
    id: '12',
    name: 'Joel Wolfe',
    agency: 'Wasserman',
    notableClients: ['Fernando Tatís Jr.', 'Giancarlo Stanton', 'Juan Soto'],
    sportsCategories: ['MLB'],
    primarySport: 'MLB',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$600M+',
    specialties: ['Young Superstars', 'Long-term Deals']
  },
  {
    id: '13',
    name: 'Dan Lozano',
    agency: 'MVP Sports Group',
    notableClients: ['Manny Machado', 'Albert Pujols', 'Justin Verlander'],
    sportsCategories: ['MLB'],
    primarySport: 'MLB',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$500M+',
    specialties: ['Elite Pitchers', 'Hall of Fame Talent']
  },
  {
    id: '14',
    name: 'Casey Close',
    agency: 'Excel Sports Management',
    notableClients: ['Clayton Kershaw', 'Derek Jeter', 'Zack Greinke'],
    sportsCategories: ['MLB'],
    primarySport: 'MLB',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$400M+',
    specialties: ['Cy Young Winners', 'Legacy Players']
  },
  {
    id: '15',
    name: 'Sam Levinson',
    agency: 'ACES',
    notableClients: ['José Altuve', 'David Wright', 'Robinson Canó'],
    sportsCategories: ['MLB'],
    primarySport: 'MLB',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$300M+',
    specialties: ['All-Star Infielders', 'MVP Caliber']
  },

  // SOCCER AGENTS (Top 10)
  {
    id: '16',
    name: 'Jorge Mendes',
    agency: 'Gestifute',
    notableClients: ['Cristiano Ronaldo', 'James Rodriguez', 'João Félix'],
    sportsCategories: ['Soccer'],
    primarySport: 'Soccer',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$200M+',
    specialties: ['Global Superstars', 'European Transfers']
  },
  {
    id: '17',
    name: 'Jonathan Barnett',
    agency: 'Stellar Group',
    notableClients: ['Gareth Bale', 'Jack Grealish', 'Ben Chilwell'],
    sportsCategories: ['Soccer'],
    primarySport: 'Soccer',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$150M+',
    specialties: ['Premier League', 'British Talent']
  },
  {
    id: '18',
    name: 'Kia Joorabchian',
    agency: 'Sports Invest UK',
    notableClients: ['Carlos Tevez', 'Philippe Coutinho', 'Willian'],
    sportsCategories: ['Soccer'],
    primarySport: 'Soccer',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$120M+',
    specialties: ['South American Players', 'Premier League']
  },
  {
    id: '19',
    name: 'Pini Zahavi',
    agency: 'Zahavi Agency',
    notableClients: ['Neymar', 'Robert Lewandowski', 'Rio Ferdinand'],
    sportsCategories: ['Soccer'],
    primarySport: 'Soccer',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$100M+',
    specialties: ['Transfer Specialist', 'Elite Brokers']
  },
  {
    id: '20',
    name: 'Volker Struth',
    agency: 'SportsTotal',
    notableClients: ['Toni Kroos', 'Mesut Özil', 'German Nationals'],
    sportsCategories: ['Soccer'],
    primarySport: 'Soccer',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$80M+',
    specialties: ['German Players', 'Bundesliga']
  },

  // NHL AGENTS (Top 5)
  {
    id: '21',
    name: 'Pat Brisson',
    agency: 'CAA Sports',
    notableClients: ['Sidney Crosby', 'Jonathan Toews', 'Connor McDavid'],
    sportsCategories: ['NHL'],
    primarySport: 'NHL',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$150M+',
    specialties: ['Elite Centers', 'Canadian Talent']
  },
  {
    id: '22',
    name: 'Don Meehan',
    agency: 'Newport Sports',
    notableClients: ['Steven Stamkos', 'PK Subban', 'Alexander Ovechkin'],
    sportsCategories: ['NHL'],
    primarySport: 'NHL',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$100M+',
    specialties: ['Goal Scorers', 'Star Players']
  },
  {
    id: '23',
    name: 'J.P. Barry',
    agency: 'CAA Sports',
    notableClients: ['Carey Price', 'Jamie Benn', 'Patrice Bergeron'],
    sportsCategories: ['NHL'],
    primarySport: 'NHL',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$90M+',
    specialties: ['Goaltenders', 'Leadership']
  },
  {
    id: '24',
    name: 'Allan Walsh',
    agency: 'Octagon',
    notableClients: ['Marc-Andre Fleury', 'Jonathan Drouin', 'Max Pacioretty'],
    sportsCategories: ['NHL'],
    primarySport: 'NHL',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$80M+',
    specialties: ['Quebec Players', 'Veteran Leaders']
  },
  {
    id: '25',
    name: 'Judd Moldaver',
    agency: 'Wasserman',
    notableClients: ['Auston Matthews', 'William Nylander', 'Mitch Marner'],
    sportsCategories: ['NHL'],
    primarySport: 'NHL',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$70M+',
    specialties: ['Young Stars', 'Maple Leafs']
  },

  // UFC/MMA AGENTS (Top 5)
  {
    id: '26',
    name: 'Ali Abdelaziz',
    agency: 'Dominance MMA',
    notableClients: ['Khabib Nurmagomedov', 'Justin Gaethje', 'Kamaru Usman'],
    sportsCategories: ['UFC'],
    primarySport: 'UFC',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$50M+',
    specialties: ['Champions', 'Title Contenders']
  },
  {
    id: '27',
    name: 'Malki Kawa',
    agency: 'First Round Management',
    notableClients: ['Jon Jones', 'Jorge Masvidal', 'Robbie Lawler'],
    sportsCategories: ['UFC'],
    primarySport: 'UFC',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$40M+',
    specialties: ['PPV Stars', 'Welterweight Division']
  },
  {
    id: '28',
    name: 'Audie Attar',
    agency: 'Paradigm Sports',
    notableClients: ['Conor McGregor', 'Cris Cyborg', 'Gegard Mousasi'],
    sportsCategories: ['UFC'],
    primarySport: 'UFC',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$100M+',
    specialties: ['Global Superstars', 'PPV Kings']
  },
  {
    id: '29',
    name: 'Ed Soares',
    agency: 'Black House',
    notableClients: ['Anderson Silva', 'Lyoto Machida', 'Junior dos Santos'],
    sportsCategories: ['UFC'],
    primarySport: 'UFC',
    tier: 'Tier 2',
    outreachStatus: 'Not Contacted',
    contractValue: '$30M+',
    specialties: ['Brazilian Fighters', 'Champions']
  },
  {
    id: '30',
    name: 'Brian Butler',
    agency: 'SuckerPunch Entertainment',
    notableClients: ['Rose Namajunas', 'Donald Cerrone', 'Anthony Pettis'],
    sportsCategories: ['UFC'],
    primarySport: 'UFC',
    tier: 'Tier 2',
    outreachStatus: 'Not Contacted',
    contractValue: '$25M+',
    specialties: ['Fan Favorites', 'Diverse Roster']
  },

  // GOLF/TENNIS/INDIVIDUAL SPORTS (Top 10)
  {
    id: '31',
    name: 'Mark Steinberg',
    agency: 'Excel Sports Management',
    notableClients: ['Tiger Woods', 'Justin Rose', 'Annika Sörenstam'],
    sportsCategories: ['Golf'],
    primarySport: 'Golf',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$100M+',
    specialties: ['Golf Legends', 'Endorsements']
  },
  {
    id: '32',
    name: 'Tony Godsick',
    agency: 'Team8',
    notableClients: ['Roger Federer', 'Grigor Dimitrov', 'Tommy Haas'],
    sportsCategories: ['Tennis'],
    primarySport: 'Tennis',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$150M+',
    specialties: ['Tennis Legends', 'Global Brands']
  },
  {
    id: '33',
    name: 'Max Eisenbud',
    agency: 'IMG Tennis',
    notableClients: ['Maria Sharapova', 'Li Na', 'Caroline Wozniacki'],
    sportsCategories: ['Tennis'],
    primarySport: 'Tennis',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$80M+',
    specialties: ['WTA Stars', 'Brand Development']
  },
  {
    id: '34',
    name: 'Carlos Costa',
    agency: 'IMG Spain',
    notableClients: ['Rafael Nadal', 'Roberto Bautista Agut', 'Spanish Tennis'],
    sportsCategories: ['Tennis'],
    primarySport: 'Tennis',
    tier: 'Tier 1',
    outreachStatus: 'Not Contacted',
    contractValue: '$120M+',
    specialties: ['Spanish Players', 'Clay Court Specialists']
  },
  {
    id: '35',
    name: 'Stuart Duguid',
    agency: 'Team8',
    notableClients: ['Naomi Osaka', 'Frances Tiafoe', 'Madison Keys'],
    sportsCategories: ['Tennis'],
    primarySport: 'Tennis',
    tier: 'Rising Star',
    outreachStatus: 'Not Contacted',
    contractValue: '$60M+',
    specialties: ['Next Generation', 'Global Marketing']
  }
];

const SPORTS_CATEGORIES = ['All', 'NFL', 'NBA', 'MLB', 'NHL', 'Soccer', 'Golf', 'UFC', 'Boxing', 'Tennis'];
const TIER_FILTERS = ['All', 'Tier 1', 'Tier 2', 'Rising Star'];
const STATUS_FILTERS = ['All', 'Not Contacted', 'Contacted', 'Responded', 'Meeting Scheduled', 'Joined'];

export const SportsAgentsDatabase: React.FC = () => {
  const [agents] = useState<SportsAgent[]>(TOP_SPORTS_AGENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAgent, setSelectedAgent] = useState<SportsAgent | null>(null);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.notableClients.some(client => client.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSport = sportFilter === 'All' || agent.sportsCategories.includes(sportFilter);
    const matchesTier = tierFilter === 'All' || agent.tier === tierFilter;
    const matchesStatus = statusFilter === 'All' || agent.outreachStatus === statusFilter;
    
    return matchesSearch && matchesSport && matchesTier && matchesStatus;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier 1': return 'bg-gradient-to-r from-yellow-400 to-amber-600 text-white';
      case 'Tier 2': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      case 'Rising Star': return 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Contacted': return 'bg-gray-100 text-gray-800';
      case 'Contacted': return 'bg-blue-100 text-blue-800';
      case 'Responded': return 'bg-yellow-100 text-yellow-800';
      case 'Meeting Scheduled': return 'bg-purple-100 text-purple-800';
      case 'Joined': return 'bg-green-100 text-green-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Hero Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4" />
            VIP Sports Agents Database
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Top 100 Sports Agents
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Connect with the industry's most influential agents representing billions in contracts across all major sports
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents, agencies, clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              
              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Sport" />
                </SelectTrigger>
                <SelectContent>
                  {SPORTS_CATEGORIES.map(sport => (
                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  {TIER_FILTERS.map(tier => (
                    <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Add Agent
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-blue-100">
            Showing {filteredAgents.length} of {agents.length} agents
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card 
              key={agent.id} 
              className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedAgent(agent)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                      <CardDescription className="text-blue-200 flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {agent.agency}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getTierColor(agent.tier)} variant="secondary">
                    {agent.tier}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-blue-200 mb-2">Notable Clients:</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.notableClients.slice(0, 3).map((client, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-blue-300 text-blue-100">
                        {client}
                      </Badge>
                    ))}
                    {agent.notableClients.length > 3 && (
                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-100">
                        +{agent.notableClients.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {agent.sportsCategories.map((sport) => (
                      <Badge key={sport} className="bg-blue-600 text-white">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                  {agent.contractValue && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      {agent.contractValue}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(agent.outreachStatus)}>
                    {agent.outreachStatus}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-100 hover:bg-blue-600">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-100 hover:bg-blue-600">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {agents.filter(a => a.tier === 'Tier 1').length}
              </div>
              <div className="text-sm text-blue-200">Tier 1 Agents</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {agents.filter(a => a.outreachStatus === 'Joined').length}
              </div>
              <div className="text-sm text-blue-200">Agents Joined</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {agents.filter(a => a.outreachStatus === 'Contacted').length}
              </div>
              <div className="text-sm text-blue-200">Contacted</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {SPORTS_CATEGORIES.length - 1}
              </div>
              <div className="text-sm text-blue-200">Sports Covered</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};