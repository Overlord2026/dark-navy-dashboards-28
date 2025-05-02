
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BudgetSuggestion {
  id: string;
  title: string;
  description: string;
}

export const BudgetSuggestionsPanel: React.FC = () => {
  const [suggestions, setSuggestions] = useState<BudgetSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        // This would normally fetch from a 'budget_suggestions' table
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
          title: `Budget for ${item.name}`,
          description: `Consider allocating funds for ${item.name.toLowerCase()} - ${item.description}`
        })) || [];
        
        setSuggestions(mappedSuggestions);
      } catch (err) {
        console.error("Error fetching budget suggestions:", err);
        setError("Failed to load budget suggestions. Please try again later.");
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
          <CardTitle className="text-white">Budget Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <p className="text-gray-400">Loading budget suggestions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#1B2A47] border-[#2A3E5C]">
        <CardHeader>
          <CardTitle className="text-white">Budget Suggestions</CardTitle>
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
        <CardTitle className="text-white">Budget Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">
          Consider these budget optimization strategies:
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
              <p className="text-gray-400">No budget suggestions available at this time.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
