import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  TrendingUp, 
  FileText, 
  Target, 
  Users,
  PieChart,
  ArrowRight,
  Wrench
} from 'lucide-react';

const advisorTools = [
  {
    category: 'Planning Tools',
    tools: [
      {
        name: 'Retirement Calculator',
        description: 'Advanced retirement planning scenarios',
        icon: Calculator,
        route: '/tools/retirement-roadmap',
        status: 'ready'
      },
      {
        name: 'Social Security Optimizer',
        description: 'Optimize SS claiming strategies',
        icon: TrendingUp,
        route: '/tools/social-security',
        status: 'ready'
      },
      {
        name: 'Portfolio Analyzer',
        description: 'Risk and allocation analysis',
        icon: PieChart,
        route: '/tools/portfolio-analyzer',
        status: 'beta'
      }
    ]
  },
  {
    category: 'Client Management',
    tools: [
      {
        name: 'Proposal Generator',
        description: 'Create professional proposals',
        icon: FileText,
        route: '/tools/proposal-generator',
        status: 'ready'
      },
      {
        name: 'Risk Assessment',
        description: 'Client risk tolerance profiling',
        icon: Target,
        route: '/tools/risk-assessment',
        status: 'ready'
      },
      {
        name: 'Client Dashboard',
        description: 'Comprehensive client overview',
        icon: Users,
        route: '/tools/client-dashboard',
        status: 'coming-soon'
      }
    ]
  }
];

const recentUsage = [
  {
    tool: 'Retirement Calculator',
    client: 'Johnson Family',
    date: '2 hours ago',
    result: 'Analysis completed'
  },
  {
    tool: 'Proposal Generator',
    client: 'Chen Investment Group',
    date: '1 day ago',
    result: 'Proposal sent'
  },
  {
    tool: 'Social Security Optimizer',
    client: 'Davis Trust',
    date: '2 days ago',
    result: 'Strategy recommended'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'beta': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case 'coming-soon': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
  }
};

export default function AdvisorTools() {
  return (
    <>
      <Helmet>
        <title>Advisor Tools | Professional Planning & Analysis Tools</title>
        <meta name="description" content="Access professional-grade tools for financial planning, client management, and business analysis" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Advisor Tools</h1>
            <p className="text-muted-foreground">
              Professional-grade tools for client planning and business management
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Request Tool
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Tools</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tools Used Today</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Analyses Run</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Client Reports</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tools by Category */}
        <div className="space-y-8">
          {advisorTools.map((category, categoryIndex) => (
            <section key={categoryIndex}>
              <h2 className="text-xl font-semibold mb-4">{category.category}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {category.tools.map((tool, toolIndex) => (
                  <Card 
                    key={toolIndex}
                    className="cursor-pointer hover:shadow-md transition-shadow group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <tool.icon className="w-6 h-6 text-primary" />
                        </div>
                        <Badge className={getStatusColor(tool.status)}>
                          {tool.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {tool.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={tool.status === 'coming-soon'}
                        >
                          {tool.status === 'coming-soon' ? 'Coming Soon' : 'Launch Tool'}
                        </Button>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Recent Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tool Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsage.map((usage, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{usage.tool}</h3>
                      <p className="text-sm text-muted-foreground">Client: {usage.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{usage.result}</p>
                    <p className="text-sm text-muted-foreground">{usage.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}