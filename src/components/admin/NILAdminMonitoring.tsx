import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  Mail,
  Download,
  Eye,
  MessageSquare
} from 'lucide-react';

interface AthleteProgress {
  id: string;
  name: string;
  school: string;
  email: string;
  progress: number;
  lastActivity: string;
  referralCount: number;
  alerts: number;
  status: 'active' | 'inactive' | 'flagged';
  completedModules: number;
  totalModules: number;
}

const NILAdminMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'flagged'>('all');

  const athleteData: AthleteProgress[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      school: 'State University',
      email: 'sarah.j@stateuni.edu',
      progress: 85,
      lastActivity: '2 hours ago',
      referralCount: 5,
      alerts: 0,
      status: 'active',
      completedModules: 8,
      totalModules: 10
    },
    {
      id: '2', 
      name: 'Marcus Williams',
      school: 'Tech College',
      email: 'mwilliams@tech.edu',
      progress: 60,
      lastActivity: '1 day ago',
      referralCount: 3,
      alerts: 1,
      status: 'flagged',
      completedModules: 6,
      totalModules: 10
    },
    {
      id: '3',
      name: 'Emily Chen',
      school: 'Metro University', 
      email: 'echen@metro.edu',
      progress: 45,
      lastActivity: '3 days ago',
      referralCount: 2,
      alerts: 0,
      status: 'inactive',
      completedModules: 4,
      totalModules: 10
    }
  ];

  const filteredAthletes = athleteData.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         athlete.school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || athlete.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive': 
        return <Badge variant="secondary">Inactive</Badge>;
      case 'flagged':
        return <Badge variant="destructive">Flagged</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Athletes</p>
                <p className="text-2xl font-bold">247</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active This Week</p>
                <p className="text-2xl font-bold text-green-600">189</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Alerts</p>
                <p className="text-2xl font-bold text-yellow-600">12</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Flagged Cases</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Athlete Monitoring Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search athletes or schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button 
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
              >
                Active
              </Button>
              <Button 
                variant={filterStatus === 'flagged' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('flagged')}
              >
                Flagged
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Bulk Message
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Athlete Table */}
          <div className="space-y-4">
            {filteredAthletes.map((athlete) => (
              <Card key={athlete.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {athlete.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">{athlete.name}</h3>
                        <p className="text-sm text-muted-foreground">{athlete.school}</p>
                        <p className="text-xs text-muted-foreground">{athlete.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Progress */}
                      <div className="text-center">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getProgressColor(athlete.progress)}`}
                              style={{ width: `${athlete.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{athlete.progress}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {athlete.completedModules}/{athlete.totalModules} modules
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="text-center">
                        <p className="text-sm font-medium">{athlete.referralCount}</p>
                        <p className="text-xs text-muted-foreground">Referrals</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium">{athlete.lastActivity}</p>
                        <p className="text-xs text-muted-foreground">Last Active</p>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(athlete.status)}
                        {athlete.alerts > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {athlete.alerts} Alert{athlete.alerts > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NILAdminMonitoring;