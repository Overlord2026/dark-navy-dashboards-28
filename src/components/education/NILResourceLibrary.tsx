import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  FileText, 
  Video, 
  Search, 
  Filter,
  BookOpen,
  Calculator,
  Shield,
  DollarSign,
  Users,
  AlertTriangle,
  Star,
  FileDown,
  Play,
  ExternalLink
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'calculator' | 'template';
  category: string;
  downloadUrl: string;
  fileSize?: string;
  duration?: string;
  icon: any;
}

export const NILResourceLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const resources: Resource[] = [
    // PDFs
    {
      id: 'nil-checklist',
      title: 'NIL Agreement Checklist',
      description: 'Essential checklist for reviewing NIL contracts before signing',
      type: 'pdf',
      category: 'contracts',
      downloadUrl: '/resources/nil-agreement-checklist.pdf',
      fileSize: '2.3 MB',
      icon: Shield
    },
    {
      id: 'tax-guide',
      title: 'NIL Tax Planning Guide',
      description: 'Comprehensive guide to managing NIL income and tax obligations',
      type: 'pdf',
      category: 'financial',
      downloadUrl: '/resources/nil-tax-guide.pdf',
      fileSize: '4.1 MB',
      icon: DollarSign
    },
    {
      id: 'state-laws',
      title: 'State NIL Laws Summary',
      description: '50-state breakdown of NIL regulations and compliance requirements',
      type: 'pdf',
      category: 'compliance',
      downloadUrl: '/resources/state-nil-laws.pdf',
      fileSize: '6.7 MB',
      icon: BookOpen
    },
    {
      id: 'budget-template',
      title: 'NIL Income Budget Template',
      description: 'Excel template for tracking and budgeting NIL earnings',
      type: 'template',
      category: 'financial',
      downloadUrl: '/resources/nil-budget-template.xlsx',
      fileSize: '150 KB',
      icon: Calculator
    },
    {
      id: 'social-media-guide',
      title: 'Social Media Brand Building Guide',
      description: 'Step-by-step guide to building your personal brand on social platforms',
      type: 'pdf',
      category: 'branding',
      downloadUrl: '/resources/social-media-guide.pdf',
      fileSize: '3.2 MB',
      icon: Star
    },
    {
      id: 'scam-prevention',
      title: 'NIL Scam Prevention Guide',
      description: 'How to identify and avoid common NIL scams and fraudulent offers',
      type: 'pdf',
      category: 'risk',
      downloadUrl: '/resources/scam-prevention.pdf',
      fileSize: '2.8 MB',
      icon: AlertTriangle
    },
    {
      id: 'parent-guide',
      title: 'Parent & Guardian NIL Guide',
      description: 'Essential information for parents supporting their athlete\'s NIL journey',
      type: 'pdf',
      category: 'family',
      downloadUrl: '/resources/parent-guide.pdf',
      fileSize: '3.5 MB',
      icon: Users
    },

    // Videos
    {
      id: 'welcome-video',
      title: 'Welcome to NIL Smart Money',
      description: 'Introduction to the platform and your NIL education journey',
      type: 'video',
      category: 'welcome',
      downloadUrl: '/videos/welcome-nil.mp4',
      duration: '5:32',
      icon: Play
    },
    {
      id: 'compliance-basics',
      title: 'NIL Compliance Basics',
      description: 'Understanding NCAA rules and staying compliant',
      type: 'video',
      category: 'compliance',
      downloadUrl: '/videos/compliance-basics.mp4',
      duration: '8:45',
      icon: Shield
    },
    {
      id: 'contract-review',
      title: 'How to Review NIL Contracts',
      description: 'Step-by-step walkthrough of contract terms and red flags',
      type: 'video',
      category: 'contracts',
      downloadUrl: '/videos/contract-review.mp4',
      duration: '12:15',
      icon: FileText
    },
    {
      id: 'brand-building',
      title: 'Building Your Athlete Brand',
      description: 'Creating authentic content and growing your social presence',
      type: 'video',
      category: 'branding',
      downloadUrl: '/videos/brand-building.mp4',
      duration: '15:20',
      icon: Star
    },

    // Calculators
    {
      id: 'deal-calculator',
      title: 'NIL Deal Value Calculator',
      description: 'Calculate the true value of NIL opportunities including taxes',
      type: 'calculator',
      category: 'financial',
      downloadUrl: '/calculators/deal-value',
      icon: Calculator
    },
    {
      id: 'tax-calculator',
      title: 'NIL Tax Estimator',
      description: 'Estimate quarterly tax payments and deductions',
      type: 'calculator',
      category: 'financial',
      downloadUrl: '/calculators/tax-estimator',
      icon: DollarSign
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', count: resources.length },
    { id: 'compliance', name: 'Compliance', count: resources.filter(r => r.category === 'compliance').length },
    { id: 'financial', name: 'Financial', count: resources.filter(r => r.category === 'financial').length },
    { id: 'contracts', name: 'Contracts', count: resources.filter(r => r.category === 'contracts').length },
    { id: 'branding', name: 'Branding', count: resources.filter(r => r.category === 'branding').length },
    { id: 'risk', name: 'Risk Management', count: resources.filter(r => r.category === 'risk').length },
    { id: 'family', name: 'Family & Coaches', count: resources.filter(r => r.category === 'family').length }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'video':
        return Video;
      case 'calculator':
        return Calculator;
      case 'template':
        return FileDown;
      default:
        return FileText;
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      pdf: { label: 'PDF', class: 'bg-red-100 text-red-700' },
      video: { label: 'Video', class: 'bg-blue-100 text-blue-700' },
      calculator: { label: 'Calculator', class: 'bg-green-100 text-green-700' },
      template: { label: 'Template', class: 'bg-purple-100 text-purple-700' }
    };
    return badges[type as keyof typeof badges] || badges.pdf;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            NIL Resource Library
          </CardTitle>
          <p className="text-muted-foreground">
            Downloadable guides, videos, calculators, and templates for your NIL journey
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.name} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => {
          const TypeIcon = getTypeIcon(resource.type);
          const CategoryIcon = resource.icon;
          const typeBadge = getTypeBadge(resource.type);
          
          return (
            <Card key={resource.id} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-5 w-5 text-primary" />
                    <TypeIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Badge className={typeBadge.class}>
                    {typeBadge.label}
                  </Badge>
                </div>
                
                <h4 className="font-semibold mb-2">{resource.title}</h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  {resource.fileSize && (
                    <span>{resource.fileSize}</span>
                  )}
                  {resource.duration && (
                    <span>{resource.duration}</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open(resource.downloadUrl, '_blank')}
                  >
                    {resource.type === 'video' ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Watch
                      </>
                    ) : resource.type === 'calculator' ? (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Resources Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or category filter
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};