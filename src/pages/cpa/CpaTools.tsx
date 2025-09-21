import React from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, FileText, Users, BookOpen, PieChart, Settings, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FLAGS } from '@/config/flags';
import AssistedBadge from '@/components/badges/AssistedBadge';
import { createProof } from '@/lib/proofs';
import { buildExplainPack, downloadExplainPack } from '@/lib/explainpack';
import { toast } from '@/hooks/use-toast';

export default function CpaTools() {
  const handleLogCheckPassed = async () => {
    const mockJobId = `job-${Date.now()}`;
    const proof = await createProof(mockJobId, 'check_passed', 'CheckPack passed', { sandbox: 'content' });
    if (proof) {
      toast({
        title: "ProofSlip Logged",
        description: `Check passed proof logged for job ${mockJobId}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to log proof slip",
        variant: "destructive",
      });
    }
  };

  const handleExportExplainPack = async () => {
    const mockJobId = `job-${Date.now()}`;
    const explainPack = await buildExplainPack(mockJobId);
    if (explainPack) {
      downloadExplainPack(explainPack);
      toast({
        title: "ExplainPack Exported",
        description: `Policy version ${explainPack.policy_version} with ${explainPack.proof_slips.length} proof slips`,
      });
    } else {
      toast({
        title: "Error", 
        description: "Failed to build explain pack",
        variant: "destructive",
      });
    }
  };

  const tools = [
    {
      title: 'Tax Projection Tool',
      description: 'Multi-year tax scenario modeling and optimization',
      icon: <Calculator className="h-6 w-6" />,
      href: '/tools/tax-projection',
      category: 'Tax Planning'
    },
    {
      title: 'TaxHub Pro',
      description: 'Professional client intake and projection console',
      icon: <Users className="h-6 w-6" />,
      href: '/taxhub/pro',
      category: 'Client Management'
    },
    {
      title: 'Continuing Education',
      description: 'CE tracking and professional development',
      icon: <BookOpen className="h-6 w-6" />,
      href: '/learn/ce',
      category: 'Professional Development'
    },
    {
      title: 'Estate Planning',
      description: 'Advanced estate tax strategies and planning',
      icon: <FileText className="h-6 w-6" />,
      href: '/cpa/estate',
      category: 'Estate Planning'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Client performance and business metrics',
      icon: <PieChart className="h-6 w-6" />,
      href: '/cpa/analytics',
      category: 'Analytics'
    },
    {
      title: 'Compliance Center',
      description: 'Track regulatory requirements and deadlines',
      icon: <Settings className="h-6 w-6" />,
      href: '/cpa/compliance',
      category: 'Compliance'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <section className="bfo-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">CPA Professional Tools</h1>
                {FLAGS.__ENABLE_AGENT_AUTOMATIONS__ && <AssistedBadge />}
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Comprehensive suite of tax planning, client management, and professional development tools
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline">All Tools</Badge>
              <Badge variant="outline">Tax Planning</Badge>
              <Badge variant="outline">Client Management</Badge>
              <Badge variant="outline">Professional Development</Badge>
              <Badge variant="outline">Compliance</Badge>
            </div>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <div key={index} className="bfo-card p-6 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{tool.title}</h3>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {tool.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  {tool.description}
                </p>
                
                <Button asChild className="w-full gold-outline-button">
                  <Link to={tool.href}>
                    Launch Tool
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          
          <section className="bfo-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Featured Workflows</h2>
              <div className="flex gap-2">
                <Button 
                  onClick={handleLogCheckPassed} 
                  variant="outline" 
                  size="sm"
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Log Check Passed
                </Button>
                <Button 
                  onClick={handleExportExplainPack} 
                  variant="outline" 
                  size="sm"
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export ExplainPack
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Individual Tax Planning</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete workflow for individual tax planning and projections
                </p>
                <Button size="sm" className="gold-outline-button">
                  Start Workflow
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Business Entity Planning</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Business formation and tax optimization strategies
                </p>
                <Button size="sm" className="gold-outline-button">
                  Start Workflow
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Estate Tax Planning</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Advanced estate planning and tax minimization
                </p>
                <Button size="sm" className="gold-outline-button">
                  Start Workflow
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Year-End Planning</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Comprehensive year-end tax planning checklist
                </p>
                <Button size="sm" className="gold-outline-button">
                  Start Workflow
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}