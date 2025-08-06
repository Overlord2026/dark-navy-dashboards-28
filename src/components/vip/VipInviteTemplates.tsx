export const VIP_INVITE_TEMPLATES = {
  healthcare_influencer: {
    email: {
      subject: "Join Our Family Office Marketplace™ as a Founding Health Influencer",
      body: `Hi {{name}},

Your impact on healthspan and longevity has been instrumental in inspiring a new chapter for families seeking to align their health and wealth. As the author of "Your Health and Wealth: Your Longevity Blueprint," I'm thrilled to invite you as a Founding Health Influencer on our Family Office Marketplace™—a new platform where families and industry leaders collaborate.

As a Founding Influencer, you'll:
• Showcase your expertise to engaged families and advisors
• Host exclusive events or podcasts in our education center  
• Share research, best practices, or health solutions directly with those who need it most
• Enjoy early access to premium features and a special "Founding 100" badge

Click here to activate your VIP profile and get early access: {{claim_link}}

Thank you for the inspiration and impact you've already made. I'd be honored to collaborate further!

Warm regards,
Tony Gomes
Boutique Family Office™`
    },
    linkedin: {
      subject: "Founding Health Influencer Invitation",
      body: `Hi {{name}},

Your leadership in longevity and healthspan has inspired our entire community. We're launching the Family Office Marketplace™ and would be honored to have you as a Founding Health Influencer.

Reserved your premium profile here: {{claim_link}}

Limited to 25 health influencers only. Hope to collaborate!

Best,
Tony Gomes`
    }
  },

  real_estate: {
    email: {
      subject: "Invitation: Join Our Elite Family Office Marketplace as a Real Estate Expert",
      body: `Hi {{name}},

Real estate is at the heart of every successful family office, and your expertise as a {{role_title}} is exactly what our members value. We're launching the Family Office Marketplace™—a private, invitation-only network for HNW families and trusted professionals.

As a Founding Real Estate Professional, you'll:
• Showcase your properties and services to qualified families
• Connect with estate planners, attorneys, and financial advisors
• Participate in exclusive panels and webinars
• Be featured in our premium directory with a "Founding 100" badge

Get early access and claim your spot: {{claim_link}}

Looking forward to elevating the family office experience together!

Best,
Tony Gomes
Boutique Family Office™`
    },
    linkedin: {
      subject: "Founding Real Estate Expert Invitation",
      body: `Hi {{name}},

Your real estate expertise is exactly what our family office community values. Join as a Founding Real Estate Professional in our exclusive marketplace.

Claim your VIP spot: {{claim_link}}

Limited seats available!

Best,
Tony`
    }
  },

  insurance_agent: {
    email: {
      subject: "Claim Your Founding Seat as a Trusted Insurance Expert",
      body: `Hi {{name}},

Insurance and risk management are critical for multi-generational wealth preservation. We're inviting you to be a Founding Insurance Expert in our Family Office Marketplace™.

As a Founding Member, you'll:
• Serve families with complex insurance needs
• Connect with estate attorneys and wealth managers
• Access exclusive insurance products and solutions
• Display your "Founding 100" credentials

Activate your VIP profile: {{claim_link}}

Excited to have your expertise in our community!

Best regards,
Tony Gomes
Boutique Family Office™`
    }
  },

  accountant: {
    email: {
      subject: "Join our Trusted CPA Network—Founding Membership Invitation",
      body: `Hi {{name}},

Tax strategy is the backbone of family office success, and your CPA expertise is invaluable to our community. We're launching the Family Office Marketplace™ and would love you as a Founding CPA.

Your Founding Benefits:
• Connect with families needing sophisticated tax planning
• Collaborate with attorneys and advisors on complex structures
• Showcase your specializations to qualified prospects
• Earn your exclusive "Founding 100" recognition

Reserve your profile: {{claim_link}}

Looking forward to your expertise!

Warm regards,
Tony Gomes
Boutique Family Office™`
    }
  },

  attorney: {
    email: {
      subject: "Invitation: Be a Founding Legal Partner",
      body: `Hi {{name}},

Estate planning and legal strategy are fundamental to family office operations. We're honored to invite you as a Founding Legal Partner in our Family Office Marketplace™.

As a Founding Partner, you'll:
• Connect with families requiring sophisticated legal services
• Network with CPAs, advisors, and other professionals
• Share insights through our educational platform
• Display your prestigious "Founding 100" credentials

Bring your expertise to families nationwide: {{claim_link}}

Thank you for considering this partnership!

Best,
Tony Gomes
Boutique Family Office™`
    }
  },

  coach: {
    email: {
      subject: "Founding Coach Invitation: Family Office Marketplace™",
      body: `Hi {{name}},

Family dynamics and leadership development are crucial for multi-generational success. We'd be honored to have you as a Founding Coach in our Family Office Marketplace™.

Your impact will include:
• Guidance for next-generation family members
• Leadership development for family office teams
• Conflict resolution and family governance
• Recognition as a "Founding 100" professional

Join our elite community: {{claim_link}}

Excited for your wisdom and expertise!

Best,
Tony Gomes`
    }
  },

  realtor: {
    email: {
      subject: "Founding Real Estate Professional Invitation",
      body: `Hi {{name}},

Real estate is at the heart of every successful family office, and your expertise as a {{role_title}} is exactly what our members value. We're launching the Family Office Marketplace™—a private, invitation-only network for HNW families and trusted professionals.

As a Founding Real Estate Professional, you'll:
• Showcase your properties and services to qualified families
• Connect with estate planners, attorneys, and financial advisors
• Participate in exclusive panels and webinars
• Be featured in our premium directory with a "Founding 100" badge

Get early access and claim your spot: {{claim_link}}

Looking forward to elevating the family office experience together!

Best,
Tony Gomes
Boutique Family Office™`
    },
    linkedin: {
      subject: "Founding Real Estate Expert Invitation",
      body: `Hi {{name}},

Your real estate expertise is exactly what our family office community values. Join as a Founding Real Estate Professional in our exclusive marketplace.

Claim your VIP spot: {{claim_link}}

Limited seats available!

Best,
Tony`
    }
  },

  property_manager: {
    email: {
      subject: "Invitation: Join Our Elite Property Management Network",
      body: `Hi {{name}},

Property management is critical for multi-generational wealth preservation and growth. We're inviting you to be a Founding Property Management Expert in our Family Office Marketplace™.

As a Founding Member, you'll:
• Serve HNW families with complex property portfolios
• Connect with wealth managers and estate attorneys
• Access exclusive property management tools and solutions
• Display your "Founding 100" credentials

Activate your VIP profile: {{claim_link}}

Excited to have your expertise in our community!

Best regards,
Tony Gomes
Boutique Family Office™`
    }
  }
};

export const PERSONA_INVITE_SETTINGS = {
  healthcare_influencer: {
    displayName: 'Health Influencer',
    maxInvites: 25,
    priority: 'high',
    color: 'teal'
  },
  real_estate: {
    displayName: 'Real Estate Professional', 
    maxInvites: 50,
    priority: 'medium',
    color: 'blue'
  },
  insurance_agent: {
    displayName: 'Insurance Expert',
    maxInvites: 40,
    priority: 'medium', 
    color: 'orange'
  },
  accountant: {
    displayName: 'CPA',
    maxInvites: 30,
    priority: 'high',
    color: 'emerald'
  },
  attorney: {
    displayName: 'Legal Counsel',
    maxInvites: 35,
    priority: 'high',
    color: 'purple'
  },
  coach: {
    displayName: 'Family Coach',
    maxInvites: 20,
    priority: 'medium',
    color: 'pink'
  },
  realtor: {
    displayName: 'Real Estate Professional',
    maxInvites: 75,
    priority: 'high',
    color: 'indigo'
  },
  property_manager: {
    displayName: 'Property Manager',
    maxInvites: 30,
    priority: 'medium',
    color: 'cyan'
  }
};