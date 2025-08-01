import React from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import MobileTabletQATestSuite from '@/components/qa/MobileTabletQATestSuite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Tablet, Monitor, Wifi } from 'lucide-react';
import { useResponsive } from '@/hooks/use-responsive';

export default function MobileMobileQATest() {
  const { isMobile, isTablet, screenWidth } = useResponsive();

  const deviceInfo = {
    viewport: `${screenWidth}px`,
    type: isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop',
    online: navigator.onLine,
    touchSupport: 'ontouchstart' in window
  };

  return (
    <MobileLayout title="QA Test">
      <div className="p-4 space-y-6">
        {/* Device Status */}
        <Card className="bg-[#1B1B32] border border-[#2A2A45]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              {isMobile ? <Smartphone className="h-5 w-5" /> : 
               isTablet ? <Tablet className="h-5 w-5" /> : 
               <Monitor className="h-5 w-5" />}
              Testing Environment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Device:</span>
              <Badge variant="outline">{deviceInfo.type}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Viewport:</span>
              <Badge variant="outline">{deviceInfo.viewport}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Touch:</span>
              <Badge variant={deviceInfo.touchSupport ? "default" : "secondary"}>
                {deviceInfo.touchSupport ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network:</span>
              <div className="flex items-center gap-1">
                <Wifi className="h-3 w-3" />
                <Badge variant={deviceInfo.online ? "default" : "destructive"}>
                  {deviceInfo.online ? "Online" : "Offline"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testing Instructions */}
        <Card className="bg-[#1B1B32] border border-[#2A2A45]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Mobile Testing</CardTitle>
            <CardDescription>
              Tips for effective mobile QA testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-gray-300">
              <li>• Test hamburger menus and navigation</li>
              <li>• Verify touch targets are 44px minimum</li>
              <li>• Check modals work with virtual keyboard</li>
              <li>• Test file uploads with camera access</li>
              <li>• Verify calculators work on small screens</li>
            </ul>
          </CardContent>
        </Card>

        {/* QA Test Suite */}
        <MobileTabletQATestSuite />
      </div>
    </MobileLayout>
  );
}