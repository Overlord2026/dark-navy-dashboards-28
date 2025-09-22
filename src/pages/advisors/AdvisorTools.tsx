import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Calculator, 
  Shield, 
  FileText, 
  PieChart,
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdvisorTools = () => {
  const tools = [
    {
      title: 'Retirement Roadmap',
      description: 'Comprehensive retirement planning and analysis tool',
      icon: <TrendingUp className="h-6 w-6" />,
      href: '/advisors/tools/retirement',
      category: 'Retirement Planning',
      status: 'Available'
    },
    {
      title: 'Estate Planning Workbench',
      description: 'Estate planning strategies and document generation',
      icon: <FileText className="h-6 w-6" />,
      href: '/advisors/tools/estate',
      category: 'Estate Planning',
      status: 'Available'
    },
    {
      title: 'Tax Planning Calculator',
      description: 'Multi-year tax scenario modeling and optimization',
      icon: <Calculator className="h-6 w-6" />,
      href: '/tools/tax',
      category: 'Tax Planning',
      status: 'Available'
    },
    {
      title: 'Risk Assessment Tool',
      description: 'Client risk tolerance and portfolio analysis',
      icon: <Shield className="h-6 w-6" />,
      href: '#',
      category: 'Risk Management',
      status: 'Coming Soon'
    },
    {
      title: 'Portfolio Analytics',
      description: 'Advanced portfolio performance and allocation analysis',
      icon: <PieChart className="h-6 w-6" />,
      href: '#',
      category: 'Portfolio Management',
      status: 'Coming Soon'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-bfo-gold mb-2">Advisor Tools</h1>
        <p className="text-white/80">
          Professional tools designed specifically for financial advisors to serve clients effectively.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <Card 
            key={index} 
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/5 border-bfo-gold/20"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-bfo-gold/10 text-bfo-gold group-hover:bg-bfo-gold group-hover:text-bfo-navy transition-colors">
                    {tool.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">{tool.title}</CardTitle>
                    <Badge 
                      variant={tool.status === 'Available' ? 'default' : 'secondary'} 
                      className="text-xs mt-1"
                    >
                      {tool.status}
                    </Badge>
                  </div>
                </div>
                {tool.status === 'Available' && (
                  <ArrowRight className="h-4 w-4 text-white/60 group-hover:text-bfo-gold transition-colors" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 text-white/70">
                {tool.description}
              </CardDescription>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs text-bfo-gold border-bfo-gold/30">
                  {tool.category}
                </Badge>
                {tool.status === 'Available' ? (
                  <Button asChild variant="outline" size="sm" className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-bfo-navy">
                    <Link to={tool.href}>
                      Launch Tool
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled className="text-white/50">
                    Coming Soon
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-bfo-gold/10 to-bfo-gold/5 border-bfo-gold/20">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-bfo-gold mb-4">Need More Tools?</h3>
            <p className="text-white/80 mb-6">
              Request additional professional tools or integrations to enhance your advisor workflow.
            </p>
            <Button variant="outline" className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-bfo-navy">
              Request Tool Integration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvisorTools;