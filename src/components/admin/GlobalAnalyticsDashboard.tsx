import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Globe, TrendingUp, Users, MapPin, Languages, Calendar } from 'lucide-react';

interface RegionMetrics {
  region: string;
  flag: string;
  totalUsers: number;
  activeUsers: number;
  signups30d: number;
  conversionRate: number;
  topCountries: string[];
  engagementScore: number;
}

const GlobalAnalyticsDashboard: React.FC = () => {
  const { t } = useTranslation();

  // Mock data - in real implementation, this would come from your analytics system
  const regionMetrics: RegionMetrics[] = [
    {
      region: 'North America',
      flag: '🇺🇸',
      totalUsers: 1247,
      activeUsers: 892,
      signups30d: 156,
      conversionRate: 23.4,
      topCountries: ['United States', 'Canada'],
      engagementScore: 87
    },
    {
      region: 'Europe',
      flag: '🇪🇺',
      totalUsers: 643,
      activeUsers: 445,
      signups30d: 89,
      conversionRate: 18.7,
      topCountries: ['France', 'Germany', 'Spain'],
      engagementScore: 82
    },
    {
      region: 'Latin America',
      flag: '🇪🇸',
      totalUsers: 298,
      activeUsers: 201,
      signups30d: 67,
      conversionRate: 29.1,
      topCountries: ['Mexico', 'Argentina', 'Colombia'],
      engagementScore: 91
    },
    {
      region: 'Asia Pacific',
      flag: '🇨🇳',
      totalUsers: 189,
      activeUsers: 134,
      signups30d: 45,
      conversionRate: 31.2,
      topCountries: ['China', 'Singapore', 'Hong Kong'],
      engagementScore: 94
    },
    {
      region: 'Middle East',
      flag: '🇸🇦',
      totalUsers: 87,
      activeUsers: 62,
      signups30d: 23,
      conversionRate: 26.4,
      topCountries: ['Saudi Arabia', 'UAE', 'Qatar'],
      engagementScore: 88
    },
    {
      region: 'India',
      flag: '🇮🇳',
      totalUsers: 156,
      activeUsers: 98,
      signups30d: 34,
      conversionRate: 21.8,
      topCountries: ['India'],
      engagementScore: 85
    }
  ];

  const totalMetrics = regionMetrics.reduce((acc, region) => ({
    totalUsers: acc.totalUsers + region.totalUsers,
    activeUsers: acc.activeUsers + region.activeUsers,
    signups30d: acc.signups30d + region.signups30d,
    avgConversion: acc.avgConversion + region.conversionRate
  }), { totalUsers: 0, activeUsers: 0, signups30d: 0, avgConversion: 0 });

  totalMetrics.avgConversion = totalMetrics.avgConversion / regionMetrics.length;

  const languageStats = [
    { language: 'English', code: 'en', flag: '🇺🇸', users: 1436, growth: 12.3 },
    { language: 'Español', code: 'es', flag: '🇪🇸', users: 365, growth: 34.7 },
    { language: 'Français', code: 'fr', flag: '🇫🇷', users: 278, growth: 18.9 },
    { language: '中文', code: 'zh', flag: '🇨🇳', users: 189, growth: 41.2 },
    { language: 'हिंदी', code: 'hi', flag: '🇮🇳', users: 156, growth: 28.5 },
    { language: 'العربية', code: 'ar', flag: '🇸🇦', users: 87, growth: 22.1 }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            {t('analytics.global.title', 'Global Analytics Dashboard')}
          </h1>
          <p className="text-muted-foreground">{t('analytics.global.description', 'Track international growth and regional performance')}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            6 Regions Active
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Languages className="h-3 w-3" />
            6 Languages
          </Badge>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +14.2% vs last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalMetrics.activeUsers / totalMetrics.totalUsers) * 100)}% engagement rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">30-Day Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.signups30d}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +27.8% vs last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.avgConversion.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Across all regions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="regions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="regions">Regional Performance</TabsTrigger>
          <TabsTrigger value="languages">Language Analytics</TabsTrigger>
          <TabsTrigger value="growth">Growth Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="regions" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regionMetrics.map((region) => (
              <Card key={region.region}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{region.flag}</span>
                    {region.region}
                  </CardTitle>
                  <CardDescription>{region.topCountries.join(', ')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">{region.totalUsers.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Total Users</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{region.activeUsers}</div>
                      <div className="text-xs text-muted-foreground">Active</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>30-Day Signups</span>
                      <span>{region.signups30d}</span>
                    </div>
                    <Progress value={(region.signups30d / 200) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Conversion Rate</span>
                      <span>{region.conversionRate}%</span>
                    </div>
                    <Progress value={region.conversionRate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Engagement Score</span>
                      <span>{region.engagementScore}/100</span>
                    </div>
                    <Progress value={region.engagementScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="languages" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Language Distribution</CardTitle>
                <CardDescription>User base by preferred language</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {languageStats.map((lang) => (
                  <div key={lang.code} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.language}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{lang.users.toLocaleString()}</div>
                      <div className="text-xs text-green-600">+{lang.growth}%</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Language Growth Rates</CardTitle>
                <CardDescription>Monthly growth by language</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {languageStats
                  .sort((a, b) => b.growth - a.growth)
                  .map((lang) => (
                    <div key={lang.code} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span className="text-sm font-medium">{lang.language}</span>
                        </div>
                        <span className="text-sm font-bold">+{lang.growth}%</span>
                      </div>
                      <Progress value={lang.growth} className="h-2" />
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Growing Markets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>🇨🇳</span>
                    <span className="text-sm">Asia Pacific</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">+31.2%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>🇪🇸</span>
                    <span className="text-sm">Latin America</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">+29.1%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>🇸🇦</span>
                    <span className="text-sm">Middle East</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">+26.4%</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Engagement Leaders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {regionMetrics
                  .sort((a, b) => b.engagementScore - a.engagementScore)
                  .slice(0, 3)
                  .map((region) => (
                    <div key={region.region} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{region.flag}</span>
                        <span className="text-sm">{region.region}</span>
                      </div>
                      <Badge variant="outline">{region.engagementScore}/100</Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Launch Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Q1 2024:</span>
                  <span>🇺🇸 🇨🇦 English Launch</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Q2 2024:</span>
                  <span>🇪🇸 🇲🇽 Spanish Expansion</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Q3 2024:</span>
                  <span>🇫🇷 🇩🇪 European Markets</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Q4 2024:</span>
                  <span>🇨🇳 🇮🇳 🇸🇦 Asia/MENA</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GlobalAnalyticsDashboard;