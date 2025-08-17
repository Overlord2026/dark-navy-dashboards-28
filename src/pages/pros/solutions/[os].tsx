import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const OS_CONFIGS = {
  'advisor-os': {
    title: 'AdvisorOS',
    description: 'Complete practice management for financial advisors',
    features: ['Client Portal', 'Portfolio Management', 'Compliance Tracking', 'Meeting Scheduler'],
    pricing: '$299/month'
  },
  'accounting-os': {
    title: 'AccountingOS', 
    description: 'Streamlined accounting and tax preparation workflow',
    features: ['Tax Return Automation', 'Client Communication', 'Document Management', 'Deadline Tracking'],
    pricing: '$199/month'
  },
  'legal-os': {
    title: 'LegalOS',
    description: 'Case management and client collaboration for attorneys',
    features: ['Case Tracking', 'Document Assembly', 'Client Portal', 'Billing Integration'],
    pricing: '$349/month'
  },
  'realtor-os': {
    title: 'RealtorOS',
    description: 'Real estate transaction and relationship management',
    features: ['Lead Management', 'Transaction Pipeline', 'Marketing Tools', 'Commission Tracking'],
    pricing: '$149/month'
  },
  'marketing-os': {
    title: 'MarketingOS',
    description: 'Multi-channel marketing automation and analytics',
    features: ['Campaign Management', 'Lead Nurturing', 'Analytics Dashboard', 'Social Media Tools'],
    pricing: '$99/month'
  }
};

export default function OperatingSystemPage() {
  const { os } = useParams<{ os: string }>();
  const config = OS_CONFIGS[os as keyof typeof OS_CONFIGS];

  if (!config) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-center">Operating System Not Found</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="mb-4">Operating System</Badge>
        <h1 className="text-4xl font-bold text-foreground">{config.title}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {config.description}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>Everything you need to run your practice efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {config.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Ready to transform your practice?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-primary">{config.pricing}</div>
            <p className="text-sm text-muted-foreground">14-day free trial • No setup fees</p>
            <div className="space-y-2">
              <Button className="w-full">Enable {config.title}</Button>
              <Button variant="outline" className="w-full">Schedule Demo</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Integration & Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Quick Setup</h4>
              <p className="text-sm text-muted-foreground">Get up and running in under 30 minutes with guided onboarding</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Data Migration</h4>
              <p className="text-sm text-muted-foreground">Seamlessly import your existing data with our migration tools</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">24/7 Support</h4>
              <p className="text-sm text-muted-foreground">Expert support team available whenever you need assistance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}