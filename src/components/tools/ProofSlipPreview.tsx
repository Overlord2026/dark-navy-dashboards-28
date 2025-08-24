import React from 'react';
import { Check, FileText, Anchor } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProofSlipPreviewProps {
  title: string;
  summary: string;
  anchored?: boolean;
  timestamp?: string;
  className?: string;
}

export const ProofSlipPreview: React.FC<ProofSlipPreviewProps> = ({ 
  title, 
  summary, 
  anchored = false,
  timestamp,
  className = ''
}) => {
  return (
    <Card className={`bg-green-50 border-green-200 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">Proof Created</span>
              {anchored && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Anchor className="w-3 h-3 mr-1" />
                  VERIFY ✓
                </Badge>
              )}
            </div>
            
            <h3 className="font-semibold text-sm text-green-900 mb-1">{title}</h3>
            <p className="text-sm text-green-700">{summary}</p>
            
            {timestamp && (
              <p className="text-xs text-green-600 mt-2">
                Created: {new Date(timestamp).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};