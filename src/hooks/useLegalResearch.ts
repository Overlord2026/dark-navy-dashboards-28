import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface SearchResult {
  id: string;
  query: string;
  date: string;
  results_count: number;
  search_type: string;
  jurisdiction?: string;
}

export interface CaseResult {
  id: string;
  case_name: string;
  court: string;
  year: string;
  citation: string;
  relevance_score: number;
  summary: string;
  key_holdings: string[];
  jurisdiction: string;
}

export interface Regulation {
  id: string;
  title: string;
  agency: string;
  effective_date: string;
  status: string;
  summary: string;
  last_updated: string;
  regulation_type: string;
}

export interface SavedResearch {
  id: string;
  title: string;
  jurisdiction: string;
  date_saved: string;
  case_count: number;
  tags: string[];
  search_query: string;
}

export const useLegalResearch = () => {
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const [caseResults, setCaseResults] = useState<CaseResult[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [savedResearch, setSavedResearch] = useState<SavedResearch[]>([]);
  const [researchStats, setResearchStats] = useState({
    total_cases: 0,
    recent_cases: 0,
    saved_cases: 0,
    avg_search_time: 0
  });

  const fetchRecentSearches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Sample recent searches
      const mockSearches: SearchResult[] = [
        {
          id: '1',
          query: 'employment discrimination federal law',
          date: '2024-01-20',
          results_count: 156,
          search_type: 'case_law',
          jurisdiction: 'federal'
        },
        {
          id: '2',
          query: 'corporate merger securities regulations',
          date: '2024-01-19',
          results_count: 89,
          search_type: 'regulations',
          jurisdiction: 'federal'
        },
        {
          id: '3',
          query: 'intellectual property licensing agreements',
          date: '2024-01-18',
          results_count: 234,
          search_type: 'case_law',
          jurisdiction: 'california'
        }
      ];

      setRecentSearches(mockSearches);
    } catch (error) {
      console.error('Error fetching recent searches:', error);
    }
  };

  const fetchCaseResults = async () => {
    try {
      // Sample case law results
      const mockCases: CaseResult[] = [
        {
          id: '1',
          case_name: 'Smith v. ABC Corporation',
          court: 'California Supreme Court',
          year: '2023',
          citation: '2023 Cal. LEXIS 456',
          relevance_score: 95,
          summary: 'Landmark case establishing new standards for employment discrimination claims in California.',
          key_holdings: [
            'Expanded definition of workplace harassment',
            'Burden of proof standards for discrimination claims'
          ],
          jurisdiction: 'california'
        },
        {
          id: '2',
          case_name: 'Johnson Industries v. EPA',
          court: 'U.S. Court of Appeals, 9th Circuit',
          year: '2023',
          citation: '2023 U.S. App. LEXIS 789',
          relevance_score: 87,
          summary: 'Federal environmental regulations and corporate compliance requirements.',
          key_holdings: [
            'Environmental impact assessments required',
            'Corporate liability standards clarified'
          ],
          jurisdiction: 'federal'
        }
      ];

      setCaseResults(mockCases);
    } catch (error) {
      console.error('Error fetching case results:', error);
    }
  };

  const fetchRegulations = async () => {
    try {
      // Sample regulations
      const mockRegulations: Regulation[] = [
        {
          id: '1',
          title: 'Securities Exchange Act Rule 10b-5',
          agency: 'SEC',
          effective_date: '2024-01-01',
          status: 'Active',
          summary: 'Anti-fraud provisions for securities transactions and insider trading prevention.',
          last_updated: '2024-01-15',
          regulation_type: 'securities'
        },
        {
          id: '2',
          title: 'Employment Eligibility Verification (I-9)',
          agency: 'DHS',
          effective_date: '2023-08-01',
          status: 'Active',
          summary: 'Form I-9 and E-Verify requirements for employers to verify employee eligibility.',
          last_updated: '2024-01-10',
          regulation_type: 'employment'
        }
      ];

      setRegulations(mockRegulations);
    } catch (error) {
      console.error('Error fetching regulations:', error);
    }
  };

  const fetchSavedResearch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Sample saved research
      const mockSaved: SavedResearch[] = [
        {
          id: '1',
          title: 'Employment At-Will Exceptions',
          jurisdiction: 'California',
          date_saved: '2024-01-20',
          case_count: 45,
          tags: ['Employment', 'Labor Law', 'Wrongful Termination'],
          search_query: 'employment at-will exceptions california'
        },
        {
          id: '2',
          title: 'Corporate Governance Best Practices',
          jurisdiction: 'Delaware',
          date_saved: '2024-01-18',
          case_count: 67,
          tags: ['Corporate Law', 'Fiduciary Duty', 'Board Relations'],
          search_query: 'corporate governance fiduciary duty delaware'
        },
        {
          id: '3',
          title: 'Contract Formation Elements',
          jurisdiction: 'Federal',
          date_saved: '2024-01-15',
          case_count: 123,
          tags: ['Contract Law', 'Consideration', 'Offer and Acceptance'],
          search_query: 'contract formation consideration federal'
        }
      ];

      setSavedResearch(mockSaved);
    } catch (error) {
      console.error('Error fetching saved research:', error);
    }
  };

  const performSearch = async (query: string, searchType: string = 'case_law', jurisdiction: string = '') => {
    setLoading(true);
    try {
      // In a real implementation, this would call a legal research API
      console.log('Performing legal research search:', { query, searchType, jurisdiction });
      
      // For now, add to recent searches and refresh results
      const newSearch: SearchResult = {
        id: Date.now().toString(),
        query,
        date: new Date().toISOString().split('T')[0],
        results_count: Math.floor(Math.random() * 500) + 50,
        search_type: searchType,
        jurisdiction
      };

      setRecentSearches(prev => [newSearch, ...prev.slice(0, 9)]);
      
      // In a real implementation, this would fetch actual search results
      await fetchCaseResults();
      
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveResearch = async (title: string, searchQuery: string, jurisdiction: string, tags: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // In a real implementation, this would save to a research_saves table
      const newSaved: SavedResearch = {
        id: Date.now().toString(),
        title,
        jurisdiction,
        date_saved: new Date().toISOString().split('T')[0],
        case_count: Math.floor(Math.random() * 100) + 10,
        tags,
        search_query: searchQuery
      };

      setSavedResearch(prev => [newSaved, ...prev]);
    } catch (error) {
      console.error('Error saving research:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchRecentSearches(),
        fetchCaseResults(),
        fetchRegulations(),
        fetchSavedResearch()
      ]);

      // Calculate research stats
      setResearchStats({
        total_cases: 1247,
        recent_cases: 89,
        saved_cases: savedResearch.length,
        avg_search_time: 4.2
      });

      setLoading(false);
    };

    loadData();
  }, []);

  return {
    loading,
    recentSearches,
    caseResults,
    regulations,
    savedResearch,
    researchStats,
    performSearch,
    saveResearch,
    refreshData: () => {
      fetchRecentSearches();
      fetchCaseResults();
      fetchRegulations();
      fetchSavedResearch();
    }
  };
};