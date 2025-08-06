import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  UserCheck,
  UserX,
  Building,
  Briefcase,
  Scale,
  Calculator,
  Home,
  Shield,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  name: string;
  email: string;
  persona: string;
  status: 'active' | 'pending' | 'suspended' | 'invited';
  onboardingStatus: 'not_started' | 'in_progress' | 'completed' | 'stalled';
  lastActive: string;
  joinedDate: string;
  invitedBy?: string;
  completionPercentage: number;
}

const personaIcons = {
  client: User,
  advisor: Briefcase,
  accountant: Calculator,
  attorney: Scale,
  property_manager: Home,
  compliance_officer: Shield,
  admin: Users,
  system_administrator: Shield,
  tenant_admin: Building
};

const personaColors = {
  client: 'bg-blue-100 text-blue-800',
  advisor: 'bg-green-100 text-green-800',
  accountant: 'bg-purple-100 text-purple-800',
  attorney: 'bg-red-100 text-red-800',
  property_manager: 'bg-orange-100 text-orange-800',
  compliance_officer: 'bg-yellow-100 text-yellow-800',
  admin: 'bg-gray-100 text-gray-800',
  system_administrator: 'bg-indigo-100 text-indigo-800',
  tenant_admin: 'bg-pink-100 text-pink-800'
};

// Mock data - in production this would come from Supabase
const mockUsers: UserData[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    persona: 'client',
    status: 'active',
    onboardingStatus: 'completed',
    lastActive: '2024-01-15',
    joinedDate: '2024-01-10',
    completionPercentage: 100
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@wealthadvisors.com',
    persona: 'advisor',
    status: 'active',
    onboardingStatus: 'completed',
    lastActive: '2024-01-14',
    joinedDate: '2024-01-08',
    completionPercentage: 100
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@taxexperts.com',
    persona: 'accountant',
    status: 'pending',
    onboardingStatus: 'in_progress',
    lastActive: '2024-01-12',
    joinedDate: '2024-01-12',
    invitedBy: 'Sarah Johnson',
    completionPercentage: 65
  },
  {
    id: '4',
    name: 'Lisa Rodriguez',
    email: 'lisa@legalfirm.com',
    persona: 'attorney',
    status: 'invited',
    onboardingStatus: 'not_started',
    lastActive: 'Never',
    joinedDate: '2024-01-13',
    invitedBy: 'Sarah Johnson',
    completionPercentage: 0
  },
  {
    id: '5',
    name: 'David Park',
    email: 'david@properties.com',
    persona: 'property_manager',
    status: 'active',
    onboardingStatus: 'stalled',
    lastActive: '2024-01-11',
    joinedDate: '2024-01-09',
    completionPercentage: 40
  }
];

export const UserManagementPanel: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOnboardingStatus, setSelectedOnboardingStatus] = useState<string>('all');
  const { toast } = useToast();

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPersona = selectedPersona === 'all' || user.persona === selectedPersona;
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
      const matchesOnboarding = selectedOnboardingStatus === 'all' || user.onboardingStatus === selectedOnboardingStatus;
      
      return matchesSearch && matchesPersona && matchesStatus && matchesOnboarding;
    });
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedPersona, selectedStatus, selectedOnboardingStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'invited': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOnboardingStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'stalled': return 'bg-red-100 text-red-800';
      case 'not_started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPersonaStats = () => {
    const stats = users.reduce((acc, user) => {
      acc[user.persona] = (acc[user.persona] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(stats).map(([persona, count]) => ({
      persona,
      count,
      icon: personaIcons[persona as keyof typeof personaIcons] || User
    }));
  };

  const getStatusStats = () => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const pending = users.filter(u => u.status === 'pending').length;
    const invited = users.filter(u => u.status === 'invited').length;
    const completed = users.filter(u => u.onboardingStatus === 'completed').length;
    
    return { total, active, pending, invited, completed };
  };

  const handleResendInvitation = (userId: string) => {
    toast({
      title: "Invitation Resent",
      description: "Invitation email has been sent successfully.",
    });
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'suspended' as const } : user
    ));
    toast({
      title: "User Suspended",
      description: "User access has been suspended.",
      variant: "destructive"
    });
  };

  const handleActivateUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'active' as const } : user
    ));
    toast({
      title: "User Activated",
      description: "User access has been restored.",
    });
  };

  const exportUserData = () => {
    const exportData = filteredUsers.map(user => ({
      Name: user.name,
      Email: user.email,
      Persona: user.persona,
      Status: user.status,
      'Onboarding Status': user.onboardingStatus,
      'Completion %': user.completionPercentage,
      'Last Active': user.lastActive,
      'Joined Date': user.joinedDate,
      'Invited By': user.invitedBy || 'Self-registered'
    }));
    
    console.log('Exporting user data:', exportData);
    toast({
      title: "Data Exported",
      description: "User data has been prepared for download.",
    });
  };

  const stats = getStatusStats();
  const personaStats = getPersonaStats();

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Invited</p>
                <p className="text-2xl font-bold">{stats.invited}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Persona Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>User Personas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {personaStats.map(({ persona, count, icon: Icon }) => (
              <div key={persona} className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${personaColors[persona as keyof typeof personaColors]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium capitalize">{persona.replace('_', ' ')}</p>
                <p className="text-lg font-bold">{count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            User Management
            <Button onClick={exportUserData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedPersona} onValueChange={setSelectedPersona}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Personas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Personas</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
                <SelectItem value="advisor">Advisors</SelectItem>
                <SelectItem value="accountant">Accountants</SelectItem>
                <SelectItem value="attorney">Attorneys</SelectItem>
                <SelectItem value="property_manager">Property Managers</SelectItem>
                <SelectItem value="compliance_officer">Compliance Officers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedOnboardingStatus} onValueChange={setSelectedOnboardingStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Onboarding Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Onboarding</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="stalled">Stalled</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => {
              const PersonaIcon = personaIcons[user.persona as keyof typeof personaIcons] || User;
              
              return (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${personaColors[user.persona as keyof typeof personaColors]}`}>
                      <PersonaIcon className="h-5 w-5" />
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.invitedBy && (
                        <p className="text-xs text-muted-foreground">Invited by {user.invitedBy}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge className={`mb-1 ${getStatusColor(user.status)}`}>
                        {user.status}
                      </Badge>
                      <br />
                      <Badge variant="outline" className={getOnboardingStatusColor(user.onboardingStatus)}>
                        {user.onboardingStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="text-right text-sm">
                      <p className="font-medium">{user.completionPercentage}%</p>
                      <p className="text-muted-foreground">Complete</p>
                    </div>
                    
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Last active</p>
                      <p>{user.lastActive}</p>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {user.status === 'invited' && (
                        <Button variant="ghost" size="sm" onClick={() => handleResendInvitation(user.id)}>
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {user.status === 'active' ? (
                        <Button variant="ghost" size="sm" onClick={() => handleSuspendUser(user.id)}>
                          <UserX className="h-4 w-4" />
                        </Button>
                      ) : user.status === 'suspended' && (
                        <Button variant="ghost" size="sm" onClick={() => handleActivateUser(user.id)}>
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};