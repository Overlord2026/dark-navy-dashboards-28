import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlayCircle, Clock, Users, Star, ExternalLink, Shield } from 'lucide-react';

export const EnhancedVideoIntegration = () => {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showCompliance, setShowCompliance] = useState(false);

  const videos = [
    {
      id: 1,
      title: "Private Market Alpha Introduction",
      description: "Understanding private market opportunities for family offices",
      duration: "12:34",
      views: 2847,
      rating: 4.8,
      category: "Education",
      thumbnail: "/api/placeholder/320/180",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      requiresCompliance: true
    },
    {
      id: 2,
      title: "Direct Indexing Explained",
      description: "How direct indexing can optimize after-tax returns",
      duration: "8:45",
      views: 1923,
      rating: 4.6,
      category: "Strategy",
      thumbnail: "/api/placeholder/320/180", 
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      requiresCompliance: false
    },
    {
      id: 3,
      title: "Alternative Investment Due Diligence",
      description: "Our 47-point due diligence process explained",
      duration: "15:22",
      views: 3421,
      rating: 4.9,
      category: "Process",
      thumbnail: "/api/placeholder/320/180",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      requiresCompliance: true
    },
    {
      id: 4,
      title: "Fiduciary Advisor Consultation",
      description: "What to expect from your strategy session",
      duration: "6:18",
      views: 1556,
      rating: 4.7,
      category: "Process",
      thumbnail: "/api/placeholder/320/180",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      requiresCompliance: false
    }
  ];

  const handleVideoClick = (video: any) => {
    if (video.requiresCompliance) {
      setShowCompliance(true);
      setSelectedVideo(video);
    } else {
      setSelectedVideo(video);
    }
    
    // Track analytics
    console.log(`Video played: ${video.title}`);
    // In real implementation: analytics.track('video_played', { videoId: video.id, title: video.title });
  };

  const handleComplianceAccept = () => {
    setShowCompliance(false);
    // Video will play after compliance is acknowledged
  };

  const categories = [...new Set(videos.map(v => v.category))];

  return (
    <div className="space-y-8">
      {/* Video Categories */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="cursor-pointer">All Videos</Badge>
        {categories.map((category) => (
          <Badge key={category} variant="outline" className="cursor-pointer">
            {category}
          </Badge>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                   onClick={() => handleVideoClick(video)}>
                <PlayCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
              {video.requiresCompliance && (
                <div className="absolute top-2 left-2 bg-gold-premium text-primary text-xs px-2 py-1 rounded flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Gated
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-xs">{video.category}</Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                  {video.rating}
                </div>
              </div>
              <h4 className="font-semibold mb-2">{video.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {video.views.toLocaleString()} views
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {video.duration}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Video Player Modal */}
      <Dialog open={!!selectedVideo && !showCompliance} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              src={selectedVideo?.embedUrl}
              title={selectedVideo?.title}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
          <div className="flex justify-between items-center pt-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {selectedVideo?.views.toLocaleString()} views
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 fill-current text-yellow-500" />
                {selectedVideo?.rating} rating
              </div>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-1" />
              Watch on YouTube
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Compliance Modal */}
      <Dialog open={showCompliance} onOpenChange={setShowCompliance}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold-dark" />
              Important Investment Disclosure
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gold-premium/10 p-4 rounded-lg border border-gold-premium/20">
              <h4 className="font-semibold mb-2 text-gold-dark">Educational Content Notice</h4>
              <p className="text-sm text-muted-foreground">
                This video contains information about investment strategies and opportunities. 
                This content is for educational purposes only and does not constitute investment advice.
              </p>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Before proceeding, please acknowledge:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Investment strategies discussed may not be suitable for all investors</li>
                <li>Past performance does not guarantee future results</li>
                <li>All investments carry risk of loss</li>
                <li>You should consult with a qualified advisor before making investment decisions</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleComplianceAccept}
                className="bg-gold-premium text-primary hover:bg-gold-dark"
              >
                I Understand - Continue to Video
              </Button>
              <Button variant="outline" onClick={() => setShowCompliance(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Analytics Summary */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Video Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gold-dark">
                {videos.reduce((sum, v) => sum + v.views, 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Views</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {(videos.reduce((sum, v) => sum + v.rating, 0) / videos.length).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Avg Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">{videos.length}</div>
              <div className="text-xs text-muted-foreground">Total Videos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold-dark">
                {Math.round(videos.reduce((sum, v) => {
                  const [min, sec] = v.duration.split(':').map(Number);
                  return sum + min + (sec / 60);
                }, 0))}m
              </div>
              <div className="text-xs text-muted-foreground">Total Runtime</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};