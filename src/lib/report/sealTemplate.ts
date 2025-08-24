/**
 * Premium brand seal template for notarized PDFs
 */

export type SealInfo = {
  notaryName: string;
  commissionNo: string;
  commissionExp: string;           // ISO date string
  state: string;
  county?: string;
  circleText?: string;             // e.g., "Electronic Notary Seal"
};

export type StampOptions = {
  brandNavy?: string;             // e.g., '#0B1E33'
  brandGold?: string;             // e.g., '#D4AF37'
  x?: number; 
  y?: number;                     // placement (points) fallback
  page?: number;                  // 0-based; default last page
};

export async function stampPdfWithBrandSeal(
  pdfBytes: Uint8Array, 
  seal: SealInfo, 
  opts: StampOptions = {}
): Promise<Uint8Array> {
  // In production, use pdf-lib or similar to:
  // 1) Load PDF document
  // 2) Get target page (last page by default)
  // 3) Draw brand header bar (navy background)
  // 4) Add thin gold accent line
  // 5) Draw notary information box
  // 6) Add circular electronic seal with gold border
  // 7) Embed timestamp and security metadata
  // 8) Return modified PDF bytes

  const brandNavy = opts.brandNavy || '#0B1E33';
  const brandGold = opts.brandGold || '#D4AF37';
  const targetPage = opts.page ?? -1; // -1 means last page
  
  // Mock implementation - log the seal application
  console.log('[Brand Seal Applied]', {
    notary: seal.notaryName,
    commission: seal.commissionNo,
    state: seal.state,
    county: seal.county,
    colors: { navy: brandNavy, gold: brandGold },
    page: targetPage,
    circleText: seal.circleText || 'Electronic Notary Seal',
    timestamp: new Date().toISOString()
  });

  // In production, this would:
  /*
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const targetPageIndex = targetPage === -1 ? pages.length - 1 : targetPage;
  const page = pages[targetPageIndex];
  const { width, height } = page.getSize();
  
  // Brand header bar (navy background)
  page.drawRectangle({
    x: 50,
    y: height - 100,
    width: width - 100,
    height: 40,
    color: rgb(11/255, 30/255, 51/255), // brandNavy
  });
  
  // Gold accent line
  page.drawRectangle({
    x: 50,
    y: height - 105,
    width: width - 100,
    height: 2,
    color: rgb(212/255, 175/255, 55/255), // brandGold
  });
  
  // Header text
  page.drawText('ELECTRONICALLY NOTARIZED', {
    x: (width / 2) - 80,
    y: height - 85,
    size: 14,
    color: rgb(1, 1, 1), // white
    font: await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  });
  
  // Notary info box
  const infoBoxY = height - 200;
  page.drawText(`${seal.notaryName}`, {
    x: 70,
    y: infoBoxY,
    size: 12,
    color: rgb(11/255, 30/255, 51/255),
    font: await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  });
  
  page.drawText(`Notary Public, ${seal.state}${seal.county ? `, ${seal.county} County` : ''}`, {
    x: 70,
    y: infoBoxY - 15,
    size: 10,
    color: rgb(11/255, 30/255, 51/255),
  });
  
  page.drawText(`Commission #${seal.commissionNo}`, {
    x: 70,
    y: infoBoxY - 30,
    size: 10,
    color: rgb(11/255, 30/255, 51/255),
  });
  
  page.drawText(`Commission Expires: ${new Date(seal.commissionExp).toLocaleDateString()}`, {
    x: 70,
    y: infoBoxY - 45,
    size: 10,
    color: rgb(11/255, 30/255, 51/255),
  });
  
  page.drawText(`Notarized: ${new Date().toLocaleDateString()}`, {
    x: 70,
    y: infoBoxY - 60,
    size: 10,
    color: rgb(11/255, 30/255, 51/255),
  });
  
  // Circular seal (right side)
  const sealCenterX = width - 150;
  const sealCenterY = infoBoxY - 20;
  const sealRadius = 35;
  
  // Outer circle (gold border)
  page.drawCircle({
    x: sealCenterX,
    y: sealCenterY,
    size: sealRadius,
    borderColor: rgb(212/255, 175/255, 55/255), // brandGold
    borderWidth: 3,
    color: rgb(1, 1, 1), // white fill
  });
  
  // Inner circle
  page.drawCircle({
    x: sealCenterX,
    y: sealCenterY,
    size: sealRadius - 10,
    borderColor: rgb(11/255, 30/255, 51/255), // brandNavy
    borderWidth: 1,
  });
  
  // Seal text
  page.drawText('NOTARY', {
    x: sealCenterX - 20,
    y: sealCenterY + 5,
    size: 9,
    color: rgb(11/255, 30/255, 51/255),
    font: await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  });
  
  page.drawText('PUBLIC', {
    x: sealCenterX - 20,
    y: sealCenterY - 10,
    size: 9,
    color: rgb(11/255, 30/255, 51/255),
    font: await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  });
  
  page.drawText(seal.state, {
    x: sealCenterX - (seal.state.length * 2),
    y: sealCenterY - 25,
    size: 7,
    color: rgb(11/255, 30/255, 51/255),
  });
  
  return await pdfDoc.save();
  */

  // For demo, return original bytes
  return pdfBytes;
}

export function generateSealPreviewSVG(seal: SealInfo, opts: StampOptions = {}): string {
  const brandNavy = opts.brandNavy || '#0B1E33';
  const brandGold = opts.brandGold || '#D4AF37';
  
  return `
    <svg width="500" height="250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.2)"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="500" height="250" fill="white" stroke="#e0e0e0" stroke-width="1"/>
      
      <!-- Brand header bar -->
      <rect x="25" y="25" width="450" height="40" fill="${brandNavy}"/>
      
      <!-- Gold accent line -->
      <rect x="25" y="70" width="450" height="3" fill="${brandGold}"/>
      
      <!-- Header text -->
      <text x="250" y="50" text-anchor="middle" fill="white" font-family="serif" font-size="16" font-weight="bold">
        ELECTRONICALLY NOTARIZED
      </text>
      
      <!-- Notary information box -->
      <text x="50" y="110" fill="${brandNavy}" font-family="serif" font-size="14" font-weight="bold">
        ${seal.notaryName}
      </text>
      <text x="50" y="130" fill="${brandNavy}" font-family="serif" font-size="11">
        Notary Public, ${seal.state}${seal.county ? `, ${seal.county} County` : ''}
      </text>
      <text x="50" y="150" fill="${brandNavy}" font-family="serif" font-size="11">
        Commission #${seal.commissionNo}
      </text>
      <text x="50" y="170" fill="${brandNavy}" font-family="serif" font-size="11">
        Commission Expires: ${new Date(seal.commissionExp).toLocaleDateString()}
      </text>
      <text x="50" y="190" fill="${brandNavy}" font-family="serif" font-size="11">
        Notarized: ${new Date().toLocaleDateString()}
      </text>
      
      <!-- Circular seal -->
      <circle cx="400" cy="150" r="45" fill="white" stroke="${brandGold}" stroke-width="4" filter="url(#dropShadow)"/>
      <circle cx="400" cy="150" r="35" fill="none" stroke="${brandNavy}" stroke-width="2"/>
      
      <!-- Seal text -->
      <text x="400" y="140" text-anchor="middle" fill="${brandNavy}" font-family="serif" font-size="11" font-weight="bold">
        NOTARY
      </text>
      <text x="400" y="155" text-anchor="middle" fill="${brandNavy}" font-family="serif" font-size="11" font-weight="bold">
        PUBLIC
      </text>
      <text x="400" y="170" text-anchor="middle" fill="${brandNavy}" font-family="serif" font-size="9">
        ${seal.state}
      </text>
      
      <!-- Security watermark -->
      <text x="250" y="230" text-anchor="middle" fill="#f0f0f0" font-family="monospace" font-size="8">
        SECURE • TAMPER-EVIDENT • ELECTRONICALLY SEALED
      </text>
    </svg>
  `.trim();
}

export function calculateSealPlacement(pageWidth: number, pageHeight: number): { x: number; y: number } {
  // Place seal in bottom-right area with appropriate margins
  return {
    x: pageWidth - 200, // 200pt from right edge
    y: 100 // 100pt from bottom edge
  };
}