
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Investments = () => {
  return (
    <ThreeColumnLayout activeMainItem="investments" title="Investments">
      <div className="space-y-8">
        {/* Alternative Assets Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Alternative Assets</h2>
            <Button variant="outline" asChild className="flex items-center gap-1">
              <Link to="/investments/alternative/all">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
              <div className="flex flex-col gap-2">
                <div className="text-muted-foreground text-sm">Total Alternative Value</div>
                <div className="text-3xl font-bold">$580,000</div>
                <div className="text-emerald-500 text-sm">↑ 12.7% from last year</div>
              </div>
            </div>
            
            <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
              <div className="flex flex-col gap-2">
                <div className="text-muted-foreground text-sm">Average Performance</div>
                <div className="text-3xl font-bold text-emerald-500">+10.9%</div>
                <div className="text-muted-foreground text-sm">Annualized returns</div>
              </div>
            </div>
            
            <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
              <div className="flex flex-col gap-2">
                <div className="text-muted-foreground text-sm">Risk Assessment</div>
                <div className="text-3xl font-bold">Medium-High</div>
                <div className="text-muted-foreground text-sm">Overall portfolio risk level</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Alternative Investment Categories</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/investments/alternative/private-equity" className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 3V21" stroke="currentColor" strokeWidth="2" />
                      <path d="M3 12H21" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-emerald-500">+12.4% YTD</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Private Equity</h4>
                    <p className="text-muted-foreground text-sm mt-1">Investments in non-public companies, buyouts, growth</p>
                  </div>
                  <div className="flex justify-end">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
              
              <Link to="/investments/alternative/private-debt" className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                      <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M7 6V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M17 6V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M7 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M7 16H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-emerald-500">+8.7% YTD</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Private Debt</h4>
                    <p className="text-muted-foreground text-sm mt-1">Direct lending, mezzanine financing, distressed debt</p>
                  </div>
                  <div className="flex justify-end">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
              
              <Link to="/investments/alternative/digital-assets" className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500">
                      <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="text-red-500">-8.7% YTD</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Digital Assets</h4>
                    <p className="text-muted-foreground text-sm mt-1">Cryptocurrencies, NFTs, blockchain investments</p>
                  </div>
                  <div className="flex justify-end">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
              
              <Link to="/investments/alternative/real-assets" className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 block">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-500">
                      <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M5 21V7L13 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M19 21V10L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 9V9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 12V12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 15V15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-emerald-500">+9.1% YTD</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Real Assets</h4>
                    <p className="text-muted-foreground text-sm mt-1">Real estate, infrastructure, commodities</p>
                  </div>
                  <div className="flex justify-end">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Investments;
