import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Clock, User, Star, Search, BookmarkPlus } from "lucide-react";

export const AnnuitiesVideosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const videos = [
    {
      id: 1,
      title: "Annuities 101: The Complete Beginner's Guide",
      description: "Learn the fundamentals of annuities, types available, and how they fit into retirement planning.",
      duration: "18:45",
      category: "Education",
      level: "Beginner",
      instructor: "Michael Chen, CFP",
      rating: 4.8,
      views: 12500,
      thumbnail: "/api/placeholder/400/225"
    },
    {
      id: 2,
      title: "Fixed vs Variable Annuities: Making the Right Choice",
      description: "Compare different annuity types and understand which might be best for your situation.",
      duration: "24:30",
      category: "Comparison",
      level: "Intermediate",
      instructor: "Sarah Williams, CFA",
      rating: 4.9,
      views: 8750,
      thumbnail: "/api/placeholder/400/225"
    },
    {
      id: 3,
      title: "Annuity Fee Analysis: What You Need to Know",
      description: "Deep dive into annuity fees, how to evaluate them, and questions to ask providers.",
      duration: "15:20",
      category: "Analysis",
      level: "Intermediate",
      instructor: "David Rodriguez, ChFC",
      rating: 4.7,
      views: 6200,
      thumbnail: "/api/placeholder/400/225"
    },
    {
      id: 4,
      title: "Tax Implications of Annuity Investments",
      description: "Understand the tax treatment of annuities and strategies for tax-efficient planning.",
      duration: "22:15",
      category: "Tax Planning",
      level: "Advanced",
      instructor: "Jennifer Park, CPA",
      rating: 4.9,
      views: 4800,
      thumbnail: "/api/placeholder/400/225"
    },
    {
      id: 5,
      title: "When to Annuitize: Timing Your Income Strategy",
      description: "Learn about annuitization options and how to time your income strategy effectively.",
      duration: "19:40",
      category: "Strategy",
      level: "Advanced",
      instructor: "Robert Kim, CLU",
      rating: 4.6,
      views: 3900,
      thumbnail: "/api/placeholder/400/225"
    },
    {
      id: 6,
      title: "Annuity Myths Debunked",
      description: "Separating fact from fiction about annuities and addressing common misconceptions.",
      duration: "16:55",
      category: "Education",
      level: "Beginner",
      instructor: "Lisa Thompson, CFP",
      rating: 4.8,
      views: 9100,
      thumbnail: "/api/placeholder/400/225"
    }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || video.category.toLowerCase() === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Annuities Video Library</h1>
        <p className="text-muted-foreground">
          Expert-led educational videos on annuities and retirement planning
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="comparison">Comparison</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="tax planning">Tax Planning</SelectItem>
                <SelectItem value="strategy">Strategy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button size="lg" className="rounded-full">
                  <Play className="h-6 w-6" />
                </Button>
              </div>
              <div className="absolute top-2 right-2">
                <Badge className={getLevelColor(video.level)}>
                  {video.level}
                </Badge>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                {video.duration}
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg leading-tight">{video.title}</CardTitle>
                <Button variant="ghost" size="sm">
                  <BookmarkPlus className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="line-clamp-2">
                {video.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <User className="h-3 w-3" />
                    {video.instructor}
                  </div>
                  <Badge variant="outline">{video.category}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {video.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    {video.views.toLocaleString()} views
                  </div>
                </div>
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No videos found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or category filter
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};