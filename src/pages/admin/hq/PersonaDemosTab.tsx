import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Users, Settings, Eye } from 'lucide-react';

export function PersonaDemosTab() {
  const personas = [
    {
      name: 'Family Office Principal',
      description: 'High-net-worth family decision maker',
      demoUrl: '/demos/family-principal',
      status: 'active',
      lastUpdated: '2024-03-15',
      features: ['Portfolio Overview', 'Risk Analytics', 'Estate Planning']
    },
    {
      name: 'Financial Advisor',
      description: 'Professional wealth management advisor',
      demoUrl: '/demos/advisor',
      status: 'active',
      lastUpdated: '2024-03-12',
      features: ['Client Management', 'Investment Research', 'Compliance Tools']
    },
    {
      name: 'Family Member',
      description: 'Next-generation family member',
      demoUrl: '/demos/family-member',
      status: 'beta',
      lastUpdated: '2024-03-10',
      features: ['Educational Content', 'Spending Insights', 'Goal Tracking']
    },
    {
      name: 'CPA/Tax Professional',
      description: 'Certified public accountant',
      demoUrl: '/demos/cpa',
      status: 'development',
      lastUpdated: '2024-03-08',
      features: ['Tax Planning', 'Compliance Reports', 'Document Management']
    },
    {
      name: 'Estate Attorney',
      description: 'Legal professional specializing in estates',
      demoUrl: '/demos/attorney',
      status: 'development',
      lastUpdated: '2024-03-05',
      features: ['Document Review', 'Trust Management', 'Legal Compliance']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'beta': return 'bg-blue-600 text-white';
      case 'development': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bfo-subheader p-4 -m-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-bfo-gold" />
            <h2 className="text-xl font-semibold">Persona Demonstrations</h2>
          </div>
          <Button className="bfo-cta-secondary">
            <Settings className="h-4 w-4 mr-2" />
            Configure Demos
          </Button>
        </div>
        <p className="text-sm mt-1 opacity-80">Interactive demonstrations for different user personas</p>
      </div>

      <div className="grid gap-4">
        {personas.map((persona, index) => (
          <Card key={index} className="bfo-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white">{persona.name}</CardTitle>
                  <p className="text-sm text-gray-300 mt-1">{persona.description}</p>
                </div>
                <Badge className={getStatusColor(persona.status)}>
                  {persona.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {persona.features.map((feature, featureIndex) => (
                    <span 
                      key={featureIndex}
                      className="px-2 py-1 text-xs rounded-full bg-bfo-gold/10 text-bfo-gold border border-bfo-gold/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Last updated: {new Date(persona.lastUpdated).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-white border-bfo-gold/40 hover:bg-bfo-gold/10">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" className="bfo-cta">
                      <Play className="h-3 w-3 mr-1" />
                      Launch Demo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Demo Analytics */}
      <Card className="bfo-card">
        <CardHeader>
          <CardTitle className="text-white">Demo Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-bfo-gold">1,247</div>
              <div className="text-sm text-gray-300">Total Demo Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-bfo-gold">8.3</div>
              <div className="text-sm text-gray-300">Avg. Engagement (min)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-bfo-gold">73%</div>
              <div className="text-sm text-gray-300">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-bfo-gold">156</div>
              <div className="text-sm text-gray-300">Conversion to Trial</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}