import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Mic, 
  Video, 
  Upload, 
  MessageSquare, 
  Play, 
  Pause,
  ChevronRight,
  Sparkles,
  Users,
  Calendar
} from 'lucide-react';
import { VaultWatermark } from './VaultWatermark';
import { PatentPendingBadge } from './PatentPendingBadge';

interface TrainingSession {
  id: string;
  title: string;
  description: string;
  questions: string[];
  completed: boolean;
  progress: number;
}

export function LegacyCopilotAvatar() {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [avatarMessage, setAvatarMessage] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');

  const trainingSessions: TrainingSession[] = [
    {
      id: 'life-story',
      title: 'Life Story & Background',
      description: 'Share your personal journey, childhood, and formative experiences',
      questions: [
        'Tell me about your childhood and where you grew up',
        'What were the most important lessons from your parents?',
        'Describe a challenge you overcame that shaped who you are',
        'What are you most proud of in your life?'
      ],
      completed: false,
      progress: 0
    },
    {
      id: 'family-values',
      title: 'Family Values & Traditions',
      description: 'Record your family\'s core values and important traditions',
      questions: [
        'What values are most important to pass down to future generations?',
        'Tell me about a family tradition that means a lot to you',
        'How do you want your family to remember you?',
        'What advice would you give to your great-grandchildren?'
      ],
      completed: false,
      progress: 25
    },
    {
      id: 'business-wisdom',
      title: 'Business & Professional Wisdom',
      description: 'Share your professional insights and business philosophy',
      questions: [
        'What are the most important business lessons you\'ve learned?',
        'How do you approach making difficult decisions?',
        'What would you tell someone starting their career?',
        'Describe your leadership philosophy'
      ],
      completed: false,
      progress: 0
    },
    {
      id: 'financial-philosophy',
      title: 'Financial Philosophy & Wealth',
      description: 'Record your approach to money, investing, and financial stewardship',
      questions: [
        'What\'s your philosophy about money and wealth?',
        'How should the family approach charitable giving?',
        'What are the most important financial lessons?',
        'How do you want your wealth to impact future generations?'
      ],
      completed: false,
      progress: 0
    }
  ];

  const sampleInteractions = [
    {
      question: "Grandpa, how did you start the family business?",
      response: "It all started in 1952 when I saw an opportunity that others missed. I had saved $500 from my job at the factory, and I noticed that people in our neighborhood needed..."
    },
    {
      question: "What advice would you give me about marriage?",
      response: "The secret to a lasting marriage isn't finding the perfect person—it's becoming the right partner. Your grandmother and I learned that communication, respect, and..."
    },
    {
      question: "Tell me about our family's most important values",
      response: "Our family has always believed in three core principles: integrity above all else, the importance of education, and taking care of those less fortunate..."
    }
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    // In a real implementation, this would start audio/video recording
    setTimeout(() => setIsRecording(false), 3000); // Simulate recording
  };

  const handleAskAvatar = () => {
    if (avatarMessage.trim()) {
      // Simulate AI response
      setCurrentResponse("I understand you're asking about " + avatarMessage + ". Based on my training, here's what I would share...");
      setAvatarMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-navy-dark relative">
      <VaultWatermark opacity={0.05} position="bottom-right" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="h-12 w-12 text-gold" />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Legacy Copilot™ AI Avatar
                </h1>
                <p className="text-white/80">
                  Train your AI to share your wisdom across generations
                </p>
              </div>
            </div>
            <PatentPendingBadge />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Training Sessions */}
            <div className="lg:col-span-2">
              <Card className="border-gold/20 bg-card/95 backdrop-blur-sm mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-gold" />
                    Training Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trainingSessions.map((session) => (
                      <Card 
                        key={session.id}
                        className={`cursor-pointer transition-all hover:border-gold/40 ${
                          selectedSession === session.id ? 'border-gold/60 bg-gold/5' : ''
                        }`}
                        onClick={() => setSelectedSession(session.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold flex items-center gap-2">
                                {session.title}
                                {session.completed && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Complete
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {session.description}
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progress</span>
                              <span>{session.progress}%</span>
                            </div>
                            <Progress value={session.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartRecording();
                              }}
                              className="border-gold/30 text-gold hover:bg-gold/10"
                            >
                              <Mic className="h-4 w-4 mr-1" />
                              Record Audio
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-gold/30 text-gold hover:bg-gold/10"
                            >
                              <Video className="h-4 w-4 mr-1" />
                              Record Video
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-gold/30 text-gold hover:bg-gold/10"
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Upload File
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recording Interface */}
              {isRecording && (
                <Card className="border-red-300 bg-red-50/90 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="animate-pulse bg-red-500 rounded-full h-3 w-3"></div>
                      <span className="font-semibold text-red-700">Recording in Progress</span>
                    </div>
                    <p className="text-red-600 mb-4">
                      Share your thoughts and experiences. Your avatar is learning from every word.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsRecording(false)}
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Stop Recording
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Avatar Interaction */}
            <div className="space-y-6">
              <Card className="border-gold/20 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-gold" />
                    Test Your Avatar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Ask your avatar a question:
                    </label>
                    <Textarea
                      placeholder="e.g., Tell me about your childhood, or What's your advice about starting a business?"
                      value={avatarMessage}
                      onChange={(e) => setAvatarMessage(e.target.value)}
                      className="resize-none"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAskAvatar}
                    disabled={!avatarMessage.trim()}
                    className="w-full bg-gradient-to-r from-gold to-gold-light text-navy"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Ask Avatar
                  </Button>
                  
                  {currentResponse && (
                    <div className="p-4 bg-gold/10 border border-gold/20 rounded-lg">
                      <p className="text-sm font-medium text-gold mb-2">
                        Your Avatar responds:
                      </p>
                      <p className="text-sm">{currentResponse}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-gold/20 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Sample Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleInteractions.map((interaction, index) => (
                      <div key={index} className="space-y-2">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium text-primary">
                            "{interaction.question}"
                          </p>
                        </div>
                        <div className="p-3 bg-gold/10 border border-gold/20 rounded-lg">
                          <p className="text-sm">
                            {interaction.response}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gold/20 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Future Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Users className="h-5 w-5 text-gold" />
                      <div>
                        <p className="font-medium">Multi-Generational Chat</p>
                        <p className="text-xs text-muted-foreground">
                          Family members can have conversations with your avatar
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-gold" />
                      <div>
                        <p className="font-medium">Milestone Messages</p>
                        <p className="text-xs text-muted-foreground">
                          Automated responses for birthdays, graduations, etc.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Video className="h-5 w-5 text-gold" />
                      <div>
                        <p className="font-medium">Visual Avatar</p>
                        <p className="text-xs text-muted-foreground">
                          AI-generated video responses with your likeness
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}