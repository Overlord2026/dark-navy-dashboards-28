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
          title: 'Founding Attorney Invitation: Boutique Family Office™ Platform for Legal Innovators',
          description: 'As a respected legal professional',
          benefits: [
            '🏛️ Attorney Dashboard: Matters management, contract templates, CLE tracker, secure document vault',
            '🎖️ VIP badge: Elite listing for client and pro referrals',
            '👥 Invite clients and business partners: Streamline onboarding and referrals',
            '💰 Earn platform credits: For every new family or attorney you invite'
          ],
          callToAction: 'Activate Attorney Profile',
          closing: 'Transform your legal practice with cutting-edge family office technology.'
        };
      case 'cpa':
        return {
          title: 'Founding Attorney Invitation: Boutique Family Office™ Platform for Elite Accountants',
          description: 'As a trusted accounting professional',
          benefits: [
            '📊 Branded CPA Dashboard: Tax planning tools, CE tracking, workflow automation, and secure document vault',
            '🎖️ VIP badge & directory listing: Stand out to HNW families and business owners',
            '👥 One-click onboarding: Invite clients and collaborate with other trusted pros',
            '💰 Referral credits: Earn rewards for inviting peers and clients to the platform'
          ],
          callToAction: 'Activate My Accountant Portal',
          closing: 'Join the elite CPA community transforming how we serve high-net-worth families.'
        };
      case 'healthcare':
        return {
          title: 'VIP Healthcare Invitation: Boutique Family Office™ Platform for Elite Wellness Leaders',
          description: 'As a leading healthcare professional',
          benefits: [
            '🏥 Healthcare Consultant Dashboard: Host your profile, rates, credentials',
            '🎖️ VIP badge: Early adopter recognition, high-visibility for families seeking longevity advice',
            '👥 Client & Family Referral Hub: Get direct, warm introductions to motivated clients',
            '💰 Earn platform credits: For every professional or clinic you refer'
          ],
          callToAction: 'Activate Healthcare Profile',
          closing: 'Start connecting with top families seeking elite wellness and longevity expertise.'
        };
      case 'insurance':
        return {
          title: 'Elite Access to Boutique Family Office™ Insurance Marketplace',
          description: 'As a recognized leader in the insurance & annuities field',
          benefits: [
            '🎖️ VIP badge & profile: Priority placement in the Insurance Marketplace',
            '👥 Bulk Client/Downline Invites: Instantly bring your agents and clients',
            '📋 CE Tracker & License Alerts: Stay compliant with automated reminders',
            '💰 Marketplace referral credits: Earn for each agent or client added'
          ],
          callToAction: 'Activate Insurance Profile',
          closing: 'Start building your presence in the elite insurance marketplace.'
        };
      case 'realestate':
      case 'real_estate':
        return {
          title: 'Welcome! Founding VIP Access to the Family Office Real Estate Marketplace',
          description: 'As a top real estate professional',
          benefits: [
            '🏆 VIP badge & featured profile: First page listing in our Realty Marketplace',
            '🏢 Practice Management Suite: All-in-one dashboard for listings, clients, transactions, and compliance',
            '👥 Client & Agent Seat Allocation: Instantly onboard your agents and premium clients',
            '🎨 Co-branded Marketing: Access templates, event tools, and referral programs',
            '💰 Referral Wallet: Track credits for every deal and referral'
          ],
          callToAction: 'Activate Realty Profile',
          closing: 'Excited to help you elevate your real estate business to the next level.'
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
            {personaType === 'healthcare' 
              ? `You've been handpicked as a Founding Healthcare Partner for the Boutique Family Office™—the industry's first all-in-one wealth and health hub for families and their trusted advisors.`
              : `${content.description}, you've been selected as a Founding Member of the new Boutique Family Office™ platform—a premium ecosystem for high-net-worth families and top professionals.`
            }
            {organizationName ? ` Your ${organizationName}` : ' Your'} personalized dashboard and referral toolkit 
            are ready for you and your clients.
          </Text>

          {customMessage && (
            <Section style={customMessageSection}>
              <Text style={customMessageText}>{customMessage}</Text>
            </Section>
          )}

          <Section style={benefitsSection}>
            <Heading style={h2}>
              {personaType === 'healthcare' ? 'Why Join as a Founding Partner?' : 'What\'s in it for you:'}
            </Heading>
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
            {personaType === 'healthcare' ? 'Wishing you health and prosperity,' : 'Best,'}
            <br />
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