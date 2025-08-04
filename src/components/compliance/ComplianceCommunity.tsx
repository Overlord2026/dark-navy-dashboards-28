import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  Star, 
  TrendingUp,
  Plus,
  Bell
} from 'lucide-react';

export const ComplianceCommunity: React.FC = () => {
  const forumPosts = [
    {
      id: 1,
      title: 'New SEC Marketing Rule Clarifications',
      author: 'Sarah Chen, CCO',
      company: 'Heritage Wealth Management',
      replies: 12,
      likes: 8,
      time: '2 hours ago',
      tag: 'SEC',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Best Practices for CCPA Compliance in 2024',
      author: 'Mike Rodriguez',
      company: 'Pacific Advisory Group',
      replies: 7,
      likes: 15,
      time: '5 hours ago',
      tag: 'Privacy',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'AML Training Program Recommendations',
      author: 'Jennifer Walsh, CCO',
      company: 'Northern Trust Partners',
      replies: 9,
      likes: 11,
      time: '1 day ago',
      tag: 'Training',
      priority: 'medium'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Monthly CCO Roundtable',
      date: '2024-02-15',
      time: '2:00 PM EST',
      type: 'Virtual',
      attendees: 45,
      host: 'Compliance Network'
    },
    {
      id: 2,
      title: 'SEC Update Webinar',
      date: '2024-02-20',
      time: '1:00 PM EST',
      type: 'Webinar',
      attendees: 120,
      host: 'RegTech Solutions'
    },
    {
      id: 3,
      title: 'FINRA Exam Prep Workshop',
      date: '2024-02-25',
      time: '10:00 AM EST',
      type: 'Workshop',
      attendees: 30,
      host: 'Compliance Academy'
    }
  ];

  const marketplaceProviders = [
    {
      id: 1,
      name: 'RegTech Solutions',
      service: 'Compliance Software',
      rating: 4.8,
      reviews: 24,
      specialties: ['Document Management', 'Audit Trails', 'Reporting']
    },
    {
      id: 2,
      name: 'Compliance Experts LLC',
      service: 'Fractional CCO Services',
      rating: 4.9,
      reviews: 18,
      specialties: ['SEC Compliance', 'Policy Development', 'Training']
    },
    {
      id: 3,
      name: 'AuditPro Services',
      service: 'Mock Examinations',
      rating: 4.7,
      reviews: 31,
      specialties: ['SEC Exams', 'FINRA Prep', 'Documentation Review']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">Compliance Community</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button size="sm" className="btn-primary-gold">
            <Plus className="h-4 w-4 mr-2" />
            Start Discussion
          </Button>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Discussions</p>
              </div>
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Events This Month</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Resources</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Discussions */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Recent Discussions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forumPosts.map((post) => (
              <div key={post.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{post.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.company}</span>
                      <span>•</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{post.tag}</Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.replies} replies</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{post.likes} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{event.time}</span>
                    <span>•</span>
                    <span>{event.attendees} attending</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Hosted by {event.host}</p>
                </div>
                
                <div className="flex gap-2">
                  <Badge variant="outline">{event.type}</Badge>
                  <Button size="sm" variant="outline">Register</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marketplace */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Compliance Provider Marketplace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketplaceProviders.map((provider) => (
              <Card key={provider.id} className="border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">{provider.name}</h4>
                      <p className="text-sm text-muted-foreground">{provider.service}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(provider.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {provider.rating} ({provider.reviews} reviews)
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {provider.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button size="sm" className="w-full" variant="outline">
                      View Profile
                    </Button>
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