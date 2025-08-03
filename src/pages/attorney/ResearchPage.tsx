import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { AttorneyNavigation } from '@/components/attorney/AttorneyNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  BookOpen, 
  Scale, 
  FileText, 
  Clock,
  Bookmark,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Download,
  Star,
  History
} from 'lucide-react';

export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
  const [searchType, setSearchType] = useState('');

  const recentSearches = [
    { query: 'employment discrimination federal law', date: '2024-01-20', results: 156 },
    { query: 'corporate merger securities regulations', date: '2024-01-19', results: 89 },
    { query: 'intellectual property licensing agreements', date: '2024-01-18', results: 234 }
  ];

  const savedResearch = [
    {
      title: 'Employment At-Will Exceptions',
      jurisdiction: 'California',
      date_saved: '2024-01-20',
      case_count: 45,
      tags: ['Employment', 'Labor Law', 'Wrongful Termination']
    },
    {
      title: 'Corporate Governance Best Practices',
      jurisdiction: 'Delaware',
      date_saved: '2024-01-18',
      case_count: 67,
      tags: ['Corporate Law', 'Fiduciary Duty', 'Board Relations']
    },
    {
      title: 'Contract Formation Elements',
      jurisdiction: 'Federal',
      date_saved: '2024-01-15',
      case_count: 123,
      tags: ['Contract Law', 'Consideration', 'Offer and Acceptance']
    }
  ];

  const caseLawResults = [
    {
      case_name: 'Smith v. ABC Corporation',
      court: 'California Supreme Court',
      year: '2023',
      citation: '2023 Cal. LEXIS 456',
      relevance: 95,
      summary: 'Landmark case establishing new standards for employment discrimination claims in California.',
      key_holdings: ['Expanded definition of workplace harassment', 'Burden of proof standards']
    },
    {
      case_name: 'Johnson Industries v. EPA',
      court: 'U.S. Court of Appeals, 9th Circuit',
      year: '2023',
      citation: '2023 U.S. App. LEXIS 789',
      relevance: 87,
      summary: 'Federal environmental regulations and corporate compliance requirements.',
      key_holdings: ['Environmental impact assessments', 'Corporate liability standards']
    }
  ];

  const regulations = [
    {
      title: 'Securities Exchange Act Rule 10b-5',
      agency: 'SEC',
      effective_date: '2024-01-01',
      status: 'Active',
      summary: 'Anti-fraud provisions for securities transactions',
      last_updated: '2024-01-15'
    },
    {
      title: 'Employment Eligibility Verification (I-9)',
      agency: 'DHS',
      effective_date: '2023-08-01',
      status: 'Active',
      summary: 'Form I-9 and E-Verify requirements for employers',
      last_updated: '2024-01-10'
    }
  ];

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <ThreeColumnLayout title="Legal Research">
      <div className="space-y-6">
        <DashboardHeader 
          heading="Legal Research & Analysis"
          text="Advanced legal research tools, case law database, and regulatory compliance tracking."
        />

        <AttorneyNavigation />

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="case-law">Case Law</TabsTrigger>
            <TabsTrigger value="regulations">Regulations</TabsTrigger>
            <TabsTrigger value="saved">Saved Research</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Legal Research Search</CardTitle>
                <CardDescription>
                  Search case law, statutes, regulations, and legal commentary
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="search">Search Query</Label>
                    <div className="flex gap-2">
                      <Input
                        id="search"
                        placeholder="Enter your legal research query..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Button>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="search-type">Search Type</Label>
                      <Select value={searchType} onValueChange={setSearchType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All sources" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Sources</SelectItem>
                          <SelectItem value="case-law">Case Law</SelectItem>
                          <SelectItem value="statutes">Statutes</SelectItem>
                          <SelectItem value="regulations">Regulations</SelectItem>
                          <SelectItem value="secondary">Secondary Sources</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="jurisdiction">Jurisdiction</Label>
                      <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                        <SelectTrigger>
                          <SelectValue placeholder="All jurisdictions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Jurisdictions</SelectItem>
                          <SelectItem value="federal">Federal</SelectItem>
                          <SelectItem value="california">California</SelectItem>
                          <SelectItem value="new-york">New York</SelectItem>
                          <SelectItem value="texas">Texas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="date-range">Date Range</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All dates" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Dates</SelectItem>
                          <SelectItem value="last-year">Last Year</SelectItem>
                          <SelectItem value="last-5-years">Last 5 Years</SelectItem>
                          <SelectItem value="last-10-years">Last 10 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Recent Searches</h4>
                  {recentSearches.map((search, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{search.query}</div>
                        <div className="text-sm text-muted-foreground">
                          {search.date} • {search.results} results
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-1" />
                        Search Again
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="case-law" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cases Found</CardTitle>
                  <Scale className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">
                    Matching your criteria
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Cases</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">
                    From last 30 days
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saved Cases</CardTitle>
                  <Bookmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">
                    In your library
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Case Law Results</CardTitle>
                <CardDescription>
                  Relevant case law and judicial decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseLawResults.map((case_item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{case_item.case_name}</h4>
                          <div className="text-sm text-muted-foreground">
                            {case_item.court} • {case_item.year} • {case_item.citation}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${getRelevanceColor(case_item.relevance)}`}>
                            {case_item.relevance}% relevant
                          </span>
                          <Button variant="outline" size="sm">
                            <Bookmark className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mb-3">{case_item.summary}</p>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Key Holdings:</div>
                        <ul className="text-sm text-muted-foreground list-disc list-inside">
                          {case_item.key_holdings.map((holding, idx) => (
                            <li key={idx}>{holding}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Full Text
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regulations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Information</CardTitle>
                <CardDescription>
                  Current regulations, agency guidance, and compliance requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regulations.map((regulation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{regulation.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {regulation.agency} • Effective: {regulation.effective_date}
                        </div>
                        <p className="text-sm mt-1">{regulation.summary}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {regulation.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Research</CardTitle>
                <CardDescription>
                  Your saved research projects and bookmarked materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedResearch.map((research, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{research.title}</h4>
                          <div className="text-sm text-muted-foreground">
                            {research.jurisdiction} • Saved: {research.date_saved} • {research.case_count} cases
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Open
                          </Button>
                          <Button variant="outline" size="sm">
                            <Star className="h-4 w-4 mr-1" />
                            Favorite
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {research.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Research Analytics</CardTitle>
                <CardDescription>
                  Insights and metrics for your legal research activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <h4 className="font-medium">Research Efficiency</h4>
                    </div>
                    <div className="text-2xl font-bold">4.2 min</div>
                    <p className="text-sm text-muted-foreground">Average search time</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-green-500" />
                      <h4 className="font-medium">Monthly Searches</h4>
                    </div>
                    <div className="text-2xl font-bold">342</div>
                    <p className="text-sm text-muted-foreground">Queries performed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Research History</CardTitle>
                <CardDescription>
                  Complete history of your legal research activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSearches.map((search, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{search.query}</div>
                        <div className="text-sm text-muted-foreground">
                          {search.date} • {search.results} results found
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Results
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}