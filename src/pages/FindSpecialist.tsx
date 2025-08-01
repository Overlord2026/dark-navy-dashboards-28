import React, { useState } from 'react';
import { AdvisorQuestionnaire } from '@/components/advisor-matching/AdvisorQuestionnaire';
import { AdvisorMatchResults } from '@/components/advisor-matching/AdvisorMatchResults';
import { ScenarioWidget } from '@/components/scenario-planning/ScenarioWidget';
// import { useAdvisorMatching } from '@/hooks/useAdvisorMatching';
// import { useScenarioPlanning } from '@/hooks/useScenarioPlanning';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FindSpecialist() {
  const [showResults, setShowResults] = useState(false);
  
  // Placeholder for advisor matching functionality
  const matches: any[] = [];
  const complexityScore = 0;
  const matchingLoading = false;
  const scenarioLoading = false;

  const handleQuestionnaireComplete = async (responses: any) => {
    console.log('Questionnaire responses:', responses);
    setShowResults(true);
  };

  const handleRunScenario = async (scenarioType: string, scenarioName: string, parameters: any) => {
    console.log('Running scenario:', { scenarioType, scenarioName, parameters });
  };

  const sendMessage = (message: string) => console.log('Sending message:', message);
  const bookMeeting = (meetingData: any) => console.log('Booking meeting:', meetingData);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Find Your Tax Specialist</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get matched with qualified CPAs and tax advisors using AI-powered analysis, 
          then explore tax strategies with interactive planning tools.
        </p>
      </div>

      <Tabs defaultValue="matching" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matching">Find Advisor</TabsTrigger>
          <TabsTrigger value="planning">Scenario Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="matching" className="space-y-8">
          {!showResults ? (
            <AdvisorQuestionnaire 
              onComplete={handleQuestionnaireComplete}
              loading={matchingLoading}
            />
          ) : (
            <AdvisorMatchResults
              matches={matches}
              complexityScore={complexityScore}
              onSendMessage={sendMessage}
              onBookMeeting={bookMeeting}
              loading={matchingLoading}
            />
          )}
        </TabsContent>

        <TabsContent value="planning" className="space-y-8">
          <ScenarioWidget 
            onRunScenario={handleRunScenario}
            loading={scenarioLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}