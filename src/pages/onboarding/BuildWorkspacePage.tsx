import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getToolRoute, TOOL_METADATA } from '@/config/toolsRegistry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar-shadcn';
import { SilentMuteToggle } from '@/components/voice/SilentMuteToggle';
import { 
  Target, 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  Home, 
  Calculator, 
  FileText, 
  Shield, 
  Crown, 
  ArrowRight,
  CheckCircle,
  Lock
} from 'lucide-react';

const BuildWorkspacePage = () => {
  const [searchParams] = useSearchParams();
  const persona = searchParams.get('persona') || 'aspiring';
  const [selectedTier, setSelectedTier] = useState<string>('');
  const navigate = useNavigate();

  // Core features available to all users - using existing component routes
  const coreFeatures = [
    {
      title: TOOL_METADATA.goals.title,
      description: TOOL_METADATA.goals.description,
      icon: Target,
      href: TOOL_METADATA.goals.route,
      available: true
    },
    {
      title: TOOL_METADATA.budget.title,
      description: TOOL_METADATA.budget.description,
      icon: Wallet,
      href: TOOL_METADATA.budget.route,
      available: true
    },
    {
      title: TOOL_METADATA.cashflow.title,
      description: TOOL_METADATA.cashflow.description,
      icon: TrendingUp,
      href: TOOL_METADATA.cashflow.route,
      available: true
    },
    {
      title: TOOL_METADATA.transactions.title,
      description: TOOL_METADATA.transactions.description,
      icon: CreditCard,
      href: TOOL_METADATA.transactions.route,
      available: true
    }
  ];

  // Premium tools requiring subscription
  const premiumTools = [
    {
      title: 'Wealth Wall',
      description: 'Complete net worth visualization and asset tracking',
      icon: Shield,
      tier: 'Premium',
      price: '$29/month'
    },
    {
      title: 'Retirement Roadmap',
      description: 'Advanced retirement planning with scenario modeling',
      icon: Home,
      tier: 'Premium',
      price: '$29/month'
    },
    {
      title: 'Tax Planner',
      description: 'Tax optimization strategies and planning tools',
      icon: Calculator,
      tier: 'Pro',
      price: '$59/month'
    },
    {
      title: 'Estate Organizer',
      description: 'Estate planning documents and beneficiary management',
      icon: FileText,
      tier: 'Pro',
      price: '$59/month'
    }
  ];

  const pricingTiers = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Essential financial tracking',
      features: ['Goals & Budget', 'Cash Flow Tracking', 'Transaction Management', 'Basic Reports'],
      current: true
    },
    {
      name: 'Premium',
      price: '$29',
      period: '/month',
      description: 'Advanced wealth management',
      features: ['Everything in Basic', 'Wealth Wall', 'Retirement Roadmap', 'Investment Tracking', 'Advanced Analytics'],
      popular: true
    },
    {
      name: 'Pro',
      price: '$59',
      period: '/month',
      description: 'Complete financial planning',
      features: ['Everything in Premium', 'Tax Planning Tools', 'Estate Organization', 'Professional Collaboration', 'Priority Support'],
      enterprise: true
    }
  ];

  const personaConfig = {
    aspiring: {
      title: 'Building Wealth Dashboard',
      subtitle: 'Start your journey to financial independence',
      primaryAction: 'Start Building Wealth',
      href: '/families/aspiring',
      description: 'Track goals, build emergency funds, and establish smart saving habits',
      keyFeatures: ['Emergency Fund Builder', 'Debt Payoff Tracker', 'Investment Learning Hub', 'Career Growth Tools']
    },
    retiree: {
      title: 'Retirement Management Dashboard', 
      subtitle: 'Secure and optimize your golden years',
      primaryAction: 'Manage Retirement',
      href: '/families/retirees',
      description: 'Optimize income, protect assets, and plan your legacy',
      keyFeatures: ['RMD Calculator', 'Healthcare Planning', 'Estate Organization', 'Income Optimization']
    }
  };

  const config = personaConfig[persona as keyof typeof personaConfig] || personaConfig.aspiring;

  // Enhanced sidebar with persona-specific features using shadcn sidebar
  const AppSidebar = () => (
    <Sidebar className="w-64 bg-[#0B2239] border-r border-[#D4AF37]/30">
      <SidebarContent>
        {/* Persona Header */}
        <div className="p-4 pb-4 border-b border-[#D4AF37]/20">
          <Badge className="mb-2 bg-[#D4AF37] text-black font-semibold text-xs">
            {persona === 'aspiring' ? 'Aspiring Families' : 'Retiree Families'}
          </Badge>
          <h2 className="text-white font-bold text-lg leading-tight">
            {config.title}
          </h2>
          <p className="text-white/70 text-xs mt-1">
            {config.description}
          </p>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[#D4AF37] font-semibold text-sm uppercase tracking-wide">
            Core Features
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {coreFeatures.map((feature) => (
                <SidebarMenuItem key={feature.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-colors">
                    <Link to={feature.href}>
                      <feature.icon className="h-4 w-4 mr-3" />
                      <span className="text-sm font-medium">{feature.title}</span>
                      <CheckCircle className="h-3 w-3 ml-auto text-green-400" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[#D4AF37] font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Premium Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {premiumTools.map((tool) => (
                <SidebarMenuItem key={tool.title}>
                  <SidebarMenuButton className="text-white/60 hover:bg-[#0B2239]/80 cursor-not-allowed">
                    <tool.icon className="h-4 w-4 mr-3 opacity-60" />
                    <span className="text-sm opacity-60">{tool.title}</span>
                    <Lock className="h-3 w-3 ml-auto opacity-60" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );

  return (
    <div className="min-h-screen bg-[#0B2239]">
      {/* Mute Linda Button - Fixed position, always visible */}
      <div className="fixed top-4 right-4 z-50">
        <SilentMuteToggle />
      </div>
      
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          
          <main className="flex-1 p-8">
            {/* Header */}
            <div className="mb-8">
              <Badge className="mb-4 bg-[#D4AF37] text-black font-semibold">
                {persona === 'aspiring' ? 'Aspiring Families' : 'Retiree Families'}
              </Badge>
              <h1 className="text-4xl font-bold text-white mb-2">
                {config.title}
              </h1>
              <p className="text-white/80 text-lg mb-6">
                {config.subtitle}
              </p>
              
              <div className="flex gap-4">
                <Button 
                  asChild
                  className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold px-6 py-3"
                >
                  <Link to={config.href}>
                    {config.primaryAction}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                >
                  Take a Tour
                </Button>
              </div>
            </div>

            {/* Enhanced Dashboard Preview with Persona-Specific Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              <Card className="bg-[#0B2239] border-2 border-[#D4AF37]/50 shadow-[0_8px_32px_rgba(212,175,55,0.3)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Available Now - Your {persona === 'aspiring' ? 'Wealth Building' : 'Retirement'} Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-4">
                    {config.description}
                  </p>
                   <div className="space-y-3">
                     {coreFeatures.map((feature) => (
                       <Link key={feature.title} to={feature.href} className="block">
                         <div className="flex items-center gap-3 p-3 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition-colors cursor-pointer">
                           <feature.icon className="h-5 w-5 text-[#D4AF37]" />
                           <div className="flex-1">
                             <span className="text-white font-medium block">{feature.title}</span>
                             <span className="text-white/60 text-sm">{feature.description}</span>
                           </div>
                           <CheckCircle className="h-4 w-4 text-green-400" />
                         </div>
                       </Link>
                     ))}
                  </div>
                  
                  {/* Persona-specific features */}
                  <div className="mt-4 pt-4 border-t border-[#D4AF37]/20">
                    <h4 className="text-[#D4AF37] font-semibold text-sm mb-2">Specialized For You:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {config.keyFeatures.map((feature, index) => (
                        <div key={index} className="text-xs text-white/80 flex items-center gap-1">
                          <Target className="h-3 w-3 text-[#D4AF37]" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0B2239]/80 border-2 border-[#D4AF37] shadow-[0_8px_24px_rgba(212,175,55,0.4)]">
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--luxury-white))] flex items-center gap-2">
                    <Crown className="h-5 w-5 text-[hsl(var(--luxury-gold))]" />
                    Upgrade for Full Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[hsl(var(--luxury-white))]/80 mb-4">
                    Unlock advanced {persona === 'aspiring' ? 'wealth building' : 'retirement planning'} and optimization tools with a Premium or Pro subscription.
                  </p>
                  <div className="space-y-3">
                    {premiumTools.slice(0, 2).map((tool) => (
                      <div key={tool.title} className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--luxury-gold))]/10 border border-[hsl(var(--luxury-gold))]/30">
                        <tool.icon className="h-5 w-5 text-[hsl(var(--luxury-gold))]" />
                        <div className="flex-1">
                          <span className="text-[hsl(var(--luxury-white))] font-medium block">{tool.title}</span>
                          <span className="text-[hsl(var(--luxury-white))]/60 text-sm">{tool.description}</span>
                        </div>
                        <Badge className="bg-[hsl(var(--luxury-purple))] text-white text-xs">
                          {tool.tier}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-4 bg-[hsl(var(--luxury-gold))] text-[hsl(var(--luxury-navy))] hover:bg-[hsl(var(--luxury-gold))]/90 font-semibold"
                    onClick={() => setSelectedTier('Premium')}
                  >
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Premium Tools Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[hsl(var(--luxury-white))] mb-6">Premium Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {premiumTools.map((tool) => (
                  <Card key={tool.title} className="bg-[hsl(var(--luxury-navy))] border-2 border-[hsl(var(--luxury-gold))]/50 hover:border-[hsl(var(--luxury-gold))] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(212,175,55,0.3)]">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-[hsl(var(--luxury-gold))]/20 border border-[hsl(var(--luxury-gold))]/30">
                            <tool.icon className="h-6 w-6 text-[hsl(var(--luxury-gold))]" />
                          </div>
                          <div>
                            <CardTitle className="text-[hsl(var(--luxury-white))] text-lg">{tool.title}</CardTitle>
                            <Badge className={`text-xs mt-1 ${tool.tier === 'Pro' ? 'bg-[hsl(var(--luxury-purple))]' : 'bg-[hsl(var(--luxury-gold))] text-[hsl(var(--luxury-navy))]'}`}>
                              {tool.tier} - {tool.price}
                            </Badge>
                          </div>
                        </div>
                        <Lock className="h-4 w-4 text-[hsl(var(--luxury-white))]/60" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[hsl(var(--luxury-white))]/80 mb-4">{tool.description}</p>
                      <Button 
                        className="w-full bg-transparent border border-[hsl(var(--luxury-gold))] text-[hsl(var(--luxury-gold))] hover:bg-[hsl(var(--luxury-gold))] hover:text-[hsl(var(--luxury-navy))] transition-all duration-300"
                        onClick={() => setSelectedTier(tool.tier)}
                      >
                        Subscribe to {tool.tier}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pricing Tiers */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[hsl(var(--luxury-white))] mb-6 text-center">Choose Your Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingTiers.map((tier) => (
                  <Card key={tier.name} className={`relative bg-[hsl(var(--luxury-navy))] transition-all duration-300 hover:scale-105 ${
                    tier.popular 
                      ? 'border-2 border-[hsl(var(--luxury-gold))] shadow-[0_8px_32px_rgba(212,175,55,0.3)]' 
                      : 'border border-[hsl(var(--luxury-gold))]/30 hover:border-[hsl(var(--luxury-gold))]/60'
                  }`}>
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-[hsl(var(--luxury-gold))] text-[hsl(var(--luxury-navy))] font-bold px-4">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-[hsl(var(--luxury-white))] text-xl">{tier.name}</CardTitle>
                      <div className="text-3xl font-bold text-[hsl(var(--luxury-gold))]">
                        {tier.price}
                        {tier.period && <span className="text-lg text-[hsl(var(--luxury-white))]/60">{tier.period}</span>}
                      </div>
                      <p className="text-[hsl(var(--luxury-white))]/70">{tier.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                            <span className="text-[hsl(var(--luxury-white))]/90">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full transition-all duration-300 ${
                          tier.current
                            ? 'bg-[hsl(var(--luxury-white))]/20 text-[hsl(var(--luxury-white))] cursor-default'
                            : tier.popular
                            ? 'bg-[hsl(var(--luxury-gold))] text-[hsl(var(--luxury-navy))] hover:bg-[hsl(var(--luxury-gold))]/90 font-semibold'
                            : 'bg-transparent border border-[hsl(var(--luxury-gold))] text-[hsl(var(--luxury-gold))] hover:bg-[hsl(var(--luxury-gold))] hover:text-[hsl(var(--luxury-navy))]'
                        }`}
                        disabled={tier.current}
                      >
                        {tier.current ? 'Current Plan' : `Choose ${tier.name}`}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
      </div>
    );
  };

export default BuildWorkspacePage;