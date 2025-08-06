import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Smartphone, 
  Bell, 
  Crown, 
  Plus, 
  Users, 
  Upload, 
  Calendar,
  Target,
  FileText,
  Video,
  ChevronRight,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';

export const ClientDashboardWireframe = () => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const WireframeBox = ({ 
    children, 
    className = "", 
    height = "auto",
    label,
    color = "border-gray-300"
  }: {
    children: React.ReactNode;
    className?: string;
    height?: string;
    label?: string;
    color?: string;
  }) => (
    <div className={`border-2 border-dashed ${color} rounded-lg p-4 ${className}`} style={{ height }}>
      {label && (
        <div className="text-xs font-mono text-gray-500 mb-2 bg-gray-100 px-2 py-1 rounded inline-block">
          {label}
        </div>
      )}
      {children}
    </div>
  );

  const DesktopWireframe = () => (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* Sticky Top Bar - Desktop */}
      <WireframeBox label="STICKY TOP BAR - 64px height" color="border-blue-400">
        <div className="flex items-center justify-between h-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center text-xs">
              🌳
            </div>
            <span className="font-mono text-xs">BFO Gold Tree Logo</span>
          </div>
          <div className="text-center">
            <div className="font-mono text-sm">John Smith</div>
            <Badge className="text-xs">Premium Client</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </div>
        </div>
      </WireframeBox>

      {/* Welcome Banner */}
      <WireframeBox label="WELCOME BANNER - 120px height" color="border-purple-400">
        <div className="space-y-2">
          <h2 className="font-mono text-lg">Welcome, John! Your Family Office Dashboard is live.</h2>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
          </div>
          <span className="text-xs font-mono">Onboarding Progress: 75%</span>
        </div>
      </WireframeBox>

      {/* Metrics Row - 4 Cards */}
      <WireframeBox label="METRICS ROW - 4 Cards, 160px height" color="border-green-400">
        <div className="grid grid-cols-4 gap-4 h-24">
          {['Net Worth\n$2.4M\n+12.3%', 'Linked Accounts\n8\nActive', 'Vault Items\n24\n3 new', 'Last Milestone\nGoal Achieved!\n🎉'].map((metric, i) => (
            <WireframeBox key={i} className="text-center text-xs whitespace-pre-line">
              {metric}
            </WireframeBox>
          ))}
        </div>
      </WireframeBox>

      {/* Quick Actions Row */}
      <WireframeBox label="QUICK ACTIONS ROW - 80px height, 44px+ buttons" color="border-orange-400">
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: Plus, text: 'Add Account' },
            { icon: Users, text: 'Invite Family/Pro' },
            { icon: Upload, text: 'Upload Doc' },
            { icon: Calendar, text: 'Schedule Call' }
          ].map((action, i) => (
            <Button key={i} className="h-12 flex flex-col gap-1 text-xs">
              <action.icon className="h-4 w-4" />
              {action.text}
            </Button>
          ))}
        </div>
      </WireframeBox>

      {/* Main Grid - 2 Columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Goal Center */}
        <WireframeBox label="GOAL CENTER & TIMELINE - Left Column" color="border-indigo-400">
          <div className="space-y-4 h-80">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm">Goal Center & Timeline</span>
              <Button size="sm" className="gap-1">
                <Plus className="h-3 w-3" />
                Add Goal
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Retirement\n70%\nETA: 2034', 'Home\n50%\nETA: 2026', 'Education\n80%\nETA: 2028', 'Vacation\n72%\nETA: 2025'].map((goal, i) => (
                <WireframeBox key={i} className="text-xs text-center whitespace-pre-line h-20">
                  <div className="w-8 h-8 rounded-full border-4 border-blue-300 mx-auto mb-1"></div>
                  {goal}
                </WireframeBox>
              ))}
            </div>
          </div>
        </WireframeBox>

        {/* Right Column - Legacy Vault */}
        <WireframeBox label="FAMILY LEGACY VAULT™ - Right Column" color="border-amber-400">
          <div className="space-y-4 h-80 relative">
            {/* Gold Tree Watermark */}
            <div className="absolute top-2 right-2 opacity-20">
              <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">🌳</div>
            </div>
            
            <span className="font-mono text-sm">Family Legacy Vault™ Snapshot</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: FileText, count: '48', label: 'Documents' },
                { icon: Video, count: '12', label: 'Videos' },
                { icon: Users, count: '6', label: 'Recipients' }
              ].map((item, i) => (
                <WireframeBox key={i} className="text-center text-xs">
                  <item.icon className="h-6 w-6 mx-auto mb-1" />
                  <div className="font-bold">{item.count}</div>
                  <div>{item.label}</div>
                </WireframeBox>
              ))}
            </div>
            <Button className="w-full h-12">Leave a Message</Button>
          </div>
        </WireframeBox>
      </div>

      {/* Marketplace Highlights */}
      <WireframeBox label="MARKETPLACE HIGHLIGHTS - 3 Rotating Cards, 200px height" color="border-pink-400">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm">Marketplace Highlights</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {['Connect with\na Pro', 'Health &\nWellness', 'New Premium\nGuide'].map((highlight, i) => (
              <WireframeBox key={i} className="text-center text-xs whitespace-pre-line h-24">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-300 to-green-300 rounded mx-auto mb-2"></div>
                {highlight}
              </WireframeBox>
            ))}
          </div>
          <Button className="mx-auto flex gap-2">
            View Marketplace
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </WireframeBox>

      {/* Education Resources Strip */}
      <WireframeBox label="EDUCATION & RESOURCES STRIP - Horizontal Scroll, 180px height" color="border-teal-400">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm">Education & Resources - Recommended for You</span>
            <Button size="sm">Start Learning</Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <WireframeBox key={i} className="min-w-[200px] text-xs text-center">
                <div className="w-full h-20 bg-gradient-to-br from-purple-200 to-blue-200 rounded mb-2 flex items-center justify-center">
                  📚
                </div>
                <div className="font-semibold">Course {i + 1}</div>
                <Badge className="text-xs mt-1">
                  {i % 2 === 0 ? 'NEW' : 'Recommended'}
                </Badge>
              </WireframeBox>
            ))}
          </div>
        </div>
      </WireframeBox>

      {/* Floating Support Elements */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <WireframeBox label="FLOATING NOTIFICATIONS" className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
        </WireframeBox>
        <WireframeBox label="FLOATING HELP" className="w-auto px-4 h-12 rounded-full bg-gray-600 text-white flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          <span className="text-sm">Need Help?</span>
        </WireframeBox>
      </div>

      {/* Bottom Bar */}
      <WireframeBox label="BOTTOM BAR - 60px height" color="border-gray-500">
        <div className="flex items-center justify-between h-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <Sun className="h-4 w-4" />
              <Moon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-4 text-xs font-mono">
            <span>Privacy Policy</span>
            <span className="font-semibold">Fiduciary Duty Principles™</span>
          </div>
        </div>
      </WireframeBox>
    </div>
  );

  const MobileWireframe = () => (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {/* Mobile Top Bar */}
      <WireframeBox label="MOBILE TOP BAR - 56px height" color="border-blue-400">
        <div className="flex items-center justify-between h-6">
          <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-xs">🌳</div>
          <div className="text-center">
            <div className="font-mono text-xs">John S.</div>
            <Badge className="text-xs">Premium</Badge>
          </div>
          <Bell className="h-4 w-4" />
        </div>
      </WireframeBox>

      {/* Mobile Welcome */}
      <WireframeBox label="MOBILE WELCOME - 100px height" color="border-purple-400">
        <div className="space-y-2">
          <h3 className="font-mono text-sm">Welcome, John!</h3>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
          </div>
        </div>
      </WireframeBox>

      {/* Mobile Metrics - 2x2 Grid */}
      <WireframeBox label="MOBILE METRICS - 2x2 Grid, 180px height" color="border-green-400">
        <div className="grid grid-cols-2 gap-2">
          {['Net Worth\n$2.4M', 'Accounts\n8', 'Vault\n24', 'Milestone\n🎉'].map((metric, i) => (
            <WireframeBox key={i} className="text-center text-xs whitespace-pre-line h-16">
              {metric}
            </WireframeBox>
          ))}
        </div>
      </WireframeBox>

      {/* Mobile Quick Actions - 2x2 Grid */}
      <WireframeBox label="MOBILE ACTIONS - 2x2 Grid, 44px+ touch targets" color="border-orange-400">
        <div className="grid grid-cols-2 gap-2">
          {['Add Account', 'Invite Family', 'Upload Doc', 'Schedule Call'].map((action, i) => (
            <Button key={i} className="h-12 text-xs">
              {action}
            </Button>
          ))}
        </div>
      </WireframeBox>

      {/* Mobile Goals - Single Column */}
      <WireframeBox label="MOBILE GOALS - Single Column Stack" color="border-indigo-400">
        <div className="space-y-2">
          <span className="font-mono text-sm">Goals</span>
          {['Retirement 70%', 'Home 50%', 'Education 80%'].map((goal, i) => (
            <WireframeBox key={i} className="text-xs p-2 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-blue-300"></div>
              {goal}
            </WireframeBox>
          ))}
        </div>
      </WireframeBox>

      {/* Mobile Vault */}
      <WireframeBox label="MOBILE VAULT - Single Column" color="border-amber-400">
        <div className="space-y-2 relative">
          <div className="absolute top-0 right-0 opacity-20 w-8 h-8 bg-yellow-300 rounded-full">🌳</div>
          <span className="font-mono text-sm">Family Vault™</span>
          <div className="flex justify-around text-center text-xs">
            <div>48<br/>Docs</div>
            <div>12<br/>Videos</div>
            <div>6<br/>Recipients</div>
          </div>
          <Button className="w-full h-12">Leave Message</Button>
        </div>
      </WireframeBox>

      {/* Mobile Marketplace - Single Card */}
      <WireframeBox label="MOBILE MARKETPLACE - Single Active Card" color="border-pink-400">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-300 to-green-300 rounded mx-auto"></div>
          <span className="font-mono text-sm">Connect with a Pro</span>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </WireframeBox>

      {/* Mobile Education - Horizontal Scroll */}
      <WireframeBox label="MOBILE EDUCATION - Horizontal Cards" color="border-teal-400">
        <div className="space-y-2">
          <span className="font-mono text-sm">Learning</span>
          <div className="flex gap-2 overflow-x-auto">
            {Array.from({ length: 3 }, (_, i) => (
              <WireframeBox key={i} className="min-w-[120px] text-xs text-center">
                <div className="w-full h-16 bg-purple-200 rounded mb-1">📚</div>
                Course {i + 1}
              </WireframeBox>
            ))}
          </div>
        </div>
      </WireframeBox>

      {/* Mobile Bottom Navigation */}
      <WireframeBox label="MOBILE BOTTOM NAV - 60px height" color="border-gray-500">
        <div className="flex justify-around items-center h-8">
          <Button variant="ghost" size="sm">Home</Button>
          <Button variant="ghost" size="sm">Goals</Button>
          <Button variant="ghost" size="sm">Vault</Button>
          <Button variant="ghost" size="sm">More</Button>
        </div>
      </WireframeBox>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Wireframe Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Client Dashboard Wireframe</h1>
        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'outline'}
            onClick={() => setViewMode('desktop')}
            className="gap-2"
          >
            <Monitor className="h-4 w-4" />
            Desktop
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            onClick={() => setViewMode('mobile')}
            className="gap-2"
          >
            <Smartphone className="h-4 w-4" />
            Mobile
          </Button>
        </div>
        
        {/* Design Specifications */}
        <Card className="max-w-4xl mx-auto mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Design Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-left">
              <div>
                <h4 className="font-medium mb-2">Colors & Branding:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Primary: Navy (#172042)</li>
                  <li>• Accent: Gold (#FFC700)</li>
                  <li>• Success: Emerald (#169873)</li>
                  <li>• Gold tree watermark in Vault</li>
                  <li>• BFO Fiduciary Duty Principles™</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Accessibility & Mobile:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• All buttons 44px+ touch targets</li>
                  <li>• WCAG 2.1 AA compliance</li>
                  <li>• Responsive stacking for mobile</li>
                  <li>• High contrast ratios</li>
                  <li>• Keyboard navigation support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wireframe Content */}
      {viewMode === 'desktop' ? <DesktopWireframe /> : <MobileWireframe />}

      {/* Wireframe Notes */}
      <Card className="mt-8 max-w-4xl mx-auto">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Implementation Notes</h3>
          <div className="text-sm space-y-2">
            <p><strong>Sticky Elements:</strong> Top bar remains fixed during scroll</p>
            <p><strong>Responsive Breakpoints:</strong> Desktop (1024px+), Tablet (768px), Mobile (320px+)</p>
            <p><strong>Interactions:</strong> Hover states, click animations, confetti for milestones</p>
            <p><strong>Loading States:</strong> Skeleton loaders for all data sections</p>
            <p><strong>Real-time Updates:</strong> Live data refresh for metrics and notifications</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};