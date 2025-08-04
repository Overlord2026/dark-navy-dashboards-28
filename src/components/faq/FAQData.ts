// FAQ data for Family Office Marketplace
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'linkedin' | 'profile' | 'privacy' | 'premium' | 'technical';
  tags: string[];
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'linkedin-failed',
    question: 'My LinkedIn import failed—what do I do?',
    answer: 'You can try again, or complete your profile manually. We never store your credentials. For help, click the "Help" button below or contact our support team.',
    category: 'linkedin',
    tags: ['linkedin', 'import', 'error', 'troubleshooting']
  },
  {
    id: 'edit-profile',
    question: 'Can I edit my imported profile?',
    answer: 'Absolutely! Go to "Edit My Profile" at any time to update, hide, or add new credentials. You have complete control over what information is displayed.',
    category: 'profile',
    tags: ['profile', 'edit', 'linkedin', 'credentials']
  },
  {
    id: 'remove-profile',
    question: 'I want to remove my profile—how?',
    answer: 'Visit "Account Settings" and click "Delete My Account." Your data will be permanently erased within 24 hours. This action cannot be undone.',
    category: 'profile',
    tags: ['delete', 'remove', 'account', 'privacy']
  },
  {
    id: 'data-security',
    question: 'How is my data secured?',
    answer: 'We use enterprise-grade encryption, multi-factor authentication, and never sell your information. You control what is shared. All data is stored in secure, SOC 2 compliant infrastructure.',
    category: 'privacy',
    tags: ['security', 'privacy', 'encryption', 'data']
  },
  {
    id: 'invite-team',
    question: 'Can I invite my team or colleagues?',
    answer: 'Yes! Use the "Invite" button on your dashboard to send a secure invite link. Team members will go through the same verification process.',
    category: 'general',
    tags: ['invite', 'team', 'colleagues', 'referral']
  },
  {
    id: 'upgrade-premium',
    question: 'How do I upgrade to premium?',
    answer: 'Click the "Upgrade" banner at the top of your dashboard for instant access to premium features and priority support. Premium includes advanced matching, analytics, and exclusive networking events.',
    category: 'premium',
    tags: ['premium', 'upgrade', 'features', 'pricing']
  },
  {
    id: 'profile-verification',
    question: 'How does profile verification work?',
    answer: 'We verify professional credentials through multiple sources including LinkedIn, regulatory databases, and manual review. Verified profiles receive a blue checkmark and higher visibility.',
    category: 'profile',
    tags: ['verification', 'credentials', 'trust', 'checkmark']
  },
  {
    id: 'client-matching',
    question: 'How are clients matched with advisors?',
    answer: 'Our AI algorithm considers specializations, location, client preferences, and compatibility factors. Clients can also browse and directly contact verified professionals.',
    category: 'general',
    tags: ['matching', 'algorithm', 'clients', 'advisors']
  },
  {
    id: 'messaging-privacy',
    question: 'Are my messages private and secure?',
    answer: 'Yes, all messages are end-to-end encrypted. Only you and the recipient can read them. We never access or analyze private communications.',
    category: 'privacy',
    tags: ['messaging', 'privacy', 'encryption', 'communication']
  },
  {
    id: 'compliance-requirements',
    question: 'What compliance features are available?',
    answer: 'We offer audit trails, document management, communication archiving, and regulatory reporting tools. All features are designed to meet SEC, FINRA, and state requirements.',
    category: 'technical',
    tags: ['compliance', 'audit', 'regulatory', 'SEC', 'FINRA']
  },
  {
    id: 'mobile-access',
    question: 'Is there a mobile app?',
    answer: 'Yes! Our platform is fully mobile-optimized and works seamlessly on all devices. You can access all features through your mobile browser.',
    category: 'technical',
    tags: ['mobile', 'app', 'responsive', 'devices']
  },
  {
    id: 'support-hours',
    question: 'What are your support hours?',
    answer: 'Our support team is available Monday-Friday, 8 AM to 8 PM EST. Premium members receive priority support with faster response times.',
    category: 'general',
    tags: ['support', 'hours', 'contact', 'help']
  }
];

export const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Topics', count: FAQ_DATA.length },
  { id: 'general', label: 'General', count: FAQ_DATA.filter(faq => faq.category === 'general').length },
  { id: 'linkedin', label: 'LinkedIn Import', count: FAQ_DATA.filter(faq => faq.category === 'linkedin').length },
  { id: 'profile', label: 'Profile Management', count: FAQ_DATA.filter(faq => faq.category === 'profile').length },
  { id: 'privacy', label: 'Privacy & Security', count: FAQ_DATA.filter(faq => faq.category === 'privacy').length },
  { id: 'premium', label: 'Premium Features', count: FAQ_DATA.filter(faq => faq.category === 'premium').length },
  { id: 'technical', label: 'Technical', count: FAQ_DATA.filter(faq => faq.category === 'technical').length }
];