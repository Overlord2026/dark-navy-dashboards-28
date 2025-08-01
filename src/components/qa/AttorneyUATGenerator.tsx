import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  FileText, 
  Users, 
  CheckSquare, 
  MessageSquare,
  Star,
  Clock,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

export const AttorneyUATGenerator: React.FC = () => {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [customScenario, setCustomScenario] = useState('');
  const [feedbackQuestions, setFeedbackQuestions] = useState<string[]>([]);
  const [testDuration, setTestDuration] = useState('2 weeks');

  const uatScenarios = [
    {
      id: 'attorney-onboarding',
      category: 'Onboarding',
      title: 'Attorney Registration & Verification',
      description: 'Complete attorney signup, bar verification, and profile setup',
      priority: 'High',
      estimatedTime: '20 minutes',
      tasks: [
        'Sign up for attorney account with valid bar information',
        'Upload bar license documentation',
        'Complete professional profile including practice areas',
        'Verify email and phone number',
        'Review and accept terms of service',
        'Navigate through initial dashboard tour'
      ]
    },
    {
      id: 'client-invitation',
      category: 'Client Management',
      title: 'Client Invitation & Onboarding',
      description: 'Invite new client and guide through onboarding process',
      priority: 'High',
      estimatedTime: '30 minutes',
      tasks: [
        'Send invitation to new client via email',
        'Track invitation status in attorney dashboard',
        'Guide client through onboarding wizard',
        'Review client information and documents',
        'Establish attorney-client relationship',
        'Set communication preferences'
      ]
    },
    {
      id: 'document-collaboration',
      category: 'Document Management',
      title: 'Document Sharing & Collaboration',
      description: 'Share documents with clients and collaborate on revisions',
      priority: 'High',
      estimatedTime: '25 minutes',
      tasks: [
        'Upload legal documents to client folder',
        'Set document permissions and access levels',
        'Share documents with specific clients',
        'Add comments and annotations to documents',
        'Track document versions and changes',
        'Download and export shared documents'
      ]
    },
    {
      id: 'legal-library',
      category: 'Education',
      title: 'Legal Library & CLE Tracking',
      description: 'Browse legal resources and manage CLE requirements',
      priority: 'Medium',
      estimatedTime: '15 minutes',
      tasks: [
        'Search legal library for specific topics',
        'Open and navigate legal guides and e-books',
        'Add CLE requirements with deadlines',
        'Mark CLE courses as completed',
        'Set reminders for upcoming CLE deadlines',
        'Share legal resources with clients'
      ]
    },
    {
      id: 'communication',
      category: 'Communication',
      title: 'Client Communication & Messaging',
      description: 'Send messages and manage client communications',
      priority: 'Medium',
      estimatedTime: '20 minutes',
      tasks: [
        'Send secure messages to clients',
        'Attach documents to messages',
        'Schedule and manage client meetings',
        'Review communication history',
        'Set up notification preferences',
        'Use messaging templates for common communications'
      ]
    },
    {
      id: 'mobile-experience',
      category: 'Mobile',
      title: 'Mobile Attorney Dashboard',
      description: 'Access attorney features from mobile device',
      priority: 'Medium',
      estimatedTime: '15 minutes',
      tasks: [
        'Log in to attorney dashboard on mobile',
        'Navigate client list and details on phone',
        'Review and respond to messages on mobile',
        'Access documents from tablet',
        'Use document scanner feature',
        'Receive and respond to push notifications'
      ]
    }
  ];

  const standardFeedbackQuestions = [
    'How intuitive was the attorney onboarding process?',
    'Did the client invitation and onboarding flow work smoothly?',
    'How user-friendly is the document management system?',
    'Were you able to find legal resources easily in the library?',
    'How effective is the client communication system?',
    'What was your experience with the mobile version?',
    'How well does the platform protect attorney-client privilege?',
    'What features would you like to see added or improved?',
    'How likely are you to recommend this platform to colleagues?',
    'What challenges did you encounter during testing?'
  ];

  const toggleScenario = (scenarioId: string) => {
    setSelectedScenarios(prev => 
      prev.includes(scenarioId) 
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  const addCustomScenario = () => {
    if (customScenario.trim()) {
      const customId = `custom-${Date.now()}`;
      setSelectedScenarios(prev => [...prev, customId]);
      setCustomScenario('');
      toast.success('Custom scenario added to UAT script');
    }
  };

  const addFeedbackQuestion = (question: string) => {
    if (!feedbackQuestions.includes(question)) {
      setFeedbackQuestions(prev => [...prev, question]);
    }
  };

  const removeFeedbackQuestion = (index: number) => {
    setFeedbackQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const generateUATScript = () => {
    const selectedUATScenarios = uatScenarios.filter(scenario => 
      selectedScenarios.includes(scenario.id)
    );

    const script = {
      title: 'Attorney Platform User Acceptance Testing Script',
      testDuration,
      scenarios: selectedUATScenarios,
      feedbackQuestions,
      instructions: [
        'Complete each scenario in a realistic manner',
        'Take notes on any issues or unexpected behavior',
        'Rate the user experience for each scenario (1-5 stars)',
        'Provide detailed feedback using the feedback form',
        'Test both desktop and mobile experiences',
        'Report any security or privacy concerns immediately'
      ]
    };

    // Simulate download
    const blob = new Blob([JSON.stringify(script, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attorney-platform-uat-script.json';
    a.click();
    URL.revokeObjectURL(url);

    toast.success('UAT script generated and downloaded');
  };

  const generateFeedbackForm = () => {
    const feedbackForm = {
      title: 'Attorney Platform UAT Feedback Form',
      sections: [
        {
          title: 'Overall Experience',
          questions: [
            'Rate your overall experience with the attorney platform (1-5 stars)',
            'How easy was it to complete your testing scenarios?',
            'Did the platform meet your expectations for an attorney collaboration tool?'
          ]
        },
        {
          title: 'Feature-Specific Feedback',
          questions: feedbackQuestions
        },
        {
          title: 'Technical Issues',
          questions: [
            'Did you encounter any bugs or technical issues?',
            'Were there any performance problems (slow loading, etc.)?',
            'Did you experience any security or privacy concerns?'
          ]
        },
        {
          title: 'Improvement Suggestions',
          questions: [
            'What features would you like to see added?',
            'What existing features need improvement?',
            'Any suggestions for better attorney-client collaboration?'
          ]
        }
      ],
      instructions: [
        'Please provide detailed and honest feedback',
        'Include specific examples when possible',
        'Rate features on a scale of 1-5 stars',
        'Attach screenshots for any issues encountered',
        'Submit feedback within the testing period'
      ]
    };

    // Simulate download
    const blob = new Blob([JSON.stringify(feedbackForm, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attorney-platform-feedback-form.json';
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Feedback form generated and downloaded');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Attorney Platform UAT Generator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Generate comprehensive User Acceptance Testing scripts and feedback forms for real attorney test users
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Form</TabsTrigger>
          <TabsTrigger value="generate">Generate UAT</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Select UAT Scenarios
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose testing scenarios for attorney users to complete
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uatScenarios.map((scenario) => (
                  <div 
                    key={scenario.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedScenarios.includes(scenario.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-accent'
                    }`}
                    onClick={() => toggleScenario(scenario.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedScenarios.includes(scenario.id)}
                          onChange={() => toggleScenario(scenario.id)}
                          className="rounded"
                        />
                        <div>
                          <h4 className="font-medium">{scenario.title}</h4>
                          <p className="text-sm text-muted-foreground">{scenario.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={scenario.priority === 'High' ? 'destructive' : 'secondary'}>
                          {scenario.priority}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {scenario.estimatedTime}
                        </Badge>
                      </div>
                    </div>
                    
                    {selectedScenarios.includes(scenario.id) && (
                      <div className="mt-3 pl-6">
                        <h5 className="font-medium mb-2">Test Tasks:</h5>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          {scenario.tasks.map((task, idx) => (
                            <li key={idx}>{task}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Add Custom Scenario</h4>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Describe a custom testing scenario for attorneys..."
                    value={customScenario}
                    onChange={(e) => setCustomScenario(e.target.value)}
                  />
                  <Button onClick={addCustomScenario} disabled={!customScenario.trim()}>
                    Add Custom Scenario
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Feedback Questions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Customize feedback questions for attorney test users
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Standard Questions</h4>
                  <div className="space-y-2">
                    {standardFeedbackQuestions.map((question, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{question}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addFeedbackQuestion(question)}
                          disabled={feedbackQuestions.includes(question)}
                        >
                          {feedbackQuestions.includes(question) ? 'Added' : 'Add'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Selected Questions ({feedbackQuestions.length})</h4>
                  {feedbackQuestions.length > 0 ? (
                    <div className="space-y-2">
                      {feedbackQuestions.map((question, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-accent rounded">
                          <span className="text-sm">{question}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFeedbackQuestion(idx)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No questions selected yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Generate UAT Materials
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Create comprehensive UAT script and feedback form for attorney testing
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="test-duration">Test Duration</Label>
                    <Input
                      id="test-duration"
                      value={testDuration}
                      onChange={(e) => setTestDuration(e.target.value)}
                      placeholder="e.g., 2 weeks"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="text-sm text-muted-foreground">
                      {selectedScenarios.length} scenarios selected
                      <br />
                      {feedbackQuestions.length} feedback questions
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={generateUATScript}
                    disabled={selectedScenarios.length === 0}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Generate UAT Script
                  </Button>
                  <Button 
                    onClick={generateFeedbackForm}
                    disabled={feedbackQuestions.length === 0}
                    variant="outline"
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Generate Feedback Form
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium mb-2">UAT Testing Instructions</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Recruit 3-5 practicing attorneys for comprehensive testing</li>
                    <li>• Provide test accounts with sample client data</li>
                    <li>• Schedule kick-off call to explain testing objectives</li>
                    <li>• Set up weekly check-ins during testing period</li>
                    <li>• Encourage testers to use real-world workflows</li>
                    <li>• Collect feedback through multiple channels (form, calls, emails)</li>
                    <li>• Document all issues with screenshots and steps to reproduce</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};