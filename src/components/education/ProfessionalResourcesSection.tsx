import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, Users, BookOpen, Download, ExternalLink } from 'lucide-react';

interface ProfessionalResourcesSectionProps {
  searchQuery?: string;
}

const professionalResources = [
  {
    id: 'compliance-guide',
    title: 'Fiduciary Compliance Guide 2024',
    description: 'Complete compliance checklist and regulatory updates for financial advisors',
    type: 'PDF Guide',
    category: 'Compliance',
    downloadUrl: '/resources/compliance-guide-2024.pdf',
    icon: Shield,
    premium: false
  },
  {
    id: 'client-onboarding',
    title: 'Client Onboarding Toolkit',
    description: 'Templates, checklists, and best practices for seamless client onboarding',
    type: 'Template Pack',
    category: 'Practice Management',
    downloadUrl: '/resources/client-onboarding-toolkit.zip',
    icon: Users,
    premium: true
  },
  {
    id: 'investment-policy',
    title: 'Investment Policy Statement Templates',
    description: 'Customizable IPS templates for different client types and risk profiles',
    type: 'Templates',
    category: 'Investment Management',
    downloadUrl: '/resources/ips-templates.docx',
    icon: FileText,
    premium: false
  },
  {
    id: 'continuing-education',
    title: 'CE Credit Courses',
    description: 'Continuing education courses approved for CFP, CPA, and other certifications',
    type: 'Online Course',
    category: 'Education',
    downloadUrl: '/ce-courses',
    icon: BookOpen,
    premium: true
  }
];

const businessTools = [
  {
    id: 'fee-calculator',
    title: 'Fee Structure Calculator',
    description: 'Calculate optimal fee structures and compare with industry benchmarks',
    type: 'Calculator',
    externalUrl: 'https://tools.example.com/fee-calculator'
  },
  {
    id: 'roi-tracker',
    title: 'Client ROI Tracker',
    description: 'Track and report client portfolio performance and advisor value-add',
    type: 'Spreadsheet',
    externalUrl: 'https://tools.example.com/roi-tracker'
  },
  {
    id: 'marketing-kit',
    title: 'Digital Marketing Kit',
    description: 'Social media templates, email campaigns, and content calendar',
    type: 'Marketing Pack',
    externalUrl: 'https://tools.example.com/marketing-kit'
  }
];

export function ProfessionalResourcesSection({ searchQuery = '' }: ProfessionalResourcesSectionProps) {
  const filteredResources = professionalResources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTools = businessTools.filter(tool =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Professional Resources</h2>
        <p className="text-muted-foreground">
          Compliance guides, practice management tools, and business development resources
        </p>
      </div>

      {/* Professional Resources */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Compliance & Practice Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((resource) => {
            const IconComponent = resource.icon;
            return (
              <Card key={resource.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{resource.type}</Badge>
                          <Badge variant="secondary">{resource.category}</Badge>
                        </div>
                      </div>
                    </div>
                    {resource.premium && (
                      <Badge className="bg-yellow-500 text-black">Premium</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="mb-4">
                    {resource.description}
                  </CardDescription>
                  
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    {resource.premium ? 'Upgrade to Download' : 'Download Resource'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Business Tools */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Business Development Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
                <Badge variant="outline">{tool.type}</Badge>
              </CardHeader>

              <CardContent>
                <CardDescription className="mb-4">
                  {tool.description}
                </CardDescription>
                
                <Button 
                  className="w-full" 
                  onClick={() => window.open(tool.externalUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Tool
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {(filteredResources.length === 0 && filteredTools.length === 0) && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No professional resources found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}