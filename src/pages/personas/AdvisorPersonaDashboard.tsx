import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoldButton, GoldOutlineButton, GoldRouterLink, GoldOutlineRouterLink } from '@/components/ui/brandButtons';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calculator, FileText, TrendingUp, Users, Play, Calendar, BookOpen } from 'lucide-react';
import { VoiceDrawer } from '@/components/voice/VoiceDrawer';
import { Link } from 'react-router-dom';
import { PersonaSubHeader } from '@/components/layout/PersonaSubHeader';

const AdvisorPersonaDashboard = () => {
  const tools = [
    {
      title: 'Retirement Roadmap',
      description: 'Comprehensive retirement planning tool',
      icon: <TrendingUp className="h-6 w-6" />,
      href: '/family/tools/retirement',
      category: 'Planning'
    },
    {
      title: 'Roth Conversion Analyzer',
      description: 'Optimize Roth conversion strategies',
      icon: <Calculator className="h-6 w-6" />,
      href: '/family/tools/roth-ladder',
      category: 'Tax Planning'
    },
    {
      title: 'Estate Workbench',
      description: 'Estate planning and document management',
      icon: <FileText className="h-6 w-6" />,
      href: '/estate/workbench',
      category: 'Estate Planning'
    },
    {
      title: 'Tax Projector',
      description: 'Multi-year tax projection scenarios',
      icon: <Calculator className="h-6 w-6" />,
      href: '/family/tools/taxhub-preview',
      category: 'Tax Planning'
    },
    {
      title: '401(k) Control Plane',
      description: 'RMD calculations and compliance',
      icon: <Users className="h-6 w-6" />,
      href: '/family/tools/rmd-check',
      category: 'Retirement'
    },
    {
      title: 'Client Vault',
      description: 'Secure document management',
      icon: <FileText className="h-6 w-6" />,
      href: '/family/vault/autofill-consent',
      category: 'Management'
    }
  ];

  const handleDemoLaunch = () => {
    // Demo launcher logic will be added
    console.log('Launching 90-second demo for advisors');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <PersonaSubHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <h2 className="text-lg font-semibold text-bfo-gold">Welcome back, Financial Advisor</h2>
            <p className="opacity-90 text-sm text-white">Your professional dashboard and automation tools live here</p>
          </div>
          <VoiceDrawer triggerLabel="🎙️ Ask AI" persona="advisor" endpoint="meeting-summary" />
        </div>
      </PersonaSubHeader>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-4">
            Financial Advisors
          </Badge>
          <div className="flex items-center justify-center gap-8 mb-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Grow Your Practice with Confidence
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Access professional-grade planning tools, automate compliance workflows, 
            and deliver exceptional client experiences with our integrated advisor platform.
          </p>
          
          {/* Main CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <GoldOutlineButton className="h-14 flex flex-col items-center justify-center gap-2">
              <Link to="/discover?persona=advisor&solutions=retirement%2Ctax" className="flex flex-col items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>Open Catalog</span>
              </Link>
            </GoldOutlineButton>
            
            <GoldButton onClick={handleDemoLaunch} className="h-14 flex flex-col items-center justify-center gap-2">
              <Play className="h-5 w-5" />
              <span>Run 90-Second Demo</span>
            </GoldButton>
            
            <GoldOutlineButton className="h-14 flex flex-col items-center justify-center gap-2">
              <Link to="/learn/advisor/starter" className="flex flex-col items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Book 15-Min Overview</span>
              </Link>
            </GoldOutlineButton>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Professional Tools</h2>
            <p className="text-muted-foreground">
              Everything you need to serve clients and grow your practice
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Tools Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Professional Advisor Tools</h2>
            <p className="text-muted-foreground">
              Essential planning tools to serve your clients better
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Retirement Roadmap</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">Planning</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Comprehensive retirement planning and analysis for client portfolios
                </CardDescription>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/advisors/tools/retirement">Launch Tool</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Estate Planning</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">Legal</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Estate planning strategies and document generation tools
                </CardDescription>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/advisors/tools/estate">Launch Tool</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Tax Planning</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">Analysis</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Advanced tax scenarios and optimization strategies
                </CardDescription>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/tools/tax">Launch Tool</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Set up your advisor workspace with client management, planning tools, and compliance tracking.
              </p>
              <GoldRouterLink 
                to="/start/advisors"
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

export default AdvisorPersonaDashboard;