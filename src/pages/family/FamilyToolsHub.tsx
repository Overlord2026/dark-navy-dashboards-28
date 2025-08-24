import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import familyToolsConfig from '@/config/familyTools.json';
import catalogConfig from '@/config/catalogConfig.json';

const FAMILY_TOOLS = [
  {
    key: 'retirement-roadmap',
    title: 'Retirement Roadmap',
    description: 'Comprehensive retirement planning analysis',
    category: 'Planning',
    route: '/family/tools/retirement'
  },
  {
    key: 'roth-ladder',
    title: 'Roth Ladder',
    description: 'Tax-efficient conversion strategies',
    category: 'Tax',
    route: '/family/tools/roth-ladder'
  },
  {
    key: 'social-security',
    title: 'Social Security Optimizer',
    description: 'Optimize your SS claiming strategy',
    category: 'Income',
    route: '/family/tools/ss-timing'
  },
  {
    key: 'rmd-check',
    title: 'RMD Check',
    description: 'Required minimum distribution planning',
    category: 'Tax',
    route: '/family/tools/rmd-check'
  },
  {
    key: 'taxhub-preview',
    title: 'TaxHub Preview',
    description: 'Tax planning and optimization tools',
    category: 'Tax',
    route: '/family/tools/taxhub-preview'
  }
];

export default function FamilyToolsHub() {
  return (
    <>
      <Helmet>
        <title>Family Tools Hub | Comprehensive Financial Tools</title>
        <meta name="description" content="Access all your family financial planning tools in one place" />
      </Helmet>
      
      <ToolHeader title="Family Tools Hub" backPath="/family/home" backLabel="Family Home" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Your Financial Tools</h1>
            <p className="text-muted-foreground text-lg">
              Professional-grade planning tools for your family's financial future
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FAMILY_TOOLS.map(tool => (
              <Link key={tool.key} to={tool.route}>
                <Card className="hover:shadow-md transition-shadow group h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {tool.title}
                        </CardTitle>
                        <Badge variant="secondary">{tool.category}</Badge>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}