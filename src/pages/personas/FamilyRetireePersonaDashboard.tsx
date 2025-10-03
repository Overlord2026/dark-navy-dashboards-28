import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoldButton, GoldOutlineButton, GoldRouterLink, GoldOutlineRouterLink } from '@/components/ui/brandButtons';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Heart, Wallet, Home, Calculator, Play, Calendar, BookOpen, FileText, TrendingUp, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { SilentMuteToggle } from '@/components/voice/SilentMuteToggle';
import { Link } from 'react-router-dom';

const FamilyRetireePersonaDashboard = () => {
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    'core-tools': true,
    'planning-tools': false,
    'organizer-tools': false
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Core existing tools - preserved completely
  const coreTools = [
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
      title: 'Family Assets',
      description: 'Asset tracking and management',
      icon: <Wallet className="h-6 w-6" />,
      href: '/family/assets',
      category: 'Wealth Management'
    }
  ];

  // Enhanced planning tools with new additions
  const planningTools = [
    {
      title: 'Annuities Explorer',
      description: 'Income planning and guaranteed retirement income strategies',
      icon: <Calculator className="h-6 w-6" />,
      href: '/solutions/annuities',
      category: 'Income Planning',
      isNew: false
    },
    {
      title: 'Tax Planning Center',
      description: 'RMD optimization, tax-efficient withdrawals, and Roth conversions',
      icon: <FileText className="h-6 w-6" />,
      href: '/solutions/tax-planning',
      category: 'Tax Strategy',
      isNew: true
    },
    {
      title: 'Estate Planning Suite',
      description: 'Wills, trusts, legacy planning, and beneficiary management',
      icon: <Home className="h-6 w-6" />,
      href: '/estate/diy',
      category: 'Estate Planning',
      isNew: true
    },
    {
      title: 'Insurance Catalog',
      description: 'Long-term care, life insurance, and Medicare planning',
      icon: <Shield className="h-6 w-6" />,
      href: '/solutions/insurance',
      category: 'Insurance',
      isNew: false
    }
  ];

  // New retirement organizer tools
  const organizerTools = [
    {
      title: 'Retirement Organizer',
      description: 'Social Security optimization, pension tracking, and income coordination',
      icon: <TrendingUp className="h-6 w-6" />,
      href: '/retirement/organizer',
      category: 'Income Coordination',
      isNew: true
    },
    {
      title: 'Family Coordination Hub',
      description: 'Share plans with adult children and coordinate care decisions',
      icon: <Users className="h-6 w-6" />,
      href: '/family/coordination',
      category: 'Family Planning',
      isNew: true
    }
  ];

  const handleDemoLaunch = () => {
    // Demo launcher logic will be added
    console.log('Launching 90-second demo for retiree families');
  };

  const renderToolSection = (title: string, tools: any[], sectionId: string, description?: string) => {
    const isExpanded = expandedSections[sectionId];
    
    return (
      <div className="mb-8">
        <button
          onClick={() => toggleSection(sectionId)}
          className="w-full flex items-center justify-between p-4 bg-[#0B2239] rounded-xl border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-all duration-300 mb-4"
        >
          <div className="text-left">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {title}
              {tools.some(tool => tool.isNew) && (
                <Badge className="text-xs bg-[#D4AF37] text-black">
                  Enhanced
                </Badge>
              )}
            </h3>
            {description && (
              <p className="text-sm text-white/70 mt-1">{description}</p>
            )}
          </div>
          {isExpanded ? (
            <ChevronDown className="h-6 w-6 text-[#D4AF37]" />
          ) : (
            <ChevronRight className="h-6 w-6 text-[#D4AF37]" />
          )}
        </button>
        
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {tools.map((tool, index) => (
              <Card key={index} className="group hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)] transition-all duration-300 hover:-translate-y-1 bg-[#0B2239] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-300">
                        {tool.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                          {tool.title}
                          {tool.isNew && (
                            <Badge className="text-xs bg-[#D4AF37] text-black">
                              New
                            </Badge>
                          )}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1 bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30">
                          {tool.category}
                        </Badge>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/60 group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-white/80">
                    {tool.description}
                  </CardDescription>
                  <Button asChild className="w-full bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
                    <Link to={tool.href}>
                      Launch Tool
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B2239]">
      {/* Mute Linda Button - Fixed position, always visible */}
      <div className="fixed top-4 right-4 z-50">
        <SilentMuteToggle />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section - Enhanced but preserved */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <Badge className="mb-4 bg-[#D4AF37] text-black font-semibold">
            Retiree Families
          </Badge>
          <div className="flex items-center justify-center gap-8 mb-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#E1C04D] bg-clip-text text-transparent">
              Secure Your Golden Years
            </h1>
          </div>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Protect your legacy, manage your health, and ensure your family's financial security 
            with tools designed for retirees and their loved ones.
          </p>
          
          {/* Main CTAs - Enhanced styling but same functionality */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Button className="h-14 flex flex-col items-center justify-center gap-2 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
              <Link to="/discover?persona=family&solutions=estate%2Chealth%2Cannuities" className="flex flex-col items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>Open Catalog</span>
              </Link>
            </Button>
            
            <Button onClick={handleDemoLaunch} className="h-14 flex flex-col items-center justify-center gap-2 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-all duration-300">
              <Play className="h-5 w-5" />
              <span>Run 90-Second Demo</span>
            </Button>
            
            <Button className="h-14 flex flex-col items-center justify-center gap-2 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
              <Link to="/learn/family-retiree/starter" className="flex flex-col items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Book 15-Min Overview</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Enhanced Tools Sections */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-white">Family Protection Tools</h2>
            <p className="text-white/70">
              Everything you need to secure your family's future
            </p>
          </div>
          
          {renderToolSection(
            "Essential Tools", 
            coreTools, 
            "core-tools",
            "Your fundamental family protection and wealth management tools"
          )}
          
          {renderToolSection(
            "Advanced Planning", 
            planningTools, 
            "planning-tools",
            "Comprehensive tax, estate, and income planning solutions"
          )}
          
          {renderToolSection(
            "Retirement Organization", 
            organizerTools, 
            "organizer-tools",
            "Coordinate your retirement income and family planning"
          )}
        </div>

        {/* Start Workspace CTA - Enhanced styling but same functionality */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-[#0B2239] border-2 border-[#D4AF37]/30 shadow-[0_8px_32px_rgba(212,175,55,0.3)]">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-white">Ready to Get Started?</h3>
              <p className="text-white/80 mb-6">
                Set up your family workspace with document storage, health planning, and estate management tools.
              </p>
              <Button 
                asChild
                className="w-full md:w-auto flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-all duration-300"
              >
                <Link to="/start/families">
                  Start Workspace
                  <ArrowRight className="h-5 w-5" />
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