
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface InvestmentMeeting {
  id: string;
  user_id: string;
  offering_id: string;
  consultation_type: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useInvestmentMeetings = () => {
  const [meetings, setMeetings] = useState<InvestmentMeeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMeetings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('investment_meetings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMeetings(data || []);
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setError('Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [user]);

  const scheduleMeeting = async (meetingData: {
    offering_id: string;
    consultation_type: string;
    preferred_date?: string;
    preferred_time?: string;
    notes?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    // Validate that offering_id is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(meetingData.offering_id)) {
      throw new Error('Invalid offering ID format');
    }

    try {
      const { data, error } = await supabase
        .from('investment_meetings')
        .insert({
          user_id: user.id,
          ...meetingData
        })
        .select()
        .single();

      if (error) throw error;
      setMeetings(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error scheduling meeting:', err);
      throw err;
    }
  };

  const updateMeetingStatus = async (meetingId: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('investment_meetings')
        .update({ status })
        .eq('id', meetingId)
        .select()
        .single();

      if (error) throw error;
      setMeetings(prev => prev.map(meeting => 
        meeting.id === meetingId ? data : meeting
      ));
      return data;
    } catch (err) {
      console.error('Error updating meeting status:', err);
      throw err;
    }
  };

  return {
    meetings,
    loading,
    error,
    scheduleMeeting,
    updateMeetingStatus,
    refetch: fetchMeetings
  };
};
