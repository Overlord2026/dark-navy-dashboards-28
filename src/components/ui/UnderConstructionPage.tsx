import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction, Clock, Star, Bell } from 'lucide-react';
import { DashboardHeader } from '@/components/ui/DashboardHeader';

interface UnderConstructionPageProps {
  featureName?: string;
  expectedDate?: string;
  description?: string;
  roadmapItems?: string[];
  showNotificationSignup?: boolean;
}

export function UnderConstructionPage({ 
  featureName = "This Feature", 
  expectedDate = "Q2 2024",
  description = "We're actively building this feature. It will be available soon with enhanced functionality.",
  roadmapItems = [],
  showNotificationSignup = true
}: UnderConstructionPageProps) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <DashboardHeader 
          heading="Under Construction" 
          text="This feature is being actively developed"
        />
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Feature Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 p-8 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="bg-orange-100 dark:bg-orange-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Construction className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              
              <h2 className="text-2xl font-semibold mb-3 text-center">{featureName}</h2>
              <p className="text-muted-foreground mb-6 text-center">{description}</p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full">
                <Star className="h-4 w-4" />
                <span className="font-medium">Expected: {expectedDate}</span>
              </div>
            </div>

            {/* Development Progress */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Development Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Planning & Design</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Complete</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Backend Development</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">🔄 In Progress</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Frontend Implementation</span>
                  <span className="text-gray-500 font-medium">⏳ Planned</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Testing & QA</span>
                  <span className="text-gray-500 font-medium">⏳ Planned</span>
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap & Notifications */}
          <div className="space-y-6">
            {roadmapItems.length > 0 && (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Planned Features</h3>
                <ul className="space-y-2">
                  {roadmapItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Star className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {showNotificationSignup && (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Get Notified
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We'll notify you as soon as this feature becomes available.
                </p>
                <Button className="w-full" variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Notify Me When Ready
                </Button>
              </div>
            )}

            {/* Alternative Actions */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4">In the meantime</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/')}
                >
                  Return to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/settings')}
                >
                  Update Preferences
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/help')}
                >
                  View Help Center
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}