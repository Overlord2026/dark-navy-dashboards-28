import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LaunchChecklistInterface } from '@/components/founding20/LaunchChecklistInterface';
import { PDFGenerator } from '@/components/founding20/PDFGenerator';
import { EmailTemplates } from '@/components/founding20/EmailTemplates';
import { QRCodeGenerator } from '@/components/founding20/QRCodeGenerator';
import { BarChart, CheckSquare, Mail, QrCode, FileText, Users, TrendingUp, Calendar, Target } from 'lucide-react';

const Founding20MasterDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Founding 20 Master Dashboard
          </h1>
          <p className="text-muted-foreground">
            Complete campaign management across Sports, Longevity, and RIA segments
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-6 gap-4">
          <Card className="bg-black border-emerald/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-emerald text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Sports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">20</div>
              <p className="text-xs text-white/60">Target organizations</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-navy/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-navy text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Longevity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">20</div>
              <p className="text-xs text-white/60">Target influencers & orgs</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-red/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-red text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                RIA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">20</div>
              <p className="text-xs text-white/60">Target RIA firms</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">8</div>
              <p className="text-xs text-white/60">Week execution plan</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold text-sm font-medium flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0%</div>
              <p className="text-xs text-white/60">Overall completion</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12</div>
              <p className="text-xs text-white/60">Founding partnerships</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="checklist" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-black border border-gold/30">
            <TabsTrigger value="checklist" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <CheckSquare className="h-4 w-4 mr-2" />
              Checklist
            </TabsTrigger>
            <TabsTrigger value="pdfs" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <FileText className="h-4 w-4 mr-2" />
              PDFs
            </TabsTrigger>
            <TabsTrigger value="emails" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Mail className="h-4 w-4 mr-2" />
              Email Templates
            </TabsTrigger>
            <TabsTrigger value="qr" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <QrCode className="h-4 w-4 mr-2" />
              QR Codes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checklist">
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">Launch Sequencing Checklist</CardTitle>
                <CardDescription className="text-white/70">
                  Interactive 8-week execution roadmap with progress tracking and ops board sync
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LaunchChecklistInterface />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pdfs">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-black border-emerald/30">
                <CardHeader>
                  <CardTitle className="text-emerald">Sports Segment</CardTitle>
                  <CardDescription className="text-white/70">
                    Generate PDFs for sports leagues and associations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PDFGenerator theme="print" segment="sports" />
                </CardContent>
              </Card>

              <Card className="bg-black border-navy/30">
                <CardHeader>
                  <CardTitle className="text-navy">Longevity Segment</CardTitle>
                  <CardDescription className="text-white/70">
                    Generate PDFs for longevity experts and organizations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PDFGenerator theme="print" segment="longevity" />
                </CardContent>
              </Card>

              <Card className="bg-black border-red/30">
                <CardHeader>
                  <CardTitle className="text-red">RIA Segment</CardTitle>
                  <CardDescription className="text-white/70">
                    Generate PDFs for RIA firms and wealth managers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PDFGenerator theme="print" segment="ria" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emails">
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-black border-emerald/30">
                  <CardHeader>
                    <CardTitle className="text-emerald">Sports Templates</CardTitle>
                    <CardDescription className="text-white/70">
                      Email templates for sports organizations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmailTemplates segment="sports" />
                  </CardContent>
                </Card>

                <Card className="bg-black border-navy/30">
                  <CardHeader>
                    <CardTitle className="text-navy">Longevity Templates</CardTitle>
                    <CardDescription className="text-white/70">
                      Email templates for longevity experts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmailTemplates segment="longevity" />
                  </CardContent>
                </Card>

                <Card className="bg-black border-red/30">
                  <CardHeader>
                    <CardTitle className="text-red">RIA Templates</CardTitle>
                    <CardDescription className="text-white/70">
                      Email templates for RIA firms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmailTemplates segment="ria" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qr">
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-black border-emerald/30">
                  <CardHeader>
                    <CardTitle className="text-emerald">Sports QR Codes</CardTitle>
                    <CardDescription className="text-white/70">
                      Generate QR codes for sports organizations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QRCodeGenerator 
                      segment="sports" 
                      baseUrl="https://my.bfocfo.com/founding20-sports"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-black border-navy/30">
                  <CardHeader>
                    <CardTitle className="text-navy">Longevity QR Codes</CardTitle>
                    <CardDescription className="text-white/70">
                      Generate QR codes for longevity experts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QRCodeGenerator 
                      segment="longevity" 
                      baseUrl="https://my.bfocfo.com/founding20-longevity"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-black border-red/30">
                  <CardHeader>
                    <CardTitle className="text-red">RIA QR Codes</CardTitle>
                    <CardDescription className="text-white/70">
                      Generate QR codes for RIA firms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QRCodeGenerator 
                      segment="ria" 
                      baseUrl="https://my.bfocfo.com/founding20-ria"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">Campaign Analytics & Reporting</CardTitle>
                <CardDescription className="text-white/70">
                  Track engagement, conversions, and partnership progress across all segments
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <BarChart className="h-16 w-16 text-gold mx-auto mb-4" />
                <p className="text-white/60 mb-4">
                  Analytics dashboard will be populated as campaign data comes in
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-black/50 border border-emerald/30 rounded-lg p-3">
                    <div className="text-emerald font-semibold">Sports</div>
                    <div className="text-white/60">Track sports org engagement</div>
                  </div>
                  <div className="bg-black/50 border border-navy/30 rounded-lg p-3">
                    <div className="text-navy font-semibold">Longevity</div>
                    <div className="text-white/60">Monitor influencer outreach</div>
                  </div>
                  <div className="bg-black/50 border border-red/30 rounded-lg p-3">
                    <div className="text-red font-semibold">RIA</div>
                    <div className="text-white/60">Measure RIA firm responses</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Founding20MasterDashboard;