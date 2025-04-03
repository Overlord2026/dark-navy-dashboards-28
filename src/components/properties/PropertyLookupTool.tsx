
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getPropertyValuation, getZillowSearchUrl } from "@/services/propertyValuationService";
import { PropertyValuation } from "@/types/property";

interface PropertyLookupToolProps {
  onAddProperty?: (address: string, valuation: PropertyValuation) => void;
}

export const PropertyLookupTool: React.FC<PropertyLookupToolProps> = ({ onAddProperty }) => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [valuation, setValuation] = useState<PropertyValuation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("Please enter an address");
      return;
    }

    setIsLoading(true);
    setError(null);
    setValuation(null);

    try {
      toast.info("Connecting to Zillow API...");
      const result = await getPropertyValuation(address);
      setValuation(result);
      toast.success("Property valuation retrieved from Zillow");
    } catch (err) {
      setError("Unable to fetch property valuation from Zillow. Please try again.");
      toast.error("Error fetching property valuation from Zillow");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToPortfolio = () => {
    if (valuation && onAddProperty) {
      onAddProperty(address, valuation);
      toast.success("Address and Zillow valuation saved for new property");
      setAddress("");
      setValuation(null);
    }
  };

  const openZillowLink = () => {
    const url = getZillowSearchUrl(address);
    window.open(url, "_blank");
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-yellow-500" />
          Zillow Property Valuation Tool
        </CardTitle>
        <CardDescription>
          Look up property values directly from Zillow by entering an address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full property address"
                className="pl-9"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching Zillow...
                </div>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" /> Get Zillow Estimate
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-800 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          {valuation && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Zillow Property Estimate</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Estimated Value</p>
                  <p className="text-xl font-bold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(valuation.estimatedValue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Confidence Level</p>
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      valuation.confidence === 'high' ? 'bg-green-500' :
                      valuation.confidence === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></span>
                    <span className="capitalize">{valuation.confidence}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data Source</p>
                  <p>{valuation.source}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p>{new Date(valuation.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={openZillowLink} className="flex-1">
                  View on Zillow
                </Button>
                <Button onClick={handleAddToPortfolio} className="flex-1">
                  Use for New Property
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
