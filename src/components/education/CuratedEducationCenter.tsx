import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  Crown, 
  TrendingUp, 
  BookOpen, 
  Play, 
  Download,
  ExternalLink,
  Calendar,
  User,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FeaturedGuideCard } from './FeaturedGuideCard';

interface CuratedContent {
  id: string;
  title: string;
  author: string;
  description: string;
  type: 'guide' | 'course' | 'ebook' | 'video';
  category: string;
  coverImage?: string;
  rating: number;
  duration?: string;
  featured: boolean;
  staffPick: boolean;
  popularity: number;
  publishedDate: string;
  downloadUrl?: string;
  viewUrl?: string;
}

export function CuratedEducationCenter() {
  // Mock curated content - in production, this would load from a spreadsheet/API
  const curatedContent: CuratedContent[] = [
    {
      id: 'gotm-2024-01',
      title: 'Advanced Tax Optimization Strategies for 2024',
      author: 'Sarah Chen, CPA',
      description: 'Comprehensive guide covering the latest tax law changes and optimization techniques for high-net-worth individuals.',
      type: 'guide',
      category: 'Tax Planning',
      rating: 4.9,
      duration: '45 min read',
      featured: true,
      staffPick: true,
      popularity: 95,
      publishedDate: '2024-01-15',
      downloadUrl: '/guides/tax-optimization-2024.pdf',
      viewUrl: '/education/guides/tax-optimization-2024'
    },
    {
      id: 'sp-retirement',
      title: 'Retirement Income Distribution Masterclass',
      author: 'Michael Rodriguez, CFP',
      description: 'Step-by-step video course on creating sustainable retirement income streams through strategic withdrawal sequencing.',
      type: 'course',
      category: 'Retirement Planning',
      rating: 4.8,
      duration: '3.5 hours',
      featured: false,
      staffPick: true,
      popularity: 88,
      publishedDate: '2024-01-10',
      viewUrl: '/education/courses/retirement-income-masterclass'
    },
    {
      id: 'sp-estate',
      title: 'Estate Planning Essentials for Modern Families',
      author: 'Jennifer Kim, JD',
      description: 'Complete eBook covering wills, trusts, and estate tax strategies for contemporary family structures.',
      type: 'ebook',
      category: 'Estate Planning',
      rating: 4.7,
      duration: '120 pages',
      featured: false,
      staffPick: true,
      popularity: 82,
      publishedDate: '2024-01-05',
      downloadUrl: '/ebooks/estate-planning-essentials.pdf',
      viewUrl: '/education/ebooks/estate-planning-essentials'
    },
    {
      id: 'trending-roth',
      title: 'Roth Conversion Timing Strategies',
      author: 'David Park, CFA',
      description: 'Interactive video explaining optimal timing for Roth conversions based on market conditions and tax brackets.',
      type: 'video',
      category: 'Tax Planning',
      rating: 4.6,
      duration: '28 minutes',
      featured: false,
      staffPick: false,
      popularity: 91,
      publishedDate: '2023-12-20',
      viewUrl: '/education/videos/roth-conversion-timing'
    },
    {
      id: 'trending-college',
      title: 'College Funding Strategies Guide',
      author: 'Lisa Thompson, CFP',
      description: '529 plans, Coverdell ESAs, and alternative funding strategies for education expenses.',
      type: 'guide',
      category: 'Education Planning',
      rating: 4.5,
      duration: '35 min read',
      featured: false,
      staffPick: false,
      popularity: 76,
      publishedDate: '2023-12-15',
      downloadUrl: '/guides/college-funding-strategies.pdf',
      viewUrl: '/education/guides/college-funding-strategies'
    },
    {
      id: 'sp-business',
      title: 'Small Business Tax Deduction Checklist',
      author: 'Robert Martinez, CPA',
      description: 'Comprehensive checklist and strategies for maximizing business tax deductions and credits.',
      type: 'ebook',
      category: 'Business Planning',
      rating: 4.8,
      duration: '45 pages',
      featured: false,
      staffPick: true,
      popularity: 84,
      publishedDate: '2023-12-10',
      downloadUrl: '/ebooks/business-tax-deductions.pdf',
      viewUrl: '/education/ebooks/business-tax-deductions'
    }
  ];

  const guideOfTheMonth = curatedContent.find(item => item.featured);
  const staffPicks = curatedContent.filter(item => item.staffPick && !item.featured);
  const trending = curatedContent
    .filter(item => !item.staffPick && !item.featured)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);

  const handleOpenContent = (content: CuratedContent) => {
    if (content.viewUrl) {
      window.open(content.viewUrl, '_blank');
    }
  };

  const handleDownloadContent = (content: CuratedContent) => {
    if (content.downloadUrl) {
      // In production, this would trigger an actual download
      window.open(content.downloadUrl, '_blank');
    }
  };

  const handleShareContent = (content: CuratedContent) => {
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: content.description,
        url: content.viewUrl || window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(content.viewUrl || window.location.href);
    }
  };

  return (
    <div className="space-y-8">
      {/* Guide of the Month */}
      {guideOfTheMonth && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
              <Crown className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Guide of the Month</h2>
              <p className="text-muted-foreground">
                January 2024 • Hand-picked by our expert team
              </p>
            </div>
          </div>

          <Card className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-yellow-200 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Featured Content Preview */}
                <div className="lg:col-span-1">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <BookOpen className="h-16 w-16 text-primary/40" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Crown className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{guideOfTheMonth.title}</h3>
                    <p className="text-muted-foreground mb-3">
                      by {guideOfTheMonth.author}
                    </p>
                    <p className="text-sm leading-relaxed">
                      {guideOfTheMonth.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{guideOfTheMonth.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{guideOfTheMonth.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(guideOfTheMonth.publishedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => handleOpenContent(guideOfTheMonth)} className="flex-1">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Guide
                    </Button>
                    {guideOfTheMonth.downloadUrl && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleDownloadContent(guideOfTheMonth)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleShareContent(guideOfTheMonth)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}

      <Separator />

      {/* Staff Picks */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Staff Picks</h2>
              <p className="text-muted-foreground">
                Recommended by our financial planning experts
              </p>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            {staffPicks.length} Resources
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffPicks.map(content => (
            <FeaturedGuideCard
              key={content.id}
              title={content.title}
              author={content.author}
              description={content.description}
              type={content.type}
              rating={content.rating}
              duration={content.duration}
              isStaffPick={content.staffPick}
              onOpen={() => handleOpenContent(content)}
              onDownload={content.downloadUrl ? () => handleDownloadContent(content) : undefined}
              onShare={() => handleShareContent(content)}
            />
          ))}
        </div>
      </motion.section>

      <Separator />

      {/* Trending Now */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Trending Now</h2>
              <p className="text-muted-foreground">
                Most popular resources this month
              </p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800">
            Hot 🔥
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((content, index) => (
            <FeaturedGuideCard
              key={content.id}
              title={content.title}
              author={content.author}
              description={content.description}
              type={content.type}
              rating={content.rating}
              duration={content.duration}
              onOpen={() => handleOpenContent(content)}
              onDownload={content.downloadUrl ? () => handleDownloadContent(content) : undefined}
              onShare={() => handleShareContent(content)}
            />
          ))}
        </div>
      </motion.section>

      {/* Content Management Note */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Content Management</h4>
              <p className="text-sm text-muted-foreground">
                Content is curated from our expert spreadsheet and updated monthly. 
                All guides include download options and can be shared with CPAs through the platform.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}