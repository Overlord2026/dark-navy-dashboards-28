
import React, { useState, useEffect } from "react";
import { NavigationTestResult, Recommendation } from "@/types/diagnostics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RecommendationsList } from "./RecommendationsList";

interface SimpleDiagnosticsViewProps {
  results: NavigationTestResult[];
  isLoading: boolean;
  onFixClick?: (recommendation: Recommendation) => void;
  onRefresh?: () => void;
}

/**
 * A simple view for displaying diagnostic results
 * This component is meant to be hidden from the user interface
 * but used for testing the functionality of the diagnostics system
 */
export const SimpleDiagnosticsView: React.FC<SimpleDiagnosticsViewProps> = ({
  results,
  isLoading,
  onFixClick,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<string>("errors");
  const [fixedRecommendations, setFixedRecommendations] = useState<string[]>([]);
  
  // Filter results by status
  const errorResults = results.filter(result => result.status === "error");
  const warningResults = results.filter(result => result.status === "warning");
  const successResults = results.filter(result => result.status === "success");
  
  const handleFixRecommendation = async (recommendation: Recommendation) => {
    if (!onFixClick) return;
    
    try {
      // Show a toast notification that we're fixing the issue
      toast.loading(`Fixing: ${recommendation.text}`, {
        id: `fix-${recommendation.id}`,
      });
      
      // Call the fix handler
      await onFixClick(recommendation);
      
      // Update our local state to track fixed recommendations
      setFixedRecommendations(prev => [...prev, recommendation.id]);
      
      // Show success toast
      toast.success(`Fixed: ${recommendation.text}`, {
        id: `fix-${recommendation.id}`,
      });
    } catch (error) {
      // Show error toast
      toast.error(`Failed to fix: ${recommendation.text}`, {
        id: `fix-${recommendation.id}`,
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
  
  // Get recommendations for a specific result, ensuring we filter out any that have been fixed
  const getRecommendationsForResult = (result: NavigationTestResult): Recommendation[] => {
    if (!result.recommendations) return [];
    
    return result.recommendations
      .filter(rec => {
        // If it's a string recommendation, always include it
        if (typeof rec === 'string') return true;
        // If it's an object recommendation, check if it's been fixed
        return !fixedRecommendations.includes(rec.id);
      })
      .map(rec => {
        // Convert string recommendations to Recommendation objects
        if (typeof rec === 'string') {
          return {
            id: `simple-${Math.random().toString(36).substring(2, 9)}`,
            text: rec,
            priority: 'medium',
            category: 'reliability',
            actionable: false
          };
        }
        return rec;
      }) as Recommendation[];
  };
  
  // Handle refreshing the diagnostics
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      toast.info("Refreshing diagnostics...");
    }
  };
  
  // Update a specific recommendation as fixed
  const handleRecommendationAction = (recommendation: Recommendation) => {
    if (!recommendation.actionable) return;
    
    handleFixRecommendation(recommendation);
    
    // Update the results to reflect the fix
    setResults(prevResults => 
      prevResults.map(result => {
        if (result.recommendations && result.recommendations.some(r => 
          typeof r === 'object' && r.id === recommendation.id
        )) {
          const updatedRecommendations = result.recommendations.filter(
            r => typeof r === 'string' || r.id !== recommendation.id
          );
          return {
            ...result,
            recommendations: updatedRecommendations
          };
        }
        return result;
      })
    );
  };
  
  // If this is just a test component that's not meant to be displayed,
  // return null or an empty fragment
  if (import.meta.env.PROD) {
    return null;
  }
  
  // Count recommendations
  const recommendationsCount = results.reduce((count, result) => {
    if (!result.recommendations) return count;
    return count + result.recommendations.length;
  }, 0);
  
  // Get total counts by status
  const totalErrors = errorResults.length;
  const totalWarnings = warningResults.length;
  const totalSuccesses = successResults.length;
  
  // Get all recommendations
  const allRecommendations = results
    .flatMap(result => result.recommendations || [])
    .filter(rec => typeof rec === 'object') // Filter out string recommendations
    .sort((a, b) => {
      if (typeof a === 'string' || typeof b === 'string') return 0;
      const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - 
             (priorityOrder[b.priority as keyof typeof priorityOrder] || 3);
    }) as Recommendation[];

  return null; // Always return null to never show this component
};
