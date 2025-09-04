/**
 * Simple PersonaCard with inline styles
 * Combines your clean API with our HSL color system
 */

import React from 'react';

export type PersonaType = 'family' | 'advisor' | 'attorney' | 'insurance' | 'healthcare' | 'nil' | 'accountant';

// Persona color mapping using our HSL system
const personaColors: Record<PersonaType, string> = {
  family: '#D4AF37',      // Brand gold
  advisor: '#6BA6FF',     // Sky blue  
  attorney: '#7A1733',    // Burgundy
  insurance: '#D9534F',   // Alert red
  healthcare: '#3946A6',  // Indigo
  nil: '#75E0C2',         // Emerald/mint
  accountant: '#75E0C2',  // Mint for accountants
};

interface PersonaCardProps {
  title: string;
  features?: string[];
  tagline?: string;
  color?: string;
  persona?: PersonaType;
  icon?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ 
  title, 
  features = [], 
  tagline = '', 
  color, 
  persona = 'family',
  icon,
  children,
  actions
}) => {
  // Use persona color if provided, otherwise fallback to color prop or default
  const cardColor = persona ? personaColors[persona] : (color || '#333333');
  
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
      {icon && <span className="icon" style={iconStyle}>{icon}</span>}
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
      
      {/* Compliance badge based on persona */}
      {persona === 'insurance' && (
        <div style={{
          fontSize: '0.7rem',
          color: '#D9534F',
          fontWeight: 'bold',
          marginTop: '8px',
          padding: '2px 6px',
          border: '1px solid #D9534F',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          10-Year Records
        </div>
      )}
      
      {persona === 'advisor' && (
        <div style={{
          fontSize: '0.7rem',
          color: '#75E0C2',
          fontWeight: 'bold',
          marginTop: '8px',
          padding: '2px 6px',
          border: '1px solid #75E0C2',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          SEC Compliant
        </div>
      )}
    </div>
  );
};

export default PersonaCard;

// Example usage matching your original API:
export const RegBICard = () => (
  <PersonaCard
    title="Reg BI Tracker"
    persona="advisor"
    features={[
      'Automated compliance monitoring',
      'Client interaction logging', 
      'Suitability analysis reports'
    ]}
    tagline="Stay compliant, save hours"
    icon="🛡️"
  />
);

export const InsuranceCard = () => (
  <PersonaCard
    title="10-Year Records Vault"
    persona="insurance"
    features={[
      'NAIC-compliant record retention',
      'Automated policy tracking',
      'Audit-ready reports'
    ]}
    tagline="Secure. Compliant. Accessible."
    icon="📋"
  />
);