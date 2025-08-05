import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface DemoVideoAutomationProps {
  userPersona: string;
  onCompletion?: () => void;
}

export const DemoVideoAutomation = ({ userPersona, onCompletion }: DemoVideoAutomationProps) => {
  const { toast } = useToast();
  const [completedVideos, setCompletedVideos] = React.useState<Set<string>>(new Set());

  const personaVideos = {
    advisor: [
      { id: 'advisor-intro', title: 'Elite Advisory Platform Tour', duration: '8:30', url: '#' },
      { id: 'advisor-matching', title: 'AI Client Matching System', duration: '12:15', url: '#' },
      { id: 'advisor-compliance', title: 'Compliance Dashboard Guide', duration: '6:45', url: '#' }
    ],
    cpa: [
      { id: 'cpa-intro', title: 'CPA Practice Management', duration: '9:20', url: '#' },
      { id: 'cpa-automation', title: 'Workflow Automation Setup', duration: '15:30', url: '#' },
      { id: 'cpa-integration', title: 'Family Office Integration', duration: '11:10', url: '#' }
    ],
    attorney: [
      { id: 'attorney-intro', title: 'Legal Services Platform', duration: '10:15', url: '#' },
      { id: 'attorney-docs', title: 'Document Library Access', duration: '7:45', url: '#' },
      { id: 'attorney-referrals', title: 'Referral Network Setup', duration: '9:30', url: '#' }
    ]
  };

  const handleVideoComplete = (videoId: string) => {
    setCompletedVideos(prev => new Set(prev).add(videoId));
    
    // Celebration animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast({
      title: "🎉 Video Completed!",
      description: "Great job! You're mastering the platform.",
    });

    // Track completion
    const completions = JSON.parse(localStorage.getItem('demo_completions') || '[]');
    completions.push({
      videoId,
      persona: userPersona,
      completedAt: new Date().toISOString()
    });
    localStorage.setItem('demo_completions', JSON.stringify(completions));

    onCompletion?.();
  };

  const videos = personaVideos[userPersona] || [];
  const completionRate = (completedVideos.size / videos.length) * 100;

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Play className="h-5 w-5" />
            Welcome Training Videos
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-sm text-blue-600">
              Progress: {completedVideos.size} of {videos.length} completed
            </div>
            <Badge variant="outline" className="border-blue-300">
              {Math.round(completionRate)}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-3">
                {completedVideos.has(video.id) ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Play className="h-5 w-5 text-blue-600" />
                )}
                <div>
                  <h4 className="font-medium">{video.title}</h4>
                  <p className="text-sm text-muted-foreground">{video.duration}</p>
                </div>
              </div>
              <Button
                variant={completedVideos.has(video.id) ? "outline" : "default"}
                onClick={() => handleVideoComplete(video.id)}
                disabled={completedVideos.has(video.id)}
              >
                {completedVideos.has(video.id) ? "Completed" : "Watch"}
              </Button>
            </div>
          ))}
          
          {completionRate === 100 && (
            <div className="text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <Award className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                🎉 Training Complete!
              </h3>
              <p className="text-amber-700">
                You've mastered the platform fundamentals. Ready to excel!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};