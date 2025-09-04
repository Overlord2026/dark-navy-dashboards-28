import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoldButton, GoldOutlineButton, GoldRouterLink, GoldOutlineRouterLink } from '@/components/ui/brandButtons';
import { Badge } from '@/components/ui/badge';
import VoiceMic from '@/components/voice/VoiceMic';
import { ArrowRight, TrendingUp, Home, Wallet, Shield, Calculator, Play, Calendar, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PersonaSubHeader } from '@/components/layout/PersonaSubHeader';

const FamilyAspiringPersonaDashboard = () => {
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState<any>(null);
  const tools = [
    {
      title: 'Wealth Vault',
      description: 'Organize and secure important documents',
      icon: <Shield className="h-6 w-6" />,
      href: '/family/vault/autofill-consent',
      category: 'Organization'
    },
    {
      title: 'Retirement Roadmap',
      description: 'Plan your path to financial independence',
      icon: <TrendingUp className="h-6 w-6" />,
      href: '/family/tools/retirement',
      category: 'Planning'
    },
    {
      title: 'Lending Solutions',
      description: 'Home buying and refinancing tools',
      icon: <Home className="h-6 w-6" />,
      href: '/solutions/lending',
      category: 'Lending'
    },
    {
      title: 'Insurance Catalog',
      description: 'Protect your growing wealth',
      icon: <Shield className="h-6 w-6" />,
      href: '/solutions/insurance',
      category: 'Protection'
    },
    {
      title: 'Investment Hub',
      description: 'Build your investment portfolio',
      icon: <Calculator className="h-6 w-6" />,
      href: '/solutions/investments',
      category: 'Investing'
    },
    {
      title: 'Family Assets',
      description: 'Track and grow your net worth',
      icon: <Wallet className="h-6 w-6" />,
      href: '/family/assets',
      category: 'Wealth Building'
    }
  ];

  const handleDemoLaunch = () => {
    // Demo launcher logic will be added
    console.log('Launching 90-second demo for aspiring families');
  };

  return (
    <div className="page-surface">
      <div className="container mx-auto px-4 py-8 pt-[var(--header-stack)]">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-4">
            Aspiring Families
          </Badge>
          <div className="flex items-center justify-center gap-8 mb-6">
             <h1 className="text-4xl md:text-6xl font-bold text-white">
               Build Your Financial Future
             </h1>
           </div>
           <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Start your wealth-building journey with the right tools and guidance. 
            From first home purchases to retirement planning, we're here to help you succeed.
          </p>
          
          {/* Main CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <GoldOutlineButton className="h-14 flex flex-col items-center justify-center gap-2">
              <Link to="/discover?persona=family&solutions=retirement%2Clending%2Cinvestments" className="flex flex-col items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>Open Catalog</span>
              </Link>
            </GoldOutlineButton>
            
            <GoldButton onClick={handleDemoLaunch} className="h-14 flex flex-col items-center justify-center gap-2">
              <Play className="h-5 w-5" />
              <span>Run 90-Second Demo</span>
            </GoldButton>
            
            <GoldOutlineButton className="h-14 flex flex-col items-center justify-center gap-2">
              <Link to="/learn/family-aspiring/starter" className="flex flex-col items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Book 15-Min Overview</span>
              </Link>
            </GoldOutlineButton>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-white">Wealth Building Tools</h2>
            <p className="text-white/80">
              Start building your financial foundation today
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-bfo-gold/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-bfo-gold/10 text-bfo-gold group-hover:bg-bfo-gold group-hover:text-black transition-colors">
                        {tool.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">{tool.title}</CardTitle>
                        <Badge className="text-xs mt-1 bg-bfo-gold text-black">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-bfo-gold" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-white/80">
                    {tool.description}
                  </CardDescription>
                  <Button asChild className="w-full bg-bfo-gold text-black hover:bg-bfo-gold/90">
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
          <Card className="max-w-2xl mx-auto bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-white">Ready to Get Started?</h3>
              <p className="text-white/80 mb-6">
                Set up your family workspace with financial planning tools, investment tracking, and goal management.
              </p>
              <GoldRouterLink 
                to="/start/families"
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

export default FamilyAspiringPersonaDashboard;