import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Filter,
  TrendingUp,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Share
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  timesUsed: number;
  lastUsed?: string;
  impressions: number;
  engagement: number;
  liked: boolean;
  content: string;
}

export function PostsLibrary() {
  const [posts] = useState<Post[]>([
    {
      id: '1',
      title: 'The Probate Nightmare: $3M Solution',
      category: 'Estate Plan & Will',
      subCategory: 'Estate Plan',
      timesUsed: 0,
      impressions: 0,
      engagement: 0,
      liked: false,
      content: 'A comprehensive guide to avoiding probate complications and protecting your family\'s wealth.'
    },
    {
      id: '2',
      title: 'How a $1.8M IRA Became a Tax Headache',
      category: 'Estate Plan & Will', 
      subCategory: 'Estate Plan',
      timesUsed: 5,
      lastUsed: '2024-01-15',
      impressions: 1250,
      engagement: 85,
      liked: true,
      content: 'Learn the critical mistakes that turned a retirement nest egg into a tax burden.'
    },
    {
      id: '3',
      title: 'The $2.6M Surprise Tax Bill',
      category: 'Estate Plan & Will',
      subCategory: 'Estate Plan', 
      timesUsed: 12,
      lastUsed: '2024-01-20',
      impressions: 2340,
      engagement: 156,
      liked: true,
      content: 'Real case study of how poor estate planning led to devastating tax consequences.'
    },
    {
      id: '4',
      title: 'SWAG Retirement Score: Your Financial GPS',
      category: 'Retirement Planning',
      subCategory: 'Retirement Analysis',
      timesUsed: 25,
      lastUsed: '2024-01-22',
      impressions: 4200,
      engagement: 312,
      liked: true,
      content: 'Discover how our proprietary SWAG methodology creates personalized retirement roadmaps.'
    },
    {
      id: '5',
      title: 'The Hidden Costs of DIY Estate Planning',
      category: 'Estate Plan & Will',
      subCategory: 'Estate Plan',
      timesUsed: 8,
      lastUsed: '2024-01-18',
      impressions: 1890,
      engagement: 98,
      liked: false,
      content: 'Why template wills and online services can cost your family millions.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category)))];
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPosts = posts.length;
  const totalImpressions = posts.reduce((acc, post) => acc + post.impressions, 0);
  const avgEngagement = posts.length > 0 ? Math.round(posts.reduce((acc, post) => acc + post.engagement, 0) / posts.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalPosts}</p>
                <p className="text-xs text-muted-foreground">Total Posts</p>
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalImpressions.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Impressions</p>
              </div>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{avgEngagement}</p>
                <p className="text-xs text-muted-foreground">Avg Engagement</p>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((posts.filter(p => p.timesUsed > 0).length / totalPosts) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">Usage Rate</p>
              </div>
              <Share className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Posts Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts by title or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>
          </div>

          {/* Posts Table */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="relative">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4">
                      <h4 className="font-medium text-sm">{post.title}</h4>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {post.subCategory}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 text-center">
                      <p className="text-sm font-medium">{post.timesUsed}</p>
                      <p className="text-xs text-muted-foreground">Times Used</p>
                    </div>
                    
                    <div className="md:col-span-2 text-center">
                      <p className="text-sm font-medium">
                        {post.lastUsed ? new Date(post.lastUsed).toLocaleDateString() : 'Never'}
                      </p>
                      <p className="text-xs text-muted-foreground">Last Used</p>
                    </div>
                    
                    <div className="md:col-span-2 text-center">
                      <p className="text-sm font-medium">{post.impressions.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Impressions</p>
                    </div>
                    
                    <div className="md:col-span-1 text-center">
                      <p className="text-sm font-medium">{post.engagement}</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                    
                    <div className="md:col-span-1 flex justify-center gap-1">
                      <Button
                        size="sm"
                        variant={post.liked ? 'default' : 'outline'}
                        className="h-8 w-8 p-0"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                      <Button size="sm">
                        Use Post
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}