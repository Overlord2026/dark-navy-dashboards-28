import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

export interface InvestmentStrategy {
  id: string;
  name: string;
  description: string;
  strategy_type: string;
  risk_level: string;
  benchmark: string;
  performance: string;
  allocation: string;
  manager: string;
  minimum_investment?: string;
  tags: string[];
  premium_locked: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface EducationalContent {
  id: string;
  title: string;
  content_type: string;
  description?: string;
  url?: string;
  file_path?: string;
  thumbnail_url?: string;
  is_premium: boolean;
}

export interface FilterOptions {
  riskLevels: { id: string, label: string }[];
  investmentTypes: { id: string, label: string }[];
  timeHorizons: { id: string, label: string }[];
}

export const useInvestmentStrategies = (defaultSegment?: string) => {
  const { userProfile } = useUser();
  const [strategies, setStrategies] = useState<InvestmentStrategy[]>([]);
  const [filteredStrategies, setFilteredStrategies] = useState<InvestmentStrategy[]>([]);
  const [recommendedStrategies, setRecommendedStrategies] = useState<InvestmentStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("");
  const [selectedInvestmentType, setSelectedInvestmentType] = useState("");
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState("");
  
  // Get the user's segment from profile or passed segment
  const userSegment = userProfile?.client_segment || defaultSegment || null;
  
  // Education content mapping
  const [educationalContent, setEducationalContent] = useState<Record<string, EducationalContent[]>>({});

  // Filter options
  const filterOptions: FilterOptions = {
    riskLevels: [
      { id: "Low", label: "Low" },
      { id: "Medium", label: "Medium" },
      { id: "Medium-High", label: "Medium-High" },
      { id: "High", label: "High" }
    ],
    investmentTypes: [
      { id: "Model", label: "Model Portfolio" },
      { id: "Strategy", label: "Strategy" },
      { id: "Sleeve", label: "Sleeve" }
    ],
    timeHorizons: [
      { id: "short", label: "Short Term (< 3 years)" },
      { id: "medium", label: "Medium Term (3-10 years)" },
      { id: "long", label: "Long Term (> 10 years)" }
    ]
  };

  // Fetch all strategies
  const fetchStrategies = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('investment_strategies')
        .select('*');
      
      if (error) throw error;
      
      setStrategies(data || []);
      setFilteredStrategies(data || []);
      
      // Generate recommendations based on user segment
      if (data && userSegment) {
        generateRecommendations(data, userSegment);
      }
    } catch (err: any) {
      console.error('Error fetching investment strategies:', err);
      setError(err.message || 'Error fetching investment strategies');
    } finally {
      setLoading(false);
    }
  }, [userSegment]);

  // Fetch educational content for strategies
  const fetchEducationalContent = useCallback(async () => {
    try {
      // Fetch the strategy-content mappings
      const { data: mappings, error: mappingError } = await supabase
        .from('strategy_educational_content')
        .select('strategy_id, content_id');
      
      if (mappingError) throw mappingError;
      
      if (mappings && mappings.length > 0) {
        // Get unique content IDs
        const contentIds = [...new Set(mappings.map(m => m.content_id))];
        
        // Fetch the content details
        const { data: contents, error: contentError } = await supabase
          .from('educational_content')
          .select('*')
          .in('id', contentIds);
        
        if (contentError) throw contentError;
        
        if (contents) {
          // Create a mapping of strategy ID to content
          const contentMap: Record<string, EducationalContent[]> = {};
          
          mappings.forEach(mapping => {
            const content = contents.find(c => c.id === mapping.content_id);
            if (content) {
              if (!contentMap[mapping.strategy_id]) {
                contentMap[mapping.strategy_id] = [];
              }
              contentMap[mapping.strategy_id].push(content);
            }
          });
          
          setEducationalContent(contentMap);
        }
      }
    } catch (err: any) {
      console.error('Error fetching educational content:', err);
    }
  }, []);

  // Generate recommendations based on user segment
  const generateRecommendations = (strategies: InvestmentStrategy[], segment: string) => {
    let recommended: InvestmentStrategy[] = [];
    
    // Filter based on segment
    switch (segment) {
      case 'physician':
        // Physicians typically prefer lower risk and stable investments
        recommended = strategies.filter(s => 
          s.risk_level === 'Low' || 
          s.risk_level === 'Medium' || 
          s.tags.includes('income') || 
          s.tags.includes('conservative')
        );
        break;
      
      case 'executive':
        // Executives often have equity compensation and prefer tax-efficient strategies
        recommended = strategies.filter(s => 
          s.tags.includes('tactical') || 
          s.tags.includes('growth') || 
          s.strategy_type === 'Sleeve'
        );
        break;
      
      case 'entrepreneur':
        // Entrepreneurs typically prefer higher risk/reward and alternatives
        recommended = strategies.filter(s => 
          s.risk_level === 'High' || 
          s.risk_level === 'Medium-High' || 
          s.tags.includes('aggressive') || 
          s.featured
        );
        break;
      
      default:
        // Default recommendations - featured and balanced strategies
        recommended = strategies.filter(s => 
          s.featured || 
          s.risk_level === 'Medium' || 
          s.tags.includes('balanced')
        );
    }
    
    // Sort by featured status first, then by performance (descending)
    recommended.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      const perfA = parseFloat(a.performance.replace(/[^0-9.-]+/g, ""));
      const perfB = parseFloat(b.performance.replace(/[^0-9.-]+/g, ""));
      
      return isNaN(perfA) || isNaN(perfB) ? 0 : perfB - perfA;
    });
    
    // Limit to top 5 recommendations
    setRecommendedStrategies(recommended.slice(0, 5));
  };

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...strategies];
    
    // Search term filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        strategy => 
          strategy.name.toLowerCase().includes(lowerSearch) || 
          strategy.manager.toLowerCase().includes(lowerSearch) ||
          (strategy.tags && strategy.tags.some(tag => tag.toLowerCase().includes(lowerSearch)))
      );
    }
    
    // Risk level filter
    if (selectedRiskLevel) {
      filtered = filtered.filter(strategy => strategy.risk_level === selectedRiskLevel);
    }
    
    // Investment type filter
    if (selectedInvestmentType) {
      filtered = filtered.filter(strategy => strategy.strategy_type === selectedInvestmentType);
    }
    
    // Time horizon filter (would need mapping in real data)
    if (selectedTimeHorizon) {
      // This is a simplification - in a real app, you'd have a proper time_horizon field
      const horizonMapping: Record<string, string[]> = {
        "short": ["Low", "Medium"],
        "medium": ["Medium", "Medium-High"],
        "long": ["Medium-High", "High"]
      };
      
      if (horizonMapping[selectedTimeHorizon]) {
        filtered = filtered.filter(strategy => 
          horizonMapping[selectedTimeHorizon].includes(strategy.risk_level)
        );
      }
    }
    
    setFilteredStrategies(filtered);
  }, [strategies, searchTerm, selectedRiskLevel, selectedInvestmentType, selectedTimeHorizon]);

  // Track strategy engagement
  const trackEngagement = async (strategyId: string, eventType: string, metadata: any = {}) => {
    if (!userProfile?.id) return;
    
    try {
      await supabase.from('strategy_engagement_tracking').insert({
        user_id: userProfile.id,
        strategy_id: strategyId,
        event_type: eventType,
        metadata
      });
    } catch (error) {
      console.error(`Error tracking ${eventType} engagement:`, error);
    }
  };

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedRiskLevel("");
    setSelectedInvestmentType("");
    setSelectedTimeHorizon("");
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchStrategies();
    fetchEducationalContent();
  }, [fetchStrategies, fetchEducationalContent]);

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters();
  }, [strategies, searchTerm, selectedRiskLevel, selectedInvestmentType, selectedTimeHorizon, applyFilters]);

  // Count active filters
  const activeFilterCount = [
    searchTerm, 
    selectedRiskLevel, 
    selectedInvestmentType, 
    selectedTimeHorizon
  ].filter(Boolean).length;

  return {
    strategies,
    filteredStrategies,
    recommendedStrategies,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedRiskLevel,
    setSelectedRiskLevel,
    selectedInvestmentType,
    setSelectedInvestmentType,
    selectedTimeHorizon,
    setSelectedTimeHorizon,
    filterOptions,
    clearFilters,
    activeFilterCount,
    trackEngagement,
    educationalContent,
    refetch: fetchStrategies
  };
};