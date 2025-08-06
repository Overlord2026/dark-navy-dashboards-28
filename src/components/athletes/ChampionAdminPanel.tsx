import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, Send, Eye, CheckCircle, Clock, 
  Mail, MessageSquare, DollarSign, TrendingUp,
  Search, Filter, Download, Plus
} from 'lucide-react';

interface OutreachRecord {
  id: string;
  championName: string;
  sport: string;
  email: string;
  outreachDate: string;
  method: 'email' | 'linkedin' | 'agent' | 'direct';
  status: 'sent' | 'opened' | 'responded' | 'declined' | 'recorded';
  responseDate?: string;
  notes?: string;
  charityChoice?: string;
  contentType?: 'video' | 'text' | 'both';
}

interface ChampionStats {
  totalInvited: number;
  responded: number;
  recorded: number;
  totalViews: number;
  totalDonations: number;
}

const mockOutreach: OutreachRecord[] = [
  {
    id: '1',
    championName: 'Michael Jordan',
    sport: 'Basketball',
    email: 'mj@jumpman.com',
    outreachDate: '2024-01-15',
    method: 'direct',
    status: 'recorded',
    responseDate: '2024-01-18',
    charityChoice: 'Boys & Girls Club',
    contentType: 'video'
  },
  {
    id: '2',
    championName: 'Serena Williams',
    sport: 'Tennis',
    email: 'serena@williams.com',
    outreachDate: '2024-01-20',
    method: 'agent',
    status: 'responded',
    responseDate: '2024-01-22',
    notes: 'Interested in participating, scheduling recording'
  },
  {
    id: '3',
    championName: 'Tom Brady',
    sport: 'Football',
    email: 'tom@tb12.com',
    outreachDate: '2024-01-25',
    method: 'email',
    status: 'sent'
  }
];

const mockStats: ChampionStats = {
  totalInvited: 25,
  responded: 8,
  recorded: 3,
  totalViews: 45000,
  totalDonations: 15000
};

export const ChampionAdminPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

  const filteredOutreach = mockOutreach.filter(record => {
    const matchesSearch = record.championName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.sport.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recorded': return 'bg-green-500';
      case 'responded': return 'bg-blue-500';
      case 'opened': return 'bg-yellow-500';
      case 'declined': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const responseRate = (mockStats.responded / mockStats.totalInvited * 100).toFixed(1);
  const recordingRate = (mockStats.recorded / mockStats.totalInvited * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Champion Outreach Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Champion
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{mockStats.totalInvited}</div>
                <div className="text-sm text-muted-foreground">Invited</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{mockStats.responded}</div>
                <div className="text-sm text-muted-foreground">Responded ({responseRate}%)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <div>
                <div className="text-2xl font-bold">{mockStats.recorded}</div>
                <div className="text-sm text-muted-foreground">Recorded ({recordingRate}%)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{mockStats.totalViews.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gold" />
              <div>
                <div className="text-2xl font-bold">${mockStats.totalDonations.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Donations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="outreach" className="space-y-4">
        <TabsList>
          <TabsTrigger value="outreach">Outreach Tracker</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="outreach" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search champions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="opened">Opened</option>
              <option value="responded">Responded</option>
              <option value="recorded">Recorded</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          {/* Outreach Table */}
          <Card>
            <CardHeader>
              <CardTitle>Champion Outreach Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOutreach.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`/champions/${record.championName.toLowerCase().replace(' ', '-')}.jpg`} />
                        <AvatarFallback>
                          {record.championName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold">{record.championName}</h3>
                        <p className="text-sm text-muted-foreground">{record.sport}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm">Outreach: {record.outreachDate}</div>
                        {record.responseDate && (
                          <div className="text-sm text-muted-foreground">
                            Response: {record.responseDate}
                          </div>
                        )}
                      </div>

                      <Badge className={getStatusColor(record.status)}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Outreach Email Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Initial Champion Invitation</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Used for first outreach to potential champions
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Preview</Button>
                    <Button size="sm">Use Template</Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Follow-up Reminder</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Gentle follow-up for non-responders after 1 week
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Preview</Button>
                    <Button size="sm">Use Template</Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Recording Instructions</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sent after champion agrees to participate
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Preview</Button>
                    <Button size="sm">Use Template</Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Pending Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No pending submissions</h3>
                <p className="text-muted-foreground">Champion submissions will appear here for review</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Response Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Email Response Rate</span>
                    <span className="font-semibold">{responseRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Recording Completion Rate</span>
                    <span className="font-semibold">{recordingRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Response Time</span>
                    <span className="font-semibold">3.2 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Athlete Views</span>
                    <span className="font-semibold">{mockStats.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Charity Donations</span>
                    <span className="font-semibold">${mockStats.totalDonations.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg. Views per Video</span>
                    <span className="font-semibold">15,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};