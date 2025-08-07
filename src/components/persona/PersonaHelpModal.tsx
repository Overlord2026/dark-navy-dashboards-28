import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  X, 
  CheckCircle, 
  Users, 
  Building, 
  Heart,
  TrendingUp,
  Calculator,
  Scale
} from 'lucide-react';
import { PersonaCardData } from '@/pages/PersonaLandingPage';

interface PersonaHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  personas: PersonaCardData[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: Array<{
    text: string;
    personaIds: string[];
    icon?: React.ComponentType<any>;
  }>;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'primary-goal',
    question: 'What best describes your primary goal?',
    options: [
      {
        text: 'Manage my family\'s wealth and health',
        personaIds: ['family'],
        icon: Users
      },
      {
        text: 'Grow my professional practice',
        personaIds: ['advisor', 'accountant', 'attorney', 'insurance', 'healthcare', 'realtor', 'coach'],
        icon: Building
      },
      {
        text: 'Share expertise and build community',
        personaIds: ['influencer', 'healthcare'],
        icon: Heart
      },
      {
        text: 'Oversee systems and compliance',
        personaIds: ['admin'],
        icon: CheckCircle
      }
    ]
  },
  {
    id: 'professional-focus',
    question: 'If you\'re a professional, what\'s your focus area?',
    options: [
      {
        text: 'Financial planning and investments',
        personaIds: ['advisor'],
        icon: TrendingUp
      },
      {
        text: 'Tax preparation and accounting',
        personaIds: ['accountant'],
        icon: Calculator
      },
      {
        text: 'Legal services and estate planning',
        personaIds: ['attorney'],
        icon: Scale
      },
      {
        text: 'Insurance and Medicare',
        personaIds: ['insurance'],
        icon: Users
      },
      {
        text: 'Healthcare and wellness',
        personaIds: ['healthcare'],
        icon: Heart
      },
      {
        text: 'Real estate and property',
        personaIds: ['realtor'],
        icon: Building
      },
      {
        text: 'Coaching and consulting',
        personaIds: ['coach'],
        icon: Users
      },
      {
        text: 'Not applicable - I\'m a client/family',
        personaIds: ['family'],
        icon: Users
      }
    ]
  }
];

export const PersonaHelpModal: React.FC<PersonaHelpModalProps> = ({
  isOpen,
  onClose,
  personas
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  const handleOptionSelect = (option: any) => {
    // Add the persona IDs from this selection
    const newPersonaIds = [...new Set([...selectedPersonaIds, ...option.personaIds])];
    setSelectedPersonaIds(newPersonaIds);

    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const getRecommendedPersonas = () => {
    if (selectedPersonaIds.length === 0) return personas.slice(0, 3);
    
    return personas.filter(persona => 
      selectedPersonaIds.includes(persona.id)
    ).sort((a, b) => {
      // Sort by featured first, then alphabetically
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.title.localeCompare(b.title);
    });
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedPersonaIds([]);
    setShowResults(false);
  };

  const handlePersonaSelect = (persona: PersonaCardData) => {
    // Store persona context in localStorage
    localStorage.setItem('selectedPersona', persona.id);
    localStorage.setItem('personaData', JSON.stringify(persona));
    
    // Close modal and let parent handle navigation
    onClose();
    
    // Navigate directly
    window.location.href = persona.route;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-foreground flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-gold" />
            Find Your Perfect Experience
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Answer a few quick questions to find the experience that best fits your needs.
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gold h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                {currentQuestion.question}
              </h3>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const IconComponent = option.icon;
                
                return (
                  <Card
                    key={index}
                    className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-border/50 bg-card/50"
                    onClick={() => handleOptionSelect(option)}
                  >
                    <CardContent className="p-6 text-center space-y-3">
                      {IconComponent && (
                        <div className="mx-auto w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-gold" />
                        </div>
                      )}
                      <p className="font-medium text-foreground leading-relaxed">
                        {option.text}
                      </p>
                      <ArrowRight className="h-4 w-4 mx-auto text-muted-foreground" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">
                Perfect! Here are your recommended experiences:
              </h3>
              <p className="text-muted-foreground">
                Based on your answers, these options will serve you best.
              </p>
            </div>

            {/* Recommended Personas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getRecommendedPersonas().map((persona) => {
                const IconComponent = persona.icon;
                
                return (
                  <Card
                    key={persona.id}
                    className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-border/50 bg-card/50"
                    onClick={() => handlePersonaSelect(persona)}
                  >
                    {persona.featured && (
                      <Badge className="absolute top-3 right-3 bg-gold text-navy text-xs">
                        Recommended
                      </Badge>
                    )}
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gold/10">
                          <IconComponent className="h-6 w-6 text-gold" />
                        </div>
                        <CardTitle className="text-lg font-serif text-foreground">
                          {persona.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 space-y-3">
                      <CardDescription className="text-foreground/80 text-sm line-clamp-3">
                        {persona.description}
                      </CardDescription>
                      
                      <Button 
                        className="w-full bg-gold text-navy hover:bg-gold/90 transition-all font-semibold"
                        size="sm"
                      >
                        {persona.ctaText}
                        <ArrowRight className="h-3 w-3 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Reset Quiz */}
            <div className="text-center pt-4">
              <Button
                variant="ghost"
                onClick={resetQuiz}
                className="text-muted-foreground hover:text-gold"
              >
                Start over
              </Button>
            </div>
          </div>
        )}

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};