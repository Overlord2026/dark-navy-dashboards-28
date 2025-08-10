import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

interface CECourse {
  id: string;
  title: string;
  description?: string;
  profession: string[];
  jurisdiction: string[];
  credit_hours: number;
  credit_type: string;
  provider: string;
  price: number;
  delivery_url: string;
}

interface ComplianceRule {
  id: string;
  title: string;
  description?: string;
  summary_plain?: string;
  jurisdiction: string;
  regulator: string;
  profession: string[];
  credit_type: string;
  effective_date?: string;
  impacted_personas: string[];
}

interface CEUpsellCardProps {
  userPersona: string;
}

export const CEUpsellCard: React.FC<CEUpsellCardProps> = ({ userPersona }) => {
  const { user } = useAuth();
  const [recommendedCourse, setRecommendedCourse] = useState<CECourse | null>(null);
  const [activeRule, setActiveRule] = useState<ComplianceRule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCERecommendation();
  }, [userPersona]);

  const fetchCERecommendation = async () => {
    try {
      setLoading(true);

      // Mock data for demo purposes since tables are new
      const mockRule: ComplianceRule = {
        id: 'mock-rule-1',
        title: 'Annual Ethics Requirement Update',
        description: 'All professionals must complete updated ethics training by end of year.',
        summary_plain: 'Complete your 2025 ethics requirement to maintain compliance.',
        jurisdiction: 'US-FED',
        regulator: 'FINRA',
        profession: [userPersona],
        credit_type: 'Ethics',
        effective_date: '2025-12-31',
        impacted_personas: [userPersona]
      };

      const mockCourse: CECourse = {
        id: 'mock-course-1',
        title: 'Professional Ethics 2025 Update',
        description: 'Comprehensive ethics training for financial professionals',
        profession: [userPersona],
        jurisdiction: ['US-FED', 'CA', 'FL'],
        credit_hours: 2,
        credit_type: 'Ethics',
        provider: 'BFO Training',
        price: 79,
        delivery_url: 'https://training.bfocfo.com/ethics-2025'
      };

      // Simulate appropriate data based on persona
      if ([
        'financial_advisor', 'attorney', 'cpa_accountant', 
        'insurance_agent', 'realtor', 'physician', 'dentist',
        'healthcare_longevity_expert', 'sports_agent', 'athlete_nil'
      ].includes(userPersona)) {
        setActiveRule(mockRule);
        setRecommendedCourse(mockCourse);
      }

    } catch (error) {
      console.error('Error in fetchCERecommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeCourse = async () => {
    if (!recommendedCourse || !user) return;

    try {
      // For now, just open the course URL
      window.open(recommendedCourse.delivery_url, '_blank');
      
      // Log for tracking
      console.log('CE course taken:', {
        user_id: user.id,
        course_id: recommendedCourse.id,
        price: recommendedCourse.price,
        source: 'dashboard_upsell'
      });
    } catch (error) {
      console.error('Error handling course action:', error);
    }
  };

  if (loading) {
    return (
      <Card className="bg-background border-amber-500/30 shadow-[0_4px_16px_rgba(0,0,0,0.3)] rounded-xl">
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-amber-500/20 h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-amber-500/20 rounded w-3/4"></div>
              <div className="h-4 bg-amber-500/20 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendedCourse || !activeRule) {
    return null;
  }

  const formatJurisdictions = (jurisdictions: string[]) => {
    return jurisdictions.map(j => j.replace('US-', '')).join(', ');
  };

  const isUrgent = activeRule.effective_date && 
    new Date(activeRule.effective_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Card className="bg-background border-amber-500 shadow-[0_4px_16px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border-b border-amber-500/30">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {isUrgent ? (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-amber-500" />
            )}
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {recommendedCourse.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {recommendedCourse.credit_hours} hrs
                </Badge>
                <Badge variant="outline" className="text-xs">
                  ${recommendedCourse.price}
                </Badge>
              </div>
            </div>
          </div>
          {isUrgent && (
            <Badge variant="destructive" className="text-xs">
              Due Soon
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Meets {activeRule.credit_type} requirement for {formatJurisdictions(recommendedCourse.jurisdiction)}
            </p>
            <p className="text-sm text-foreground">
              {activeRule.summary_plain || activeRule.description}
            </p>
          </div>

          {activeRule.effective_date && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Due: {format(new Date(activeRule.effective_date), 'MMM d, yyyy')}
              </span>
            </div>
          )}

          <div className="pt-2">
            <Button 
              onClick={handleTakeCourse}
              className="w-full bg-amber-500 hover:bg-amber-600 text-background font-medium"
            >
              Take Course
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};