import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, 
  Send, 
  Share2, 
  MessageSquare, 
  Mail,
  Phone,
  Linkedin,
  Star,
  Crown
} from 'lucide-react';
import { AllPersonaTypes } from '@/types/personas';
import { useAdvancedEventTracking } from '@/hooks/useAdvancedEventTracking';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Persona-specific invite templates with exact copy provided
const PERSONA_INVITE_TEMPLATES: Record<AllPersonaTypes, {
  subject: string;
  message: string;
  ctaText: string;
  linkedinMessage: string;
  smsMessage: string;
  description: string;
}> = {
  advisor: {
    subject: "Join Our SWAG Advisor Network - Premium Planning Tools Inside",
    message: "Join our SWAG Advisor Network – bring premium planning to your clients. Access advanced CRM, proposal tools, and connect with vetted HNW families. Early adopters get priority access to new features and dedicated support.",
    ctaText: "Join SWAG Advisor Network",
    linkedinMessage: "I'm using the Family Office Marketplace™ to grow my advisory practice. Join our SWAG Advisor Network – bring premium planning to your clients with advanced tools and HNW family connections. Would love to have you in our network!",
    smsMessage: "Join our SWAG Advisor Network! Advanced planning tools + HNW client connections. Early access available: [link]",
    description: "Grow your practice with premium planning tools and vetted HNW family connections."
  },
  accountant: {
    subject: "Simplify Client Tax Season - Premium CPA Tools",
    message: "Simplify client tax season with premium tools and trusted wealth partners. Access automated workflows, CE tracking, and direct connections to family office clients who need expert tax planning.",
    ctaText: "Join Premium CPA Network",
    linkedinMessage: "I've been using the Family Office Marketplace™ to streamline my tax practice. Simplify client tax season with premium tools and trusted wealth partners. Great for CPAs looking to expand into HNW clients!",
    smsMessage: "Simplify tax season with premium CPA tools + wealth partner connections. Check it out: [link]",
    description: "Streamline your tax practice with premium tools and wealth partner connections."
  },
  cpa: {
    subject: "Simplify Client Tax Season - Premium CPA Tools",
    message: "Simplify client tax season with premium tools and trusted wealth partners. Access automated workflows, CE tracking, and direct connections to family office clients who need expert tax planning.",
    ctaText: "Join Premium CPA Network",
    linkedinMessage: "I've been using the Family Office Marketplace™ to streamline my tax practice. Simplify client tax season with premium tools and trusted wealth partners. Great for CPAs looking to expand into HNW clients!",
    smsMessage: "Simplify tax season with premium CPA tools + wealth partner connections. Check it out: [link]",
    description: "Streamline your tax practice with premium tools and wealth partner connections."
  },
  attorney: {
    subject: "Grow Your Legal Practice - Family Office Connections",
    message: "Grow your legal practice with exclusive family office connections. Access secure document workflows, CLE automation, and connect with HNW families needing estate planning and legal services.",
    ctaText: "Join Attorney Network",
    linkedinMessage: "I'm part of the Family Office Marketplace™ attorney network. Grow your legal practice with exclusive family office connections and premium legal tools. Great opportunity for estate planning attorneys!",
    smsMessage: "Grow your legal practice with family office connections + premium tools. Learn more: [link]",
    description: "Connect with HNW families and access premium legal practice tools."
  },
  insurance_agent: {
    subject: "Unlock Compliance Support & Lead Gen for Your Agency",
    message: "Unlock more compliance support and lead gen for your agency. Access multi-state compliance tools, automated CE tracking, and connect with high-value clients seeking insurance solutions.",
    ctaText: "Join Insurance Network",
    linkedinMessage: "I'm using the Family Office Marketplace™ for my insurance practice. Unlock more compliance support and lead gen for your agency with premium tools and HNW client connections.",
    smsMessage: "Unlock compliance support + lead gen for your agency. Premium tools available: [link]",
    description: "Access compliance tools and high-value client connections for your agency."
  },
  imo_fmo: {
    subject: "Premium IMO/FMO Network - Advanced Compliance Tools",
    message: "Join our premium IMO/FMO network with advanced compliance tools and agent support. Manage multi-state operations, automate CE tracking, and connect with qualified advisors seeking insurance solutions.",
    ctaText: "Join IMO/FMO Network",
    linkedinMessage: "I'm part of the Family Office Marketplace™ IMO/FMO network. Advanced compliance tools and agent support make managing multi-state operations much easier. Great for growing organizations!",
    smsMessage: "Join premium IMO/FMO network. Advanced compliance + agent support tools: [link]",
    description: "Advanced compliance tools and qualified advisor connections for IMO/FMO operations."
  },
  coach: {
    subject: "Showcase Your Curriculum - Advisor Coach Network",
    message: "Showcase your curriculum and connect with advisors seeking expert coaching. Access our platform to publish training content, manage cohorts, and deliver trackable outcomes to financial professionals nationwide.",
    ctaText: "Join Coach Network",
    linkedinMessage: "I'm using the Family Office Marketplace™ to showcase my advisor coaching curriculum. Great platform to connect with financial professionals and deliver trackable training outcomes!",
    smsMessage: "Showcase your coaching curriculum to advisors nationwide. Platform access: [link]",
    description: "Connect with advisors seeking expert coaching and publish your curriculum."
  },
  consultant: {
    subject: "Elite Consultant Network - Showcase Your Expertise",
    message: "Join our elite consultant network and showcase your expertise to top-tier wealth management professionals. Publish practice audits, manage advisor cohorts, and deliver trackable outcomes.",
    ctaText: "Join Elite Network",
    linkedinMessage: "I'm part of the Family Office Marketplace™ elite consultant network. Great platform to showcase expertise and connect with top-tier wealth management professionals!",
    smsMessage: "Join elite consultant network. Showcase expertise to wealth professionals: [link]",
    description: "Showcase your expertise to elite wealth management professionals."
  },
  compliance: {
    subject: "Centralize Compliance - RIA/Insurance/Attorney Tools",
    message: "Centralize audits and monitor filings with our comprehensive compliance platform. Automate RIA/insurance/attorney compliance, access mock audit tools, and stay ahead of regulatory changes.",
    ctaText: "Join Compliance Network",
    linkedinMessage: "I'm using the Family Office Marketplace™ compliance platform. Centralize audits, monitor filings, and automate compliance across RIA/insurance/attorney practices. Game-changer for compliance professionals!",
    smsMessage: "Centralize compliance with comprehensive automation tools. Platform access: [link]",
    description: "Automate compliance across RIA/insurance/attorney practices with comprehensive tools."
  },
  healthcare_consultant: {
    subject: "Verified Longevity Consultant Network",
    message: "Connect as a verified longevity consultant and join our expert network. Manage client care, participate in expert panels, and lead in family health and longevity with our nationwide platform.",
    ctaText: "Join Healthcare Network",
    linkedinMessage: "I'm part of the Family Office Marketplace™ healthcare consultant network. Connect as a verified longevity expert and join our nationwide platform for family health and wellness!",
    smsMessage: "Join verified longevity consultant network. Expert platform access: [link]",
    description: "Lead in family health and longevity as a verified expert consultant."
  },
  organization: {
    subject: "Early-Adopter Industry Partnership",
    message: "Achieve early-adopter status and drive innovation through strategic partnerships. Host educational content, connect members to trusted wealth professionals, and build industry-leading collaborations.",
    ctaText: "Claim Partnership",
    linkedinMessage: "Our organization is an early-adopter partner with the Family Office Marketplace™. Drive innovation and strategic partnerships while connecting members to trusted wealth professionals!",
    smsMessage: "Achieve early-adopter industry partnership status. Strategic platform access: [link]",
    description: "Drive innovation and strategic partnerships as an early-adopter organization."
  },
  agency: {
    subject: "VIP Marketing Partner Access",
    message: "Engage your audience with VIP reserved access and cross-promotion opportunities. Showcase lead services to verified advisors and track ROI in real-time with our marketing partner platform.",
    ctaText: "Join Marketing Network",
    linkedinMessage: "We're a VIP marketing partner with the Family Office Marketplace™. Engage audiences with reserved access and cross-promotion opportunities. Great ROI tracking tools!",
    smsMessage: "Join VIP marketing partner network. Reserved access + ROI tracking: [link]",
    description: "Engage audiences with VIP access and cross-promotion opportunities."
  },
  hnw_client: {
    subject: "Exclusive Family Office Access",
    message: "Connect with vetted wealth professionals and access premium financial resources. Take control of your financial future with personalized strategies and our secure, private platform.",
    ctaText: "Join Family Network",
    linkedinMessage: "I'm using the Family Office Marketplace™ to connect with vetted wealth professionals. Exclusive access to premium financial resources and personalized strategies!",
    smsMessage: "Connect with vetted wealth professionals. Exclusive family office access: [link]",
    description: "Access premium financial resources and personalized wealth strategies."
  },
  pre_retiree: {
    subject: "Retire with Confidence - Expert Guidance",
    message: "Prepare for retirement with expert guidance and proven strategies. Connect with specialists who understand pre-retirement planning and secure your financial future.",
    ctaText: "Plan My Retirement",
    linkedinMessage: "I'm using the Family Office Marketplace™ to prepare for retirement. Expert guidance and proven strategies for pre-retirees. Highly recommend!",
    smsMessage: "Expert retirement planning guidance available. Check it out: [link]",
    description: "Expert retirement planning and proven pre-retirement strategies."
  },
  next_gen: {
    subject: "Next Generation Wealth Building",
    message: "Build your wealth with modern strategies and connect with professionals who understand young investors. Start your financial journey with confidence.",
    ctaText: "Start Building Wealth",
    linkedinMessage: "I'm using the Family Office Marketplace™ for next-gen wealth building. Modern strategies and professionals who understand young investors!",
    smsMessage: "Modern wealth building for young investors. Join here: [link]",
    description: "Modern wealth building strategies for the next generation."
  },
  family_office_admin: {
    subject: "Family Office Management Tools",
    message: "Streamline family office operations with professional-grade tools and connect with trusted service providers who understand complex family needs.",
    ctaText: "Optimize Operations",
    linkedinMessage: "I'm using the Family Office Marketplace™ to streamline our family office operations. Professional-grade tools and trusted service providers!",
    smsMessage: "Streamline family office operations with professional tools: [link]",
    description: "Professional-grade tools for family office management."
  },
  client: {
    subject: "Exclusive Family Office Access",
    message: "Connect with vetted wealth professionals and access premium financial resources. Take control of your financial future with personalized strategies and our secure, private platform.",
    ctaText: "Join Family Network",
    linkedinMessage: "I'm using the Family Office Marketplace™ to connect with vetted wealth professionals. Exclusive access to premium financial resources and personalized strategies!",
    smsMessage: "Connect with vetted wealth professionals. Exclusive family office access: [link]",
    description: "Access premium financial resources and personalized wealth strategies."
  },
  enterprise_admin: {
    subject: "Enterprise Platform Access",
    message: "Manage your organization's wealth management needs with enterprise-grade tools and connect with top-tier professionals.",
    ctaText: "Access Enterprise Tools",
    linkedinMessage: "I'm using the Family Office Marketplace™ for our enterprise wealth management. Top-tier professionals and enterprise-grade tools!",
    smsMessage: "Enterprise wealth management tools available: [link]",
    description: "Enterprise-grade wealth management solutions."
  },
  vip_reserved: {
    subject: "Your VIP Reserved Profile is Ready",
    message: "You're one of the first 25 industry leaders invited to shape the future of family wealth management. Your premium VIP profile is ready—just click to activate your founding member access.",
    ctaText: "Claim VIP Profile",
    linkedinMessage: "I've been invited as one of the first 25 VIP members to shape the Family Office Marketplace™. Exclusive founding member access to transform wealth management!",
    smsMessage: "Your VIP reserved profile is ready. Founding member access available: [link]",
    description: "Exclusive founding member access to shape the future of wealth management."
  },
  realtor: {
    subject: "Join Our Elite Real Estate Professional Network",
    message: "Real estate is at the heart of every successful family office. Join our Family Office Marketplace™ as a Founding Real Estate Professional and connect with HNW families needing sophisticated property services.",
    ctaText: "Join Real Estate Network",
    linkedinMessage: "I'm using the Family Office Marketplace™ to connect with HNW families. Join our elite real estate professional network - perfect for realtors working with high-net-worth clients and family offices!",
    smsMessage: "Elite real estate network for HNW families. Founding member access: [link]",
    description: "Connect with HNW families and expand your real estate practice."
  },
  property_manager: {
    subject: "Premium Property Management Network Invitation",
    message: "Join our Family Office Marketplace™ as a Founding Property Management Expert. Connect with families managing complex property portfolios and showcase your expertise to qualified prospects.",
    ctaText: "Join Property Network",
    linkedinMessage: "I've joined the Family Office Marketplace™ property management network. Great opportunity for property managers to connect with HNW families and family offices needing professional management services!",
    smsMessage: "Premium property management network for family offices. Join here: [link]",
    description: "Showcase expertise to families with complex property portfolios."
  }
};

interface PersonaInviteTemplatesProps {
  currentPersona: AllPersonaTypes;
  onInviteSent?: (platform: string, count: number) => void;
}

export const PersonaInviteTemplates: React.FC<PersonaInviteTemplatesProps> = ({
  currentPersona,
  onInviteSent
}) => {
  const { trackViralShare } = useAdvancedEventTracking();
  const [customMessage, setCustomMessage] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientCount, setRecipientCount] = useState(1);

  const template = PERSONA_INVITE_TEMPLATES[currentPersona] || PERSONA_INVITE_TEMPLATES.client;

  const handleCopyToClipboard = async (text: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${platform} invite copied to clipboard!`);
      
      await trackViralShare({
        platform: 'copy' as any,
        persona: currentPersona,
        shareType: 'invite',
        recipientCount: 1,
        messageTemplate: platform
      });
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDirectShare = async (platform: string) => {
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}?invite=${currentPersona}&ref=viral`;
    
    let shareUrl = '';
    let message = '';

    switch (platform) {
      case 'linkedin':
        message = template.linkedinMessage.replace('[link]', inviteUrl);
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inviteUrl)}&summary=${encodeURIComponent(message)}`;
        break;
      case 'email':
        message = `${template.message}\n\nJoin here: ${inviteUrl}`;
        shareUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(message)}`;
        break;
      case 'sms':
        message = template.smsMessage.replace('[link]', inviteUrl);
        shareUrl = `sms:${recipientPhone}?body=${encodeURIComponent(message)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
      
      await trackViralShare({
        platform: platform as any,
        persona: currentPersona,
        shareType: 'invite',
        recipientCount,
        messageTemplate: platform
      });

      onInviteSent?.(platform, recipientCount);
      toast.success(`${platform} invite sent!`);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center">
            <Share2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Invite Colleagues
              {currentPersona === 'vip_reserved' && (
                <Badge className="bg-gradient-to-r from-gold to-yellow-500 text-navy">
                  <Crown className="h-3 w-3 mr-1" />
                  VIP
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="linkedin" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="linkedin" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              SMS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="linkedin" className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">LinkedIn Share Message:</h4>
              <Textarea 
                value={template.linkedinMessage}
                readOnly
                className="min-h-[100px] bg-background"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleCopyToClipboard(template.linkedinMessage, 'LinkedIn')}
                variant="outline"
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Message
              </Button>
              <Button 
                onClick={() => handleDirectShare('linkedin')}
                className="flex-1 bg-[#0077B5] hover:bg-[#005885]"
              >
                <Send className="h-4 w-4 mr-2" />
                Share on LinkedIn
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium">Recipient Email:</label>
                <Input 
                  type="email"
                  placeholder="colleague@company.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Subject: {template.subject}</h4>
                <Textarea 
                  value={template.message}
                  readOnly
                  className="min-h-[100px] bg-background"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleCopyToClipboard(`Subject: ${template.subject}\n\n${template.message}`, 'Email')}
                variant="outline"
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Email
              </Button>
              <Button 
                onClick={() => handleDirectShare('email')}
                disabled={!recipientEmail}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium">Recipient Phone:</label>
                <Input 
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                />
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">SMS Message:</h4>
                <Textarea 
                  value={template.smsMessage}
                  readOnly
                  className="min-h-[80px] bg-background"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleCopyToClipboard(template.smsMessage, 'SMS')}
                variant="outline"
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy SMS
              </Button>
              <Button 
                onClick={() => handleDirectShare('sms')}
                disabled={!recipientPhone}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Send SMS
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Referral Reward */}
        <motion.div 
          className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 text-green-700">
            <Star className="h-5 w-5" />
            <span className="font-medium">Referral Reward: Get 1 month free for each professional who joins!</span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};