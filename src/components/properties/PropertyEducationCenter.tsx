import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Video, 
  FileText, 
  MessageCircle,
  Calendar,
  ExternalLink,
  GraduationCap
} from "lucide-react";

export const PropertyEducationCenter: React.FC = () => {
  const educationResources = [
    {
      id: '1',
      title: 'FSBO vs Professional Listing',
      type: 'guide',
      description: 'Complete guide to selling your property yourself vs hiring a professional',
      duration: '10 min read',
      category: 'Selling'
    },
    {
      id: '2',
      title: 'Real Estate Investment Analysis',
      type: 'webinar',
      description: 'Learn how to analyze cash flow, cap rates, and ROI for investment properties',
      duration: '45 min',
      category: 'Investing'
    },
    {
      id: '3',
      title: 'Property Market Trends 2024',
      type: 'video',
      description: 'Expert insights on current market conditions and forecasts',
      duration: '20 min',
      category: 'Market Analysis'
    },
    {
      id: '4',
      title: 'Tax Implications of Real Estate',
      type: 'guide',
      description: 'Understanding depreciation, 1031 exchanges, and tax strategies',
      duration: '15 min read',
      category: 'Tax Planning'
    }
  ];

  const upcomingWebinars = [
    {
      id: '1',
      title: 'Family Office Real Estate Strategies',
      date: '2024-03-15',
      time: '2:00 PM EST',
      presenter: 'Sarah Johnson, CFA'
    },
    {
      id: '2',
      title: 'Property Management Best Practices',
      date: '2024-03-22',
      time: '1:00 PM EST',
      presenter: 'Michael Chen, CCIM'
    }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'guide': return FileText;
      case 'video': return Video;
      case 'webinar': return GraduationCap;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Selling': 'bg-blue-100 text-blue-800',
      'Investing': 'bg-green-100 text-green-800',
      'Market Analysis': 'bg-purple-100 text-purple-800',
      'Tax Planning': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Education Center</h2>
        <p className="text-muted-foreground">
          Expert resources to help you make informed real estate decisions
        </p>
      </div>

      {/* Quick Help */}
      <Card className="bg-gradient-subtle border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Need Expert Help?</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with a real estate concierge for personalized guidance
                </p>
              </div>
            </div>
            <Button className="bg-gradient-primary">
              Start Chat
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Educational Resources */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Educational Resources
              </CardTitle>
              <CardDescription>
                Guides, videos, and tools to help you succeed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {educationResources.map((resource) => {
                  const IconComponent = getResourceIcon(resource.type);
                  return (
                    <div key={resource.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {resource.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge className={getCategoryColor(resource.category)}>
                                {resource.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {resource.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Webinars */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Webinars
              </CardTitle>
              <CardDescription>
                Live sessions with industry experts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingWebinars.map((webinar) => (
                  <div key={webinar.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{webinar.title}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {webinar.date} at {webinar.time}
                      </div>
                      <p>Presented by {webinar.presenter}</p>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Register
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Download Listing Checklist
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Video className="h-4 w-4 mr-2" />
                Property Photo Tips
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Market Analysis Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};