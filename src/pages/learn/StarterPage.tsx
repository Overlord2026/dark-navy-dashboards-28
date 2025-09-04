import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Play, BookOpen, Users, Clock, CheckCircle } from 'lucide-react';

const PERSONA_INFO: Record<string, {
  title: string;
  description: string;
  videoTitle: string;
  features: string[];
  calendlyUrl: string;
}> = {
  advisor: {
    title: 'Financial Advisor Overview',
    description: 'Discover how our platform helps financial advisors grow their practice and serve clients better.',
    videoTitle: 'Financial Advisor Platform Walkthrough',
    features: [
      'Client portfolio management and analysis',
      'Automated compliance and documentation',
      'Advanced planning tools and calculators',
      'Seamless client collaboration',
      'Integrated proposal generation'
    ],
    calendlyUrl: 'https://calendly.com/your-team/advisor-demo'
  },
  insurance: {
    title: 'Insurance Agent Overview',
    description: 'See how insurance agents streamline their workflow from intake to claims processing.',
    videoTitle: 'Insurance Platform Complete Workflow',
    features: [
      'Streamlined client intake process',
      'Multi-carrier quote comparison',
      'One-click policy binding',
      'Automated claims processing (FNOL)',
      'Commission tracking and reporting'
    ],
    calendlyUrl: 'https://calendly.com/your-team/insurance-demo'
  },
  accountant: {
    title: 'CPA & Tax Professional Overview',
    description: 'Learn how CPAs leverage our platform for advanced tax planning and estate analysis.',
    videoTitle: 'CPA Tax Planning Platform Tour',
    features: [
      'Multi-year tax projection modeling',
      'Estate tax analysis and planning',
      'Business valuation tools',
      'Client collaboration workspace',
      'Professional report generation'
    ],
    calendlyUrl: 'https://calendly.com/your-team/cpa-demo'
  },
  attorney: {
    title: 'Estate Planning Attorney Overview',
    description: 'Explore how attorneys modernize their estate planning practice with our platform.',
    videoTitle: 'Estate Planning Practice Automation',
    features: [
      'Automated document drafting',
      'Client interview workflows',
      'Collaborative review sessions',
      'Secure document execution',
      'Compliance and filing management'
    ],
    calendlyUrl: 'https://calendly.com/your-team/attorney-demo'
  },
  'family-retiree': {
    title: 'Retiree Family Overview',
    description: 'See how retiree families protect their legacy and manage their golden years.',
    videoTitle: 'Family Security and Legacy Planning',
    features: [
      'Secure family document vault',
      'Healthcare directive planning',
      'Income optimization strategies',
      'Legacy and estate planning',
      'Family member access management'
    ],
    calendlyUrl: 'https://calendly.com/your-team/family-demo'
  },
  'family-aspiring': {
    title: 'Aspiring Family Overview',
    description: 'Discover how growing families build wealth and achieve their financial goals.',
    videoTitle: 'Wealth Building for Growing Families',
    features: [
      'Goal-based financial planning',
      'Investment strategy development',
      'Home buying preparation',
      'Insurance and protection planning',
      'Family financial organization'
    ],
    calendlyUrl: 'https://calendly.com/your-team/family-demo'
  }
};

const StarterPage = () => {
  const { persona } = useParams<{ persona: string }>();
  
  if (!persona || !PERSONA_INFO[persona]) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
            <p className="text-muted-foreground">
              The requested persona information could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const info = PERSONA_INFO[persona];

  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-navy))]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4 bg-bfo-gold text-black">
              {persona.charAt(0).toUpperCase() + persona.slice(1)} Overview
            </Badge>
            <h1 className="text-4xl font-bold mb-4 text-white">{info.title}</h1>
            <p className="text-xl text-white/80">{info.description}</p>
          </div>

          {/* Video Section */}
          <Card className="mb-8 bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Play className="h-5 w-5 text-bfo-gold" />
                {info.videoTitle}
              </CardTitle>
              <CardDescription className="text-white/80">
                Watch this 15-minute overview to see the platform in action
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Video Placeholder */}
              <div className="aspect-video bg-[hsl(210_65%_8%)] rounded-lg flex items-center justify-center mb-4 border border-bfo-gold/20">
                <div className="text-center">
                  <Play className="h-16 w-16 text-bfo-gold mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-white">Video Coming Soon</h3>
                  <p className="text-white/80">
                    Our team is preparing a comprehensive walkthrough video for {persona} users.
                  </p>
                </div>
              </div>
              
              {/* Video Controls Placeholder */}
              <div className="flex items-center justify-between text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Duration: ~15 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Interactive Demo Available</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Overview */}
          <Card className="mb-8 bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CheckCircle className="h-5 w-5 text-bfo-gold" />
                Key Platform Features
              </CardTitle>
              <CardDescription className="text-white/80">
                Here's what you'll be able to do with our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {info.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(210_65%_8%)] border border-bfo-gold/20">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Booking Section */}
          <Card className="border-4 border-bfo-gold bg-[hsl(210_65%_13%)] shadow-lg shadow-bfo-gold/20">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-bfo-gold" />
              <h3 className="text-2xl font-bold mb-4 text-white">Ready to Learn More?</h3>
              <p className="text-white/80 mb-6">
                Book a personalized 15-minute overview with our team. We'll show you exactly 
                how the platform works for your specific needs and answer any questions.
              </p>
              
              <div className="space-y-4">
                <Button size="lg" className="w-full md:w-auto bg-bfo-gold text-black hover:bg-bfo-gold/90" asChild>
                  <a 
                    href={info.calendlyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-5 w-5" />
                    Book Your 15-Minute Overview
                  </a>
                </Button>
                
                <div className="text-sm text-white/60">
                  <p>✓ No commitment required</p>
                  <p>✓ Personalized to your needs</p>
                  <p>✓ Live Q&A with our experts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <div className="mt-8 text-center">
            <p className="text-white/80 mb-4">
              Want to explore on your own first?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black">
                <a href={`/personas/${persona}`}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Return to {persona.charAt(0).toUpperCase() + persona.slice(1)} Dashboard
                </a>
              </Button>
              <Button variant="outline" asChild className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black">
                <a href={`/discover?persona=${persona}`}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Solution Catalog
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarterPage;