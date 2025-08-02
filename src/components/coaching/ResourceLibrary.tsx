import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Video, 
  CheckSquare, 
  Download, 
  Upload, 
  Search, 
  Filter,
  BookOpen,
  Play,
  FileCheck,
  Star,
  Eye,
  Heart,
  Share
} from 'lucide-react';

export function ResourceLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'prospecting', label: 'Prospecting' },
    { value: 'sales', label: 'Sales Process' },
    { value: 'client-relations', label: 'Client Relations' },
    { value: 'practice-management', label: 'Practice Management' },
    { value: 'technology', label: 'Technology' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'marketing', label: 'Marketing' }
  ];

  const resourceTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'playbook', label: 'Playbooks' },
    { value: 'webinar', label: 'Webinars' },
    { value: 'checklist', label: 'Checklists' },
    { value: 'template', label: 'Templates' },
    { value: 'guide', label: 'Guides' },
    { value: 'video', label: 'Videos' }
  ];

  const resources = [
    {
      id: 1,
      title: 'Complete Prospecting Playbook',
      description: 'Comprehensive guide to identifying and engaging high-value prospects',
      type: 'playbook',
      category: 'prospecting',
      author: 'Mike Chen',
      rating: 4.9,
      downloads: 156,
      views: 890,
      favorite: false,
      tags: ['Lead Generation', 'Cold Calling', 'Email Outreach'],
      duration: null,
      fileSize: '2.4 MB',
      uploadDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Client Discovery Meeting Script',
      description: 'Structured conversation guide for initial client meetings',
      type: 'template',
      category: 'client-relations',
      author: 'Lisa Anderson',
      rating: 4.8,
      downloads: 203,
      views: 1250,
      favorite: true,
      tags: ['Discovery', 'Client Meetings', 'Questioning'],
      duration: null,
      fileSize: '1.2 MB',
      uploadDate: '2024-01-20'
    },
    {
      id: 3,
      title: 'Advanced Sales Closing Techniques',
      description: 'Webinar recording covering proven closing strategies and objection handling',
      type: 'webinar',
      category: 'sales',
      author: 'David Martinez',
      rating: 4.7,
      downloads: 89,
      views: 567,
      favorite: false,
      tags: ['Closing', 'Objections', 'Sales Psychology'],
      duration: '45 min',
      fileSize: '850 MB',
      uploadDate: '2024-01-25'
    },
    {
      id: 4,
      title: 'Client Onboarding Checklist',
      description: 'Step-by-step checklist to ensure consistent client onboarding experience',
      type: 'checklist',
      category: 'practice-management',
      author: 'Sarah Johnson',
      rating: 4.9,
      downloads: 342,
      views: 1890,
      favorite: true,
      tags: ['Onboarding', 'Process', 'Client Experience'],
      duration: null,
      fileSize: '0.8 MB',
      uploadDate: '2024-02-01'
    },
    {
      id: 5,
      title: 'Digital Marketing Mastery Course',
      description: 'Complete video series on modern digital marketing for financial advisors',
      type: 'video',
      category: 'marketing',
      author: 'Emily Davis',
      rating: 4.8,
      downloads: 78,
      views: 445,
      favorite: false,
      tags: ['Digital Marketing', 'Social Media', 'Content Creation'],
      duration: '3.5 hours',
      fileSize: '1.2 GB',
      uploadDate: '2024-02-10'
    },
    {
      id: 6,
      title: 'Compliance Documentation Guide',
      description: 'Essential guide to maintaining proper compliance documentation',
      type: 'guide',
      category: 'compliance',
      author: 'Robert Wilson',
      rating: 4.6,
      downloads: 167,
      views: 723,
      favorite: false,
      tags: ['Compliance', 'Documentation', 'Risk Management'],
      duration: null,
      fileSize: '3.1 MB',
      uploadDate: '2024-02-15'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'playbook':
        return <BookOpen className="h-4 w-4" />;
      case 'webinar':
        return <Video className="h-4 w-4" />;
      case 'checklist':
        return <CheckSquare className="h-4 w-4" />;
      case 'template':
        return <FileText className="h-4 w-4" />;
      case 'guide':
        return <FileCheck className="h-4 w-4" />;
      case 'video':
        return <Play className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'playbook':
        return 'bg-blue-100 text-blue-800';
      case 'webinar':
        return 'bg-purple-100 text-purple-800';
      case 'checklist':
        return 'bg-green-100 text-green-800';
      case 'template':
        return 'bg-orange-100 text-orange-800';
      case 'guide':
        return 'bg-indigo-100 text-indigo-800';
      case 'video':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Resource Library</h3>
          <p className="text-sm text-muted-foreground">
            Playbooks, webinars, and tools shared by top coaches
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Resource
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {resourceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resource Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(resource.type)}
                  <Badge className={getTypeBadgeColor(resource.type)}>
                    {resource.type}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Heart className={`h-4 w-4 ${resource.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              <CardTitle className="text-base">{resource.title}</CardTitle>
              <CardDescription className="text-sm">
                {resource.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>By {resource.author}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{resource.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {resource.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {resource.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{resource.tags.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  <span>{resource.downloads}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{resource.views}</span>
                </div>
              </div>

              {resource.duration && (
                <div className="text-xs text-muted-foreground">
                  Duration: {resource.duration}
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <Share className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium mb-2">No resources found</h4>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or upload a new resource.
              </p>
              <Button>Upload Resource</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}