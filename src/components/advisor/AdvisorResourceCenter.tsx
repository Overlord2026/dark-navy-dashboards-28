import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  Search,
  Filter,
  Star,
  Clock,
  Award,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  Play,
  ExternalLink,
  Bookmark,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: 'guide' | 'video' | 'template';
  tags: string[];
  downloadUrl?: string;
  videoUrl?: string;
  thumbnail?: string;
  duration?: string;
  fileSize?: string;
  rating: number;
  downloads: number;
  isNew?: boolean;
  isPremium?: boolean;
}

interface EducationProgress {
  totalModules: number;
  completedModules: number;
  currentStreak: number;
  totalHours: number;
  certificates: number;
  level: string;
}

const mockResources: ResourceItem[] = [
  // Downloadable Guides
  {
    id: 'guide-1',
    title: 'Client Onboarding Best Practices',
    description: 'Comprehensive guide to streamline client onboarding process and improve retention rates.',
    category: 'guide',
    tags: ['onboarding', 'client management', 'best practices'],
    downloadUrl: '#',
    fileSize: '2.3 MB',
    rating: 4.8,
    downloads: 1247,
    isNew: true
  },
  {
    id: 'guide-2',
    title: 'Risk Assessment Framework',
    description: 'Professional framework for conducting thorough client risk assessments.',
    category: 'guide',
    tags: ['risk management', 'assessment', 'compliance'],
    downloadUrl: '#',
    fileSize: '1.8 MB',
    rating: 4.9,
    downloads: 986
  },
  {
    id: 'guide-3',
    title: 'Fee Structure Analysis Guide',
    description: 'Strategic guide to analyzing and optimizing advisor fee structures.',
    category: 'guide',
    tags: ['fees', 'pricing', 'strategy'],
    downloadUrl: '#',
    fileSize: '3.1 MB',
    rating: 4.7,
    downloads: 723,
    isPremium: true
  },
  
  // Explainer Videos
  {
    id: 'video-1',
    title: 'Portfolio Rebalancing Strategies',
    description: 'Learn advanced portfolio rebalancing techniques with real-world examples.',
    category: 'video',
    tags: ['portfolio', 'rebalancing', 'strategy'],
    videoUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
    duration: '18:42',
    rating: 4.9,
    downloads: 2341,
    isNew: true
  },
  {
    id: 'video-2',
    title: 'Tax-Loss Harvesting Masterclass',
    description: 'Master the art of tax-loss harvesting to maximize client returns.',
    category: 'video',
    tags: ['tax planning', 'harvesting', 'optimization'],
    videoUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=225&fit=crop',
    duration: '25:16',
    rating: 4.8,
    downloads: 1892
  },
  {
    id: 'video-3',
    title: 'Client Communication Excellence',
    description: 'Transform your client relationships with proven communication strategies.',
    category: 'video',
    tags: ['communication', 'client relations', 'soft skills'],
    videoUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=225&fit=crop',
    duration: '22:08',
    rating: 4.7,
    downloads: 1456,
    isPremium: true
  },
  
  // Marketing Templates
  {
    id: 'template-1',
    title: 'Client Newsletter Template',
    description: 'Professional newsletter template to keep clients engaged and informed.',
    category: 'template',
    tags: ['marketing', 'newsletter', 'communication'],
    downloadUrl: '#',
    fileSize: '4.2 MB',
    rating: 4.6,
    downloads: 894
  },
  {
    id: 'template-2',
    title: 'Social Media Content Kit',
    description: 'Complete social media templates and content calendar for advisors.',
    category: 'template',
    tags: ['social media', 'marketing', 'content'],
    downloadUrl: '#',
    fileSize: '12.5 MB',
    rating: 4.8,
    downloads: 1234,
    isNew: true
  },
  {
    id: 'template-3',
    title: 'Professional Presentation Deck',
    description: 'Customizable presentation templates for client meetings and seminars.',
    category: 'template',
    tags: ['presentations', 'meetings', 'templates'],
    downloadUrl: '#',
    fileSize: '8.7 MB',
    rating: 4.9,
    downloads: 657,
    isPremium: true
  }
];

const mockProgress: EducationProgress = {
  totalModules: 24,
  completedModules: 18,
  currentStreak: 7,
  totalHours: 45.5,
  certificates: 3,
  level: 'Advanced'
};

export function AdvisorResourceCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'guide' | 'video' | 'template'>('all');
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (resource: ResourceItem) => {
    if (resource.isPremium) {
      toast.info('Premium content - upgrade required');
      return;
    }
    toast.success(`Downloading ${resource.title}`);
  };

  const handleBookmark = (resourceId: string) => {
    setBookmarkedItems(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
    toast.success('Bookmark updated');
  };

  const handleShare = (resource: ResourceItem) => {
    navigator.clipboard.writeText(`Check out this resource: ${resource.title}`);
    toast.success('Link copied to clipboard');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'guide': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'template': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'guide': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'template': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
          <Award className="h-8 w-8 text-primary" />
          Advisor Resource Center
        </h1>
        <p className="text-muted-foreground mt-2">
          Professional development resources, tools, and training materials
        </p>
      </motion.div>

      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resources">Resource Library</TabsTrigger>
          <TabsTrigger value="videos">Video Training</TabsTrigger>
          <TabsTrigger value="templates">Marketing Templates</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources, guides, and templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {(['all', 'guide', 'video', 'template'] as const).map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category === 'all' ? 'All' : category}s
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource Grid */}
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredResources.map((resource) => (
              <motion.div key={resource.id} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  {resource.category === 'video' && resource.thumbnail && (
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={resource.thumbnail}
                        alt={resource.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      {resource.duration && (
                        <Badge className="absolute bottom-2 right-2 bg-black/75 text-white">
                          {resource.duration}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight flex items-center gap-2">
                          {resource.title}
                          {resource.isNew && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                          {resource.isPremium && (
                            <Badge className="text-xs bg-gradient-to-r from-amber-400 to-orange-500">
                              Premium
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(resource.id)}
                        className="p-1"
                      >
                        <Bookmark 
                          className={`h-4 w-4 ${bookmarkedItems.includes(resource.id) ? 'fill-current text-primary' : ''}`}
                        />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getCategoryColor(resource.category)}>
                        {getCategoryIcon(resource.category)}
                        <span className="ml-1 capitalize">{resource.category}</span>
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-current text-yellow-400" />
                        {resource.rating}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    <CardDescription className="text-sm">
                      {resource.description}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{resource.downloads} downloads</span>
                      {resource.fileSize && <span>{resource.fileSize}</span>}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDownload(resource)}
                        className="flex-1"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {resource.category === 'video' ? 'Watch' : 'Download'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(resource)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockResources.filter(r => r.category === 'video').map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>
                  <Badge className="absolute bottom-2 right-2 bg-black/75 text-white">
                    {video.duration}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{video.description}</p>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockResources.filter(r => r.category === 'template').map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{template.title}</h3>
                      <p className="text-sm text-muted-foreground">{template.fileSize}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  <Button className="w-full" onClick={() => handleDownload(template)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Progress Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {Math.round((mockProgress.completedModules / mockProgress.totalModules) * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <Progress 
                  value={(mockProgress.completedModules / mockProgress.totalModules) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {mockProgress.currentStreak}
                </div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
                <div className="flex justify-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {mockProgress.totalHours}
                </div>
                <p className="text-sm text-muted-foreground">Hours Completed</p>
                <div className="flex justify-center mt-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {mockProgress.certificates}
                </div>
                <p className="text-sm text-muted-foreground">Certificates Earned</p>
                <div className="flex justify-center mt-2">
                  <Award className="h-4 w-4 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Level & Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Learning Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Current Level: {mockProgress.level}</span>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600">
                    {mockProgress.level}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Modules Completed</span>
                    <span>{mockProgress.completedModules}/{mockProgress.totalModules}</span>
                  </div>
                  <Progress value={(mockProgress.completedModules / mockProgress.totalModules) * 100} />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Risk Management</p>
                    <p className="text-xs text-muted-foreground">Certified</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Portfolio Theory</p>
                    <p className="text-xs text-muted-foreground">Certified</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Tax Strategies</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}