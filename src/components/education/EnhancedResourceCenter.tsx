import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ExternalLink, 
  PlayCircle, 
  FileText, 
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Award,
  Sparkles,
  Download,
  Eye,
  ShoppingCart
} from 'lucide-react';

interface ResourceLink {
  type: 'amazon' | 'pdf' | 'vimeo' | 'youtube' | 'guide' | 'download';
  label: string;
  url: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  type: 'course' | 'guide' | 'book' | 'video' | 'pdf';
  category: 'Tax' | 'Retirement' | 'Estate' | 'Investment' | 'Insurance' | 'Planning' | 'Business';
  tags: string[];
  links: ResourceLink[];
  badges?: ('popular' | 'editor-choice' | 'new' | 'premium' | 'free')[];
  author?: string;
  rating?: number;
  duration?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  featured?: boolean;
}

const sampleResources: Resource[] = [
  {
    id: '1',
    title: 'The Complete Guide to Roth IRA Conversions',
    description: 'Master the timing, strategies, and tax implications of Roth IRA conversions with real-world examples and detailed case studies.',
    coverImage: 'photo-1461749280684-dccba630e2f6',
    type: 'guide',
    category: 'Retirement',
    tags: ['Roth IRA', 'Tax Strategy', 'Retirement Planning'],
    links: [
      { type: 'guide', label: 'View Complete Guide', url: '/guides/roth-conversions' },
      { type: 'pdf', label: 'Download PDF', url: '/pdfs/roth-guide.pdf' }
    ],
    badges: ['editor-choice', 'popular'],
    rating: 4.9,
    duration: '45 min read',
    difficulty: 'Intermediate',
    featured: true
  },
  {
    id: '2',
    title: 'Advanced Tax Planning for High Net Worth',
    description: 'Comprehensive strategies for complex tax situations including estate planning integration, multi-state considerations, and entity structuring.',
    coverImage: 'photo-1486312338219-ce68d2c6f44d',
    type: 'course',
    category: 'Tax',
    tags: ['Tax Planning', 'High Net Worth', 'Estate Planning', 'Advanced Strategies'],
    links: [
      { type: 'vimeo', label: 'Watch Course', url: 'https://vimeo.com/course-example' },
      { type: 'pdf', label: 'Course Materials', url: '/materials/tax-planning.pdf' }
    ],
    badges: ['premium', 'new'],
    rating: 4.8,
    duration: '4 hours',
    difficulty: 'Advanced',
    author: 'Sarah Johnson, CPA'
  },
  {
    id: '3',
    title: 'Estate Planning Essentials',
    description: 'Navigate wills, trusts, and estate planning documents with confidence. Essential knowledge for protecting your family\'s financial future.',
    coverImage: 'photo-1581091226825-a6a2a5aee158',
    type: 'book',
    category: 'Estate',
    tags: ['Wills', 'Trusts', 'Estate Documents', 'Legacy Planning'],
    links: [
      { type: 'amazon', label: 'Buy on Amazon', url: 'https://amazon.com/estate-planning-book' },
      { type: 'guide', label: 'Free Preview', url: '/preview/estate-planning' }
    ],
    badges: ['popular', 'free'],
    rating: 4.7,
    difficulty: 'Beginner',
    author: 'Michael Thompson, J.D.'
  },
  {
    id: '4',
    title: 'Investment Portfolio Optimization',
    description: 'Learn modern portfolio theory, asset allocation strategies, and risk management techniques for optimal investment outcomes.',
    coverImage: 'photo-1487058792275-0ad4aaf24ca7',
    type: 'video',
    category: 'Investment',
    tags: ['Portfolio Management', 'Asset Allocation', 'Risk Management'],
    links: [
      { type: 'youtube', label: 'Watch Series', url: 'https://youtube.com/playlist' },
      { type: 'download', label: 'Download Worksheets', url: '/worksheets/portfolio.zip' }
    ],
    badges: ['editor-choice'],
    rating: 4.6,
    duration: '3.5 hours',
    difficulty: 'Intermediate',
    author: 'David Chen, CFA'
  },
  {
    id: '5',
    title: 'SECURE Act 2.0 Compliance Guide',
    description: 'Navigate the latest retirement account rule changes, RMD requirements, and distribution strategies under the new legislation.',
    coverImage: 'photo-1473091534298-04dcbce3278c',
    type: 'pdf',
    category: 'Retirement',
    tags: ['SECURE Act', 'RMD', 'Compliance', 'Retirement Rules'],
    links: [
      { type: 'pdf', label: 'Download Guide', url: '/pdfs/secure-act-guide.pdf' },
      { type: 'guide', label: 'Online Version', url: '/guides/secure-act' }
    ],
    badges: ['new', 'free'],
    difficulty: 'Advanced',
    duration: '25 min read'
  },
  {
    id: '6',
    title: 'Small Business Tax Strategies',
    description: 'Maximize deductions, optimize entity structure, and implement tax-efficient strategies for small business owners and entrepreneurs.',
    coverImage: 'photo-1500673922987-e212871fec22',
    type: 'course',
    category: 'Business',
    tags: ['Small Business', 'Tax Deductions', 'Entity Selection', 'Entrepreneurship'],
    links: [
      { type: 'vimeo', label: 'Start Course', url: 'https://vimeo.com/small-business-tax' },
      { type: 'pdf', label: 'Tax Checklist', url: '/checklists/business-tax.pdf' }
    ],
    badges: ['popular', 'premium'],
    rating: 4.8,
    duration: '2.5 hours',
    difficulty: 'Intermediate',
    author: 'Lisa Rodriguez, CPA'
  }
];

const categories = ['All', 'Tax', 'Retirement', 'Estate', 'Investment', 'Insurance', 'Planning', 'Business'];

interface EnhancedResourceCenterProps {
  showCategories?: string[];
  maxItems?: number;
  showSearch?: boolean;
  title?: string;
  description?: string;
}

export function EnhancedResourceCenter({ 
  showCategories = categories,
  maxItems = 50,
  showSearch = true,
  title = "Resource Center",
  description = "Discover expert guides, courses, and tools to enhance your financial knowledge"
}: EnhancedResourceCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredResources = useMemo(() => {
    let filtered = sampleResources.filter(resource => {
      const matchesSearch = !searchTerm || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
      const matchesShowCategories = showCategories.includes('All') || showCategories.includes(resource.category);
      
      return matchesSearch && matchesCategory && matchesShowCategories;
    });

    return filtered.slice(0, maxItems);
  }, [searchTerm, selectedCategory, showCategories, maxItems]);

  const getBadgeConfig = (badge: string) => {
    switch (badge) {
      case 'popular':
        return { icon: TrendingUp, label: 'Most Popular', className: 'bg-blue-500 text-white' };
      case 'editor-choice':
        return { icon: Award, label: "Editor's Choice", className: 'bg-purple-500 text-white' };
      case 'new':
        return { icon: Sparkles, label: 'New', className: 'bg-green-500 text-white' };
      case 'premium':
        return { icon: Star, label: 'Premium', className: 'bg-yellow-500 text-white' };
      case 'free':
        return { icon: Star, label: 'Free', className: 'bg-gray-500 text-white' };
      default:
        return { icon: Star, label: badge, className: 'bg-gray-500 text-white' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return PlayCircle;
      case 'video': return PlayCircle;
      case 'guide': return FileText;
      case 'book': return BookOpen;
      case 'pdf': return Download;
      default: return FileText;
    }
  };

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'amazon': return ShoppingCart;
      case 'pdf': return Download;
      case 'download': return Download;
      case 'vimeo': return PlayCircle;
      case 'youtube': return PlayCircle;
      case 'guide': return Eye;
      default: return ExternalLink;
    }
  };

  const ResourceCard = ({ resource }: { resource: Resource }) => {
    const TypeIcon = getTypeIcon(resource.type);
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full ${
          resource.featured ? 'ring-2 ring-primary/20' : ''
        }`}>
          <div className="relative overflow-hidden rounded-t-lg">
            <div className="aspect-[16/10] relative">
              <img
                src={`https://images.unsplash.com/${resource.coverImage}?auto=format&fit=crop&w=600&h=375`}
                alt={resource.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Type badge */}
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="flex items-center gap-1 bg-white/90 text-gray-900">
                  <TypeIcon className="h-3 w-3" />
                  {resource.type}
                </Badge>
              </div>
              
              {/* Category badge */}
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary/90 text-primary-foreground">
                  {resource.category}
                </Badge>
              </div>
              
              {/* Difficulty and rating */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <Badge className={`${
                  resource.difficulty === 'Beginner' ? 'bg-green-500' :
                  resource.difficulty === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                } text-white`}>
                  {resource.difficulty}
                </Badge>
                {resource.rating && (
                  <div className="flex items-center gap-1 text-white text-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {resource.rating}
                  </div>
                )}
              </div>
              
              {/* Duration */}
              {resource.duration && (
                <div className="absolute bottom-3 right-3 text-white text-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {resource.duration}
                </div>
              )}
            </div>
          </div>
          
          <CardContent className="p-5 flex flex-col h-full">
            <div className="flex-1">
              {/* Special badges */}
              {resource.badges && resource.badges.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {resource.badges.slice(0, 2).map((badge) => {
                    const config = getBadgeConfig(badge);
                    const IconComponent = config.icon;
                    return (
                      <Badge key={badge} className={`${config.className} text-xs`}>
                        <IconComponent className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                    );
                  })}
                </div>
              )}
              
              <CardTitle className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {resource.title}
              </CardTitle>
              
              <CardDescription className="text-sm mb-3 line-clamp-3 flex-1">
                {resource.description}
              </CardDescription>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Author */}
              {resource.author && (
                <p className="text-xs text-muted-foreground mb-4">
                  By {resource.author}
                </p>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="space-y-2 pt-2 border-t">
              {resource.links.slice(0, 2).map((link, index) => {
                const IconComponent = getLinkIcon(link.type);
                return (
                  <Button
                    key={index}
                    variant={index === 0 ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {link.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Search and Filters */}
      {showSearch && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1">
          {showCategories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="text-xs px-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Resource Grid */}
        <TabsContent value={selectedCategory} className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCategory + searchTerm}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </motion.div>
          </AnimatePresence>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No resources found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}