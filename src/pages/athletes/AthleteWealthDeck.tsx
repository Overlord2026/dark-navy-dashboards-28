import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Users,
  Heart,
  Shield,
  BookOpen,
  Download,
  QrCode,
  Play,
  ArrowRight,
  Star,
  Award,
  Zap,
  BarChart3,
  Settings,
  Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';

const athleteStats = [
  { sport: 'NFL', avgCareer: '3.3 years', bankruptcyRate: '78%' },
  { sport: 'NBA', avgCareer: '4.5 years', bankruptcyRate: '60%' },
  { sport: 'MLB', avgCareer: '5.6 years', bankruptcyRate: '40%' },
];

const swagPhases = [
  {
    id: 1,
    name: 'Income Now',
    timeline: 'Years 1-2',
    description: 'Core living expenses covered (housing, food, health, utilities, transportation)',
    subDescription: 'Emergency liquidity for unexpected events',
    color: 'from-emerald-500 to-emerald-600',
    icon: Shield,
    investments: ['High-yield savings', 'Money market funds', 'Short-term CDs']
  },
  {
    id: 2,
    name: 'Income Later',
    timeline: 'Years 3-12',
    description: 'Discretionary & lifestyle spending (travel, events, hobbies)',
    subDescription: 'RMDs, low-volatility income sources (private credit, income real estate)',
    color: 'from-blue-500 to-blue-600',
    icon: TrendingUp,
    investments: ['Private credit', 'Income real estate', 'Dividend stocks']
  },
  {
    id: 3,
    name: 'Growth',
    timeline: '12+ years',
    description: 'High-growth equities, dividend stocks, private equity, blockchain, crypto',
    subDescription: 'Focus on long-term wealth creation',
    color: 'from-purple-500 to-purple-600',
    icon: Zap,
    investments: ['Growth equities', 'Private equity', 'Blockchain/Crypto']
  },
  {
    id: 4,
    name: 'Legacy',
    timeline: 'Ongoing',
    description: 'Estate planning, family protection, charitable giving',
    subDescription: 'Multi-generational impact',
    color: 'from-amber-500 to-amber-600',
    icon: Heart,
    investments: ['Life insurance', 'Trusts', 'Charitable vehicles']
  }
];

const testimonials = [
  {
    name: 'Marcus Johnson',
    sport: 'Former NFL Pro Bowl WR',
    quote: "The SWAG framework helped me see beyond my playing career. I'm now financially secure for life.",
    image: '/placeholder-athlete1.jpg'
  },
  {
    name: 'Sarah Williams',
    sport: 'Olympic Gold Medalist',
    quote: "Finally, a retirement plan that understands athletes' unique challenges and timeline.",
    image: '/placeholder-athlete2.jpg'
  }
];

export default function AthleteWealthDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const slides = [
    'title',
    'challenge', 
    'swag-framework',
    'portal-walkthrough',
    'education-center',
    'marketplace',
    'benefits',
    'testimonials',
    'cta'
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Presentation Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={prevSlide} variant="outline" size="sm">
                ← Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Slide {currentSlide + 1} of {slides.length}
              </span>
              <Button onClick={nextSlide} variant="outline" size="sm">
                Next →
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Deck
              </Button>
              <Button 
                onClick={() => setShowVideo(!showVideo)}
                variant="outline" 
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                {showVideo ? 'Hide' : 'Show'} Video
              </Button>
            </div>
          </div>

          {/* Slide Navigation Dots */}
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide 
                    ? 'bg-primary' 
                    : 'bg-muted hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          {/* Video Teaser (if shown) */}
          {showVideo && (
            <Card className="bg-gradient-to-r from-primary/10 to-blue-600/10">
              <CardContent className="pt-6">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">SWAG™ Framework Animation</h3>
                    <p className="text-muted-foreground">60-second animated overview of the 4-phase approach</p>
                    <Button className="mt-4">
                      Play Demo Video
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Slide Content */}
          <Card className="min-h-[600px]">
            <CardContent className="pt-8">
              {/* Slide 1: Title */}
              {currentSlide === 0 && (
                <div className="text-center space-y-8 h-full flex flex-col justify-center">
                  <div>
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      Your SWAG™ Retirement Roadmap
                    </h1>
                    <p className="text-2xl md:text-3xl text-muted-foreground">
                      Health, Wealth, Legacy
                    </p>
                  </div>
                  
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                      <Trophy className="h-24 w-24 text-primary" />
                    </div>
                    <Badge className="absolute top-4 right-4 bg-primary">
                      For Athletes & Entertainers
                    </Badge>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <QrCode className="h-16 w-16 mx-auto mb-2" />
                      <p className="text-sm font-medium">Scan for Live Demo</p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    <Link to="/retirement-roadmap">
                      <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600">
                        Try Demo Portal
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Slide 2: The Challenge */}
              {currentSlide === 1 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">The Challenge</h2>
                    <p className="text-xl text-muted-foreground">
                      Athletic careers are short, but financial consequences are long-lasting
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {athleteStats.map((stat) => (
                      <Card key={stat.sport} className="text-center">
                        <CardHeader>
                          <CardTitle className="text-2xl">{stat.sport}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="text-3xl font-bold text-primary">{stat.avgCareer}</div>
                              <div className="text-sm text-muted-foreground">Average Career</div>
                            </div>
                            <div>
                              <div className="text-3xl font-bold text-destructive">{stat.bankruptcyRate}</div>
                              <div className="text-sm text-muted-foreground">Face Bankruptcy</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-destructive/10 border-destructive/20">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <h3 className="text-2xl font-semibold">The Hidden Costs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <strong>Lifestyle Pressure:</strong> Maintaining status and image post-career
                          </div>
                          <div>
                            <strong>Poor Advice:</strong> Advisors who don't understand athlete needs
                          </div>
                          <div>
                            <strong>Unplanned Transition:</strong> No roadmap for life after sports
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Slide 3: SWAG Framework */}
              {currentSlide === 2 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">
                      The SWAG™ Retirement Roadmap Framework
                    </h2>
                    <Badge className="text-lg px-4 py-2">Trademarked & Proven</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {swagPhases.map((phase) => {
                      const IconComponent = phase.icon;
                      return (
                        <Card 
                          key={phase.id} 
                          className={`relative overflow-hidden bg-gradient-to-br ${phase.color} text-white`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <IconComponent className="h-8 w-8" />
                              <Badge variant="secondary" className="text-black">
                                Phase {phase.id}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg">{phase.name}</CardTitle>
                            <div className="text-sm opacity-90">{phase.timeline}</div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <p className="text-sm opacity-90">{phase.description}</p>
                              <p className="text-xs opacity-75">{phase.subDescription}</p>
                              <div className="space-y-1">
                                <div className="text-xs font-medium">Sample Investments:</div>
                                {phase.investments.map((investment, idx) => (
                                  <div key={idx} className="text-xs opacity-75">
                                    • {investment}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <Card className="bg-primary/10 border-primary/20">
                    <CardContent className="pt-6 text-center">
                      <h3 className="text-xl font-semibold mb-2">Visual Timeline</h3>
                      <div className="flex items-center justify-between">
                        {swagPhases.map((phase, index) => (
                          <div key={phase.id} className="flex items-center">
                            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${phase.color}`} />
                            {index < swagPhases.length - 1 && (
                              <div className="w-8 h-0.5 bg-muted mx-2" />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>Now</span>
                        <span>Years 1-2</span>
                        <span>Years 3-12</span>
                        <span>12+ Years</span>
                        <span>Legacy</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Slide 4: Portal Walkthrough */}
              {currentSlide === 3 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">Athlete Portal Walkthrough</h2>
                    <p className="text-xl text-muted-foreground">
                      See your complete financial picture in one secure dashboard
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Accounts & Assets
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Bank Accounts</span>
                            <span className="font-medium">$2.4M</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Real Estate</span>
                            <span className="font-medium">$3.8M</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Digital Assets</span>
                            <span className="font-medium">$450K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Collectibles</span>
                            <span className="font-medium">$125K</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Income Gap Analyzer
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span>Monthly Need</span>
                              <span className="font-medium">$45,000</span>
                            </div>
                            <Progress value={75} className="h-2" />
                            <div className="text-sm text-muted-foreground mt-1">75% covered</div>
                          </div>
                          <div className="text-sm">
                            <strong>Gap:</strong> $11,250/month needs additional planning
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Scenario Modeling
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Early Retirement (age 30)</span>
                            <Badge variant="outline">87% success</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Market Crash (-40%)</span>
                            <Badge variant="outline">72% success</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Long-term Care Event</span>
                            <Badge variant="outline">65% success</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5" />
                          SWAG Phase View
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {swagPhases.slice(0, 3).map((phase) => (
                            <div key={phase.id} className="flex items-center justify-between">
                              <span className="text-sm">{phase.name}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={Math.random() * 100} className="w-16 h-1" />
                                <span className="text-xs">
                                  ${Math.floor(Math.random() * 500 + 100)}K
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center">
                    <Link to="/retirement-roadmap">
                      <Button size="lg">
                        <Play className="h-4 w-4 mr-2" />
                        Try Live Demo
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Slide 5: Education Center */}
              {currentSlide === 4 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">Education & Solutions Center</h2>
                    <p className="text-xl text-muted-foreground">
                      Mobile-first curriculum designed specifically for athletes
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          12-Module Athlete Curriculum
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            'NIL & Contract Management',
                            'Tax Optimization for Athletes',
                            'Asset Protection Strategies', 
                            'Mental Health & Wellness',
                            'Second Career Planning',
                            'Investment Fundamentals'
                          ].map((module, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                {index + 1}
                              </div>
                              <span className="text-sm">{module}</span>
                              <Award className="h-4 w-4 text-warning ml-auto" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Key Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                            <div>
                              <div className="font-medium">Mobile-First Design</div>
                              <div className="text-sm text-muted-foreground">
                                Learn on-the-go between training and games
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                            <div>
                              <div className="font-medium">Badge & Achievement System</div>
                              <div className="text-sm text-muted-foreground">
                                Gamified learning with progress tracking
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                            <div>
                              <div className="font-medium">Profile Integration</div>
                              <div className="text-sm text-muted-foreground">
                                Courses sync with your SWAG roadmap
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-r from-primary/10 to-blue-600/10">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold">Coming Soon: AI Coach</h3>
                        <p className="text-muted-foreground">
                          Personalized financial coaching powered by AI, available 24/7 via text or voice
                        </p>
                        <Button variant="outline">
                          Join Waitlist
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Slide 6: Marketplace */}
              {currentSlide === 5 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">Vetted Professional Marketplace</h2>
                    <p className="text-xl text-muted-foreground">
                      Pre-screened fiduciary professionals who understand athlete needs
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { title: 'Fiduciary Advisors', icon: Target, count: '500+' },
                      { title: 'Certified CPAs', icon: Shield, count: '200+' },
                      { title: 'Sports Attorneys', icon: BookOpen, count: '150+' },
                      { title: 'Health Experts', icon: Heart, count: '100+' }
                    ].map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <Card key={category.title} className="text-center">
                          <CardHeader>
                            <IconComponent className="h-8 w-8 mx-auto text-primary" />
                            <CardTitle className="text-lg">{category.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-primary">{category.count}</div>
                            <div className="text-sm text-muted-foreground">Available</div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Why Our Marketplace is Different</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center space-y-3">
                          <Star className="h-8 w-8 mx-auto text-warning" />
                          <h4 className="font-semibold">Athlete-Specialized</h4>
                          <p className="text-sm text-muted-foreground">
                            All professionals have experience working with athletes and entertainers
                          </p>
                        </div>
                        <div className="text-center space-y-3">
                          <Shield className="h-8 w-8 mx-auto text-emerald-500" />
                          <h4 className="font-semibold">Fiduciary Standard</h4>
                          <p className="text-sm text-muted-foreground">
                            Every advisor is legally bound to act in your best interest
                          </p>
                        </div>
                        <div className="text-center space-y-3">
                          <Users className="h-8 w-8 mx-auto text-blue-500" />
                          <h4 className="font-semibold">Single Secure Login</h4>
                          <p className="text-sm text-muted-foreground">
                            Access all services through one integrated platform
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Slide 7: Benefits */}
              {currentSlide === 6 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">Benefits for Leagues, Unions, and Agencies</h2>
                    <p className="text-xl text-muted-foreground">
                      Protecting your players protects your organization
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-emerald-50 border-emerald-200">
                      <CardHeader>
                        <CardTitle className="text-emerald-700">Reduced Risk</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• Lower bankruptcy rates</li>
                          <li>• Fewer financial scandals</li>
                          <li>• Reduced reputational damage</li>
                          <li>• Lower welfare costs</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-blue-700">Enhanced Satisfaction</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• Improved player wellbeing</li>
                          <li>• Better post-career outcomes</li>
                          <li>• Stronger alumni relationships</li>
                          <li>• Positive community impact</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-purple-50 border-purple-200">
                      <CardHeader>
                        <CardTitle className="text-purple-700">White-Label Ready</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• Custom team branding</li>
                          <li>• Agency co-branding</li>
                          <li>• Integrated with existing systems</li>
                          <li>• Full administrative control</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-r from-primary/10 to-blue-600/10">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <h3 className="text-2xl font-semibold">Partnership ROI</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div>
                            <div className="text-3xl font-bold text-primary">40%</div>
                            <div className="text-sm text-muted-foreground">Reduction in post-career financial distress</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-primary">2.5x</div>
                            <div className="text-sm text-muted-foreground">Increase in financial literacy scores</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-primary">95%</div>
                            <div className="text-sm text-muted-foreground">Player satisfaction rating</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Slide 8: Testimonials */}
              {currentSlide === 7 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">What Athletes Are Saying</h2>
                    <p className="text-xl text-muted-foreground">
                      Real success stories from real athletes
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial, index) => (
                      <Card key={index} className="bg-gradient-to-br from-primary/5 to-blue-600/5">
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <Trophy className="h-8 w-8 text-primary" />
                              </div>
                              <div>
                                <div className="font-semibold text-lg">{testimonial.name}</div>
                                <div className="text-sm text-muted-foreground">{testimonial.sport}</div>
                              </div>
                            </div>
                            <blockquote className="text-lg italic">
                              "{testimonial.quote}"
                            </blockquote>
                            <div className="flex text-warning">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-current" />
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold">League Partners</h3>
                        <p className="text-muted-foreground mb-6">
                          Trusted by professional organizations nationwide
                        </p>
                        <div className="flex justify-center items-center gap-8 opacity-60">
                          {/* Placeholder for partner logos */}
                          <div className="w-20 h-12 bg-muted rounded flex items-center justify-center text-xs">
                            LEAGUE
                          </div>
                          <div className="w-20 h-12 bg-muted rounded flex items-center justify-center text-xs">
                            UNION
                          </div>
                          <div className="w-20 h-12 bg-muted rounded flex items-center justify-center text-xs">
                            AGENCY
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Partnership announcements coming soon
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Slide 9: Call to Action */}
              {currentSlide === 8 && (
                <div className="text-center space-y-8 h-full flex flex-col justify-center">
                  <div>
                    <h2 className="text-5xl md:text-6xl font-bold mb-6">
                      Your career is short.
                    </h2>
                    <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
                      Your legacy is forever.
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Card className="bg-gradient-to-br from-primary/10 to-blue-600/10">
                      <CardContent className="pt-6 text-center">
                        <QrCode className="h-24 w-24 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Try Free Demo</h3>
                        <p className="text-muted-foreground mb-4">
                          Scan QR code or click below for instant access
                        </p>
                        <Link to="/retirement-roadmap">
                          <Button size="lg" className="w-full">
                            Launch Demo Portal
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10">
                      <CardContent className="pt-6 text-center">
                        <Users className="h-24 w-24 mx-auto mb-4 text-emerald-600" />
                        <h3 className="text-xl font-semibold mb-2">Partner with Us</h3>
                        <p className="text-muted-foreground mb-4">
                          League, union, or agency interested in player wellness?
                        </p>
                        <Button size="lg" variant="outline" className="w-full">
                          Schedule Partnership Call
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center">
                    <p className="text-lg text-muted-foreground mb-4">
                      Join the athletes who are building wealth that lasts
                    </p>
                    <Badge className="text-lg px-6 py-3">
                      SWAG™ Retirement Roadmap - Start Today
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Administrative Panel for Sales Reps */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Sales Rep Admin Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Latest Deck
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Version
                </Button>
                <Button variant="outline">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate Custom QR
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}