import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Send, Edit, Plus, Copy, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { track } from '@/lib/analytics/track';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  campaign_name: string;
  segment: string;
  template_type: string;
  sender_name: string;
  sender_email: string;
  subject_line: string;
  template_content: string;
  is_active: boolean;
}

const SEGMENTS = ['sports', 'longevity', 'ria'];
const TEMPLATE_TYPES = ['cold_outreach', 'follow_up', 'overview_share', 'deck_share'];

const emailTemplates = {
  sports: {
    cold_outreach: {
      subject: "Partnership Opportunity: Boutique Family Office™ x {{org_name}}",
      content: `Hi {{contact_name}},

I hope this message finds you well. I'm reaching out regarding an exciting partnership opportunity between {{org_name}} and Boutique Family Office™.

We've developed a comprehensive platform that addresses both healthspan and wealthspan for athletes — exactly what your players need for long-term success beyond their playing careers.

**What we offer:**
• NIL & Financial Education: Athlete-friendly modules built with compliance in mind
• Secure Legacy Vault™: Enterprise-grade document management and audit trails  
• SWAG™ Retirement Roadmap: Science-based planning for short, mid, and long-term horizons

**Why {{org_name}} is a perfect fit:**
Your commitment to player development aligns perfectly with our mission to provide comprehensive financial and health education.

I'd love to schedule a 15-minute preview call to show you how we can enhance your existing player care programs.

Would you be available for a brief conversation this week?

Best regards,
{{sender_name}}
Boutique Family Office™
Healthspan + Wealthspan. One Platform.`
    },
    follow_up: {
      subject: "Following up: {{org_name}} x BFO Partnership",
      content: `Hi {{contact_name}},

Following up on my previous message about partnering with Boutique Family Office™.

I wanted to share a quick overview of what we've built specifically for organizations like {{org_name}}.

[Attached: Founding 20 Sports Overview]

Key highlights:
• Player engagement + measurable literacy outcomes
• Co-created modules and private program spaces  
• National brand, local delivery via licensed advisors

Many organizations find value in our approach to combining financial education with health optimization — something that really resonates with modern athletes.

Would a 15-minute preview call work for you this week? I can show you exactly how this would integrate with your existing player development programs.

Best regards,
{{sender_name}}
Boutique Family Office™`
    }
  },
  longevity: {
    cold_outreach: {
      subject: "Partnership Opportunity: Advancing Healthspan Research with BFO",
      content: `Hi {{contact_name}},

I hope this finds you well. I'm reaching out regarding a unique partnership opportunity between {{org_name}} and Boutique Family Office™.

We've created the first platform to truly integrate healthspan and wealthspan — addressing the financial implications of longevity research and optimization.

**Our platform includes:**
• Science-based longevity protocols with financial planning integration
• Research collaboration opportunities with our network
• Educational content that bridges health optimization and wealth management

**Why {{org_name}} is strategically important:**
Your leadership in longevity research positions you perfectly to help shape how we approach the financial aspects of extended healthspan.

I'd love to explore how we might collaborate on research initiatives and educational content.

Would you be open to a brief 15-minute conversation about potential partnership opportunities?

Best regards,
{{sender_name}}
Boutique Family Office™
Healthspan + Wealthspan. One Platform.`
    }
  },
  ria: {
    cold_outreach: {
      subject: "RIA Partnership: Boutique Family Office™ Integration Opportunity",
      content: `Hi {{contact_name}},

I hope this message finds you well. I'm reaching out regarding a strategic partnership opportunity for {{org_name}} with Boutique Family Office™.

We've developed a comprehensive platform that enhances traditional wealth management with integrated health optimization — creating a true family office experience for your clients.

**What we bring to your practice:**
• Integrated healthspan + wealthspan planning
• Advanced client family solutions and estate coordination
• Technology platform that enhances your existing advisory services

**Why {{org_name}} is a strategic fit:**
Your reputation for innovative client service aligns perfectly with our vision for the future of wealth management.

I'd love to schedule a brief 15-minute call to show you how this integration could enhance your client experience and potentially create new revenue streams.

Would you be available for a conversation this week?

Best regards,
{{sender_name}}
Boutique Family Office™
Healthspan + Wealthspan. One Platform.`
    }
  }
};

export const EmailCampaignManager: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedSegment, setSelectedSegment] = useState('sports');
  const [isLoading, setIsLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
    track('email_campaign_manager_viewed', { segment: selectedSegment });
  }, [selectedSegment]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('f20_email_campaigns')
        .select('*')
        .eq('segment', selectedSegment)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load email templates');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = async (template: Partial<EmailTemplate>) => {
    try {
      if (template.id) {
        const { error } = await supabase
          .from('f20_email_campaigns')
          .update(template)
          .eq('id', template.id);
        if (error) throw error;
        track('email_template_updated', { template_id: template.id, segment: template.segment });
      } else {
        const { error } = await supabase
          .from('f20_email_campaigns')
          .insert(template);
        if (error) throw error;
        track('email_template_created', { segment: template.segment, type: template.template_type });
      }
      
      loadTemplates();
      setEditingTemplate(null);
      toast.success('Template saved successfully');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  const createTemplateFromDefault = async (templateType: string) => {
    const defaultTemplate = emailTemplates[selectedSegment as keyof typeof emailTemplates]?.[templateType as keyof typeof emailTemplates.sports];
    
    if (!defaultTemplate) {
      toast.error('No default template available for this type');
      return;
    }

    const newTemplate: Partial<EmailTemplate> = {
      campaign_name: `${selectedSegment.charAt(0).toUpperCase() + selectedSegment.slice(1)} ${templateType.replace('_', ' ')}`,
      segment: selectedSegment,
      template_type: templateType,
      sender_name: 'Boutique Family Office™',
      sender_email: 'founding20@my.bfocfo.com',
      subject_line: defaultTemplate.subject,
      template_content: defaultTemplate.content,
      is_active: true
    };

    await saveTemplate(newTemplate);
  };

  const duplicateTemplate = async (template: EmailTemplate) => {
    const duplicatedTemplate: Partial<EmailTemplate> = {
      ...template,
      id: undefined,
      campaign_name: `${template.campaign_name} (Copy)`,
      is_active: false
    };

    await saveTemplate(duplicatedTemplate);
    track('email_template_duplicated', { original_id: template.id, segment: template.segment });
  };

  const sendTestEmail = async (template: EmailTemplate) => {
    track('email_test_sent', { template_id: template.id, segment: template.segment });
    toast.info('Test email functionality coming soon');
  };

  const previewWithPersonalization = (template: EmailTemplate) => {
    const sampleData = {
      contact_name: 'John Smith',
      org_name: selectedSegment === 'sports' ? 'NFL' : selectedSegment === 'longevity' ? 'Tony Robbins' : 'Crescent Wealth',
      sender_name: template.sender_name
    };

    const personalizedSubject = template.subject_line.replace(/\{\{(\w+)\}\}/g, (match, key) =>
      sampleData[key as keyof typeof sampleData] || match
    );

    const personalizedContent = template.template_content.replace(/\{\{(\w+)\}\}/g, (match, key) =>
      sampleData[key as keyof typeof sampleData] || match
    );

    setPreviewTemplate({
      ...template,
      subject_line: personalizedSubject,
      template_content: personalizedContent
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gold">Email Campaign Manager</h2>
          <p className="text-white/70">Create and manage email templates for outreach campaigns</p>
        </div>
      </div>

      <Tabs value={selectedSegment} onValueChange={setSelectedSegment}>
        <TabsList className="grid w-full grid-cols-3 bg-black border border-gold/30">
          <TabsTrigger value="sports" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black">
            Sports
          </TabsTrigger>
          <TabsTrigger value="longevity" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Longevity
          </TabsTrigger>
          <TabsTrigger value="ria" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            RIA
          </TabsTrigger>
        </TabsList>

        {SEGMENTS.map(segment => (
          <TabsContent key={segment} value={segment} className="space-y-4">
            {/* Quick Create Buttons */}
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold text-lg">Quick Create Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {TEMPLATE_TYPES.map(type => (
                    <Button
                      key={type}
                      onClick={() => createTemplateFromDefault(type)}
                      variant="outline"
                      className="border-gold text-gold hover:bg-gold/10 h-auto p-4 flex flex-col items-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      <span className="text-sm">{type.replace('_', ' ')}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Existing Templates */}
            <div className="space-y-4">
              {templates.map(template => (
                <Card key={template.id} className="bg-black border-gold/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-white">{template.campaign_name}</h3>
                          <Badge className={`${template.is_active ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                            {template.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline" className="border-gold text-gold">
                            {template.template_type.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-white/70 mb-2">
                          <strong>Subject:</strong> {template.subject_line}
                        </p>
                        
                        <p className="text-sm text-white/70">
                          <strong>From:</strong> {template.sender_name} &lt;{template.sender_email}&gt;
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => previewWithPersonalization(template)}
                          className="border-gold text-gold hover:bg-gold/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => duplicateTemplate(template)}
                          className="border-gold text-gold hover:bg-gold/10"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendTestEmail(template)}
                          className="border-gold text-gold hover:bg-gold/10"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          onClick={() => setEditingTemplate(editingTemplate === template.id ? null : template.id)}
                          className="bg-gold text-black hover:bg-gold/90"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {editingTemplate === template.id && (
                      <div className="space-y-4 pt-4 border-t border-gold/30">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-white/70">Campaign Name</label>
                            <Input
                              value={template.campaign_name}
                              onChange={(e) => setTemplates(prev => 
                                prev.map(t => t.id === template.id ? {...t, campaign_name: e.target.value} : t)
                              )}
                              className="bg-black border-gold/30 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-white/70">Template Type</label>
                            <Select 
                              value={template.template_type}
                              onValueChange={(value) => setTemplates(prev => 
                                prev.map(t => t.id === template.id ? {...t, template_type: value} : t)
                              )}
                            >
                              <SelectTrigger className="bg-black border-gold/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TEMPLATE_TYPES.map(type => (
                                  <SelectItem key={type} value={type}>
                                    {type.replace('_', ' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm text-white/70">Subject Line</label>
                          <Input
                            value={template.subject_line}
                            onChange={(e) => setTemplates(prev => 
                              prev.map(t => t.id === template.id ? {...t, subject_line: e.target.value} : t)
                            )}
                            className="bg-black border-gold/30 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm text-white/70">Email Content</label>
                          <Textarea
                            value={template.template_content}
                            onChange={(e) => setTemplates(prev => 
                              prev.map(t => t.id === template.id ? {...t, template_content: e.target.value} : t)
                            )}
                            className="bg-black border-gold/30 text-white min-h-[300px]"
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => saveTemplate(template)}
                            className="bg-gold text-black hover:bg-gold/90"
                          >
                            Save Template
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingTemplate(null)}
                            className="border-gold text-gold hover:bg-gold/10"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Email Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="bg-white text-black max-w-2xl w-full max-h-[80vh] overflow-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Email Preview</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPreviewTemplate(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">Subject:</label>
                  <p className="text-lg">{previewTemplate.subject_line}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold">From:</label>
                  <p>{previewTemplate.sender_name} &lt;{previewTemplate.sender_email}&gt;</p>
                </div>
                
                <div className="border-t pt-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {previewTemplate.template_content}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
