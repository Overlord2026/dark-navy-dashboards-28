import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Download, 
  FileText, 
  BookOpen,
  Video,
  Upload,
  Users,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function PlanMigrationVideoScript() {
  const handleDownloadScript = () => {
    const scriptContent = `
Plan Migration Made Easy - Video Training Script
==============================================

Duration: 3 minutes

INTRO (0:00-0:15)
-----------------
Welcome to the Plan Import Wizard! I'm excited to show you how easy it is to migrate your existing retirement plans to our platform. 

In the next 3 minutes, you'll learn everything you need to know to get started.

SECTION 1: Upload Methods (0:15-0:45)
-------------------------------------
First, let's look at your upload options. You have two main choices:

1. CSV/Excel Import - Perfect if you're coming from MoneyGuidePro, eMoney, or RightCapital. Just export your data and upload it here.

2. PDF Upload with AI Parsing - Have plan summaries or reports? Our AI will automatically extract all the key data for you. No manual data entry required!

For CSV uploads, you can download our template to see exactly what fields we need. It's that simple.

SECTION 2: Field Mapping (0:45-1:30)
------------------------------------
Now here's where the magic happens. When you upload a PDF, our AI goes to work immediately. 

Watch as it extracts:
- Client demographics
- Current asset values
- Retirement goals
- Risk tolerance
- Monthly contributions
- And much more

The system automatically maps these fields, but you can review and edit anything before importing. This ensures 100% accuracy every time.

SECTION 3: Review & Import (1:30-2:15)
--------------------------------------
Once your data is parsed and mapped, you'll see this review screen. Here you can:
- Verify all the extracted information
- Make any necessary corrections
- Add additional notes or details

When you're satisfied, just click "Import Plan" and you're done! The plan is immediately available in your dashboard.

SECTION 4: Client Assignment (2:15-2:45)
----------------------------------------
After import, you can assign the plan to your client records. This connects everything together - their contact info, documents, meeting notes, and now their retirement plan.

The plan appears instantly in your Retirement Analyzer where you can run scenarios, stress tests, and generate beautiful reports for client meetings.

COMPLIANCE & SUPPORT (2:45-3:00)
--------------------------------
Everything is automatically logged for compliance. You can view the complete audit trail anytime.

Need help? Just click the concierge button for white-glove onboarding assistance, or book a training call with our team.

That's it! You're ready to migrate your plans and unlock the full power of our platform.

CALL TO ACTION
--------------
Ready to get started? Click "Import Plans" from your dashboard or visit the Resource Center for more training materials.

Thanks for watching, and welcome to the future of retirement planning!

---

Production Notes:
- Screen recordings of actual import process
- Highlight key UI elements with callouts
- Use sample data that shows realistic scenarios
- Include brief testimonial quotes overlay
- End with clear next steps CTA
`;

    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plan-migration-video-script.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Video script downloaded! Ready for production team.');
  };

  const videoOutline = [
    {
      timestamp: '0:00-0:15',
      section: 'Introduction',
      content: 'Welcome to Plan Import Wizard - overview of what you\'ll learn'
    },
    {
      timestamp: '0:15-0:45',
      section: 'Upload Methods',
      content: 'CSV/Excel vs PDF upload options, template download'
    },
    {
      timestamp: '0:45-1:30',
      section: 'AI Parsing Demo',
      content: 'Live demo of PDF parsing, field extraction, automatic mapping'
    },
    {
      timestamp: '1:30-2:15',
      section: 'Review & Verification',
      content: 'Data review screen, editing capabilities, accuracy checks'
    },
    {
      timestamp: '2:15-2:45',
      section: 'Client Assignment',
      content: 'Linking to client records, dashboard integration'
    },
    {
      timestamp: '2:45-3:00',
      section: 'Support & Next Steps',
      content: 'Compliance logging, concierge service, training resources'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Video className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold">Plan Migration Video Script</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          "Plan Migration Made Easy" - Complete 3-minute training script
        </p>
      </div>

      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-red-600" />
            Production Ready Script
          </CardTitle>
          <CardDescription>
            Complete script with timestamps, screen recording notes, and production guidelines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold">3 Minutes</h4>
              <p className="text-sm text-muted-foreground">Total duration</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold">6 Sections</h4>
              <p className="text-sm text-muted-foreground">Structured content</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <CheckCircle className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold">Screen Recording</h4>
              <p className="text-sm text-muted-foreground">Live demo included</p>
            </div>
          </div>
          
          <Button onClick={handleDownloadScript} className="w-full" size="lg">
            <Download className="h-5 w-5 mr-2" />
            Download Complete Script
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Video Outline & Timestamps</CardTitle>
          <CardDescription>
            Detailed breakdown of each section with timing and content focus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {videoOutline.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="font-mono text-xs">
                    {item.timestamp}
                  </Badge>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{item.section}</h4>
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-muted-foreground">Key</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Production Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Visual Elements:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Screen recordings of actual import process</li>
                <li>• Highlight key UI elements with callouts</li>
                <li>• Use realistic sample data</li>
                <li>• Include brief testimonial quotes overlay</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Audio:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Clear, friendly narration</li>
                <li>• Background music (subtle)</li>
                <li>• UI sound effects for key actions</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Supporting Materials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Required Assets:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sample CSV template file</li>
                <li>• Mock PDF retirement report</li>
                <li>• Screenshot assets for thumbnails</li>
                <li>• Brand-compliant video template</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Distribution:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Advisor Resource Center</li>
                <li>• Email onboarding sequence</li>
                <li>• Support documentation</li>
                <li>• Sales demo materials</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">Ready for Production</h3>
          <p className="text-muted-foreground mb-4">
            This script is production-ready and includes all necessary elements for a professional training video
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Send to Video Team
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Create Storyboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}