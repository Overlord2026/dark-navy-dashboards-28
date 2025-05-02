
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface GoalSuggestion {
  id: string;
  title: string;
  description: string;
}

export const GoalSuggestionsPanel: React.FC = () => {
  const [suggestions, setSuggestions] = useState<GoalSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        // This would normally fetch from a 'goal_suggestions' table
        // For now, we'll use asset_classes as they have a similar structure
        const { data, error } = await supabase
          .from("asset_classes")
          .select("*")
          .limit(3);
          
        if (error) {
          throw error;
        }
        
        // Map the data to our suggestion format
        const mappedSuggestions = data?.map(item => ({
          id: item.id,
          title: `Goal: ${item.name} Fund`,
          description: `Consider setting a goal for ${item.description}`
        })) || [];
        
        setSuggestions(mappedSuggestions);
      } catch (err) {
        console.error("Error fetching goal suggestions:", err);
        setError("Failed to load goal suggestions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-[#1B2A47] border-[#2A3E5C]">
        <CardHeader>
          <CardTitle className="text-white">Goal Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <p className="text-gray-400">Loading goal suggestions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#1B2A47] border-[#2A3E5C]">
        <CardHeader>
          <CardTitle className="text-white">Goal Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-400">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1B2A47] border-[#2A3E5C]">
      <CardHeader>
        <CardTitle className="text-white">Goal Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">
          Consider these financial goals for your plan:
        </p>
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-3 bg-[#0F1E3A] rounded-md border border-[#2A3E5C]">
              <h4 className="font-medium text-[#9b87f5]">{suggestion.title}</h4>
              <p className="text-sm text-gray-400 mt-1">{suggestion.description}</p>
            </div>
          ))}
          {suggestions.length === 0 && (
            <div className="p-3 bg-[#0F1E3A] rounded-md border border-[#2A3E5C]">
              <p className="text-gray-400">No goal suggestions available at this time.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
