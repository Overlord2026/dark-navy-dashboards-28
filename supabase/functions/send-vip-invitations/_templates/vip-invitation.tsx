import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface VIPInvitationEmailProps {
  recipientName: string;
  organizationName: string;
  personaType: string;
  magicLink: string;
  vipTier: string;
  senderName?: string;
  customMessage?: string;
}

export const VIPInvitationEmail = ({
  recipientName,
  organizationName,
  personaType,
  magicLink,
  vipTier,
  senderName = "Tony Gomes",
  customMessage
}: VIPInvitationEmailProps) => {
  const getPersonaSpecificContent = (persona: string) => {
    switch (persona) {
      case 'advisor':
        return {
          title: "You're Invited: Founding Access to the Boutique Family Office Platform™",
          description: 'As a leader in the advisor community',
          benefits: [
            '🎖️ VIP status: Founding Member badge and early adopter perks',
            '👥 Invite your book of business: Seamlessly onboard clients—your brand, your experience',
            '💎 Unlock rewards: Credits for every client/referral, exclusive dashboard access',
            '🤝 Marketplace access: Network with elite family offices, attorneys, CPAs, and more',
            '⚡ Practice management tools: Automate onboarding, compliance, and client reporting'
          ],
          callToAction: 'Activate Your Founders Account Now',
          closing: "We're reserving your spot for the next 7 days—don't miss this founding opportunity!"
        };
      case 'attorney':
        return {
          title: 'Exclusive Legal Partner Invitation: Boutique Family Office Platform™',
          description: 'As a respected legal professional',
          benefits: [
            '🏛️ Legal Partner Portal: Branded practice management dashboard',
            '📋 Client intake automation: Streamlined case management and document processing',
            '🤝 Attorney referral network: Connect with elite family offices and advisors',
            '📄 Document automation: E-signature and legal workflow tools',
            '🛡️ Premium compliance features: Trust accounting and regulatory support'
          ],
          callToAction: 'Access Your Legal Partner Portal',
          closing: 'Join the elite network of legal professionals serving high-net-worth families.'
        };
      case 'cpa':
        return {
          title: 'CPA Founding Member Invitation: Boutique Family Office Platform™',
          description: 'As a trusted accounting professional',
          benefits: [
            '📊 Custom CPA practice dashboard with tax planning collaboration tools',
            '📁 Client document management and secure file sharing',
            '🌐 Professional referral network with family offices and advisors',
            '🔄 Tax workflow automation and compliance tracking',
            '📈 Premium analytics and client reporting features'
          ],
          callToAction: 'Activate Your CPA Founding Access',
          closing: 'Be part of the premier network serving sophisticated tax planning clients.'
        };
      default:
        return {
          title: 'VIP Founding Member Invitation: Boutique Family Office Platform™',
          description: 'As a leader in your industry',
          benefits: [
            '🏆 Custom branded portal with premium features',
            '💰 Enhanced referral rewards system',
            '🌟 Access to elite professional network',
            '🚀 Advanced practice management tools',
            '👑 Founding member recognition and perks'
          ],
          callToAction: 'Activate Your VIP Access',
          closing: 'Join the founding community of elite professionals.'
        };
    }
  };

  const content = getPersonaSpecificContent(personaType);

  return (
    <Html>
      <Head />
      <Preview>{content.title} - Your personalized portal is ready</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://boutiquefamilyoffice.com/logo.png"
              width="150"
              height="40"
              alt="Boutique Family Office"
              style={logo}
            />
          </Section>

          <Section style={heroSection}>
            <div style={vipBadge}>
              <Text style={badgeText}>🎖️ VIP {vipTier.replace('_', ' ').toUpperCase()}</Text>
            </div>
            <Heading style={h1}>{content.title}</Heading>
          </Section>

          <Text style={greeting}>Hi {recipientName},</Text>

          <Text style={paragraph}>
            {content.description}, you've been selected as a <strong>Founding Member</strong> of the new 
            Boutique Family Office™ platform—a premium ecosystem for high-net-worth families and top professionals.
            {organizationName ? ` Your ${organizationName}` : ' Your'} personalized dashboard and referral toolkit 
            are ready for you and your clients.
          </Text>

          {customMessage && (
            <Section style={customMessageSection}>
              <Text style={customMessageText}>{customMessage}</Text>
            </Section>
          )}

          <Section style={benefitsSection}>
            <Heading style={h2}>What's in it for you:</Heading>
            <ul style={benefitsList}>
              {content.benefits.map((benefit, index) => (
                <li key={index} style={benefitItem}>• {benefit}</li>
              ))}
            </ul>
          </Section>

          <Section style={ctaSection}>
            <Text style={paragraph}>Ready to elevate your practice?</Text>
            <Button style={ctaButton} href={magicLink}>
              {content.callToAction}
            </Button>
          </Section>

          <Text style={urgency}>{content.closing}</Text>

          <Section style={foundersSection}>
            <Text style={foundersText}>
              You'll also have access to our <strong>"Founding Members Wall,"</strong> quarterly 
              strategy roundtables, and exclusive marketing assets to boost your practice.
            </Text>
          </Section>

          <Text style={paragraph}>
            Reply here or call/text me if you have any questions. Looking forward to having 
            you as a cornerstone of our community!
          </Text>

          <Text style={signature}>
            Best,<br />
            {senderName}<br />
            Co-Founder, Boutique Family Office™
          </Text>

          <Section style={footer}>
            <Text style={footerText}>
              This invitation is exclusive to {organizationName || 'your organization'} and expires in 7 days. 
              <Link href="mailto:support@boutiquefamilyoffice.com" style={link}>
                Contact support
              </Link> for assistance.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f9fafb',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  maxWidth: '100%',
};

const header = {
  padding: '32px 0',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const heroSection = {
  textAlign: 'center' as const,
  padding: '32px 0',
  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
  borderRadius: '12px',
  margin: '24px 0',
};

const vipBadge = {
  display: 'inline-block',
  padding: '8px 16px',
  backgroundColor: '#fbbf24',
  borderRadius: '20px',
  marginBottom: '16px',
};

const badgeText = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
};

const h1 = {
  color: '#111827',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1.2',
};

const h2 = {
  color: '#374151',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '32px 0 16px',
};

const greeting = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: '600',
  margin: '32px 0 16px',
};

const paragraph = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const customMessageSection = {
  backgroundColor: '#eff6ff',
  border: '1px solid #dbeafe',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const customMessageText = {
  color: '#1e40af',
  fontSize: '16px',
  fontStyle: 'italic',
  margin: '0',
};

const benefitsSection = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const benefitsList = {
  margin: '0',
  padding: '0',
  listStyle: 'none',
};

const benefitItem = {
  color: '#166534',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '8px 0',
};

const ctaSection = {
  textAlign: 'center' as const,
  padding: '32px 0',
};

const ctaButton = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  margin: '0 auto 16px',
};

const linkText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '16px 0 0',
};

const foundersSection = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fbbf24',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const foundersText = {
  color: '#92400e',
  fontSize: '16px',
  margin: '0',
};

const signature = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '32px 0',
};

const urgency = {
  color: '#dc2626',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '24px 0',
};

const footer = {
  borderTop: '1px solid #e5e7eb',
  paddingTop: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
};

const link = {
  color: '#dc2626',
  textDecoration: 'underline',
};

export default VIPInvitationEmail;