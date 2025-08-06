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
          title: 'Exclusive Early Access: Boutique Family Office Platform',
          description: 'As a leader and innovator in the advisor community',
          benefits: [
            'Custom branded dashboard for your practice',
            'Enhanced client referral rewards system',
            'Premium practice management tools',
            'Founding member marketplace listing'
          ]
        };
      case 'attorney':
        return {
          title: 'VIP Legal Partner: Family Office Marketplace',
          description: 'As a respected legal professional',
          benefits: [
            'Branded legal partner portal',
            'Client intake and lead management',
            'Attorney referral network access',
            'Compliance and document management tools'
          ]
        };
      case 'cpa':
        return {
          title: 'Founding CPA Partner Invitation',
          description: 'As a trusted accounting professional',
          benefits: [
            'Custom CPA practice dashboard',
            'Tax planning and compliance tools',
            'Client collaboration platform',
            'Professional referral network'
          ]
        };
      default:
        return {
          title: 'VIP Founding Member Invitation',
          description: 'As a leader in your industry',
          benefits: [
            'Custom branded portal',
            'Enhanced referral system',
            'Premium platform features',
            'Founding member recognition'
          ]
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
            {content.description}, you've been selected as one of the first 100 VIPs 
            to join the new <strong>Boutique Family Office™ Platform</strong>. Your personalized 
            {organizationName ? ` ${organizationName}` : ''} dashboard and referral toolkit are ready 
            for you and your clients.
          </Text>

          {customMessage && (
            <Section style={customMessageSection}>
              <Text style={customMessageText}>{customMessage}</Text>
            </Section>
          )}

          <Section style={benefitsSection}>
            <Heading style={h2}>Your VIP Benefits Include:</Heading>
            <ul style={benefitsList}>
              {content.benefits.map((benefit, index) => (
                <li key={index} style={benefitItem}>✓ {benefit}</li>
              ))}
            </ul>
          </Section>

          <Section style={ctaSection}>
            <Button style={ctaButton} href={magicLink}>
              🔗 Access Your VIP Portal
            </Button>
            <Text style={linkText}>
              Or copy this link: <Link href={magicLink} style={link}>{magicLink}</Link>
            </Text>
          </Section>

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
            Founder & CEO, Boutique Family Office™
          </Text>

          <Section style={footer}>
            <Text style={footerText}>
              This exclusive invitation expires in 30 days. 
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