
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Globe, RotateCw, AlertCircle, Check } from "lucide-react";
import { FamilyOffice } from "@/types/familyoffice";

interface WebsiteScraperProps {
  onDataRetrieved: (data: Partial<FamilyOffice>[]) => void;
}

export function WebsiteScraper({ onDataRetrieved }: WebsiteScraperProps) {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [isScraperBusy, setIsScraperBusy] = useState(false);
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const [urlStatus, setUrlStatus] = useState<"none" | "validating" | "valid" | "invalid">("none");
  const [selectors, setSelectors] = useState({
    name: ".organization-name",
    description: ".organization-description",
    location: ".organization-location",
    services: ".service-list .service-item",
    team: ".team-members .team-member",
  });

  const validateUrl = () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to validate",
        variant: "destructive",
      });
      return;
    }

    // Simple URL validation
    if (!url.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsValidatingUrl(true);
    setUrlStatus("validating");
    
    // Simulate URL validation process
    setTimeout(() => {
      setIsValidatingUrl(false);
      setUrlStatus("valid");
      
      toast({
        title: "URL Validated",
        description: "The URL is valid and accessible for scraping",
      });
    }, 1500);
  };

  const handleScrape = () => {
    if (urlStatus !== "valid") {
      toast({
        title: "Validation Required",
        description: "Please validate the URL before scraping",
        variant: "destructive",
      });
      return;
    }

    setIsScraperBusy(true);
    
    // Simulate scraping process
    setTimeout(() => {
      // Sample data for demonstration
      const scrapedData = [
        {
          name: "Atlantic Family Office",
          location: "New York, NY",
          description: "A premier family office serving the East Coast's most influential families.",
          foundedYear: 1998,
          minimumAssets: 20,
          aum: 2.8,
          tier: "advanced" as const,
          wealthTiers: ["uhnw"],
        }
      ];
      
      onDataRetrieved(scrapedData);
      setIsScraperBusy(false);
      
      toast({
        title: "Scraping Complete",
        description: `Successfully scraped data for ${scrapedData.length} family office`,
      });
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Scraper</CardTitle>
        <CardDescription>
          Ethically scrape public information from family office websites with proper permissions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="websiteUrl">Family Office Website URL</Label>
            <div className="flex gap-2">
              <Input
                id="websiteUrl"
                placeholder="https://example-family-office.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={validateUrl}
                disabled={isValidatingUrl}
              >
                {isValidatingUrl ? (
                  <RotateCw className="h-4 w-4 animate-spin" />
                ) : urlStatus === "valid" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  "Validate"
                )}
              </Button>
            </div>
            {urlStatus === "valid" && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" /> URL is valid and accessible
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Ensure you have permission to scrape this website and comply with their robots.txt
            </p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Ethical Scraping Guidelines:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Only scrape publicly available information</li>
                <li>Respect robots.txt and site terms of service</li>
                <li>Implement rate limiting to avoid overloading servers</li>
                <li>Verify you have permission to collect and use the data</li>
                <li>Validate and verify all scraped information before publishing</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>CSS Selectors for Data Extraction</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameSelector" className="text-xs">Organization Name</Label>
              <Input
                id="nameSelector"
                value={selectors.name}
                onChange={(e) => setSelectors({...selectors, name: e.target.value})}
                placeholder=".organization-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locationSelector" className="text-xs">Location</Label>
              <Input
                id="locationSelector"
                value={selectors.location}
                onChange={(e) => setSelectors({...selectors, location: e.target.value})}
                placeholder=".organization-location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionSelector" className="text-xs">Description</Label>
              <Input
                id="descriptionSelector"
                value={selectors.description}
                onChange={(e) => setSelectors({...selectors, description: e.target.value})}
                placeholder=".organization-description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servicesSelector" className="text-xs">Services</Label>
              <Input
                id="servicesSelector"
                value={selectors.services}
                onChange={(e) => setSelectors({...selectors, services: e.target.value})}
                placeholder=".service-list .service-item"
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={handleScrape} 
          className="w-full"
          disabled={isScraperBusy || urlStatus !== "valid"}
        >
          {isScraperBusy ? (
            <>
              <RotateCw className="h-4 w-4 mr-2 animate-spin" />
              Scraping Website...
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 mr-2" />
              Scrape Website Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
