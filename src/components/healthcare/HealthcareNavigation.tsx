import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Stethoscope, 
  Brain, 
  BookOpen, 
  Shield, 
  MessageCircle,
  Users
} from 'lucide-react';

interface HealthcareNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activePersona: string;
  showOutreach: boolean;
}

export function HealthcareNavigation({ 
  activeTab, 
  onTabChange, 
  activePersona, 
  showOutreach 
}: HealthcareNavigationProps) {
  const tabs = [
    { value: 'dashboard', icon: Activity, label: 'Dashboard' },
    { value: 'care-team', icon: Stethoscope, label: 'My Care Team' },
    { value: 'longevity', icon: Brain, label: 'Longevity Programs' },
    { value: 'guides', icon: BookOpen, label: 'Health Guides' },
    { value: 'insurance', icon: Shield, label: 'Insurance' },
    { value: 'community', icon: MessageCircle, label: 'Community' },
  ];

  if (showOutreach) {
    tabs.push({ value: 'outreach', icon: Users, label: 'Outreach' });
  }

  return (
    <div className="w-full mb-8">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="relative">
          {/* Desktop: Grid layout */}
          <TabsList className={`hidden md:grid w-full mb-0 ${showOutreach ? 'grid-cols-7' : 'grid-cols-6'}`}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value} 
                  className="gap-2 touch-target font-display"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden overflow-x-auto">
            <TabsList className="inline-flex w-max min-w-full space-x-1 p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value} 
                    className="gap-2 touch-target whitespace-nowrap flex-shrink-0 font-display"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>
      </Tabs>
    </div>
  );
}