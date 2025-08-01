import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QuestionnaireData {
  annual_income: string;
  states_with_income: string[];
  has_equity_comp: string;
  owns_business: string;
  international_income: string;
  net_worth: string;
  budget_range: string;
  preferred_meeting_type: string;
  timeline: string;
  estate_planning: string;
  charitable_giving: string;
  investment_planning: string;
  specific_needs: string;
}

interface AdvisorMatch {
  id: string;
  advisor: any;
  match_score: number;
  ai_reasoning: string;
  expertise_match_details: any;
  availability_match: boolean;
  license_match: boolean;
  budget_match: boolean;
  recommended_order: number;
}

export function useAdvisorMatching() {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<AdvisorMatch[]>([]);
  const [complexityScore, setComplexityScore] = useState(0);

  const submitQuestionnaire = async (responses: QuestionnaireData) => {
    setLoading(true);
    try {
      // First, create the questionnaire record
      const { data: questionnaire, error: questionnaireError } = await supabase
        .from('client_questionnaires')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          questionnaire_type: 'advisor_matching',
          responses,
        })
        .select()
        .single();

      if (questionnaireError) {
        throw new Error(`Failed to save questionnaire: ${questionnaireError.message}`);
      }

      // Call the matching function
      const { data: matchingResult, error: matchingError } = await supabase.functions.invoke(
        'advisor-matching',
        {
          body: {
            questionnaireId: questionnaire.id,
            responses
          }
        }
      );

      if (matchingError) {
        throw new Error(`Matching failed: ${matchingError.message}`);
      }

      setMatches(matchingResult.matches);
      setComplexityScore(matchingResult.complexity_score);
      
      toast.success(`Found ${matchingResult.total_matches} potential matches!`);
      
      return matchingResult;
    } catch (error) {
      console.error('Error in advisor matching:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to find matches');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (advisorId: string, message: string, subject: string) => {
    try {
      const { error } = await supabase
        .from('advisor_messages')
        .insert({
          client_id: (await supabase.auth.getUser()).data.user?.id,
          advisor_id: advisorId,
          message_type: 'inquiry',
          subject,
          message,
          status: 'sent'
        });

      if (error) {
        throw new Error(`Failed to send message: ${error.message}`);
      }

      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
      throw error;
    }
  };

  const bookMeeting = async (advisorId: string) => {
    try {
      // This would typically integrate with a calendar system
      // For now, we'll just log the meeting request
      const { error } = await supabase
        .from('advisor_messages')
        .insert({
          client_id: (await supabase.auth.getUser()).data.user?.id,
          advisor_id: advisorId,
          message_type: 'meeting_request',
          subject: 'Meeting Request',
          message: 'I would like to schedule a consultation meeting.',
          status: 'sent'
        });

      if (error) {
        throw new Error(`Failed to book meeting: ${error.message}`);
      }

      toast.success('Meeting request sent! The advisor will contact you soon.');
    } catch (error) {
      console.error('Error booking meeting:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to book meeting');
      throw error;
    }
  };

  const getMatches = async (questionnaireId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('advisor_matches')
        .select(`
          *,
          advisor:advisor_profiles(*)
        `)
        .eq('questionnaire_id', questionnaireId)
        .order('recommended_order');

      if (error) {
        throw new Error(`Failed to fetch matches: ${error.message}`);
      }

      setMatches(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch matches');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserQuestionnaires = async () => {
    try {
      const { data, error } = await supabase
        .from('client_questionnaires')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch questionnaires: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch questionnaires');
      throw error;
    }
  };

  return {
    loading,
    matches,
    complexityScore,
    submitQuestionnaire,
    sendMessage,
    bookMeeting,
    getMatches,
    getUserQuestionnaires
  };
}