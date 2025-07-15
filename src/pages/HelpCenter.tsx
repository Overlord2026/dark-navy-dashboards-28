import React, { useState, useEffect } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default function HelpCenter() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast({
        title: "Error",
        description: "Failed to load help content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <ThreeColumnLayout title="Help Center" activeMainItem="help">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <HelpCircle className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Help Center</h1>
              <p className="text-muted-foreground">Loading help content...</p>
            </div>
          </div>
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout title="Help Center" activeMainItem="help">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <HelpCircle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Help Center</h1>
            <p className="text-muted-foreground">Find answers to your questions and get help with your account.</p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for help topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
            <Badge variant="outline">
              {filteredFAQs.length} {filteredFAQs.length === 1 ? 'question' : 'questions'}
            </Badge>
          </div>

          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No questions found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No FAQs are available at the moment.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredFAQs.map((faq) => (
              <Card key={faq.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                >
                  <CardTitle className="text-lg font-medium flex items-center justify-between">
                    <span>{faq.question}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        FAQ
                      </Badge>
                      <div className={`transform transition-transform duration-200 ${expandedFaq === faq.id ? 'rotate-180' : ''}`}>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                {expandedFaq === faq.id && (
                  <CardContent className="pt-0">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground whitespace-pre-wrap">{faq.answer}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Contact Support */}
        <Card className="bg-accent/50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Still need help?</h3>
                <p className="text-muted-foreground">
                  If you can't find the answer you're looking for, our support team is here to help.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}