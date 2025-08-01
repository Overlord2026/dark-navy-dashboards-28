import React from 'react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import MobileTabletQATestSuite from '@/components/qa/MobileTabletQATestSuite';
import { useAuth } from '@/context/AuthContext';
import { useResponsive } from '@/hooks/use-responsive';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Tablet, Monitor, Wifi, Battery } from 'lucide-react';

export default function MobileQATestPage() {
  const { userProfile } = useAuth();
  const { isMobile, isTablet, isDesktop, screenWidth } = useResponsive();

  // Device info for testing context
  const deviceInfo = {
    viewport: `${screenWidth}px`,
    type: isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop',
    userAgent: navigator.userAgent,
    online: navigator.onLine,
    touchSupport: 'ontouchstart' in window
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="Mobile & Tablet QA Testing" 
        text="Comprehensive testing suite for mobile interfaces, touch interactions, and responsive layouts across all personas"
      />

      {/* Current Device Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isMobile ? <Smartphone className="h-5 w-5" /> : 
             isTablet ? <Tablet className="h-5 w-5" /> : 
             <Monitor className="h-5 w-5" />}
            Current Testing Environment
          </CardTitle>
          <CardDescription>
            Your current device and browser configuration for mobile testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Device Type</div>
              <Badge variant="outline">{deviceInfo.type}</Badge>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Viewport</div>
              <Badge variant="outline">{deviceInfo.viewport}</Badge>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Touch Support</div>
              <div className="flex items-center gap-1">
                <Badge variant={deviceInfo.touchSupport ? "default" : "secondary"}>
                  {deviceInfo.touchSupport ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Network</div>
              <div className="flex items-center gap-1">
                <Wifi className="h-3 w-3" />
                <Badge variant={deviceInfo.online ? "default" : "destructive"}>
                  {deviceInfo.online ? "Online" : "Offline"}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Testing Instructions */}
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Mobile Testing Tips:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Use browser dev tools to simulate different devices (F12 → Device toolbar)</li>
              <li>• Test in both portrait and landscape orientations</li>
              <li>• Verify touch targets are at least 44px for accessibility</li>
              <li>• Check that modals and dropdowns work with virtual keyboards</li>
              <li>• Test file uploads with camera access on mobile devices</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Main Test Suite */}
      <MobileTabletQATestSuite />

      {/* Testing Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile QA Test Coverage</CardTitle>
          <CardDescription>
            What this test suite validates across all user personas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Navigation & Menus</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Hamburger menu functionality</li>
                <li>✓ Sidebar responsive behavior</li>
                <li>✓ Mobile route navigation</li>
                <li>✓ Bottom navigation for mobile</li>
                <li>✓ Breadcrumb adaptation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Touch Interactions</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Modal touch gestures</li>
                <li>✓ Button touch targets (44px min)</li>
                <li>✓ Form input interactions</li>
                <li>✓ Swipe gestures</li>
                <li>✓ Virtual keyboard handling</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Layout Responsiveness</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Dashboard card stacking</li>
                <li>✓ Table horizontal scrolling</li>
                <li>✓ Chart scaling and readability</li>
                <li>✓ Form layout adaptation</li>
                <li>✓ Content overflow handling</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">File Upload & Tools</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Camera capture integration</li>
                <li>✓ Photo library access</li>
                <li>✓ File picker functionality</li>
                <li>✓ Calculator tool usability</li>
                <li>✓ Progress indication</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}