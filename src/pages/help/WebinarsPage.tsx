import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Users, PlayCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function WebinarsPage() {
  const navigate = useNavigate();

  const upcomingWebinars = [
    {
      id: 1,
      title: "2024 Tax Planning Strategies for High-Net-Worth Families",
      date: "2024-02-15",
      time: "2:00 PM EST",
      duration: "60 minutes",
      presenter: "Sarah Johnson, CPA",
      description: "Explore advanced tax strategies including trust structures, charitable giving, and international considerations.",
      attendees: 45,
      maxAttendees: 100,
      status: "upcoming"
    },
    {
      id: 2,
      title: "Estate Planning in a Digital Age",
      date: "2024-02-22", 
      time: "1:00 PM EST",
      duration: "45 minutes",
      presenter: "Michael Chen, J.D.",
      description: "Managing digital assets, cryptocurrency, and online accounts in estate planning.",
      attendees: 28,
      maxAttendees: 75,
      status: "upcoming"
    },
    {
      id: 3,
      title: "Family Office Investment Committee Best Practices",
      date: "2024-03-01",
      time: "3:00 PM EST", 
      duration: "90 minutes",
      presenter: "David Rodriguez, CFA",
      description: "Structure and optimize your family's investment decision-making process.",
      attendees: 18,
      maxAttendees: 50,
      status: "upcoming"
    }
  ];

  const pastWebinars = [
    {
      id: 4,
      title: "Maximizing Your Platform: Advanced Features Deep Dive",
      date: "2024-01-25",
      presenter: "Lisa Wang, Product Manager",
      duration: "55 minutes",
      views: 127,
      recording: true
    },
    {
      id: 5,
      title: "2023 Year-End Financial Review Strategies", 
      date: "2023-12-15",
      presenter: "Robert Kim, CFP",
      duration: "70 minutes",
      views: 203,
      recording: true
    },
    {
      id: 6,
      title: "Cybersecurity for Family Offices",
      date: "2023-11-30",
      presenter: "Jennifer Torres, CISSP",
      duration: "50 minutes", 
      views: 156,
      recording: true
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Educational Webinars</h1>
            <p className="text-xl text-muted-foreground">
              Expert insights on wealth management, tax planning, and family office operations
            </p>
          </div>

          {/* Upcoming Webinars */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Upcoming Webinars</h2>
            <div className="space-y-4">
              {upcomingWebinars.map((webinar) => (
                <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{webinar.title}</h3>
                          <p className="text-muted-foreground">{webinar.description}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(webinar.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {webinar.time} ({webinar.duration})
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {webinar.attendees}/{webinar.maxAttendees} registered
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium">Presenter: {webinar.presenter}</p>
                        </div>
                      </div>

                      <div className="lg:w-48 flex flex-col gap-3">
                        <Badge className="w-fit">
                          {Math.ceil((new Date(webinar.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </Badge>
                        <Button className="w-full">
                          Register Now
                        </Button>
                        <Button variant="outline" className="w-full">
                          Add to Calendar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Past Webinars / Recordings */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Webinar Recordings</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastWebinars.map((webinar) => (
                <Card key={webinar.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative">
                        <PlayCircle className="h-12 w-12 text-gray-400" />
                        <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                          {webinar.duration}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold line-clamp-2">{webinar.title}</h3>
                        <p className="text-sm text-muted-foreground">{webinar.presenter}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{new Date(webinar.date).toLocaleDateString()}</span>
                          <span>{webinar.views} views</span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Watch Recording
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Webinar Series Info */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Monthly Webinar Series</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join us every month for expert-led sessions covering the latest trends and strategies 
                  in wealth management, tax planning, and family office operations.
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button>
                    Subscribe to Series
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Request Topic
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardContent className="pt-6 text-center">
              <h3 className="font-semibold mb-2">Questions About Our Webinars?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Contact our education team or suggest topics for future sessions
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm">Contact Education Team</Button>
                <Button variant="outline" size="sm">Suggest a Topic</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}