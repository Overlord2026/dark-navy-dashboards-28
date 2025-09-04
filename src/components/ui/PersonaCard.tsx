/**
 * Simple PersonaCard with inline styles
 * Combines your clean API with our HSL color system
 */

import React from 'react';

// Structured persona configuration
const personas = {
  'Financial Advisors': { 
    color: '#6BA6FF', // Sky blue
    icon: '⚖️', 
    badge: 'SEC Compliant',
    compliance: '• FINRA Registered • SEC Oversight'
  },
  'Accountants': { 
    color: '#75E0C2', // Mint/emerald
    icon: '📊', 
    badge: 'AICPA Member',
    compliance: '• AICPA Member • IRS Authorized'
  },
  'Attorneys': { 
    color: '#7A1733', // Burgundy
    icon: '⚖️', 
    badge: 'Bar Certified',
    compliance: '• Bar Certified • Ethics Compliant'
  },
  'Insurance': { 
    color: '#D9534F', // Alert red
    icon: '📋', 
    badge: '10-Year Records',
    compliance: '• NAIC Compliant • State Licensed'
  },
  'Healthcare': { 
    color: '#3946A6', // Indigo
    icon: '🏥', 
    badge: 'HIPAA Secure',
    compliance: '• HIPAA Secure • State Licensed'
  },
  'NIL': { 
    color: '#75E0C2', // Emerald
    icon: '🏆', 
    badge: 'NCAA Compliant',
    compliance: '• NCAA Compliant • Deal Tracking'
  },
  'Family': { 
    color: '#D4AF37', // Brand gold
    icon: '👨‍👩‍👧‍👦', 
    badge: 'Wealth Manager',
    compliance: '• Wealth Optimization • Legacy Planning'
  }
};

// Legacy persona type for backward compatibility
export type PersonaType = 'family' | 'advisor' | 'attorney' | 'insurance' | 'healthcare' | 'nil' | 'accountant';

interface PersonaCardProps {
  title: string;
  features?: string[];
  tagline?: string;
  color?: string;
  persona?: keyof typeof personas | PersonaType; // Support both string keys and legacy types
  icon?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

// Legacy mapping for backward compatibility
const legacyPersonaMapping: Record<PersonaType, keyof typeof personas> = {
  family: 'Family',
  advisor: 'Financial Advisors', 
  attorney: 'Attorneys',
  insurance: 'Insurance',
  healthcare: 'Healthcare',
  nil: 'NIL',
  accountant: 'Accountants'
};

const PersonaCard: React.FC<PersonaCardProps> = ({ 
  title, 
  features = [], 
  tagline = '', 
  color, 
  persona = 'Family',
  icon,
  children,
  actions
}) => {
  // Resolve persona configuration
  const personaKey = typeof persona === 'string' && persona in personas 
    ? persona as keyof typeof personas
    : legacyPersonaMapping[persona as PersonaType] || 'Family';
    
  const personaConfig = personas[personaKey];
  
  // Use persona color if available, otherwise fallback to color prop or default
  const cardColor = color || personaConfig?.color || '#333333';
  const cardIcon = icon || personaConfig?.icon;
  const complianceBadge = personaConfig?.badge;
  
  const cardStyle = {
    backgroundColor: '#0B0F14', // Brand black background
    border: `2px solid ${cardColor}`, // Persona-specific border
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  };

  const titleStyle = {
    color: '#FFFFFF', // White text for contrast
    margin: '8px 0',
    fontSize: '1.1rem',
    fontWeight: '600',
  };

  const featureStyle = {
    margin: '5px 0', 
    color: '#E0E0E0', // Light gray for features
    fontSize: '0.9rem',
  };

  const taglineStyle = {
    color: cardColor, // Use persona color for tagline
    fontStyle: 'italic',
    marginTop: '12px',
    fontSize: '0.9rem',
    fontWeight: '500',
  };

  const iconStyle = {
    fontSize: '1.2em', 
    marginRight: '8px',
    color: cardColor, // Persona color for icon
  };

  return (
    <div
      className="persona-card"
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 16px rgba(0,0,0,0.3)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      }}
    >
      {cardIcon && <span className="icon" style={iconStyle}>{cardIcon}</span>}
      <h3 style={titleStyle}>{title}</h3>
      
      {/* Children content (for legacy compatibility) */}
      {children && (
        <div style={{ marginBottom: '12px', color: '#E0E0E0' }}>
          {children}
        </div>
      )}
      
      {/* Features list */}
      {features.length > 0 && (
        <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
          {features.map((feature, index) => (
            <li key={index} style={featureStyle}>
              <span style={{ color: cardColor, marginRight: '6px' }}>•</span>
              {feature}
            </li>
          ))}
        </ul>
      )}
      
      {/* Tagline */}
      {tagline && <p style={taglineStyle}>{tagline}</p>}
      
      {/* Actions */}
      {actions && (
        <div style={{ marginTop: '16px' }}>
          {actions}
        </div>
      )}
      
      {/* Compliance badge based on persona config */}
      {complianceBadge && (
        <div style={{
          fontSize: '0.7rem',
          color: cardColor,
          fontWeight: 'bold',
          marginTop: '8px',
          padding: '2px 6px',
          border: `1px solid ${cardColor}`,
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          {complianceBadge}
        </div>
      )}
      
      {/* Compliance info based on persona config */}
      {personaConfig?.compliance && (
        <div style={{
          fontSize: '0.7rem',
          color: '#B0B0B0',
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: `1px solid ${cardColor}`,
        }}>
          {personaConfig.compliance}
        </div>
      )}
    </div>
  );
};

export default PersonaCard;

// Export persona configuration for external use
export { personas };

// Example usage with structured approach:
export const RegBICard = () => (
  <PersonaCard
    title="Reg BI Tracker"
    persona="Financial Advisors"  // Uses structured config
    features={[
      'Automated compliance monitoring',
      'Client interaction logging', 
      'Suitability analysis reports'
    ]}
    tagline="Stay compliant, save hours"
  />
);

export const CustomCard = () => (
  <PersonaCard
    title="Custom Tool"
    color="#001F3F"  // Custom color override
    icon="⚖️"        // Custom icon override
    features={['Custom feature 1', 'Custom feature 2']}
    tagline="Custom tagline"
  />
);