import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Copy, 
  Send, 
  Users, 
  School, 
  Share,
  FileText,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

const NILCoachOutreach = () => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [coachName, setCoachName] = useState('');

  const emailTemplates = [
    {
      title: "Initial Coach Introduction",
      subject: "New NIL SmartMoney Curriculum—Empowering Your Athletes for Success!",
      template: `Dear [Coach Name],

Exciting news! The NIL SmartMoney Academy is now live—an all-in-one, best-in-class digital curriculum for empowering student-athletes with NIL education, financial literacy, and career skills.

Your athletes can:
- Learn the rules, avoid scams, and master NIL deals
- Earn completion badges and credits for self-paced progress  
- Connect their parents and guardians to the process

Get started by enrolling your team and accessing our full curriculum here: [platform_link]

Want a guided demo or custom onboarding for your school? Reply to this email or schedule a quick call.

To your athletes' success,

Tony Gomes
Founder, NIL SmartMoney Academy
tony@awmfl.com`,
      category: "intro"
    },
    {
      title: "Athletic Director Outreach",
      subject: "Empower Your Athletes – Free NIL Education & Compliance Platform",
      template: `Hi [AD Name],

We're excited to introduce a game-changing NIL (Name, Image, and Likeness) Education & Compliance platform—custom-built to empower your student-athletes to succeed on and off the field.

• Free, privacy-first onboarding for your team
• Interactive curriculum: compliance, tax, social media, and contract skills
• Real-world athlete stories and 1:1 access to expert advisors
• Custom reporting for coaches and schools—no cost

As a respected Athletic Director, you're among the first 100 invited to set up a school portal and preview our curriculum. We would be honored to walk you through a demo.

[CTA: Schedule Demo]

Let's help your athletes make the most of their NIL opportunities—safely, smartly, and for life.

Best regards,
Tony Gomes
Boutique Family Office™`,
      category: "admin"
    },
    {
      title: "Follow-up & Demo Request",
      subject: "NIL Education Demo - Perfect for [School Name] Athletes",
      template: `Hi [Coach Name],

I wanted to follow up on the NIL SmartMoney Academy platform I shared recently.

Given [School Name]'s commitment to athlete development, I believe this would be incredibly valuable for your team. The platform offers:

✅ Comprehensive NIL compliance training
✅ Financial literacy and tax planning modules  
✅ Social media and branding guidance
✅ Risk management and scam prevention
✅ Career planning beyond sports

Would you be interested in a 15-minute demo to see how this could benefit your athletes? I can show you:
- The complete curriculum overview
- How to track athlete progress
- Referral and engagement features

Let me know what works for your schedule.

Best,
Tony Gomes`,
      category: "followup"
    }
  ];

  const linkedInTemplates = [
    {
      title: "LinkedIn Connection Request",
      message: `Hi [Name], I'm launching a new NIL education platform for athletes, families, and coaches—would love to invite you/your program for a VIP preview. Our mission is to empower and protect the next generation of athletes with world-class fiduciary guidance. Can I send more info?`
    },
    {
      title: "LinkedIn Follow-up Message", 
      message: `Thanks for connecting! I'd love to show you our NIL SmartMoney Academy—a comprehensive education platform for student-athletes. We're offering free access to the first 100 schools. Would you be open to a quick 10-minute demo to see if it would benefit your athletes?`
    }
  ];

  const generatePersonalizedEmail = (template: string) => {
    return template
      .replace(/\[Coach Name\]/g, coachName || '[Coach Name]')
      .replace(/\[AD Name\]/g, coachName || '[AD Name]')  
      .replace(/\[School Name\]/g, schoolName || '[School Name]')
      .replace(/\[platform_link\]/g, 'https://bfo.app/athletes/nil-landing');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Template copied to clipboard!');
  };

  const sendEmail = (subject: string, body: string) => {
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Coach & School Outreach</h2>
        <p className="text-muted-foreground">
          Ready-to-use templates for reaching out to coaches, athletic directors, and schools
        </p>
      </div>

      {/* Personalization Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Personalize Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Coach/AD Name</label>
              <Input
                placeholder="e.g., Coach Johnson"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">School Name</label>
              <Input
                placeholder="e.g., State University"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Recipient Email</label>
              <Input
                type="email"
                placeholder="coach@school.edu"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Templates
        </h3>
        
        {emailTemplates.map((template, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{template.title}</CardTitle>
                <Badge variant="outline">{template.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subject:</label>
                <p className="font-medium">{template.subject}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Body:</label>
                <Textarea
                  value={generatePersonalizedEmail(template.template)}
                  readOnly
                  className="mt-2 min-h-[200px] font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => copyToClipboard(generatePersonalizedEmail(template.template))}
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Template
                </Button>
                <Button 
                  onClick={() => sendEmail(template.subject, generatePersonalizedEmail(template.template))}
                  disabled={!recipientEmail}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* LinkedIn Templates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Share className="h-5 w-5" />
          LinkedIn Templates
        </h3>

        {linkedInTemplates.map((template, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{template.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={template.message.replace(/\[Name\]/g, coachName || '[Name]')}
                readOnly
                className="min-h-[100px]"
              />
              <Button 
                onClick={() => copyToClipboard(template.message.replace(/\[Name\]/g, coachName || '[Name]'))}
                variant="outline"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy LinkedIn Message
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Download All Templates
            </Button>
            <Button variant="outline" className="justify-start">
              <School className="h-4 w-4 mr-2" />
              School Database
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Outreach Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NILCoachOutreach;