import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  FileText, 
  Video, 
  Image, 
  Users, 
  BookOpen,
  Presentation,
  PlayCircle,
  Monitor,
  Smartphone,
  CheckCircle,
  Clock
} from "lucide-react";

export const TrainingMaterialsCenter: React.FC = () => {
  const [downloadCount, setDownloadCount] = useState(0);

  const handleDownload = (fileName: string) => {
    setDownloadCount(prev => prev + 1);
    // Simulate download
    console.log(`Downloading: ${fileName}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Training Materials Center</h2>
          <p className="text-muted-foreground">Comprehensive training resources for all persona groups</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            Staff Training Portal
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Bulk Download
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">Across all persona groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downloadCount + 3847}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Video Content</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43</div>
            <p className="text-xs text-muted-foreground">Hours of training</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Guides</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Step-by-step guides</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="persona-guides" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="persona-guides">Persona Guides</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="video-training">Video Training</TabsTrigger>
          <TabsTrigger value="mobile-resources">Mobile Resources</TabsTrigger>
          <TabsTrigger value="staff-materials">Staff Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="persona-guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Financial Advisor Complete Guide",
                description: "Comprehensive PDF guide with screenshots and workflows",
                personas: ["Financial Advisors"],
                type: "PDF",
                size: "4.2 MB",
                pages: 47,
                updated: "2 days ago"
              },
              {
                title: "CPA Practice Management",
                description: "Step-by-step guide for tax professionals and accountants",
                personas: ["CPAs", "Tax Professionals"],
                type: "PDF + PPTX",
                size: "6.8 MB",
                pages: 62,
                updated: "1 week ago"
              },
              {
                title: "Realtor Dashboard Training",
                description: "Complete walkthrough of listing and lead management",
                personas: ["Real Estate Agents"],
                type: "PDF",
                size: "3.9 MB",
                pages: 38,
                updated: "3 days ago"
              },
              {
                title: "Property Manager Handbook",
                description: "Tenant portal setup and maintenance tracking guide",
                personas: ["Property Managers"],
                type: "PDF + Video",
                size: "5.1 MB",
                pages: 51,
                updated: "5 days ago"
              },
              {
                title: "NIL Education Curriculum",
                description: "Complete athlete education platform guide",
                personas: ["Athletes", "Coaches", "Parents"],
                type: "PDF + PPTX",
                size: "7.3 MB",
                pages: 73,
                updated: "1 day ago"
              },
              {
                title: "Attorney Practice Suite",
                description: "Document management and client portal guide",
                personas: ["Attorneys", "Legal Professionals"],
                type: "PDF",
                size: "4.7 MB",
                pages: 44,
                updated: "1 week ago"
              }
            ].map((guide, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-base">{guide.title}</CardTitle>
                    <Badge variant="outline">{guide.type}</Badge>
                  </div>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {guide.personas.map((persona) => (
                      <Badge key={persona} variant="secondary" className="text-xs">
                        {persona}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{guide.pages} pages</span>
                    <span>{guide.size}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Updated {guide.updated}</span>
                  </div>
                  
                  <Button 
                    className="w-full gap-2" 
                    size="sm"
                    onClick={() => handleDownload(guide.title)}
                  >
                    <Download className="h-3 w-3" />
                    Download Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Slides & Presentations</CardTitle>
                <CardDescription>PowerPoint decks for each persona group</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Realtor Onboarding Deck", slides: 23, personas: "Real Estate Agents" },
                  { name: "Property Manager Setup", slides: 28, personas: "Property Managers" },
                  { name: "Financial Advisor Walkthrough", slides: 31, personas: "Financial Advisors" },
                  { name: "NIL Education Intro", slides: 19, personas: "Athletes & Coaches" },
                  { name: "CPA Practice Overview", slides: 26, personas: "CPAs & Tax Pros" }
                ].map((deck, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Presentation className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{deck.name}</p>
                        <p className="text-sm text-muted-foreground">{deck.slides} slides • {deck.personas}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(deck.name)}>
                      <Download className="h-3 w-3 mr-1" />
                      PPTX
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Start Checklists</CardTitle>
                <CardDescription>Step-by-step PDF checklists for immediate action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Realtor First 24 Hours", items: 12, time: "30 min" },
                  { name: "Property Manager Setup", items: 15, time: "45 min" },
                  { name: "Financial Advisor Checklist", items: 18, time: "60 min" },
                  { name: "NIL Platform Quick Start", items: 10, time: "20 min" },
                  { name: "CPA Dashboard Setup", items: 14, time: "40 min" }
                ].map((checklist, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">{checklist.name}</p>
                        <p className="text-sm text-muted-foreground">{checklist.items} steps • ~{checklist.time}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(checklist.name)}>
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="video-training" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Dashboard Walkthrough with Mary",
                description: "Complete tour of the realtor practice dashboard",
                duration: "12:34",
                persona: "Realtors",
                thumbnail: "realtor-walkthrough.jpg",
                type: "Demo Video"
              },
              {
                title: "Property Manager Complete Training",
                description: "From setup to advanced features in 20 minutes",
                duration: "19:47",
                persona: "Property Managers",
                thumbnail: "property-mgr-training.jpg",
                type: "Training Series"
              },
              {
                title: "Financial Advisor Onboarding",
                description: "Step-by-step guide to platform mastery",
                duration: "15:23",
                persona: "Financial Advisors",
                thumbnail: "advisor-onboarding.jpg",
                type: "Getting Started"
              },
              {
                title: "NIL Education Platform Tour",
                description: "Complete curriculum and coaching tools overview",
                duration: "18:12",
                persona: "Athletes & Coaches",
                thumbnail: "nil-platform-tour.jpg",
                type: "Feature Demo"
              },
              {
                title: "CPA Practice Management",
                description: "Client onboarding and compliance tracking",
                duration: "22:15",
                persona: "CPAs",
                thumbnail: "cpa-practice.jpg",
                type: "Advanced Training"
              },
              {
                title: "Marketing Dashboard Mastery",
                description: "Campaign creation and analytics deep-dive",
                duration: "16:41",
                persona: "Marketing Teams",
                thumbnail: "marketing-mastery.jpg",
                type: "Advanced Features"
              }
            ].map((video, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="relative mb-3">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardTitle className="text-base">{video.title}</CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <Badge variant="secondary">{video.persona}</Badge>
                    <Badge variant="outline">{video.type}</Badge>
                  </div>
                  <Button className="w-full gap-2" onClick={() => handleDownload(video.title)}>
                    <Video className="h-3 w-3" />
                    Download Video
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mobile-resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile-Optimized Guides
                </CardTitle>
                <CardDescription>Responsive PDFs designed for mobile viewing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Mobile Dashboard Quick Guide", size: "1.2 MB", personas: "All Users" },
                  { name: "On-the-Go Property Management", size: "1.8 MB", personas: "Property Managers" },
                  { name: "Mobile Listing Management", size: "1.5 MB", personas: "Real Estate Agents" },
                  { name: "Client Check-in Mobile Guide", size: "1.1 MB", personas: "Financial Advisors" }
                ].map((guide, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium">{guide.name}</p>
                        <p className="text-sm text-muted-foreground">{guide.size} • {guide.personas}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(guide.name)}>
                      <Download className="h-3 w-3 mr-1" />
                      Mobile PDF
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Desktop vs Mobile Comparison
                </CardTitle>
                <CardDescription>Feature comparison charts and optimization tips</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6">
                  <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Interactive comparison charts showing desktop vs mobile feature availability
                  </p>
                  <Button variant="outline" onClick={() => handleDownload("Mobile Comparison Guide")}>
                    <Download className="h-3 w-3 mr-1" />
                    Download Comparison
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mobile App Screenshots & Workflows</CardTitle>
              <CardDescription>Visual guides for mobile app navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Login & Onboarding",
                  "Dashboard Navigation", 
                  "Contact Management",
                  "Document Upload",
                  "Calendar & Scheduling",
                  "Analytics & Reports",
                  "Settings & Profile",
                  "Help & Support"
                ].map((workflow) => (
                  <div key={workflow} className="text-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <Smartphone className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">{workflow}</p>
                    <Button size="sm" variant="ghost" className="mt-2" onClick={() => handleDownload(`${workflow} Screenshots`)}>
                      <Image className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff-materials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Training SOPs</CardTitle>
                <CardDescription>Standard Operating Procedures for platform management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "User Onboarding SOP", pages: 15, updated: "2 days ago" },
                  { name: "Technical Support Procedures", pages: 22, updated: "1 week ago" },
                  { name: "Content Management Guidelines", pages: 18, updated: "3 days ago" },
                  { name: "Marketing Campaign SOPs", pages: 25, updated: "5 days ago" },
                  { name: "Data Export & Reporting", pages: 12, updated: "1 day ago" }
                ].map((sop, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{sop.name}</p>
                      <p className="text-sm text-muted-foreground">{sop.pages} pages • Updated {sop.updated}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(sop.name)}>
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demo Scripts & Presentations</CardTitle>
                <CardDescription>Ready-to-use scripts for client demonstrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Financial Advisor Demo Script", duration: "15 min", type: "PDF" },
                  { name: "Realtor Platform Walkthrough", duration: "12 min", type: "PDF + PPTX" },
                  { name: "Property Manager Demo Flow", duration: "18 min", type: "PDF" },
                  { name: "NIL Education Presentation", duration: "20 min", type: "PPTX" },
                  { name: "Marketing Dashboard Demo", duration: "14 min", type: "PDF + Video" }
                ].map((script, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="font-medium">{script.name}</p>
                        <p className="text-sm text-muted-foreground">{script.duration} • {script.type}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(script.name)}>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Marketing Assets & Templates</CardTitle>
              <CardDescription>Branded materials for outreach and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Email Templates", count: 24, type: "HTML/Text" },
                  { name: "Social Media Assets", count: 36, type: "PNG/JPG" },
                  { name: "Presentation Templates", count: 12, type: "PPTX" },
                  { name: "Brochure Designs", count: 8, type: "PDF/Figma" },
                  { name: "Website Banners", count: 18, type: "PNG/SVG" },
                  { name: "Video Thumbnails", count: 15, type: "PNG/PSD" }
                ].map((asset, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <Image className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium mb-1">{asset.name}</p>
                    <p className="text-sm text-muted-foreground mb-3">{asset.count} items • {asset.type}</p>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(asset.name)}>
                      <Download className="h-3 w-3 mr-1" />
                      Package
                    </Button>
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