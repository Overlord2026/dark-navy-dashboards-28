import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Mail, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Target,
  Play,
  Settings,
  Eye,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LeadToSalesMarketingEngineProps {
  persona?: 'accountant' | 'advisor' | 'attorney' | 'realtor' | 'insurance' | 'healthcare';
}

export const LeadToSalesMarketingEngine: React.FC<LeadToSalesMarketingEngineProps> = ({
  persona = 'accountant'
}) => {
  const [activeTab, setActiveTab] = useState('campaigns');

  const personaConfigs = {
    accountant: {
      title: 'CPA Practice Growth Engine',
      description: 'Grow your accounting practice with automated tax-focused campaigns',
      sampleSubject: 'Your Tax Strategy Could Save You $15,000+',
      sampleContent: 'Are you maximizing your tax efficiency? Our recent analysis shows business owners like you could save an average of $15,000 annually with proper planning...',
      ctaText: 'Schedule Free Tax Consultation'
    },
    advisor: {
      title: 'Wealth Management Lead Engine',
      description: 'Attract high-net-worth prospects with sophisticated investment strategies',
      sampleSubject: 'Market Volatility: Protect & Grow Your Wealth',
      sampleContent: 'Recent market events have created unique opportunities for strategic investors. Our fiduciary approach has helped clients preserve wealth while capturing growth...',
      ctaText: 'Book Complimentary Portfolio Review'
    },
    attorney: {
      title: 'Legal Practice Marketing Engine',
      description: 'Generate qualified leads for your legal practice',
      sampleSubject: 'Protect Your Assets Before It\'s Too Late',
      sampleContent: 'Estate planning isn\'t just for the wealthy. Recent changes in tax law affect families at all income levels...',
      ctaText: 'Schedule Free Legal Consultation'
    },
    realtor: {
      title: 'Real Estate Lead Generator',
      description: 'Connect with buyers and sellers in your market',
      sampleSubject: 'Your Home Value Has Changed',
      sampleContent: 'Market conditions in your neighborhood have shifted. Properties similar to yours are selling 15% above asking price...',
      ctaText: 'Get Free Home Valuation'
    },
    insurance: {
      title: 'Insurance Sales Engine',
      description: 'Identify and nurture insurance prospects efficiently',
      sampleSubject: 'Are You Underinsured? Most People Are',
      sampleContent: 'Life changes happen fast - new job, marriage, kids. Your insurance coverage should keep pace...',
      ctaText: 'Get Free Insurance Review'
    },
    healthcare: {
      title: 'Healthcare Practice Growth',
      description: 'Attract patients and grow your healthcare practice',
      sampleSubject: 'Transform Your Health in 2024',
      sampleContent: 'Preventive care is the foundation of long-term health. Our comprehensive approach helps patients achieve their wellness goals...',
      ctaText: 'Schedule Health Consultation'
    }
  };

  const config = personaConfigs[persona];

  const campaignStats = {
    active: 12,
    leads: 147,
    conversions: 34,
    roi: 340
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mx-auto mb-4 flex items-center justify-center"
        >
          <TrendingUp className="w-8 h-8 text-white" />
        </motion.div>
        
        <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
        <p className="text-muted-foreground">{config.description}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Mail className="w-5 h-5 mr-2 text-primary" />
                  Email Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Campaigns</span>
                    <Badge>{campaignStats.active}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Open Rate</span>
                    <span className="text-sm font-medium text-green-600">24.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Click Rate</span>
                    <span className="text-sm font-medium text-green-600">8.2%</span>
                  </div>
                  <Button size="sm" className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                  SMS Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Sequences</span>
                    <Badge>8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response Rate</span>
                    <span className="text-sm font-medium text-green-600">31.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="text-sm font-medium text-green-600">12.1%</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure SMS
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Sample Email Template
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subject Line</label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm font-medium">
                    {config.sampleSubject}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Content</label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm space-y-3">
                    <p>Hi [First Name],</p>
                    <p>{config.sampleContent}</p>
                    <div className="pt-2">
                      <Button size="sm">{config.ctaText}</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Best regards,<br/>
                      [Your Name]<br/>
                      [Your Firm]
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm">Use This Template</Button>
                  <Button size="sm" variant="outline">Customize</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{campaignStats.active}</div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{campaignStats.leads}</div>
                <p className="text-sm text-muted-foreground">Leads Generated</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{campaignStats.conversions}</div>
                <p className="text-sm text-muted-foreground">Conversions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{campaignStats.roi}%</div>
                <p className="text-sm text-muted-foreground">ROI</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Campaign Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tax Planning Campaign</span>
                    <span className="text-green-600">23% conversion</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Year-End Planning</span>
                    <span className="text-green-600">18% conversion</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Business Tax Review</span>
                    <span className="text-green-600">15% conversion</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Recent Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Lead #{1000 + i}</div>
                        <div className="text-sm text-muted-foreground">
                          From: Tax Planning Campaign
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        2 days ago
                      </Badge>
                      <Button size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};