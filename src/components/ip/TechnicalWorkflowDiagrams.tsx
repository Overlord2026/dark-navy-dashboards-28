import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, GitBranch, Database, Shield } from 'lucide-react';

export function TechnicalWorkflowDiagrams() {
  const [selectedDiagram, setSelectedDiagram] = useState('family-vault');

  const exportDiagram = (diagramId: string) => {
    // This would export the mermaid diagram as SVG/PNG
    console.log(`Exporting diagram: ${diagramId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gold via-primary to-emerald bg-clip-text text-transparent">
            Technical Workflow Diagrams
          </h2>
          <p className="text-muted-foreground">
            Detailed system architecture and workflow documentation for patent review
          </p>
        </div>
        <Button onClick={() => exportDiagram(selectedDiagram)} className="btn-primary-gold gap-2">
          <Download className="h-4 w-4" />
          Export Current Diagram
        </Button>
      </div>

      <Tabs value={selectedDiagram} onValueChange={setSelectedDiagram} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="family-vault">Family Vault</TabsTrigger>
          <TabsTrigger value="swag-scoring">SWAG Scoring</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="linda-ai">Linda AI</TabsTrigger>
        </TabsList>

        <TabsContent value="family-vault">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Family Legacy Vault™ Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">System Architecture Overview</h4>
                  <div className="text-sm space-y-2">
                    <p><strong>Encryption Layer:</strong> AES-256 end-to-end encryption with individual key management</p>
                    <p><strong>Access Control:</strong> Role-based permissions with biometric verification</p>
                    <p><strong>Time-Delayed Delivery:</strong> Scheduled message release based on events/dates</p>
                    <p><strong>Inheritance Chain:</strong> Blockchain-verified succession protocols</p>
                  </div>
                </div>
                
                <div className="mermaid-container bg-white p-4 border rounded-lg">
                  <div className="text-xs font-mono">
{`graph TD
    A[Family Member] --> B[Biometric Auth]
    B --> C[Vault Access Portal]
    C --> D[Role Verification]
    D --> E[Encrypted Storage Layer]
    E --> F[Message Repository]
    E --> G[File Storage]
    E --> H[Time-Delayed Queue]
    
    F --> I[AES-256 Encryption]
    G --> I
    H --> J[Event Triggers]
    J --> K[Automated Delivery]
    K --> L[Notification System]
    
    M[Inheritance Events] --> N[Blockchain Verification]
    N --> O[Access Permission Update]
    O --> C
    
    P[Admin Dashboard] --> Q[Family Tree Management]
    Q --> R[Permission Matrix]
    R --> D
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style E fill:#bbf,stroke:#333,stroke-width:2px
    style I fill:#bfb,stroke:#333,stroke-width:2px
    style N fill:#fbb,stroke:#333,stroke-width:2px`}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-blue-700">Novel Elements</h5>
                    <ul className="list-disc list-inside text-blue-600 mt-2">
                      <li>Multi-generational access control</li>
                      <li>Event-triggered message delivery</li>
                      <li>Blockchain inheritance verification</li>
                      <li>Biometric family tree authentication</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-green-700">Technical Innovation</h5>
                    <ul className="list-disc list-inside text-green-600 mt-2">
                      <li>Time-delayed cryptographic release</li>
                      <li>Role-based encryption keys</li>
                      <li>Automated inheritance protocols</li>
                      <li>Cross-generational data integrity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="swag-scoring">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                SWAG Lead Score™ Algorithm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Proprietary Scoring Methodology</h4>
                  <div className="text-sm space-y-2">
                    <p><strong>Data Sources:</strong> Plaid banking, Catchlight wealth data, social signals, behavioral patterns</p>
                    <p><strong>ML Model:</strong> Ensemble learning with 200+ features, real-time updating</p>
                    <p><strong>Scoring Range:</strong> 0-100 with confidence intervals and trend analysis</p>
                    <p><strong>Update Frequency:</strong> Real-time with monthly model retraining</p>
                  </div>
                </div>
                
                <div className="mermaid-container bg-white p-4 border rounded-lg">
                  <div className="text-xs font-mono">
{`graph LR
    A[Prospect Data] --> B[Data Ingestion Layer]
    B --> C[Plaid Banking API]
    B --> D[Catchlight Wealth API]
    B --> E[Social Signal Crawlers]
    B --> F[Behavioral Tracking]
    
    C --> G[Financial Pattern Analysis]
    D --> H[Wealth Verification]
    E --> I[Social Graph Analysis]
    F --> J[Engagement Scoring]
    
    G --> K[Feature Engineering]
    H --> K
    I --> K
    J --> K
    
    K --> L[ML Ensemble Model]
    L --> M[Random Forest]
    L --> N[Neural Network]
    L --> O[Gradient Boosting]
    
    M --> P[Score Aggregation]
    N --> P
    O --> P
    
    P --> Q[SWAG Score 0-100]
    Q --> R[Confidence Interval]
    Q --> S[Trend Prediction]
    
    T[Real-time Updates] --> U[Model Retraining]
    U --> L
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style L fill:#bbf,stroke:#333,stroke-width:2px
    style Q fill:#bfb,stroke:#333,stroke-width:2px`}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-purple-700">Financial Factors</h5>
                    <ul className="list-disc list-inside text-purple-600 mt-2">
                      <li>Account balances</li>
                      <li>Transaction patterns</li>
                      <li>Investment activity</li>
                      <li>Credit utilization</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-orange-700">Behavioral Signals</h5>
                    <ul className="list-disc list-inside text-orange-600 mt-2">
                      <li>Platform engagement</li>
                      <li>Content preferences</li>
                      <li>Response timing</li>
                      <li>Communication style</li>
                    </ul>
                  </div>
                  <div className="bg-teal-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-teal-700">Social Indicators</h5>
                    <ul className="list-disc list-inside text-teal-600 mt-2">
                      <li>Professional network</li>
                      <li>Company affiliations</li>
                      <li>Public statements</li>
                      <li>Investment interests</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Persona-Adaptive Onboarding Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Dynamic Persona Detection & Routing</h4>
                  <div className="text-sm space-y-2">
                    <p><strong>Persona Types:</strong> Advisor, Client, Accountant, Attorney, Insurance, IMO/FMO</p>
                    <p><strong>Detection Method:</strong> AI-powered classification based on initial responses and data</p>
                    <p><strong>Adaptive Workflows:</strong> Custom document flows, compliance requirements, feature access</p>
                    <p><strong>Integration:</strong> Real-time e-signature, document generation, tier assignment</p>
                  </div>
                </div>
                
                <div className="mermaid-container bg-white p-4 border rounded-lg">
                  <div className="text-xs font-mono">
{`graph TD
    A[User Registration] --> B[Initial Questionnaire]
    B --> C[AI Persona Classifier]
    C --> D{Persona Detection}
    
    D -->|Advisor| E[Advisor Onboarding]
    D -->|Client| F[Client Onboarding]
    D -->|Accountant| G[Accountant Onboarding]
    D -->|Attorney| H[Attorney Onboarding]
    D -->|Insurance| I[Insurance Onboarding]
    
    E --> J[License Verification]
    F --> K[Wealth Verification]
    G --> L[CPA Verification]
    H --> M[Bar Admission Check]
    I --> N[Insurance License Check]
    
    J --> O[Document Generation]
    K --> O
    L --> O
    M --> O
    N --> O
    
    O --> P[E-signature Workflow]
    P --> Q[Compliance Validation]
    Q --> R[Feature Access Assignment]
    R --> S[Dashboard Customization]
    S --> T[Onboarding Complete]
    
    U[Compliance Database] --> Q
    V[State Requirements] --> Q
    W[Regulatory APIs] --> Q
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#bbf,stroke:#333,stroke-width:2px
    style Q fill:#bfb,stroke:#333,stroke-width:2px
    style T fill:#fbf,stroke:#333,stroke-width:2px`}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-indigo-700">Innovation Highlights</h5>
                    <ul className="list-disc list-inside text-indigo-600 mt-2">
                      <li>Real-time persona classification</li>
                      <li>Regulatory compliance automation</li>
                      <li>Dynamic document generation</li>
                      <li>State-specific workflow adaptation</li>
                    </ul>
                  </div>
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-pink-700">Technical Uniqueness</h5>
                    <ul className="list-disc list-inside text-pink-600 mt-2">
                      <li>Multi-persona single platform</li>
                      <li>Automated compliance validation</li>
                      <li>Real-time feature provisioning</li>
                      <li>Integrated e-signature workflows</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="linda-ai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Linda Voice AI Meeting Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Voice AI Integration Architecture</h4>
                  <div className="text-sm space-y-2">
                    <p><strong>Voice Technology:</strong> VAPI/VOIP integration with custom NLP processing</p>
                    <p><strong>Communication:</strong> Dual-channel voice and SMS with firm branding</p>
                    <p><strong>AI Capabilities:</strong> Meeting confirmation, rescheduling, follow-up, reminders</p>
                    <p><strong>Integration:</strong> Calendar APIs, CRM sync, automated logging</p>
                  </div>
                </div>
                
                <div className="mermaid-container bg-white p-4 border rounded-lg">
                  <div className="text-xs font-mono">
{`graph TD
    A[Meeting Scheduled] --> B[Linda AI Trigger]
    B --> C[Client Contact Database]
    C --> D{Contact Preference}
    
    D -->|Voice| E[VOIP System]
    D -->|Text| F[SMS Gateway]
    
    E --> G[AI Voice Synthesis]
    F --> H[Branded SMS Template]
    
    G --> I[Natural Language Processing]
    H --> I
    
    I --> J[Response Analysis]
    J --> K{Client Response}
    
    K -->|Confirmed| L[Calendar Update]
    K -->|Reschedule| M[Alternative Scheduling]
    K -->|Cancel| N[Cancellation Processing]
    K -->|No Response| O[Follow-up Sequence]
    
    L --> P[Confirmation Logging]
    M --> Q[Reschedule Coordination]
    N --> R[Cancellation Notification]
    O --> S[Escalation to Human]
    
    P --> T[CRM Integration]
    Q --> T
    R --> T
    S --> T
    
    U[Firm Branding Database] --> G
    U --> H
    V[Compliance Monitoring] --> I
    W[Call Analytics] --> J
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style I fill:#bbf,stroke:#333,stroke-width:2px
    style T fill:#bfb,stroke:#333,stroke-width:2px`}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-cyan-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-cyan-700">AI Capabilities</h5>
                    <ul className="list-disc list-inside text-cyan-600 mt-2">
                      <li>Natural conversation flow</li>
                      <li>Context-aware responses</li>
                      <li>Multi-language support</li>
                      <li>Emotional intelligence</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-yellow-700">Integration Features</h5>
                    <ul className="list-disc list-inside text-yellow-600 mt-2">
                      <li>Calendar synchronization</li>
                      <li>CRM data integration</li>
                      <li>Compliance logging</li>
                      <li>Analytics dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}