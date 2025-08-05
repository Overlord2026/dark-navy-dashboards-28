import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertCircle } from 'lucide-react';

interface PatentPendingBannerProps {
  feature?: string;
  className?: string;
  showIcon?: boolean;
}

export function PatentPendingBanner({ 
  feature = "Platform Technology", 
  className = "",
  showIcon = true 
}: PatentPendingBannerProps) {
  return (
    <Card className={`border-amber-200 bg-amber-50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {showIcon && (
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-600" />
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                Patent Pending
              </Badge>
              <span className="text-sm font-medium text-amber-700">
                {feature}
              </span>
            </div>
            <p className="text-xs text-amber-600">
              This feature contains proprietary technology protected under U.S. patent application.
              Unauthorized use or reproduction is prohibited.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PatentPendingFooter() {
  return (
    <div className="border-t border-border bg-muted/30 px-6 py-4">
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Shield className="h-3 w-3" />
        <span>
          Patent Pending • BFO Family Office Platform • Contains proprietary technology protected under U.S. patent applications
        </span>
      </div>
    </div>
  );
}

export function PatentNoticeDialog() {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-amber-600" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Patent Protected Technology
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The BFO Family Office Platform incorporates multiple proprietary technologies 
            currently protected under U.S. patent applications, including:
          </p>
        </div>
        <div className="text-left space-y-1 text-xs text-muted-foreground">
          <div>• Family Legacy Vault™ multi-generational messaging system</div>
          <div>• SWAG Lead Score™ proprietary wealth assessment algorithm</div>
          <div>• Persona-adaptive onboarding and compliance automation</div>
          <div>• Linda Voice AI meeting assistant integration</div>
          <div>• Real-time multi-role compliance management system</div>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Unauthorized use, reproduction, or reverse engineering of these technologies is prohibited.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}