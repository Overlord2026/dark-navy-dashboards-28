import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Heart, Wallet, Home, Calculator, Play, Calendar, BookOpen } from 'lucide-react';
import VoiceMic from '@/components/voice/VoiceMic';
import { Link } from 'react-router-dom';
import { PersonaSubHeader } from '@/components/layout/PersonaSubHeader';

const FamilyRetireePersonaDashboard = () => {
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState<any>(null);
  const tools = [
    {
      title: 'Wealth Vault',
      description: 'Secure document storage and family records',
      icon: <Shield className="h-6 w-6" />,
      href: '/family/vault/autofill-consent',
      category: 'Security'
    },
    {
      title: 'Health Hub',
      description: 'Healthcare directives and medical planning',
      icon: <Heart className="h-6 w-6" />,
      href: '/estate/healthcare',
      category: 'Healthcare'
    },
    {
      title: 'Annuities Explorer',
      description: 'Income planning and annuity analysis',
      icon: <Calculator className="h-6 w-6" />,
      href: '/solutions/annuities',
      category: 'Income Planning'
    },
    {
      title: 'Estate Planning',
      description: 'Legacy planning and asset distribution',
      icon: <Home className="h-6 w-6" />,
      href: '/estate/diy',
      category: 'Estate Planning'
    },
    {
      title: 'Insurance Catalog',
      description: 'Long-term care and life insurance options',
      icon: <Shield className="h-6 w-6" />,
      href: '/solutions/insurance',
      category: 'Insurance'
    },
    {
      title: 'Family Assets',
      description: 'Asset tracking and management',
      icon: <Wallet className="h-6 w-6" />,
      href: '/family/assets',
      category: 'Wealth Management'
    }
  ];

  const handleDemoLaunch = () => {
    // Demo launcher logic will be added
    console.log('Launching 90-second demo for retiree families');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <PersonaSubHeader 
        title="Welcome back, Retiree Family"
        subtitle="Manage your retirement with confidence and clarity"
        right={<VoiceMic label="Speak" persona="family" autoSummarize onTranscript={setTranscript} onSummary={setSummary} size="sm" />}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-4">
            Retiree Families
          </Badge>
          <div className="flex items-center justify-center gap-8 mb-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Secure Your Golden Years
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Protect your legacy, manage your health, and ensure your family's financial security 
            with tools designed for retirees and their loved ones.
          </p>
          
          {/* Main CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <GoldOutlineButton className="h-14 flex flex-col items-center justify-center gap-2">
              <Link to="/discover?persona=family&solutions=estate%2Chealth%2Cannuities" className="flex flex-col items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>Open Catalog</span>
              </Link>
            </GoldOutlineButton>
            
            <GoldButton onClick={handleDemoLaunch} className="h-14 flex flex-col items-center justify-center gap-2">
              <Play className="h-5 w-5" />
              <span>Run 90-Second Demo</span>
            </GoldButton>
            
            <GoldOutlineButton className="h-14 flex flex-col items-center justify-center gap-2">
              <Link to="/learn/family-retiree/starter" className="flex flex-col items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Book 15-Min Overview</span>
              </Link>
            </GoldOutlineButton>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Family Protection Tools</h2>
            <p className="text-muted-foreground">
              Everything you need to secure your family's future
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

        {/* Start Workspace CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Set up your family workspace with document storage, health planning, and estate management tools.
              </p>
              <Button asChild size="lg" className="w-full md:w-auto">
                <Link to="/start/families">
                  Start Workspace
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FamilyRetireePersonaDashboard;