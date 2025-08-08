import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Shield, Clock, CheckCircle2 } from 'lucide-react';

interface DocumentPackPreviewProps {
  matterType: string;
  stateCode: string;
}

export const DocumentPackPreview: React.FC<DocumentPackPreviewProps> = ({
  matterType,
  stateCode
}) => {
  const getDocumentsForMatter = (type: string) => {
    const baseDocuments = [
      {
        name: 'Last Will and Testament',
        description: 'Distributes your assets according to your wishes',
        required: true,
        icon: FileText
      },
      {
        name: 'Financial Power of Attorney',
        description: 'Authorizes someone to handle your financial affairs',
        required: true,
        icon: Shield
      },
      {
        name: 'Advance Healthcare Directive',
        description: 'Medical decisions and healthcare preferences',
        required: true,
        icon: FileText
      }
    ];

    if (type.includes('trust') || type === 'package_trust') {
      baseDocuments.push({
        name: 'Revocable Living Trust',
        description: 'Manages assets during lifetime and after death',
        required: true,
        icon: Shield
      });
    }

    return baseDocuments;
  };

  const documents = getDocumentsForMatter(matterType);
  const estimatedTime = matterType.includes('trust') ? '45-60 minutes' : '30-45 minutes';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Your Estate Planning Package
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Est. {estimatedTime}</span>
          </div>
          <Badge variant="secondary">{stateCode} Compliant</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.map((doc, index) => {
          const IconComponent = doc.icon;
          return (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <IconComponent className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{doc.name}</h4>
                  {doc.required && (
                    <Badge variant="secondary" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {doc.description}
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
            </div>
          );
        })}
        
        <div className="mt-6 p-4 bg-primary/10 rounded-lg">
          <h5 className="font-medium text-primary mb-2">What's Included</h5>
          <ul className="text-sm space-y-1">
            <li>• Attorney review and approval</li>
            <li>• Digital notarization (RON/RIN where allowed)</li>
            <li>• Coordinated witness signatures</li>
            <li>• State filing assistance (where supported)</li>
            <li>• Secure storage in your Family Vault</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};