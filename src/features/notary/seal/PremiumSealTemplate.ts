/**
 * Premium eSeal stamping template with brand styling and LTV timestamp
 */

export interface SealTemplate {
  style: 'premium' | 'classic' | 'minimal';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  layout: {
    sealPosition: 'bottom-right' | 'bottom-center' | 'top-right';
    infoBoxPosition: 'left' | 'right' | 'bottom';
    marginTop: number;
    marginSide: number;
  };
}

export const PREMIUM_SEAL_TEMPLATE: SealTemplate = {
  style: 'premium',
  colors: {
    primary: 'hsl(45, 100%, 51%)', // Gold
    secondary: 'hsl(220, 50%, 20%)', // Navy
    accent: 'hsl(45, 100%, 85%)', // Light gold
    text: 'hsl(220, 50%, 15%)' // Dark navy
  },
  layout: {
    sealPosition: 'bottom-right',
    infoBoxPosition: 'left',
    marginTop: 50,
    marginSide: 50
  }
};

export interface NotaryInfo {
  name: string;
  commission: string;
  jurisdiction: string;
  expires: string;
  sealImageUrl?: string;
  certificate?: string;
}

export interface SealOptions {
  template: SealTemplate;
  notary: NotaryInfo;
  sessionId: string;
  timestamp: string;
  enableLTV: boolean;
  documentHash: string;
  qrCodeData?: string;
}

export function generatePremiumSealSVG(options: SealOptions): string {
  const { template, notary, sessionId, timestamp, documentHash } = options;
  const { colors, layout } = template;
  
  return `
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${colors.accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.primary};stop-opacity:1" />
        </linearGradient>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      
      <!-- Premium Frame -->
      <rect x="10" y="10" width="380" height="180" 
            fill="url(#goldGradient)" 
            stroke="${colors.secondary}" 
            stroke-width="3" 
            rx="8"
            filter="url(#dropShadow)" />
            
      <!-- Inner Border -->
      <rect x="20" y="20" width="360" height="160" 
            fill="white" 
            stroke="${colors.secondary}" 
            stroke-width="1" 
            rx="4" />
      
      <!-- Header Bar -->
      <rect x="25" y="25" width="350" height="30" 
            fill="${colors.secondary}" />
      <text x="200" y="43" 
            text-anchor="middle" 
            fill="white" 
            font-family="serif" 
            font-size="16" 
            font-weight="bold">
        ELECTRONICALLY NOTARIZED
      </text>
      
      <!-- Notary Information -->
      <text x="35" y="75" fill="${colors.text}" font-family="serif" font-size="12" font-weight="bold">
        ${notary.name}
      </text>
      <text x="35" y="90" fill="${colors.text}" font-family="serif" font-size="10">
        Notary Public, ${notary.jurisdiction}
      </text>
      <text x="35" y="105" fill="${colors.text}" font-family="serif" font-size="10">
        Commission #${notary.commission}
      </text>
      <text x="35" y="120" fill="${colors.text}" font-family="serif" font-size="10">
        Commission Expires: ${notary.expires}
      </text>
      
      <!-- Seal Circle -->
      <circle cx="320" cy="110" r="45" 
              fill="url(#goldGradient)" 
              stroke="${colors.secondary}" 
              stroke-width="3"
              filter="url(#dropShadow)" />
      <circle cx="320" cy="110" r="35" 
              fill="none" 
              stroke="${colors.secondary}" 
              stroke-width="2" />
      <text x="320" y="105" 
            text-anchor="middle" 
            fill="${colors.secondary}" 
            font-family="serif" 
            font-size="8" 
            font-weight="bold">
        NOTARY
      </text>
      <text x="320" y="115" 
            text-anchor="middle" 
            fill="${colors.secondary}" 
            font-family="serif" 
            font-size="8" 
            font-weight="bold">
        PUBLIC
      </text>
      <text x="320" y="125" 
            text-anchor="middle" 
            fill="${colors.secondary}" 
            font-family="serif" 
            font-size="6">
        ${notary.jurisdiction}
      </text>
      
      <!-- Security Features -->
      <text x="35" y="145" fill="${colors.text}" font-family="monospace" font-size="8">
        Session: ${sessionId.slice(-8)}
      </text>
      <text x="35" y="155" fill="${colors.text}" font-family="monospace" font-size="8">
        Hash: ${documentHash.slice(0, 16)}...
      </text>
      <text x="35" y="165" fill="${colors.text}" font-family="monospace" font-size="8">
        Timestamp: ${timestamp}
      </text>
      
      ${options.enableLTV ? `
      <!-- LTV Indicator -->
      <rect x="250" y="140" width="60" height="25" 
            fill="${colors.accent}" 
            stroke="${colors.secondary}" 
            stroke-width="1" 
            rx="3" />
      <text x="280" y="155" 
            text-anchor="middle" 
            fill="${colors.secondary}" 
            font-family="sans-serif" 
            font-size="8" 
            font-weight="bold">
        LTV
      </text>
      ` : ''}
    </svg>
  `.trim();
}

export async function applyPremiumSeal(
  pdfBytes: Uint8Array,
  options: SealOptions
): Promise<{ bytes: Uint8Array; hash: string; timestamp?: string }> {
  
  // Generate premium seal SVG
  const sealSVG = generatePremiumSealSVG(options);
  
  // In production, this would:
  // 1. Load PDF with PDF-lib
  // 2. Convert SVG to image or embed as vector
  // 3. Place seal at specified position
  // 4. Add timestamp if LTV enabled
  // 5. Calculate final hash
  
  console.log('[Premium Seal]', {
    template: options.template.style,
    position: options.template.layout.sealPosition,
    ltv: options.enableLTV,
    notary: options.notary.name,
    sealSVG: sealSVG.length + ' chars'
  });
  
  // Generate SHA256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', pdfBytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  let timestamp: string | undefined;
  if (options.enableLTV) {
    // Simulate LTV timestamp from trusted authority
    timestamp = new Date().toISOString();
    console.log('[LTV Timestamp]', { timestamp, tsa: 'demo-authority' });
  }
  
  // Return original bytes for demo - in production, return sealed PDF
  return {
    bytes: pdfBytes,
    hash: `sha256:${hash}`,
    timestamp
  };
}

export function generateSealReceiptHTML(
  options: SealOptions,
  result: { hash: string; timestamp?: string }
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Notarization Receipt</title>
      <style>
        body { font-family: serif; max-width: 600px; margin: 40px auto; padding: 20px; }
        .seal-preview { border: 2px solid #333; padding: 20px; margin: 20px 0; }
        .security-info { background: #f5f5f5; padding: 15px; border-left: 4px solid ${options.template.colors.primary}; }
        .hash { font-family: monospace; word-break: break-all; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>Electronic Notarization Receipt</h1>
      
      <div class="seal-preview">
        ${generatePremiumSealSVG(options)}
      </div>
      
      <h2>Notarization Details</h2>
      <p><strong>Notary:</strong> ${options.notary.name}</p>
      <p><strong>Commission:</strong> ${options.notary.commission}</p>
      <p><strong>Jurisdiction:</strong> ${options.notary.jurisdiction}</p>
      <p><strong>Session ID:</strong> ${options.sessionId}</p>
      <p><strong>Completed:</strong> ${options.timestamp}</p>
      
      <div class="security-info">
        <h3>Security Verification</h3>
        <p><strong>Document Hash:</strong></p>
        <p class="hash">${result.hash}</p>
        
        ${result.timestamp ? `
        <p><strong>LTV Timestamp:</strong> ${result.timestamp}</p>
        <p><em>This document includes long-term validation for extended verification.</em></p>
        ` : ''}
        
        <p><em>This receipt verifies the integrity and authenticity of the notarized document.</em></p>
      </div>
      
      <footer style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
        Generated by Premium Notarization Service
      </footer>
    </body>
    </html>
  `;
}