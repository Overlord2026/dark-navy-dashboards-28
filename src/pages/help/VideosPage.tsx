import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, PlayCircle, Clock, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function VideosPage() {
  const navigate = useNavigate();

  const videoCategories = [
    "Getting Started",
    "Account Management", 
    "Financial Planning",
    "Tax Strategies",
    "Estate Planning",
    "Investment Tools"
  ];

  const videos = [
    {
      id: 1,
      title: "Platform Overview: Your First 5 Minutes",
      description: "A quick tour of the dashboard and key features",
      duration: "4:32",
      category: "Getting Started",
      thumbnail: "/placeholder.svg",
      featured: true
    },
    {
      id: 2,
      title: "Connecting Your Bank Accounts Securely",
      description: "How to link accounts using Plaid and what data is shared",
      duration: "6:18",
      category: "Account Management",
      thumbnail: "/placeholder.svg",
      featured: false
    },
    {
      id: 3,
      title: "Setting Up Financial Goals",
      description: "Create and track retirement, education, and other goals",
      duration: "8:45",
      category: "Financial Planning",
      thumbnail: "/placeholder.svg",
      featured: true
    },
    {
      id: 4,
      title: "Tax Loss Harvesting Strategies",
      description: "Advanced tax optimization techniques for high-net-worth families",
      duration: "12:15",
      category: "Tax Strategies",
      thumbnail: "/placeholder.svg",
      featured: false
    },
    {
      id: 5,
      title: "Estate Planning Document Vault",
      description: "Organize and share estate planning documents securely",
      duration: "7:30",
      category: "Estate Planning",
      thumbnail: "/placeholder.svg",
      featured: false
    },
    {
      id: 6,
      title: "Portfolio Analysis Tools",
      description: "Understanding risk metrics and allocation reports",
      duration: "10:22",
      category: "Investment Tools",
      thumbnail: "/placeholder.svg",
      featured: true
    }
  ];

  const featuredVideos = videos.filter(v => v.featured);
  const allVideos = videos;

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
            <h1 className="text-4xl font-bold">Video Library</h1>
            <p className="text-xl text-muted-foreground">Learn at your own pace with our comprehensive tutorials</p>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search videos..." className="pl-10" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter by Category
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Featured Videos */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Featured Videos</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video bg-gray-100">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Button size="lg" className="rounded-full">
                        <PlayCircle className="h-8 w-8" />
                      </Button>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                      <Clock className="h-3 w-3 mr-1" />
                      {video.duration}
                    </Badge>
                  </div>
                  <CardContent className="pt-4">
                    <Badge variant="secondary" className="mb-2">{video.category}</Badge>
                    <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* All Videos by Category */}
          <section>
            <h2 className="text-2xl font-bold mb-4">All Videos</h2>
            <div className="space-y-6">
              {videoCategories.map((category) => {
                const categoryVideos = allVideos.filter(v => v.category === category);
                if (categoryVideos.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-3">{category}</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {categoryVideos.map((video) => (
                        <Card key={video.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="pt-4">
                            <div className="flex gap-3">
                              <div className="w-20 h-14 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                <PlayCircle className="h-6 w-6 text-gray-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{video.description}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {video.duration}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Support Note */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <h3 className="font-semibold mb-2">Can't find what you're looking for?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Request a specific tutorial or schedule a live demo with our team
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm">Request Tutorial</Button>
                <Button size="sm">Schedule Demo</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}