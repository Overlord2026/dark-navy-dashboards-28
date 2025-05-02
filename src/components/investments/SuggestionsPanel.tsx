
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AssetClass } from "@/types/investments";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const SuggestionsPanel: React.FC = () => {
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssetClasses = async () => {
      try {
        const { data, error } = await supabase
          .from("asset_classes")
          .select("*")
          .order("name");
          
        if (error) {
          throw error;
        }
        
        setAssetClasses(data || []);
      } catch (err) {
        console.error("Error fetching asset classes:", err);
        setError("Failed to load investment suggestions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssetClasses();
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-[#1B2A47] border-[#2A3E5C]">
        <CardHeader>
          <CardTitle className="text-white">Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <p className="text-gray-400">Loading investment suggestions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#1B2A47] border-[#2A3E5C]">
        <CardHeader>
          <CardTitle className="text-white">Suggestions</CardTitle>
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
        <CardTitle className="text-white">Investment Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">
          Consider diversifying your portfolio with these asset classes:
        </p>
        <div className="space-y-3">
          {assetClasses.map((assetClass) => (
            <div key={assetClass.id} className="p-3 bg-[#0F1E3A] rounded-md border border-[#2A3E5C]">
              <h4 className="font-medium text-[#9b87f5]">{assetClass.name}</h4>
              <p className="text-sm text-gray-400 mt-1">{assetClass.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
