import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Presentation, Video, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const NILCurriculumDownloads = () => {
  const downloads = [
    {
      title: "NIL Education Curriculum",
      type: "PDF",
      description: "Complete 10-module curriculum with learning objectives and visuals",
      icon: FileText,
      size: "2.4 MB",
      pages: "45 pages"
    },
    {
      title: "NIL Education Curriculum", 
      type: "PowerPoint",
      description: "Interactive presentation deck with module slides and animations",
      icon: Presentation,
      size: "5.7 MB",
      slides: "32 slides"
    },
    {
      title: "Onboarding Scripts",
      type: "PDF", 
      description: "Step-by-step guides for athletes, coaches, and staff",
      icon: FileText,
      size: "1.2 MB",
      pages: "12 pages"
    },
    {
      title: "NIL Demo Slides",
      type: "PowerPoint",
      description: "Platform walkthrough and feature demonstration",
      icon: Presentation,
      size: "3.1 MB", 
      slides: "18 slides"
    },
    {
      title: "Demo Video Script",
      type: "PDF",
      description: "Complete script for NIL platform demo video",
      icon: Video,
      size: "0.8 MB",
      pages: "8 pages"
    },
    {
      title: "Admin Coach Dashboard Specs",
      type: "PDF",
      description: "Dashboard specifications and monitoring guidelines",
      icon: FileText,
      size: "1.5 MB",
      pages: "15 pages"
    }
  ];

  const handleDownload = (filename: string) => {
    // Simulate download
    console.log(`Downloading ${filename}`);
  };

  const handlePreview = (filename: string) => {
    // Simulate preview
    console.log(`Previewing ${filename}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">NIL Curriculum Downloads</h2>
        <p className="text-muted-foreground">
          Access complete curriculum materials, training guides, and resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {downloads.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{item.size}</span>
                  <span>•</span>
                  <span>{item.pages || item.slides}</span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleDownload(item.title)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handlePreview(item.title)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Course Checklists
            </Button>
            <Button variant="outline" className="justify-start">
              <Presentation className="h-4 w-4 mr-2" />
              Training Materials
            </Button>
            <Button variant="outline" className="justify-start">
              <Video className="h-4 w-4 mr-2" />
              Demo Videos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NILCurriculumDownloads;