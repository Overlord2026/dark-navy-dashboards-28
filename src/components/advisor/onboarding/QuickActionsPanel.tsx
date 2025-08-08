import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  MessageCircle, 
  Trophy, 
  HelpCircle,
  ExternalLink,
  Phone,
  Mail,
  Video,
  FileText,
  Star,
  Award
} from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'setup' | 'support' | 'community' | 'rewards';
  action: () => void;
  badge?: string;
}

const quickActions: QuickAction[] = [
  {
    title: 'Invite Clients',
    description: 'Start building your client list and send portal invitations',
    icon: <Users className="h-5 w-5" />,
    category: 'setup',
    action: () => console.log('Invite clients'),
    badge: 'Essential'
  },
  {
    title: 'Access Knowledge Base',
    description: 'Browse guides, tutorials, and best practices',
    icon: <BookOpen className="h-5 w-5" />,
    category: 'support',
    action: () => console.log('Knowledge base')
  },
  {
    title: 'Book Strategy Call',
    description: 'Schedule a one-on-one session with our practice consultants',
    icon: <Calendar className="h-5 w-5" />,
    category: 'support',
    action: () => console.log('Book strategy call'),
    badge: 'Popular'
  },
  {
    title: 'Join Advisor Network',
    description: 'Connect with peers for strategies and referral opportunities',
    icon: <MessageCircle className="h-5 w-5" />,
    category: 'community',
    action: () => console.log('Join network')
  },
  {
    title: 'View Leaderboard',
    description: 'Track your referrals, credits, and ranking',
    icon: <Trophy className="h-5 w-5" />,
    category: 'rewards',
    action: () => console.log('View leaderboard')
  },
  {
    title: 'Chat Support',
    description: 'Get instant help from our support team',
    icon: <MessageCircle className="h-5 w-5" />,
    category: 'support',
    action: () => console.log('Chat support'),
    badge: '24/7'
  }
];

const supportOptions = [
  {
    title: 'Live Chat',
    description: 'Get instant answers to your questions',
    icon: <MessageCircle className="h-5 w-5 text-green-600" />,
    available: true,
    action: () => console.log('Start chat')
  },
  {
    title: 'Phone Support',
    description: 'Speak directly with our technical team',
    icon: <Phone className="h-5 w-5 text-blue-600" />,
    available: true,
    action: () => console.log('Call support')
  },
  {
    title: 'Video Training',
    description: 'Schedule a screen-share training session',
    icon: <Video className="h-5 w-5 text-purple-600" />,
    available: true,
    action: () => console.log('Book training')
  },
  {
    title: 'Email Support',
    description: 'Submit detailed questions via email',
    icon: <Mail className="h-5 w-5 text-orange-600" />,
    available: true,
    action: () => console.log('Email support')
  }
];

export function QuickActionsPanel() {
  const getCategoryActions = (category: string) => 
    quickActions.filter(action => action.category === category);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Support & Resources</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get the help you need to succeed. Access support, connect with peers, 
          and track your progress in the advisor community.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Card key={index} className="transition-colors hover:border-primary/50 cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {action.icon}
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </div>
                {action.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {action.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm mb-3">
                {action.description}
              </CardDescription>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                onClick={action.action}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support Options */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <HelpCircle className="h-6 w-6 text-primary" />
            <CardTitle>Get Help When You Need It</CardTitle>
          </div>
          <CardDescription>
            Multiple ways to get support based on your preference and urgency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportOptions.map((option, index) => (
              <div key={index} className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex justify-center mb-3">
                  {option.icon}
                </div>
                <h4 className="font-medium mb-2">{option.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                <Button size="sm" onClick={option.action} className="w-full">
                  {option.title.includes('Chat') ? 'Start Chat' :
                   option.title.includes('Phone') ? 'Call Now' :
                   option.title.includes('Video') ? 'Schedule' : 'Contact'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community & Rewards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Community */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle>Advisor Success Network</CardTitle>
            </div>
            <CardDescription>
              Connect with 10,000+ advisors sharing strategies and referrals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">2.3K</div>
                <div className="text-sm text-muted-foreground">Monthly Referrals</div>
              </div>
            </div>
            <Button className="w-full gap-2">
              <ExternalLink className="h-4 w-4" />
              Join the Network
            </Button>
          </CardContent>
        </Card>

        {/* Rewards */}
        <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-accent" />
              <CardTitle>Rewards & Recognition</CardTitle>
            </div>
            <CardDescription>
              Earn credits, climb leaderboards, and get recognized for excellence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Current Rank</span>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Rising Star</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Referral Credits</span>
                <span className="font-medium">$250</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Next Milestone</span>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-medium">Top Performer</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2">
              <Trophy className="h-4 w-4" />
              View Leaderboard
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Base */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle>Knowledge Base & Training</CardTitle>
          </div>
          <CardDescription>
            Everything you need to master the platform and grow your practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Getting Started</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Platform Overview</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Client Import Guide</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">First Week Checklist</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Advanced Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Lead Scoring Mastery</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Proposal Automation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Compliance Setup</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Best Practices</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Client Communication</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Referral Strategies</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Practice Growth</a></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}