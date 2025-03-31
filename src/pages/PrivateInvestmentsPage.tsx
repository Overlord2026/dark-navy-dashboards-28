
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { PrivateInvestmentsFirmList } from "@/components/familyoffice/PrivateInvestmentsFirmList";
import { usePrivateInvestments } from "@/hooks/usePrivateInvestments";
import { Input } from "@/components/ui/input";

export default function PrivateInvestmentsPage() {
  const { firms, isLoading } = usePrivateInvestments();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  return (
    <ThreeColumnLayout title="Private Investments - Family Office Services">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/marketplace" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> 
              Back to Marketplace
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">Private Investments</h1>
            <p className="text-lg text-muted-foreground">
              Access exclusive private investment opportunities through our strategic partnerships with industry-leading investment firms.
            </p>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by firm name, strategy or investment type..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6 bg-muted/20 p-4 rounded-md">
            <h3 className="w-full text-sm font-medium mb-2">Filter by Investment Category:</h3>
            <Button 
              variant={activeCategory === "all" ? "default" : "outline"} 
              onClick={() => setActiveCategory("all")}
              size="sm"
            >
              All Categories
            </Button>
            <Button 
              variant={activeCategory === "private-equity" ? "default" : "outline"} 
              onClick={() => setActiveCategory("private-equity")}
              size="sm"
            >
              Private Equity
            </Button>
            <Button 
              variant={activeCategory === "private-credit" ? "default" : "outline"} 
              onClick={() => setActiveCategory("private-credit")}
              size="sm"
            >
              Private Credit
            </Button>
            <Button 
              variant={activeCategory === "real-estate" ? "default" : "outline"} 
              onClick={() => setActiveCategory("real-estate")}
              size="sm"
            >
              Real Estate
            </Button>
            <Button 
              variant={activeCategory === "infrastructure" ? "default" : "outline"} 
              onClick={() => setActiveCategory("infrastructure")}
              size="sm"
            >
              Infrastructure
            </Button>
          </div>
          
          <PrivateInvestmentsFirmList 
            firms={firms} 
            isLoading={isLoading}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
