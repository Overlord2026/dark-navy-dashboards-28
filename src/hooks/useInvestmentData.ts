
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface InvestmentOffering {
  id: string;
  name: string;
  description: string;
  firm: string;
  minimum_investment: string;
  performance: string;
  lockup_period: string;
  tags: string[];
  featured: boolean;
  category_id: string;
  created_at: string;
  updated_at: string;
}

export interface InvestmentCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface UserInterest {
  id: string;
  user_id: string;
  offering_id: string;
  created_at: string;
}

export const useInvestmentData = () => {
  const [offerings, setOfferings] = useState<InvestmentOffering[]>([]);
  const [categories, setCategories] = useState<InvestmentCategory[]>([]);
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOfferings = async () => {
    try {
      const { data, error } = await supabase
        .from('investment_offerings')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOfferings(data || []);
    } catch (err) {
      console.error('Error fetching offerings:', err);
      setError('Failed to fetch investment offerings');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('investment_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch investment categories');
    }
  };

  const fetchUserInterests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_investment_interests')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserInterests(data || []);
    } catch (err) {
      console.error('Error fetching user interests:', err);
      setError('Failed to fetch user interests');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchOfferings(),
        fetchCategories(),
        fetchUserInterests()
      ]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  const addUserInterest = async (offeringId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('user_investment_interests')
        .insert({
          user_id: user.id,
          offering_id: offeringId
        })
        .select()
        .single();

      if (error) throw error;
      setUserInterests(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding user interest:', err);
      throw err;
    }
  };

  const removeUserInterest = async (offeringId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('user_investment_interests')
        .delete()
        .eq('user_id', user.id)
        .eq('offering_id', offeringId);

      if (error) throw error;
      setUserInterests(prev => prev.filter(interest => interest.offering_id !== offeringId));
    } catch (err) {
      console.error('Error removing user interest:', err);
      throw err;
    }
  };

  const getOfferingsByCategory = (categoryId: string) => {
    return offerings.filter(offering => offering.category_id === categoryId);
  };

  const isUserInterested = (offeringId: string) => {
    return userInterests.some(interest => interest.offering_id === offeringId);
  };

  return {
    offerings,
    categories,
    userInterests,
    loading,
    error,
    addUserInterest,
    removeUserInterest,
    getOfferingsByCategory,
    isUserInterested,
    refetch: () => {
      fetchOfferings();
      fetchCategories();
      fetchUserInterests();
    }
  };
};
