import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  BookOpen, 
  FileText, 
  Play, 
  Download, 
  ExternalLink,
  Filter,
  Star,
  Clock,
  User,
  Grid,
  List
} from 'lucide-react';
import { educationalResources } from '@/data/education/resources';
import { csvGuides } from '@/data/csvGuides';
import { EducationalResource } from '@/types/education';

const categories = [
  { id: 'all', name: 'All Topics', count: 0 },
  { id: 'estate', name: 'Estate Planning', count: 0 },
  { id: 'tax', name: 'Tax Strategy', count: 0 },
  { id: 'investing', name: 'Investing', count: 0 },
  { id: 'retirement', name: 'Retirement', count: 0 },
  { id: 'business', name: 'Business', count: 0 },
  { id: 'legal', name: 'Legal', count: 0 }
];

const resourceTypes = [
  { id: 'all', name: 'All Types', icon: Grid },
  { id: 'guides', name: 'Guides', icon: FileText },
  { id: 'books', name: 'Books', icon: BookOpen },
  { id: 'whitepapers', name: 'Research', icon: FileText },
  { id: 'ebooks', name: 'E-Books', icon: BookOpen },
  { id: 'courses', name: 'Courses', icon: Play }
];

export function MarketplaceEducationalResources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Combine all educational resources
  const allResources = [
    ...educationalResources.guides.map(item => ({ ...item, type: 'guides', category: getCategoryFromTitle(item.title) })),
    ...educationalResources.books.map(item => ({ ...item, type: 'books', category: getCategoryFromTitle(item.title) })),
    ...educationalResources.whitepapers.map(item => ({ ...item, type: 'whitepapers', category: getCategoryFromTitle(item.title) })),
    ...educationalResources.ebooks.map(item => ({ ...item, type: 'ebooks', category: getCategoryFromTitle(item.title) })),
    ...educationalResources.resources.map(item => ({ ...item, type: 'resources', category: getCategoryFromTitle(item.title) })),
    ...csvGuides.map(guide => ({
      id: `csv-${guide.title}`,
      title: guide.title,
      description: guide.description || '',
      type: 'guides',
      category: getCategoryFromTitle(guide.title),
      isPaid: false,
      level: 'All Levels',
      ghlUrl: guide.guideURL || '',
      coverImage: guide.coverImageURL
    }))
  ];

  // Filter resources based on search, category, and type
  const filteredResources = allResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  function getCategoryFromTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('estate') || lowerTitle.includes('trust')) return 'estate';
    if (lowerTitle.includes('tax') || lowerTitle.includes('irs')) return 'tax';
    if (lowerTitle.includes('invest') || lowerTitle.includes('portfolio') || lowerTitle.includes('bitcoin')) return 'investing';
    if (lowerTitle.includes('retirement') || lowerTitle.includes('social security')) return 'retirement';
    if (lowerTitle.includes('business') || lowerTitle.includes('corporate')) return 'business';
    if (lowerTitle.includes('legal') || lowerTitle.includes('law') || lowerTitle.includes('compliance')) return 'legal';
    return 'estate'; // Default category
  }

  function getResourceIcon(type: string) {
    switch (type) {
      case 'books': return BookOpen;
      case 'whitepapers': return FileText;
      case 'ebooks': return BookOpen;
      case 'courses': return Play;
      case 'resources': return ExternalLink;
      default: return FileText;
    }
  }

  function getPlaceholderImage(title: string, type: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('retirement')) return 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop';
    if (lowerTitle.includes('estate')) return 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop';
    if (lowerTitle.includes('tax')) return 'https://images.unsplash.com/photo-1554224154-26032fced8bd?w=400&h=300&fit=crop';
    if (lowerTitle.includes('bitcoin')) return 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=300&fit=crop';
    if (lowerTitle.includes('business')) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop';
    return 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop';
  }

  function handleResourceClick(resource: any) {
    if (resource.ghlUrl) {
      window.open(resource.ghlUrl, '_blank');
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Educational Resources</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Access our comprehensive library of guides, research papers, books, and courses 
          covering estate planning, tax strategy, investing, retirement, and more.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search resources..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-xs"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Type and View Mode Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Resource Type Filters */}
          <div className="flex flex-wrap gap-2">
            {resourceTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type.id)}
                className="gap-2 text-xs"
              >
                <type.icon className="w-3 h-3" />
                {type.name}
              </Button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredResources.length} resources
      </div>

      {/* Resources Grid/List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {filteredResources.map((resource) => {
          const IconComponent = getResourceIcon(resource.type);
          
          return (
            <Card 
              key={resource.id}
              className={`cursor-pointer hover-scale transition-all duration-200 border-border/50 ${
                viewMode === 'list' ? 'w-full' : ''
              }`}
              onClick={() => handleResourceClick(resource)}
            >
              <CardContent className={viewMode === 'grid' ? "p-0" : "p-4"}>
                {viewMode === 'grid' ? (
                  <div className="space-y-4">
                    {/* Cover Image */}
                    <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                      <img
                        src={resource.coverImage || getPlaceholderImage(resource.title, resource.type)}
                        alt={resource.title}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getPlaceholderImage(resource.title, resource.type);
                        }}
                      />
                      {/* Type Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="text-xs capitalize bg-background/80 backdrop-blur-sm">
                          {resource.type}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-2">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {resource.description}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          {'author' in resource && resource.author && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{resource.author}</span>
                            </div>
                          )}
                          {resource.level && (
                            <Badge variant="outline" className="text-xs py-0">
                              {resource.level}
                            </Badge>
                          )}
                        </div>
                        <IconComponent className="w-4 h-4" />
                      </div>

                      {/* CTA Button */}
                      <Button 
                        size="sm" 
                        className="w-full gap-2 text-xs"
                        variant={resource.ghlUrl ? "default" : "outline"}
                      >
                        {resource.ghlUrl ? (
                          <>
                            <ExternalLink className="w-3 h-3" />
                            View Resource
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Coming Soon
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* List View */
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-18 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={resource.coverImage || getPlaceholderImage(resource.title, resource.type)}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getPlaceholderImage(resource.title, resource.type);
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-sm line-clamp-1">{resource.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs capitalize ml-2">
                          {resource.type}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {'author' in resource && resource.author && (
                            <span>By {resource.author}</span>
                          )}
                          {resource.level && (
                            <Badge variant="outline" className="text-xs py-0">
                              {resource.level}
                            </Badge>
                          )}
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="gap-2 text-xs"
                          variant={resource.ghlUrl ? "default" : "outline"}
                        >
                          {resource.ghlUrl ? (
                            <>
                              <ExternalLink className="w-3 h-3" />
                              View
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Soon
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No resources found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
        </div>
      )}

      {/* CTA to Education Center */}
      <div className="text-center space-y-4 pt-8 border-t border-border">
        <h3 className="text-xl font-semibold">Want More?</h3>
        <p className="text-muted-foreground">
          Explore our full Education Center for interactive courses, webinars, and personalized learning paths.
        </p>
        <Button size="lg" className="gap-2">
          <BookOpen className="w-5 h-5" />
          Visit Education Center
        </Button>
      </div>
    </div>
  );
}