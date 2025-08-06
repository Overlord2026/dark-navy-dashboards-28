import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Users, Play, AlertTriangle, CheckCircle, MessageCircle, Shield, Heart, Star } from 'lucide-react';

const trainingSections = {
  persona: {
    title: "Athlete Persona Profile",
    icon: Users,
    content: {
      needs: [
        "Financial education without overwhelming complexity",
        "Practical, actionable advice for their unique situation",
        "Privacy and confidentiality protection",
        "Guidance on career transitions and life planning",
        "Support for mental health and wellbeing",
        "Connection to trusted, fiduciary advisors"
      ],
      painPoints: [
        "Overwhelmed by financial complexity",
        "Distrust of advisors due to past bad experiences",
        "Fear of being taken advantage of",
        "Anxiety about life after sports",
        "Pressure from family and friends for financial support",
        "Identity crisis during career transitions"
      ],
      motivations: [
        "Protecting their family's future",
        "Building generational wealth",
        "Making smart financial decisions",
        "Finding purpose beyond sports",
        "Giving back to their community",
        "Maintaining financial independence"
      ]
    }
  },
  demo: {
    title: "Demo Walkthrough Guide",
    icon: Play,
    content: {
      steps: [
        {
          step: "Welcome & Overview",
          details: "Start with the athlete's goals and current situation. Show how the platform is designed specifically for their needs."
        },
        {
          step: "Navigation Tour",
          details: "Walk through the main sections: Education Center, Assessment Tools, Copilot Chat, and Advisor Marketplace."
        },
        {
          step: "Module Preview",
          details: "Show 1-2 relevant modules based on their interest (NIL for college athletes, retirement planning for pros)."
        },
        {
          step: "Assessment Demo",
          details: "Have them take the quick financial readiness quiz to demonstrate personalized recommendations."
        },
        {
          step: "Copilot Interaction",
          details: "Show how the AI Copilot works and when it escalates to human advisors."
        },
        {
          step: "Privacy & Security",
          details: "Emphasize data protection, no SSN required, and confidential support options."
        }
      ]
    }
  },
  guidelines: {
    title: "Do's and Don'ts",
    icon: AlertTriangle,
    content: {
      dos: [
        "Always emphasize privacy and confidentiality first",
        "Use athlete-specific examples and terminology",
        "Focus on their unique financial challenges",
        "Be transparent about fiduciary responsibilities",
        "Validate their concerns about predatory advisors",
        "Offer emotional support for career transitions",
        "Connect them with peer mentors when appropriate",
        "Respect their time constraints during season"
      ],
      donts: [
        "Never ask for SSN or sensitive financial data upfront",
        "Don't promise specific investment returns",
        "Avoid overwhelming them with technical jargon",
        "Don't dismiss their concerns about family pressure",
        "Never rush them into any commitments",
        "Don't ignore mental health aspects",
        "Avoid comparisons to other athletes without permission",
        "Don't assume they understand complex financial concepts"
      ]
    }
  },
  scripts: {
    title: "Role-Play Scripts",
    icon: MessageCircle,
    content: {
      scenarios: [
        {
          situation: "Athlete concerned about family asking for money",
          response: "This is one of the most common concerns we hear. Our Family & Friends module specifically addresses this challenge. We can help you create boundaries while still supporting your loved ones in a sustainable way. Would you like to see some strategies other athletes have used?"
        },
        {
          situation: "Athlete skeptical about financial advisors",
          response: "I completely understand that skepticism - unfortunately, too many athletes have been taken advantage of. That's exactly why we only work with fiduciary advisors who are legally required to put your interests first. Our platform helps you learn how to identify and vet trustworthy professionals."
        },
        {
          situation: "Athlete worried about life after sports",
          response: "Career transitions are challenging for everyone, but especially for athletes who've dedicated their lives to their sport. Our Second Act module and Copilot support are designed specifically for this. We also connect you with other athletes who've successfully navigated this transition. You're not alone in this."
        },
        {
          situation: "College athlete asking about NIL deals",
          response: "NIL can be incredible opportunities, but also potential traps if you're not careful. Our NIL module breaks down exactly what to look for in contracts, red flags to avoid, and how to structure deals for maximum benefit. We can also connect you with attorneys who specialize in athlete contracts."
        }
      ]
    }
  },
  referral: {
    title: "Referral Process Overview",
    icon: Star,
    content: {
      process: [
        "Initial platform engagement and education",
        "Assessment completion and personalized recommendations",
        "Copilot interaction to understand specific needs",
        "Advisor matching based on location, specialization, and personality fit",
        "Introduction facilitation with clear expectations",
        "Ongoing support and relationship monitoring",
        "Feedback collection and continuous improvement"
      ],
      criteria: [
        "Fiduciary obligation requirement",
        "Experience working with athletes",
        "Fee transparency and reasonable structure",
        "Cultural fit and communication style",
        "Geographic accessibility or virtual capability",
        "Specialization in relevant areas (taxes, contracts, etc.)",
        "Positive references from other athlete clients"
      ]
    }
  },
  escalation: {
    title: "Escalation & Hand-off Workflow",
    icon: Shield,
    content: {
      triggers: [
        "Mental health crisis indicators",
        "Complex financial situations requiring immediate attention",
        "Legal issues or contract disputes",
        "Family or relationship conflicts affecting finances",
        "Substance abuse concerns",
        "Urgent career transition support needs"
      ],
      process: [
        "Immediate assessment of urgency level",
        "Documentation of situation and context",
        "Appropriate resource mobilization (counselor, advisor, attorney)",
        "Warm handoff with proper introduction",
        "Follow-up scheduling and monitoring",
        "Continued platform support as appropriate"
      ],
      resources: [
        "Licensed mental health counselors",
        "Fiduciary financial advisors",
        "Sports attorneys and agents",
        "Career transition specialists",
        "Peer mentor network",
        "Crisis intervention services"
      ]
    }
  }
};

export function AthleteTrainingManual() {
  const [activeSection, setActiveSection] = useState('persona');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Athlete & Entertainer Training Manual
          </CardTitle>
          <p className="text-muted-foreground">
            Comprehensive guide for advisors and staff working with athletes and entertainers
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="persona">Persona</TabsTrigger>
          <TabsTrigger value="demo">Demo</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="scripts">Scripts</TabsTrigger>
          <TabsTrigger value="referral">Referral</TabsTrigger>
          <TabsTrigger value="escalation">Escalation</TabsTrigger>
        </TabsList>

        <TabsContent value="persona">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {trainingSections.persona.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-accent" />
                  Unique Needs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {trainingSections.persona.content.needs.map((need, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-accent/10 rounded">
                      <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{need}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Pain Points
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {trainingSections.persona.content.painPoints.map((pain, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-destructive/10 rounded">
                      <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{pain}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Motivations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {trainingSections.persona.content.motivations.map((motivation, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-primary/10 rounded">
                      <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{motivation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                {trainingSections.demo.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingSections.demo.content.steps.map((step, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="flex-shrink-0">
                        Step {index + 1}
                      </Badge>
                      <div>
                        <h4 className="font-semibold mb-2">{step.step}</h4>
                        <p className="text-sm text-muted-foreground">{step.details}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {trainingSections.guidelines.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-accent">✓ DO's</h3>
                <div className="space-y-2">
                  {trainingSections.guidelines.content.dos.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-accent/10 rounded">
                      <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-destructive">⚠ DON'Ts</h3>
                <div className="space-y-2">
                  {trainingSections.guidelines.content.donts.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-destructive/10 rounded">
                      <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scripts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {trainingSections.scripts.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {trainingSections.scripts.content.scenarios.map((scenario, index) => (
                  <AccordionItem key={index} value={`scenario-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="text-sm font-medium">{scenario.situation}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm italic">"{scenario.response}"</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referral">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                {trainingSections.referral.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Referral Process</h3>
                <div className="space-y-3">
                  {trainingSections.referral.content.process.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Advisor Selection Criteria</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {trainingSections.referral.content.criteria.map((criterion, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-secondary/10 rounded">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{criterion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {trainingSections.escalation.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-destructive">Escalation Triggers</h3>
                <div className="space-y-2">
                  {trainingSections.escalation.content.triggers.map((trigger, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-destructive/10 rounded">
                      <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{trigger}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Escalation Process</h3>
                <div className="space-y-3">
                  {trainingSections.escalation.content.process.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Available Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {trainingSections.escalation.content.resources.map((resource, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-accent/10 rounded">
                      <Shield className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{resource}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}