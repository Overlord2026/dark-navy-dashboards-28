
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useAudience } from "@/context/AudienceContext";
import { AudienceSegmentSelector } from "@/components/audience/AudienceSegmentSelector";
import { RecommendedContentCard } from "@/components/audience/RecommendedContentCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Diamond, GraduationCap, Landmark, UserCircle } from "lucide-react";

export default function AudiencePreferencesPage() {
  const { currentSegment, currentProfile } = useAudience();
  
  const getSegmentIcon = () => {
    switch(currentSegment) {
      case 'aspiring':
        return <GraduationCap className="h-8 w-8 text-primary" />;
      case 'retiree':
        return <Landmark className="h-8 w-8 text-amber-500" />;
      case 'uhnw':
        return <Diamond className="h-8 w-8 text-indigo-500" />;
    }
  };

  return (
    <ThreeColumnLayout title="Profile & Preferences" activeMainItem="settings">
      <div className="container py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCircle className="h-8 w-8" />
            Wealth Profile & Preferences
          </h1>
          <p className="text-muted-foreground mt-2">
            Customize your experience and get tailored recommendations based on your financial journey.
          </p>
        </div>
        
        <div className="space-y-8">
          <AudienceSegmentSelector />
          
          <div className="bg-muted/60 p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              {getSegmentIcon()}
              <div>
                <h2 className="text-xl font-bold">{currentProfile.name} Profile</h2>
                <p className="text-muted-foreground">{currentProfile.description}</p>
              </div>
            </div>
            
            <Tabs defaultValue="recommendations">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="goals">Common Goals</TabsTrigger>
                <TabsTrigger value="challenges">Key Challenges</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommendations" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProfile.recommendedContent.map((content) => (
                    <RecommendedContentCard key={content.id} content={content} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="goals" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProfile.commonGoals.map((goal, idx) => (
                    <Card key={idx}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 p-1.5 rounded-full">
                            <Check className="h-5 w-5 text-green-600" />
                          </div>
                          <CardTitle className="text-base">{goal}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          A common financial objective for {currentProfile.name.toLowerCase()} individuals.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="challenges" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProfile.primaryChallenges.map((challenge, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-base">{challenge}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          Our advisors and tools can help you address this common challenge.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
