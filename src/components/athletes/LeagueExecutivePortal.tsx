import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Users, Trophy, Mail, Phone, Linkedin, Calendar, Star, Shield, Target, Globe } from 'lucide-react';

interface LeagueExecutive {
  id: string;
  name: string;
  title: string;
  organization: string;
  league: string;
  email?: string;
  linkedin?: string;
  phone?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Contacted' | 'Contacted' | 'Meeting Scheduled' | 'Partnership Discussion' | 'Joined';
  focusAreas: string[];
  playerCount?: number;
  avgSalary?: string;
  keyInitiatives?: string[];
}

const LEAGUE_EXECUTIVES: LeagueExecutive[] = [
  {
    id: '1',
    name: 'DeMaurice Smith',
    title: 'Executive Director',
    organization: 'NFLPA',
    league: 'NFL',
    priority: 'High',
    status: 'Not Contacted',
    focusAreas: ['Player Welfare', 'Financial Education', 'Post-Career Planning'],
    playerCount: 1696,
    avgSalary: '$2.7M',
    keyInitiatives: ['Player Development', 'Trust Fund Management', 'Healthcare']
  },
  {
    id: '2',
    name: 'Tamika Tremaglio',
    title: 'Executive Director',
    organization: 'NBPA',
    league: 'NBA',
    priority: 'High',
    status: 'Not Contacted',
    focusAreas: ['Financial Literacy', 'Business Development', 'Mental Health'],
    playerCount: 450,
    avgSalary: '$8.3M',
    keyInitiatives: ['Rookie Transition Program', 'Financial Planning', 'Player Wellness']
  },
  {
    id: '3',
    name: 'Tony Clark',
    title: 'Executive Director',
    organization: 'MLBPA',
    league: 'MLB',
    priority: 'High',
    status: 'Not Contacted',
    focusAreas: ['Player Rights', 'Financial Security', 'Career Transition'],
    playerCount: 1200,
    avgSalary: '$4.4M',
    keyInitiatives: ['Player Assistance Program', 'Education Fund', 'Retirement Planning']
  },
  {
    id: '4',
    name: 'Marty Walsh',
    title: 'Executive Director',
    organization: 'NHLPA',
    league: 'NHL',
    priority: 'Medium',
    status: 'Not Contacted',
    focusAreas: ['Player Development', 'Financial Education', 'International Players'],
    playerCount: 700,
    avgSalary: '$2.9M',
    keyInitiatives: ['Goals & Dreams Foundation', 'Player Assistance', 'Career Transition']
  },
  {
    id: '5',
    name: 'Cindy Parlow Cone',
    title: 'President',
    organization: 'US Soccer',
    league: 'Soccer',
    priority: 'Medium',
    status: 'Not Contacted',
    focusAreas: ['Youth Development', 'Women\'s Soccer', 'Olympic Programs'],
    playerCount: 800,
    avgSalary: '$300K',
    keyInitiatives: ['Player Development', 'Education Programs', 'Mental Health']
  },
  {
    id: '6',
    name: 'Seth Waugh',
    title: 'CEO',
    organization: 'PGA Tour',
    league: 'Golf',
    priority: 'Medium',
    status: 'Not Contacted',
    focusAreas: ['Player Services', 'Tournament Operations', 'Global Growth'],
    playerCount: 300,
    avgSalary: '$1.5M',
    keyInitiatives: ['Player Impact Program', 'Retirement Plan', 'Charity Initiatives']
  }
];

const COLLABORATION_TYPES = [
  {
    id: 'education',
    title: 'Educational Partnerships',
    description: 'Co-create financial literacy and wellness programs',
    icon: Target,
    benefits: ['Custom curriculum', 'League branding', 'Player engagement metrics']
  },
  {
    id: 'compliance',
    title: 'Compliance & Best Practices',
    description: 'Develop industry-standard compliance tools',
    icon: Shield,
    benefits: ['Regulatory alignment', 'Risk management', 'Audit capabilities']
  },
  {
    id: 'whitelabel',
    title: 'White-Label Solutions',
    description: 'Branded platform for league-specific needs',
    icon: Building2,
    benefits: ['Custom branding', 'League-specific features', 'Direct player access']
  },
  {
    id: 'research',
    title: 'Research & Data',
    description: 'Collaborative research on player financial wellness',
    icon: Globe,
    benefits: ['Industry insights', 'Trend analysis', 'Policy recommendations']
  }
];

export const LeagueExecutivePortal: React.FC = () => {
  const [executives] = useState<LeagueExecutive[]>(LEAGUE_EXECUTIVES);
  const [selectedExec, setSelectedExec] = useState<LeagueExecutive | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredExecutives = executives.filter(exec => {
    const matchesSearch = exec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exec.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exec.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLeague = leagueFilter === 'All' || exec.league === leagueFilter;
    const matchesPriority = priorityFilter === 'All' || exec.priority === priorityFilter;
    
    return matchesSearch && matchesLeague && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      case 'Medium': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'Low': return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Contacted': return 'bg-gray-100 text-gray-800';
      case 'Contacted': return 'bg-blue-100 text-blue-800';
      case 'Meeting Scheduled': return 'bg-purple-100 text-purple-800';
      case 'Partnership Discussion': return 'bg-yellow-100 text-yellow-800';
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
            <Building2 className="w-4 h-4" />
            League Executive Portal
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Sports League Partnership Hub
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Connect with league executives to co-create athlete financial wellness programs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Executive Directory */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <Card className="mb-6 bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Search executives, leagues, organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  
                  <Select value={leagueFilter} onValueChange={setLeagueFilter}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="League" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Leagues</SelectItem>
                      <SelectItem value="NFL">NFL</SelectItem>
                      <SelectItem value="NBA">NBA</SelectItem>
                      <SelectItem value="MLB">MLB</SelectItem>
                      <SelectItem value="NHL">NHL</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Golf">Golf</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Priorities</SelectItem>
                      <SelectItem value="High">High Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="Low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Executives Grid */}
            <div className="space-y-4">
              {filteredExecutives.map((exec) => (
                <Card 
                  key={exec.id} 
                  className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedExec(exec)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{exec.name}</h3>
                          <p className="text-blue-200">{exec.title}</p>
                          <p className="text-blue-300 font-semibold">{exec.organization}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={getPriorityColor(exec.priority)}>
                          {exec.priority} Priority
                        </Badge>
                        <Badge className={getStatusColor(exec.status)}>
                          {exec.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <Users className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                        <div className="text-white font-bold">{exec.playerCount?.toLocaleString()}</div>
                        <div className="text-blue-200 text-sm">Players</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                        <div className="text-white font-bold">{exec.avgSalary}</div>
                        <div className="text-blue-200 text-sm">Avg Salary</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <Badge className="bg-blue-600 text-white">{exec.league}</Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-blue-200 mb-2">Focus Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {exec.focusAreas.map((area, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-blue-300 text-blue-100">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Proposal
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Meeting
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Collaboration Types */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="text-white">Partnership Types</CardTitle>
                <CardDescription className="text-blue-200">
                  Collaboration opportunities with leagues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {COLLABORATION_TYPES.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div key={type.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="w-6 h-6 text-amber-400" />
                        <h4 className="font-semibold text-white">{type.title}</h4>
                      </div>
                      <p className="text-sm text-blue-200 mb-3">{type.description}</p>
                      <div className="space-y-1">
                        {type.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-blue-100">
                            <Star className="w-3 h-3 text-amber-400" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Partnership Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">6</div>
                    <div className="text-sm text-blue-200">Major Leagues</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">5,000+</div>
                    <div className="text-sm text-blue-200">Total Athletes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">$2.5B</div>
                    <div className="text-sm text-blue-200">Combined Salaries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">15+</div>
                    <div className="text-sm text-blue-200">Key Executives</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};