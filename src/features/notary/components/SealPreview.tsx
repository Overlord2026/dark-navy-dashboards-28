/**
 * Seal preview component for demonstrating premium brand styling
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateSealPreviewSVG } from '@/lib/report/sealTemplate';
import { Stamp, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jsonLdSafe } from '@/lib/jsonLd';

interface SealPreviewProps {
  notaryInfo: {
    name: string;
    commission: string;
    jurisdiction: string;
    expires: string;
    county?: string;
  };
  onDownloadReceipt?: () => void;
}

export function SealPreview({ notaryInfo, onDownloadReceipt }: SealPreviewProps) {
  const sealSVG = generateSealPreviewSVG({
    notaryName: notaryInfo.name,
    commissionNo: notaryInfo.commission,
    commissionExp: notaryInfo.expires,
    state: notaryInfo.jurisdiction,
    county: notaryInfo.county,
    circleText: 'Electronic Notary Seal'
  }, {
    brandNavy: '#0B1E33',
    brandGold: '#D4AF37'
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stamp className="h-5 w-5" />
          Premium Seal Preview
        </CardTitle>
        <CardDescription>
          Brand-style electronic notary seal with gold/navy styling
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seal Preview */}
        <div 
          className="border rounded-lg p-4 bg-white"
          dangerouslySetInnerHTML={{ __html: sealSVG }}
        />
        
        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium">Security Features</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Premium gold/navy branding</li>
              <li>• Tamper-evident design</li>
              <li>• SHA256 document hash</li>
              <li>• LTV timestamp support</li>
              <li>• Electronic seal validation</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Compliance</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• State jurisdiction display</li>
              <li>• Commission number visible</li>
              <li>• Expiration date included</li>
              <li>• Notarization timestamp</li>
              <li>• Circular seal format</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Stamp className="h-4 w-4 mr-2" />
            Preview on Sample PDF
          </Button>
          {onDownloadReceipt && (
            <Button variant="outline" onClick={onDownloadReceipt}>
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          )}
        </div>

        {/* Technical Info */}
        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Template:</strong> Premium Brand Seal v1.0</p>
          <p><strong>Colors:</strong> Navy (#0B1E33) • Gold (#D4AF37)</p>
          <p><strong>Format:</strong> SVG with PDF embedding support</p>
          <p><strong>Security:</strong> SHA256 + LTV timestamp ready</p>
        </div>
      </CardContent>
    </Card>
  );
}