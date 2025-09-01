import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target, Clock } from 'lucide-react';

export function RoadmapTab() {
  const roadmapItems = [
    {
      quarter: 'Q4 2024',
      status: 'in-progress',
      items: [
        { title: 'Enhanced Security Framework', status: 'completed', priority: 'high' },
        { title: 'Mobile App Beta Launch', status: 'in-progress', priority: 'high' },
        { title: 'Advanced Analytics Dashboard', status: 'planned', priority: 'medium' }
      ]
    },
    {
      quarter: 'Q1 2025',
      status: 'planned',
      items: [
        { title: 'AI-Powered Portfolio Insights', status: 'planned', priority: 'high' },
        { title: 'Third-Party Integrations', status: 'planned', priority: 'medium' },
        { title: 'Compliance Automation Suite', status: 'planned', priority: 'high' }
      ]
    },
    {
      quarter: 'Q2 2025',
      status: 'planned',
      items: [
        { title: 'Global Expansion Features', status: 'planned', priority: 'medium' },
        { title: 'Advanced Reporting Engine', status: 'planned', priority: 'medium' },
        { title: 'Client Portal Enhancements', status: 'planned', priority: 'low' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-white';
      case 'in-progress': return 'bg-blue-600 text-white';
      case 'planned': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bfo-subheader p-4 -m-6 mb-6">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-bfo-gold" />
          <h2 className="text-xl font-semibold">Strategic Roadmap</h2>
        </div>
        <p className="text-sm mt-1 opacity-80">Product development timeline and priorities</p>
      </div>

      <div className="space-y-6">
        {roadmapItems.map((quarter, index) => (
          <Card key={index} className="bfo-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Calendar className="h-5 w-5 text-bfo-gold" />
                {quarter.quarter}
                <Badge className={getStatusColor(quarter.status)}>
                  {quarter.status.replace('-', ' ')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quarter.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-bfo-gold/20">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-bfo-gold" />
                      <span className="text-white font-medium">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}