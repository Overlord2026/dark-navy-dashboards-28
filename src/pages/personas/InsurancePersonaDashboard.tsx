import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoldButton, GoldOutlineButton, GoldRouterLink, GoldOutlineRouterLink } from '@/components/ui/brandButtons';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, FileText, Calculator, AlertTriangle, Play, Calendar, BookOpen } from 'lucide-react';
import VoiceMic from '@/components/voice/VoiceMic';
import { Link } from 'react-router-dom';
import { PersonaSubHeader } from '@/components/layout/PersonaSubHeader';

const InsurancePersonaDashboard = () => {
  const [transcript, setTranscript] = useState('');
  const tools = [
    {
      title: 'Intake (Home/Auto)',
      description: 'Streamlined client intake and risk assessment',
      icon: <FileText className="h-6 w-6" />,
      href: '/insurance/intake',
      category: 'Onboarding'
    },
    {
      title: 'Quote Engine',
      description: 'Real-time quotes across multiple carriers',
      icon: <Calculator className="h-6 w-6" />,
      href: '/quotes/start',
      category: 'Sales'
    },
    {
      title: 'Bind Policies',
      description: 'Policy binding and activation workflow',
      icon: <Shield className="h-6 w-6" />,
      href: '/insurance/bind/new',
      category: 'Operations'
    },
    {
      title: 'FNOL (Claims)',
      description: 'First notice of loss and claims processing',
      icon: <AlertTriangle className="h-6 w-6" />,
      href: '/insurance/fnol/new',
      category: 'Claims'
    }
  ];

  const handleDemoLaunch = () => {
    // Demo launcher logic will be added
    console.log('Launching 90-second demo for insurance agents');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <PersonaSubHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <h2 className="text-lg font-semibold text-bfo-gold">Welcome back, Insurance Agent</h2>
            <p className="opacity-90 text-sm text-white">Manage your entire insurance workflow with modern tools</p>
          </div>
          <VoiceMic label="Record Notes" persona="insurance" autoSummarize={false} onTranscript={setTranscript} size="sm" />
        </div>
      </PersonaSubHeader>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-4">
            Insurance Agents
          </Badge>
          <div className="flex items-center justify-center gap-8 mb-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Streamline Your Insurance Operations
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            From client intake to claims processing, manage your entire insurance workflow 
            with modern tools designed for today's insurance professionals.
          </p>
          
          {/* Main CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <GoldOutlineButton className="h-14 flex flex-col items-center justify-center gap-2">
              <Link to="/discover?persona=insurance&solutions=auto%2Chome%2Clife" className="flex flex-col items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>Open Catalog</span>
              </Link>
            </GoldOutlineButton>
            
            <GoldButton onClick={handleDemoLaunch} className="h-14 flex flex-col items-center justify-center gap-2">
              <Play className="h-5 w-5" />
              <span>Run 90-Second Demo</span>
            </GoldButton>
            
            <GoldOutlineButton className="h-14 flex flex-col items-center justify-center gap-2">
              <Link to="/learn/insurance/starter" className="flex flex-col items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Book 15-Min Overview</span>
              </Link>
            </GoldOutlineButton>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Insurance Workflow Tools</h2>
            <p className="text-muted-foreground">
              Complete end-to-end insurance operations platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {tool.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {tool.description}
                  </CardDescription>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={tool.href}>
                      Launch Tool
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Start Workspace CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Set up your insurance workspace with client management, quoting tools, and claims processing.
              </p>
              <GoldRouterLink 
                to="/start/insurance"
                className="w-full md:w-auto flex items-center gap-2 px-6 py-3"
              >
                Start Workspace
                <ArrowRight className="h-5 w-5" />
              </GoldRouterLink>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InsurancePersonaDashboard;