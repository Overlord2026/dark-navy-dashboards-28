import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  MessageSquare, 
  UserPlus, 
  Send, 
  Phone, 
  Video, 
  Calendar,
  Star,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { UpgradePaywall } from '@/components/subscription/UpgradePaywall';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'estate-attorney' | 'tax-advisor' | 'financial-planner' | 'insurance-agent';
  firm: string;
  avatar?: string;
  rating: number;
  location: string;
  specialties: string[];
  isVerified: boolean;
  lastActive: Date;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  attachments?: string[];
  isRead: boolean;
}

interface MarketplaceProfessional {
  id: string;
  name: string;
  title: string;
  firm: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  location: string;
  specialties: string[];
  avatar?: string;
  availability: 'available' | 'busy' | 'offline';
  responseTime: string;
  isVerified: boolean;
}

export function CollaborationTools() {
  const { subscriptionPlan, hasAccess } = useSubscriptionAccess();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');

  // Check premium access
  const hasCollaborationAccess = hasAccess('premium_analytics_access') || subscriptionPlan?.tier === 'premium' || subscriptionPlan?.tier === 'elite';

  // Sample data
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Mitchell',
      email: 'sarah@estatelaw.com',
      role: 'estate-attorney',
      firm: 'Mitchell Estate Law',
      rating: 4.9,
      location: 'New York, NY',
      specialties: ['Estate Planning', 'Trusts', 'Probate'],
      isVerified: true,
      lastActive: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      name: 'David Chen',
      email: 'david@taxadvisors.com',
      role: 'tax-advisor',
      firm: 'Chen Tax Advisory',
      rating: 4.8,
      location: 'San Francisco, CA',
      specialties: ['Estate Tax', 'Gift Tax', 'Generation-Skipping'],
      isVerified: true,
      lastActive: new Date(Date.now() - 1800000)
    }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      senderName: 'Sarah Mitchell',
      content: 'I\'ve reviewed your trust documents. We should schedule a call to discuss the tax implications.',
      timestamp: new Date(Date.now() - 7200000),
      isRead: true
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'You',
      content: 'That sounds great. Are you available tomorrow afternoon?',
      timestamp: new Date(Date.now() - 3600000),
      isRead: true
    }
  ]);

  const [marketplaceProfessionals] = useState<MarketplaceProfessional[]>([
    {
      id: '1',
      name: 'Michael Rodriguez',
      title: 'Senior Estate Planning Attorney',
      firm: 'Rodriguez & Associates',
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 450,
      location: 'Los Angeles, CA',
      specialties: ['High Net Worth Planning', 'Family Limited Partnerships', 'Charitable Trusts'],
      availability: 'available',
      responseTime: '< 2 hours',
      isVerified: true
    },
    {
      id: '2',
      name: 'Jennifer Park',
      title: 'Tax Planning Specialist',
      firm: 'Park Financial Group',
      rating: 4.8,
      reviewCount: 89,
      hourlyRate: 350,
      location: 'Chicago, IL',
      specialties: ['Estate Tax Minimization', 'Business Succession', 'International Planning'],
      availability: 'busy',
      responseTime: '< 4 hours',
      isVerified: true
    },
    {
      id: '3',
      name: 'Robert Thompson',
      title: 'Certified Financial Planner',
      firm: 'Thompson Wealth Management',
      rating: 4.7,
      reviewCount: 156,
      hourlyRate: 300,
      location: 'Miami, FL',
      specialties: ['Wealth Transfer', 'Insurance Planning', 'Retirement Strategies'],
      availability: 'available',
      responseTime: '< 1 hour',
      isVerified: true
    }
  ]);

  if (!hasCollaborationAccess) {
    return (
      <UpgradePaywall
        promptData={{
          feature_name: 'Estate Planning Collaboration Tools',
          required_tier: 'premium',
          add_on_required: 'premium_analytics_access'
        }}
        showUsageProgress={false}
      />
    );
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;
    
    toast.success('Message sent');
    setNewMessage('');
  };

  const handleInviteAdvisor = () => {
    if (!inviteEmail || !inviteRole) {
      toast.error('Please fill in all fields');
      return;
    }
    
    toast.success('Invitation sent successfully');
    setInviteDialogOpen(false);
    setInviteEmail('');
    setInviteRole('');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'estate-attorney': return '⚖️';
      case 'tax-advisor': return '💰';
      case 'financial-planner': return '📊';
      case 'insurance-agent': return '🛡️';
      default: return '👤';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'estate-attorney': return 'Estate Attorney';
      case 'tax-advisor': return 'Tax Advisor';
      case 'financial-planner': return 'Financial Planner';
      case 'insurance-agent': return 'Insurance Agent';
      default: return 'Professional';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Estate Planning Team Collaboration
            <Badge variant="secondary">Premium</Badge>
          </CardTitle>
          <CardDescription>
            Securely collaborate with your estate planning professionals
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="team" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="team">My Team</TabsTrigger>
          <TabsTrigger value="messages">Secure Messages</TabsTrigger>
          <TabsTrigger value="marketplace">Find Professionals</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Estate Planning Team</h3>
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Advisor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Estate Planning Professional</DialogTitle>
                  <DialogDescription>
                    Send a secure invitation to collaborate on your estate plan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Email Address</Label>
                    <Input
                      placeholder="advisor@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Professional Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estate-attorney">Estate Attorney</SelectItem>
                        <SelectItem value="tax-advisor">Tax Advisor</SelectItem>
                        <SelectItem value="financial-planner">Financial Planner</SelectItem>
                        <SelectItem value="insurance-agent">Insurance Agent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Personal Message (Optional)</Label>
                    <Textarea placeholder="Add a personal note to your invitation..." />
                  </div>
                  <Button onClick={handleInviteAdvisor} className="w-full">
                    Send Invitation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map(member => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{member.name}</h4>
                        {member.isVerified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{getRoleLabel(member.role)}</p>
                      <p className="text-xs text-muted-foreground mb-2">{member.firm}</p>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{member.rating}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{member.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {member.specialties.slice(0, 2).map(specialty => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setActiveChat(member.id)}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="h-3 w-3 mr-1" />
                          Meet
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-96">
            {/* Chat List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-sm">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {teamMembers.map(member => (
                    <div
                      key={member.id}
                      className={`p-3 cursor-pointer hover:bg-muted ${
                        activeChat === member.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setActiveChat(member.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {getRoleIcon(member.role)} {getRoleLabel(member.role)}
                          </p>
                        </div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                {activeChat && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {teamMembers.find(m => m.id === activeChat)?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-sm">
                          {teamMembers.find(m => m.id === activeChat)?.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {getRoleLabel(teamMembers.find(m => m.id === activeChat)?.role || '')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1 p-0">
                {activeChat ? (
                  <div className="flex flex-col h-64">
                    <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                      {messages.map(message => (
                        <div key={message.id} className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs p-2 rounded-lg ${
                            message.senderId === 'me' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button size="sm" onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Find Vetted Estate Professionals</h3>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estate-planning">Estate Planning</SelectItem>
                  <SelectItem value="tax-planning">Tax Planning</SelectItem>
                  <SelectItem value="trust-administration">Trust Administration</SelectItem>
                  <SelectItem value="business-succession">Business Succession</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nationwide">Nationwide</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="fl">Florida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketplaceProfessionals.map(professional => (
              <Card key={professional.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={professional.avatar} />
                        <AvatarFallback>
                          {professional.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${getAvailabilityColor(professional.availability)}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{professional.name}</h4>
                        {professional.isVerified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{professional.title}</p>
                      <p className="text-xs text-muted-foreground">{professional.firm}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{professional.rating}</span>
                        <span className="text-xs text-muted-foreground">({professional.reviewCount})</span>
                      </div>
                      <span className="text-xs font-medium">${professional.hourlyRate}/hr</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{professional.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Responds {professional.responseTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {professional.specialties.slice(0, 2).map(specialty => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="h-3 w-3 mr-1" />
                      Contact
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}