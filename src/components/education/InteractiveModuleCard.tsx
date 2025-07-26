import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Award, 
  Play, 
  Download, 
  BookOpen, 
  CheckCircle2, 
  Star,
  Quote,
  Calendar,
  Users,
  Shield,
  Mail
} from "lucide-react";
import { EducationalResource } from "@/types/education";
import { toast } from "sonner";

interface InteractiveModuleCardProps {
  resource: EducationalResource;
  progress?: number;
  isCompleted?: boolean;
  testimonial?: {
    quote: string;
    author: string;
    location: string;
    year: string;
  };
  onEnroll?: () => void;
  onSaveByEmail?: () => void;
  showInteractiveElements?: boolean;
}

export const InteractiveModuleCard = ({
  resource,
  progress = 0,
  isCompleted = false,
  testimonial,
  onEnroll,
  onSaveByEmail,
  showInteractiveElements = true
}: InteractiveModuleCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showKnowledgeCheck, setShowKnowledgeCheck] = useState(false);
  const [knowledgeScore, setKnowledgeScore] = useState<number | null>(null);

  const handleStartModule = () => {
    if (onEnroll) {
      onEnroll();
    } else {
      window.open(resource.ghlUrl, '_blank');
    }
    toast.success(`Starting: ${resource.title}`);
  };

  const handleSaveByEmail = () => {
    if (onSaveByEmail) {
      onSaveByEmail();
    } else {
      toast.success("PDF guide will be sent to your email shortly");
    }
  };

  const handleKnowledgeCheck = () => {
    setShowKnowledgeCheck(true);
  };

  const completeKnowledgeCheck = (score: number) => {
    setKnowledgeScore(score);
    setShowKnowledgeCheck(false);
    toast.success(`Great job! You scored ${score}% on the knowledge check.`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`h-full transition-all duration-300 ${
          isHovered ? 'shadow-lg border-primary/50' : 'hover:shadow-md'
        } ${isCompleted ? 'ring-1 ring-green-500/20 bg-green-50/5' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="space-y-4">
          {/* Status and Level Badges */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={resource.isPaid ? "default" : "secondary"}>
                {resource.isPaid ? "Premium" : "Free"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {resource.level}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {knowledgeScore && (
                <Badge variant="outline" className="text-xs bg-green-50">
                  Quiz: {knowledgeScore}%
                </Badge>
              )}
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {resource.description}
            </CardDescription>
          </div>

          {/* Progress Bar (if in progress) */}
          {progress > 0 && progress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Module Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {resource.duration}
            </div>
            {resource.author && (
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                {resource.author}
              </div>
            )}
          </div>

          {/* Testimonial Section */}
          {testimonial && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-muted/30 rounded-lg p-4 space-y-3"
            >
              <Quote className="h-4 w-4 text-primary" />
              <blockquote className="text-sm italic text-foreground">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>— {testimonial.author}</span>
                <span>{testimonial.location}, {testimonial.year}</span>
              </div>
            </motion.div>
          )}

          {/* Interactive Elements */}
          {showInteractiveElements && (
            <div className="space-y-3">
              {/* Primary Action */}
              <Button 
                className="w-full"
                onClick={handleStartModule}
                disabled={isCompleted && progress === 100}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Completed
                  </>
                ) : progress > 0 ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Module
                  </>
                )}
              </Button>

              {/* Secondary Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleSaveByEmail}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Get PDF
                </Button>
                
                {isCompleted && (
                  <Dialog open={showKnowledgeCheck} onOpenChange={setShowKnowledgeCheck}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Star className="h-4 w-4 mr-1" />
                        Quiz
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Knowledge Check</DialogTitle>
                        <DialogDescription>
                          Test your understanding of the key concepts from this module.
                        </DialogDescription>
                      </DialogHeader>
                      <KnowledgeCheckComponent 
                        moduleTitle={resource.title}
                        onComplete={completeKnowledgeCheck}
                      />
                    </DialogContent>
                  </Dialog>
                )}

                {!isCompleted && progress > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleKnowledgeCheck}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Check
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Fiduciary Notice */}
          <div className="text-xs text-muted-foreground flex items-center gap-2 pt-2 border-t border-border">
            <Shield className="h-3 w-3 text-primary" />
            <span>No sales agenda—real education by CFP® professionals</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Knowledge Check Component
const KnowledgeCheckComponent = ({ 
  moduleTitle, 
  onComplete 
}: { 
  moduleTitle: string;
  onComplete: (score: number) => void;
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  
  // Sample questions - in real implementation, these would be module-specific
  const questions = [
    {
      question: "What is the most important factor when selecting a financial advisor?",
      options: [
        "Lowest fees",
        "Fiduciary standard",
        "Highest returns promised",
        "Biggest firm"
      ],
      correct: 1
    },
    {
      question: "How often should you review your family governance structure?",
      options: [
        "Never, once set",
        "Every 10 years",
        "Every 3-5 years",
        "Monthly"
      ],
      correct: 2
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correct = newAnswers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correct ? 1 : 0);
      }, 0);
      const score = Math.round((correct / questions.length) * 100);
      onComplete(score);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(((currentQuestion) / questions.length) * 100)}% Complete</span>
        </div>
        
        <Progress value={(currentQuestion / questions.length) * 100} />
        
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">{questions[currentQuestion].question}</h3>
          
          <div className="space-y-2">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => handleAnswer(index)}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};