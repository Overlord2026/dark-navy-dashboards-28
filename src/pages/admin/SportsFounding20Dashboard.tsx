import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PDFGenerator } from '@/components/founding20/PDFGenerator';
import { EmailTemplates } from '@/components/founding20/EmailTemplates';
import { QRCodeGenerator } from '@/components/founding20/QRCodeGenerator';
import { BarChart, Mail, QrCode, FileText, Users, TrendingUp } from 'lucide-react';

const SportsFounding20Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Sports Founding 20 Campaign
          </h1>
          <p className="text-muted-foreground">
            Manage the complete campaign for sports leagues and associations
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-black border-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Target Organizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">20</div>
              <p className="text-xs text-white/60">Sports leagues & associations</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">2</div>
              <p className="text-xs text-white/60">Cold + follow-up sequences</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold text-sm font-medium flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">20</div>
              <p className="text-xs text-white/60">Org-specific tracking codes</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Conversion Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">20%</div>
              <p className="text-xs text-white/60">Target partnership rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pdfs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-black border border-gold/30">
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

          <TabsContent value="pdfs">
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">PDF Generation</CardTitle>
                <CardDescription className="text-white/70">
                  Generate print and digital versions of the ROI-ranked organization list
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PDFGenerator theme="print" segment="sports" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emails">
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">Email Templates</CardTitle>
                <CardDescription className="text-white/70">
                  Customize and preview email templates for outreach
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmailTemplates segment="sports" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr">
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">QR Code Generator</CardTitle>
                <CardDescription className="text-white/70">
                  Generate trackable QR codes for each target organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QRCodeGenerator segment="sports" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">Campaign Analytics</CardTitle>
                <CardDescription className="text-white/70">
                  Track engagement and conversion metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <BarChart className="h-16 w-16 text-gold mx-auto mb-4" />
                <p className="text-white/60">
                  Analytics dashboard will be populated as campaign data comes in
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SportsFounding20Dashboard;