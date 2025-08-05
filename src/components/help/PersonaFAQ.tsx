import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, ThumbsUp, ThumbsDown, MessageCircle, Phone, Star } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  personas: string[];
  category: string;
  helpful_votes: number;
  not_helpful_votes: number;
  search_count: number;
}

interface PersonaFAQProps {
  userPersona: string;
  isVIP?: boolean;
}

export const PersonaFAQ = ({ userPersona, isVIP = false }: PersonaFAQProps) => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const personaFAQs = {
    advisor: {
      category: 'Advisory Services',
      questions: [
        {
          question: "How do I get matched with high-net-worth clients?",
          answer: "Our AI-powered matching system analyzes client needs, investment preferences, and geographic requirements to connect you with qualified prospects. Complete your profile with specializations, certifications, and minimum client thresholds to improve matching accuracy.",
          category: "Client Acquisition"
        },
        {
          question: "What compliance tools are available for advisors?",
          answer: "Access real-time compliance monitoring, automated reporting, document management, and regulatory update alerts. All tools are designed to meet SEC, FINRA, and state registration requirements.",
          category: "Compliance"
        },
        {
          question: "How do I access the VIP referral network?",
          answer: "VIP advisors gain access to exclusive high-value referrals from our partner network including CPAs, attorneys, and family offices. Maintain a 4.8+ rating and complete advanced certifications to qualify.",
          category: "VIP Benefits"
        }
      ]
    },
    cpa: {
      category: 'CPA Services',
      questions: [
        {
          question: "How do I set up automated client onboarding workflows?",
          answer: "Use our workflow builder to create custom onboarding sequences. Set up document requests, compliance checks, and engagement letter automation. Templates are available for different service types.",
          category: "Automation"
        },
        {
          question: "What family office integration features are available?",
          answer: "Connect with family office advisors for seamless client transitions, shared reporting, and collaborative tax planning. Access specialized family office tax tools and multi-generational planning resources.",
          category: "Integration"
        }
      ]
    },
    attorney: {
      category: 'Legal Services',
      questions: [
        {
          question: "How do I access the estate planning document library?",
          answer: "Browse our comprehensive library of estate planning templates, trust documents, and legal forms. All documents are state-specific and regularly updated for compliance.",
          category: "Documents"
        },
        {
          question: "What referral opportunities exist with family offices?",
          answer: "Partner with family offices for estate planning, trust administration, and succession planning. High-value referrals are available for qualified attorneys with relevant experience.",
          category: "Referrals"
        }
      ]
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [userPersona]);

  useEffect(() => {
    filterFAQs();
  }, [faqs, searchQuery, userPersona]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      
      // Use hardcoded persona FAQs for now since database types aren't updated
      const defaultFAQs = personaFAQs[userPersona]?.questions.map((faq, index) => ({
        id: `${userPersona}-${index}`,
        question: faq.question,
        answer: faq.answer,
        personas: [userPersona],
        category: faq.category,
        helpful_votes: 0,
        not_helpful_votes: 0,
        search_count: 0
      })) || [];
      
      setFaqs(defaultFAQs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      // Fallback to empty array
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterFAQs = () => {
    let filtered = faqs;
    
    if (searchQuery.trim()) {
      filtered = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Log search for analytics
      if (searchQuery.length > 2) {
        logFAQEvent('search', searchQuery, null);
      }
    }
    
    setFilteredFaqs(filtered);
  };

  const logFAQEvent = async (eventType: string, query: string | null, faqId: string | null) => {
    try {
      // Store analytics in localStorage for now
      const analytics = JSON.parse(localStorage.getItem('faq_analytics') || '[]');
      analytics.push({
        user_persona: userPersona,
        event_type: eventType,
        search_query: query,
        faq_id: faqId,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('faq_analytics', JSON.stringify(analytics));
    } catch (error) {
      console.error('Error logging FAQ event:', error);
    }
  };

  const handleVote = async (faqId: string, isHelpful: boolean) => {
    if (votedItems.has(faqId)) {
      toast({
        title: "Already voted",
        description: "You've already provided feedback for this item.",
      });
      return;
    }

    try {
      const column = isHelpful ? 'helpful_votes' : 'not_helpful_votes';
      
      // Update vote count locally
      setFaqs(prev => prev.map(faq => 
        faq.id === faqId 
          ? { ...faq, [column]: faq[column] + 1 }
          : faq
      ));
      
      setVotedItems(prev => new Set(prev).add(faqId));
      
      // Log vote
      await logFAQEvent(isHelpful ? 'helpful_vote' : 'not_helpful_vote', null, faqId);
      
      toast({
        title: "Thank you!",
        description: "Your feedback helps us improve our help center.",
      });
    } catch (error) {
      console.error('Error recording vote:', error);
    }
  };

  const getSupportOptions = () => {
    if (isVIP) {
      return (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Star className="h-5 w-5" />
              VIP Priority Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-amber-600 hover:bg-amber-700">
              <Phone className="h-4 w-4 mr-2" />
              Call VIP Hotline: (555) 123-4567
            </Button>
            <Button variant="outline" className="w-full border-amber-300">
              <MessageCircle className="h-4 w-4 mr-2" />
              Priority Chat Support
            </Button>
            <p className="text-sm text-amber-700">
              Average response time: Under 15 minutes
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Need More Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat Support
          </Button>
          <Button variant="outline" className="w-full">
            Email: support@familyofficehub.com
          </Button>
          <p className="text-sm text-muted-foreground">
            Average response time: 2-4 hours
          </p>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading help content...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${userPersona} help topics...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {personaFAQs[userPersona]?.category || 'Help Topics'}
                  {searchQuery && ` - "${searchQuery}"`}
                </span>
                <Badge variant="secondary">
                  {filteredFaqs.length} articles
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'No results found for your search.' : 'No help topics available.'}
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left">
                        <div className="flex justify-between items-center w-full mr-4">
                          <span>{faq.question}</span>
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        
                        {/* Feedback */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-sm text-muted-foreground">Was this helpful?</span>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVote(faq.id, true)}
                              disabled={votedItems.has(faq.id)}
                              className="flex items-center gap-1"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              {faq.helpful_votes > 0 && faq.helpful_votes}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVote(faq.id, false)}
                              disabled={votedItems.has(faq.id)}
                              className="flex items-center gap-1"
                            >
                              <ThumbsDown className="h-3 w-3" />
                              {faq.not_helpful_votes > 0 && faq.not_helpful_votes}
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Support Options */}
        <div className="space-y-6">
          {getSupportOptions()}
          
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                Getting Started Guide
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Video Tutorials
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Best Practices
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                API Documentation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};