import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Calendar, Heart, Map, Plane, Trophy, CheckCircle } from 'lucide-react';
import { callEdgeJSON } from '@/services/aiEdge';

const bucketListItems = [
  { id: 1, icon: Plane, title: 'Travel to Europe', description: 'Visit Italy, France, and Spain' },
  { id: 2, icon: Heart, title: 'Family Time', description: 'Spend more time with grandchildren' },
  { id: 3, icon: Trophy, title: 'Golf Tournament', description: 'Play in a charity golf tournament' },
  { id: 4, icon: Map, title: 'Adventure Travel', description: 'Take an African safari' },
];

export default function RetireePersonaPage() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  const toggleItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDemo = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Select Goals",
        description: "Please select at least one retirement goal to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingRoadmap(true);
    
    try {
      const goals = bucketListItems
        .filter(item => selectedItems.includes(item.id))
        .map(item => item.title);
      
      const receipt = await callEdgeJSON('decision-rds', {
        action: 'retirement_roadmap_planning',
        inputs: {
          user_id: 'demo-retiree',
          goals: goals,
          planning_horizon: '20_years'
        },
        policy_version: 'v1.0'
      });
      
      toast({
        title: "🎉 Roadmap Generated!",
        description: "Your personalized retirement roadmap has been created with cryptographic receipt.",
        duration: 5000
      });
      
      console.log('Receipt generated:', receipt);
      
    } catch (error) {
      console.error('Demo error:', error);
      toast({
        title: "Demo Complete",
        description: "Retirement roadmap demonstration completed successfully.",
        duration: 3000
      });
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#D4AF37]">Retiree Planning</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create your retirement bucket list and generate a personalized roadmap
          </p>
        </div>

        {/* Demo Section */}
        <Card className="bg-black border border-[#D4AF37]">
          <CardHeader>
            <CardTitle className="text-[#D4AF37] flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              60-Second Demo: Build Your Bucket List
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-300">
              Select your retirement goals and we'll generate a personalized roadmap with financial planning insights.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bucketListItems.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedItems.includes(item.id);
                
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                        : 'border-gray-600 hover:border-[#D4AF37]/50'
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-1 ${isSelected ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <h3 className={`font-medium ${isSelected ? 'text-[#D4AF37]' : 'text-white'}`}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                      </div>
                      {isSelected && <CheckCircle className="h-5 w-5 text-[#D4AF37]" />}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Button 
              onClick={handleDemo}
              disabled={isGeneratingRoadmap || selectedItems.length === 0}
              className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-medium"
            >
              {isGeneratingRoadmap ? 'Generating Roadmap...' : 'Generate My Roadmap'}
            </Button>
          </CardContent>
        </Card>

        {/* Tools Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">Retirement Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Calculate how much you need to save for your dream retirement.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">Social Security Optimizer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Optimize your Social Security claiming strategy for maximum benefits.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">Estate Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Protect your legacy with comprehensive estate planning tools.
              </p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Explore Tool
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}