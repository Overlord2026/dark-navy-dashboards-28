import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Mail, Send, Eye } from 'lucide-react';
import { track } from '@/lib/analytics/track';

interface EmailTemplate {
  id: string;
  subject: string;
  preheader: string;
  body: string;
  cta: string;
}

const emailTemplates: EmailTemplate[] = [
  {
    id: 'sports_f20_cold',
    subject: 'Founding 20 Invite: Player Care + Financial Longevity for {{org_name}}',
    preheader: 'Concierge onboarding, co‑created modules, and measurable outcomes.',
    body: `Hi {{first_name}},

I'm {{sender_name}}, co‑founder of Boutique Family Office™. We unify healthspan + wealthspan for athlete programs and NIL education.

**Why you:** {{personal_hook}}

**What you get:**
• Early access + concierge setup  
• Co‑created modules for {{org_name}}  
• White‑label + enterprise security

Here's a 60‑second preview: {{short_video_link}}

Are you open to a 15‑minute call this week?

— {{sender_name}}`,
    cta: 'Book 15‑minute preview'
  },
  {
    id: 'sports_f20_followup',
    subject: 'Quick 30s video for {{org_name}}',
    preheader: 'BFO: athlete‑first NIL + long‑term financial wellness.',
    body: `Hi {{first_name}},

Following up with a 30‑second video tailored to {{org_name}}. If it resonates, I'll lock a 15‑minute preview at your convenience.

{{custom_video_link}}

Best,
{{sender_name}}`,
    cta: 'Schedule'
  }
];

interface EmailTemplatesProps {
  segment?: string;
}

export const EmailTemplates: React.FC<EmailTemplatesProps> = ({ segment = 'sports' }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(emailTemplates[0]);
  const [previewData, setPreviewData] = useState({
    first_name: 'John',
    org_name: 'NFL',
    sender_name: 'Pedro Alvarado',
    personal_hook: 'Your leadership in player safety and education aligns perfectly with our mission.',
    short_video_link: 'https://bfo.com/video/nfl-preview',
    custom_video_link: 'https://bfo.com/video/nfl-custom'
  });

  const renderTemplate = (template: string, data: Record<string, string>) => {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match);
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    track('template_copied', { segment, template_id: selectedTemplate.id, type });
  };

  const generateEmailHTML = (template: EmailTemplate) => {
    const renderedSubject = renderTemplate(template.subject, previewData);
    const renderedBody = renderTemplate(template.body, previewData);
    const renderedPreheader = renderTemplate(template.preheader, previewData);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${renderedSubject}</title>
  <style>
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
      line-height: 1.6; 
      color: #ffffff; 
      background-color: #000000; 
      margin: 0; 
      padding: 0; 
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #000000; 
    }
    .header { 
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); 
      padding: 40px 20px; 
      text-align: center; 
      border-bottom: 3px solid #FFD700; 
    }
    .logo { 
      font-family: 'Playfair Display', serif; 
      font-size: 24px; 
      font-weight: 700; 
      color: #FFD700; 
      margin-bottom: 10px; 
    }
    .tagline { 
      font-size: 14px; 
      color: #046B4D; 
      font-weight: 500; 
    }
    .content { 
      padding: 40px 20px; 
      background-color: #000000; 
    }
    .preheader { 
      display: none; 
      font-size: 1px; 
      line-height: 1px; 
      max-height: 0; 
      max-width: 0; 
      opacity: 0; 
      overflow: hidden; 
    }
    .body-text { 
      font-size: 16px; 
      line-height: 1.8; 
      color: #ffffff; 
      margin-bottom: 30px; 
      white-space: pre-line; 
    }
    .cta-button { 
      display: inline-block; 
      background-color: #FFD700; 
      color: #000000; 
      text-decoration: none; 
      padding: 16px 32px; 
      border-radius: 8px; 
      font-weight: 700; 
      font-size: 16px; 
      margin: 20px 0; 
      text-align: center; 
    }
    .footer { 
      background-color: #1a1a1a; 
      padding: 20px; 
      text-align: center; 
      font-size: 12px; 
      color: #999999; 
      border-top: 1px solid #333333; 
    }
  </style>
</head>
<body>
  <div class="preheader">${renderedPreheader}</div>
  <div class="container">
    <div class="header">
      <div class="logo">Boutique Family Office™</div>
      <div class="tagline">Healthspan + Wealthspan. One Platform.</div>
    </div>
    <div class="content">
      <div class="body-text">${renderedBody}</div>
      <a href="#" class="cta-button">${template.cta}</a>
    </div>
    <div class="footer">
      <p>Boutique Family Office™ | Founding 20 Campaign</p>
      <p>This email was sent as part of our exclusive partnership invitation.</p>
    </div>
  </div>
</body>
</html>`;
  };

  const previewEmail = () => {
    const htmlContent = generateEmailHTML(selectedTemplate);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
    track('email_preview_opened', { segment, template_id: selectedTemplate.id });
  };

  const sendTestEmail = () => {
    track('test_email_requested', { segment, template_id: selectedTemplate.id });
    // Here you would integrate with your email service
    alert('Test email functionality would be integrated with Resend API');
  };

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <div className="flex gap-2 flex-wrap">
        {emailTemplates.map((template) => (
          <Button
            key={template.id}
            variant={selectedTemplate.id === template.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTemplate(template)}
            className={selectedTemplate.id === template.id ? "bg-gold text-black" : ""}
          >
            {template.id === 'sports_f20_cold' ? 'Cold Outreach' : 'Follow-up'}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Template Editor */}
        <Card className="bg-black border-gold/30">
          <CardHeader>
            <CardTitle className="text-gold flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Template: {selectedTemplate.id}
            </CardTitle>
            <CardDescription className="text-white/70">
              Customize the template with your variables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white/80">Subject Line</label>
              <Input 
                value={selectedTemplate.subject}
                readOnly
                className="bg-black/50 border-gold/30 text-white mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-white/80">Preheader</label>
              <Input 
                value={selectedTemplate.preheader}
                readOnly
                className="bg-black/50 border-gold/30 text-white mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-white/80">Email Body</label>
              <Textarea 
                value={selectedTemplate.body}
                readOnly
                rows={12}
                className="bg-black/50 border-gold/30 text-white mt-1"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button 
                size="sm" 
                variant="outline"
                className="border-gold/50 text-gold"
                onClick={() => copyToClipboard(selectedTemplate.subject, 'subject')}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy Subject
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-gold/50 text-gold"
                onClick={() => copyToClipboard(selectedTemplate.body, 'body')}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy Body
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-gold/50 text-gold"
                onClick={() => copyToClipboard(generateEmailHTML(selectedTemplate), 'html')}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy HTML
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Variables */}
        <Card className="bg-black border-gold/30">
          <CardHeader>
            <CardTitle className="text-gold">Preview Variables</CardTitle>
            <CardDescription className="text-white/70">
              Adjust these values to see how the template renders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(previewData).map(([key, value]) => (
              <div key={key}>
                <label className="text-sm font-medium text-white/80 capitalize">
                  {key.replace('_', ' ')}
                </label>
                <Input
                  value={value}
                  onChange={(e) => setPreviewData(prev => ({ ...prev, [key]: e.target.value }))}
                  className="bg-black/50 border-gold/30 text-white mt-1"
                />
              </div>
            ))}

            <div className="pt-4 space-y-2">
              <Button 
                onClick={previewEmail}
                className="w-full bg-gold text-black hover:bg-gold/90"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Email
              </Button>
              <Button 
                variant="outline" 
                onClick={sendTestEmail}
                className="w-full border-gold/50 text-gold"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Test Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rendered Preview */}
      <Card className="bg-black border-gold/30">
        <CardHeader>
          <CardTitle className="text-gold">Rendered Preview</CardTitle>
          <CardDescription className="text-white/70">
            How the email will look with current variables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 bg-black/50 border border-gold/20 rounded-lg">
            <div>
              <Badge variant="outline" className="border-gold/50 text-gold mb-2">Subject</Badge>
              <p className="text-white font-medium">
                {renderTemplate(selectedTemplate.subject, previewData)}
              </p>
            </div>
            
            <div>
              <Badge variant="outline" className="border-gold/50 text-gold mb-2">Body</Badge>
              <div className="text-white/90 whitespace-pre-line text-sm leading-relaxed">
                {renderTemplate(selectedTemplate.body, previewData)}
              </div>
            </div>
            
            <div className="pt-4">
              <Button className="bg-gold text-black hover:bg-gold/90">
                {selectedTemplate.cta}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};