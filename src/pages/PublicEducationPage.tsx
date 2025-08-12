import React, { useState, useMemo } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  FileText, 
  BookOpen, 
  ExternalLink, 
  Download,
  Star,
  Calendar,
  Settings,
  PlayCircle,
  Users
} from 'lucide-react';
import { useEducationResources } from '@/hooks/useEducationResources';
import { EducationResource } from '@/types/education';
import { useUser } from '@/context/UserContext';
import { EducationAdminPanel } from '@/components/education/EducationAdminPanel';
import { getFeaturedCourses, getPopularCourses, getAllCourses } from '@/data/education/courseUtils';

const PublicEducationPage = () => {
  const { resources, loading } = useEducationResources();
  const { userProfile } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const isAdmin = userProfile?.role && ['admin', 'superadmin', 'tenant_admin'].includes(userProfile.role);

  // Get course data for demo content
  const featuredCourses = getFeaturedCourses();
  const popularCourses = getPopularCourses();

  // Get unique categories from resources
  const categories = useMemo(() => {
    const cats = Array.from(new Set(resources.map(r => r.category).filter(Boolean)));
    return cats.sort();
  }, [resources]);

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    let filtered = resources.filter(resource => {
      const matchesSearch = !searchTerm || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
      const matchesType = selectedType === 'all' || resource.resource_type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    });

    // Sort resources
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'oldest':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [resources, searchTerm, selectedCategory, selectedType, sortBy]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'docx':
        return FileText;
      case 'flipbook':
        return BookOpen;
      case 'external_link':
        return ExternalLink;
      default:
        return FileText;
    }
  };

  const handleResourceClick = (resource: EducationResource) => {
    if (resource.file_url) {
      window.open(resource.file_url, '_blank');
    }
  };

  const handleCourseAccess = (course: any) => {
    if (course.ghlUrl) {
      window.open(course.ghlUrl, '_blank');
    }
  };

  const renderResourceCard = (resource: EducationResource) => {
    const Icon = getResourceIcon(resource.resource_type || 'pdf');
    
    return (
      <Card 
        key={resource.id} 
        className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => handleResourceClick(resource)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors">
                  {resource.title}
                  {resource.is_featured && (
                    <Star className="inline h-4 w-4 ml-2 text-yellow-500 fill-current" />
                  )}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">
                    {resource.resource_type?.toUpperCase() || 'FILE'}
                  </Badge>
                  {resource.category && (
                    <Badge variant="outline" className="text-xs">
                      {resource.category}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardHeader>
        
        {resource.description && (
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {resource.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {resource.created_at ? new Date(resource.created_at).toLocaleDateString() : 'Recent'}
              </div>
              {resource.file_size && (
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {(resource.file_size / (1024 * 1024)).toFixed(1)} MB
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  const renderCourseCard = (course: any) => {
    return (
      <Card 
        key={course.id} 
        className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => handleCourseAccess(course)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <PlayCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors">
                  {course.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant={course.isPaid ? "default" : "secondary"} className="text-xs">
                    {course.isPaid ? 'Premium' : 'Free'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.duration}
                  </Badge>
                </div>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        </CardContent>
      </Card>
    );
  };

  if (showAdminPanel) {
    return <EducationAdminPanel onBack={() => setShowAdminPanel(false)} />;
  }

  return (
    <ThreeColumnLayout title="Education Center">
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="text-center bg-gradient-primary rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-4">Financial Education Center</h1>
          <p className="text-lg opacity-90 mb-6">
            Comprehensive guides, courses, and resources to enhance your financial knowledge
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Interactive Courses
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Expert Guides
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community Resources
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">Word Doc</SelectItem>
                <SelectItem value="flipbook">Flipbook</SelectItem>
                <SelectItem value="external_link">External</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>

            {isAdmin && (
              <Button 
                onClick={() => setShowAdminPanel(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Manage
              </Button>
            )}
          </div>
        </div>

        {/* Featured Courses */}
        {featuredCourses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Featured Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map(renderCourseCard)}
            </div>
          </div>
        )}

        {/* Popular Courses */}
        {popularCourses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />
              Popular Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCourses.slice(0, 6).map(renderCourseCard)}
            </div>
          </div>
        )}

        {/* Featured Resources */}
        {filteredResources.some(r => r.is_featured) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Featured Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources
                .filter(resource => resource.is_featured)
                .map(renderResourceCard)
              }
            </div>
          </div>
        )}

        {/* All Resources */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              All Resources ({filteredResources.length})
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Resources Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== 'all' || selectedType !== 'all'
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Educational resources will appear here once they are added.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources
                .filter(resource => !resource.is_featured)
                .map(renderResourceCard)
              }
            </div>
          )}
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default PublicEducationPage;