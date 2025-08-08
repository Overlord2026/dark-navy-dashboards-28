import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventTracking } from '@/hooks/useEventTracking';
import {
  ArrowLeft,
  Play,
  Pause,
  Download,
  CheckCircle,
  Clock,
  FileText,
  Video,
  Wrench,
  HelpCircle,
  Award,
  ArrowRight
} from 'lucide-react';

interface CourseContent {
  id: string;
  title: string;
  description: string;
  duration: string;
  videos: {
    intro: string;
    content: string[];
  };
  tools: {
    name: string;
    type: 'calculator' | 'checklist' | 'planner' | 'assessment';
    url: string;
  }[];
  downloadables: string[];
  quiz: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correct: number;
    }>;
    passThreshold: number;
  };
  scenarios: Array<{
    id: string;
    title: string;
    description: string;
    choices: Array<{
      text: string;
      outcome: string;
      isOptimal: boolean;
    }>;
  }>;
}

// Mock course content - in real app, this would come from API
const mockCourseContent: { [key: string]: CourseContent } = {
  'intro': {
    id: 'intro',
    title: 'Introduction to Athlete Financial Wellness',
    description: 'Foundation of financial literacy for professional athletes',
    duration: '45 min',
    videos: {
      intro: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: [
        'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'https://www.youtube.com/embed/dQw4w9WgXcQ'
      ]
    },
    tools: [
      {
        name: 'Athlete Readiness Self-Check',
        type: 'assessment',
        url: '/tools/readiness-check'
      },
      {
        name: 'Goal Setting Worksheet',
        type: 'planner',
        url: '/tools/goal-setting'
      }
    ],
    downloadables: [
      'Athlete Financial Wellness Guide.pdf',
      'Quick Reference Sheet.pdf'
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'What percentage of professional athletes face financial difficulties within 5 years of retirement?',
          options: ['20%', '40%', '60%', '80%'],
          correct: 2
        },
        {
          id: 'q2',
          question: 'Which is the most important first step in financial planning for athletes?',
          options: ['Buying insurance', 'Creating a budget', 'Investing in stocks', 'Buying real estate'],
          correct: 1
        },
        {
          id: 'q3',
          question: 'What should be your primary focus during your first professional contract?',
          options: ['Maximizing lifestyle', 'Building emergency fund', 'Buying luxury items', 'Investing everything'],
          correct: 1
        },
        {
          id: 'q4',
          question: 'How much of your income should you save during peak earning years?',
          options: ['10%', '20%', '30%', '50%+'],
          correct: 3
        },
        {
          id: 'q5',
          question: 'What is the most common financial mistake athletes make?',
          options: ['Not investing', 'Overspending', 'Bad investments', 'Poor tax planning'],
          correct: 1
        }
      ],
      passThreshold: 80
    },
    scenarios: [
      {
        id: 's1',
        title: 'First Contract Decision',
        description: 'You just signed a $4M contract over 4 years. What\'s your first financial move?',
        choices: [
          {
            text: 'Buy a luxury car and celebrate',
            outcome: 'This depletes your savings and creates ongoing expenses. Not optimal for long-term wealth.',
            isOptimal: false
          },
          {
            text: 'Set aside 6 months of expenses as emergency fund',
            outcome: 'Excellent choice! This provides financial security and peace of mind.',
            isOptimal: true
          },
          {
            text: 'Invest everything in cryptocurrency',
            outcome: 'High risk strategy that could lead to significant losses. Better to diversify.',
            isOptimal: false
          },
          {
            text: 'Buy real estate immediately',
            outcome: 'Real estate can be good, but you need liquidity first. Build your foundation.',
            isOptimal: false
          }
        ]
      }
    ]
  }
};

export default function CourseViewer() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { trackEvent } = useEventTracking();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [videoProgress, setVideoProgress] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [courseProgress, setCourseProgress] = useState(0);

  const course = courseId ? mockCourseContent[courseId] : null;

  useEffect(() => {
    if (course) {
      trackEvent('course', 'progress', { courseId: course.id, progress: courseProgress });
    }
  }, [course, courseProgress, trackEvent]);

  const handleQuizSubmit = () => {
    if (!course) return;

    const totalQuestions = course.quiz.questions.length;
    const correctAnswers = course.quiz.questions.reduce((count, question) => {
      return quizAnswers[question.id] === question.correct ? count + 1 : count;
    }, 0);

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    setQuizScore(score);
    
    trackEvent('quiz', 'attempt', { courseId: course.id, score });

    if (score >= course.quiz.passThreshold) {
      setCourseProgress(100);
    }
  };

  const handleToolClick = (toolName: string, toolUrl: string) => {
    trackEvent('tool', 'use', { toolName });
    // In real app, this would open the tool
    console.log(`Opening tool: ${toolName} at ${toolUrl}`);
  };

  const handleDownload = (filename: string) => {
    // In real app, this would trigger download
    console.log(`Downloading: ${filename}`);
  };

  const handleScenarioChoice = (scenarioId: string, choiceIndex: number) => {
    // Track scenario interaction
    console.log(`Scenario ${scenarioId}, choice ${choiceIndex}`);
  };

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
            <Button onClick={() => navigate('/courses/athlete')}>
              Back to Athlete Center
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/courses/athlete')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Center
            </Button>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Progress: {courseProgress}%
              </div>
              <Progress value={courseProgress} className="w-32" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {course.duration}
            </Badge>
            {courseProgress === 100 && (
              <Badge variant="default" className="flex items-center gap-1 bg-green-500">
                <CheckCircle className="h-3 w-3" />
                Completed
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {course.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {course.description}
          </p>
        </div>

        {/* Course Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Introduction Video
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <Play className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Course Introduction</p>
                      </div>
                    </div>
                    <Button onClick={() => setActiveTab('videos')}>
                      Watch All Videos
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Objectives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        Understand fundamental financial principles for athletes
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        Learn to create a personal financial action plan
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        Recognize common financial pitfalls and how to avoid them
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        Build confidence in financial decision-making
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Interactive Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {course.tools.map((tool) => (
                      <Button
                        key={tool.name}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleToolClick(tool.name, tool.url)}
                      >
                        <Wrench className="h-4 w-4 mr-2" />
                        {tool.name}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Downloads
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {course.downloadables.map((file) => (
                      <Button
                        key={file}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleDownload(file)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {file}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Videos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Introduction</h3>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Play className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Introduction Video</p>
                      </div>
                    </div>
                  </div>

                  {course.videos.content.map((video, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-semibold mb-3">
                        Part {index + 1}: Content Module
                      </h3>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Play className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">Content Video {index + 1}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.tools.map((tool) => (
                <Card key={tool.name} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      {tool.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Interactive {tool.type} to help you apply course concepts
                    </p>
                    <Button 
                      onClick={() => handleToolClick(tool.name, tool.url)}
                      className="w-full"
                    >
                      Open Tool
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scenarios">
            <div className="space-y-6">
              {course.scenarios.map((scenario) => (
                <Card key={scenario.id}>
                  <CardHeader>
                    <CardTitle>{scenario.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{scenario.description}</p>
                    
                    <div className="space-y-3">
                      {scenario.choices.map((choice, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full text-left h-auto p-4"
                          onClick={() => handleScenarioChoice(scenario.id, index)}
                        >
                          {choice.text}
                        </Button>
                      ))}
                    </div>

                    {selectedScenario === scenario.id && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">Outcome:</h4>
                        <p className="text-sm">Click on a choice to see the outcome and learn from the scenario.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Course Quiz
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {course.quiz.questions.length} questions • {course.quiz.passThreshold}% to pass
                    </p>
                  </div>
                  {quizScore !== null && (
                    <Badge 
                      variant={quizScore >= course.quiz.passThreshold ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {quizScore >= course.quiz.passThreshold ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <HelpCircle className="h-3 w-3" />
                      )}
                      Score: {quizScore}%
                    </Badge>
                  )}
                </div>

                {course.quiz.questions.map((question, index) => (
                  <div key={question.id} className="space-y-3">
                    <h3 className="font-semibold">
                      {index + 1}. {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <Button
                          key={optionIndex}
                          variant={quizAnswers[question.id] === optionIndex ? "default" : "outline"}
                          className="w-full text-left justify-start"
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [question.id]: optionIndex }))}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}

                <Button 
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length < course.quiz.questions.length}
                  className="w-full"
                  size="lg"
                >
                  Submit Quiz
                </Button>

                {quizScore !== null && quizScore >= course.quiz.passThreshold && (
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <Award className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Congratulations!
                    </h3>
                    <p className="text-green-700">
                      You've successfully completed this course. Your certificate is being generated.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}