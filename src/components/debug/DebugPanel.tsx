import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRoleContext } from '@/context/RoleContext';
import { useLocation } from 'react-router-dom';
import { getRoleNavigation } from '@/utils/roleNavigation';
import { hasRoleAccess, getRoleDisplayName } from '@/utils/roleHierarchy';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Bug, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface DebugPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function DebugPanel({ isOpen, onToggle }: DebugPanelProps) {
  const { userProfile, isAuthenticated, isLoading } = useUser();
  const { getCurrentRole, getCurrentClientTier, emulatedRole, isDevMode, getRoleDashboard } = useRoleContext();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const currentRole = getCurrentRole();
  const currentTier = getCurrentClientTier();
  const navigation = getRoleNavigation(currentRole, currentTier);
  const dashboardUrl = getRoleDashboard();

  // Helper to check if current route matches navigation
  const findMatchingNavItem = (items: any[], path: string): any => {
    for (const item of items) {
      if (item.href === path) return item;
      if (item.children) {
        const match = findMatchingNavItem(item.children, path);
        if (match) return match;
      }
    }
    return null;
  };

  const matchingNavItem = findMatchingNavItem(navigation, location.pathname);

  // Route validation
  const routeIssues: string[] = [];
  if (!matchingNavItem && location.pathname !== '/') {
    routeIssues.push(`Current route "${location.pathname}" not found in navigation`);
  }

  // Role validation
  const roleIssues: string[] = [];
  if (!userProfile) {
    roleIssues.push('No user profile loaded');
  }
  if (!isAuthenticated) {
    roleIssues.push('User not authenticated');
  }
  if (emulatedRole && !isDevMode) {
    roleIssues.push('Emulated role set but not in dev mode');
  }

  // Access validation
  const accessIssues: string[] = [];
  if (currentRole === 'client' && currentTier !== userProfile?.client_tier && !isDevMode) {
    accessIssues.push(`Tier mismatch: showing ${currentTier} but profile has ${userProfile?.client_tier}`);
  }

  const Section = ({ title, children, isError = false }: { title: string; children: React.ReactNode; isError?: boolean }) => (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => toggleSection(title)}
        className={`w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 ${
          isError ? 'text-destructive' : ''
        }`}
      >
        <span className="font-medium flex items-center gap-2">
          {isError ? <AlertTriangle className="h-4 w-4" /> : <Bug className="h-4 w-4" />}
          {title}
        </span>
        {expandedSections[title] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {expandedSections[title] && (
        <div className="px-3 pb-3 text-sm space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  const StatusIndicator = ({ status, label }: { status: 'success' | 'warning' | 'error'; label: string }) => (
    <div className="flex items-center gap-2">
      {status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
      {status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
      {status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
      <span className={`text-sm ${
        status === 'success' ? 'text-green-700' : 
        status === 'warning' ? 'text-yellow-700' : 
        'text-red-700'
      }`}>
        {label}
      </span>
    </div>
  );

  if (!isDevMode) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="mb-2 bg-background border-2 border-primary"
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug Panel
      </Button>

      {isOpen && (
        <Card className="w-96 max-h-96 overflow-y-auto bg-background border-2 border-primary shadow-xl">
          <div className="p-3 border-b border-border bg-muted/50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Navigation Debug
              </h3>
              <Button onClick={onToggle} variant="ghost" size="sm">×</Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            <Section title="System Status">
              <StatusIndicator 
                status={isAuthenticated ? 'success' : 'error'} 
                label={`Authentication: ${isAuthenticated ? 'OK' : 'Failed'}`} 
              />
              <StatusIndicator 
                status={isLoading ? 'warning' : 'success'} 
                label={`Loading: ${isLoading ? 'In Progress' : 'Complete'}`} 
              />
              <StatusIndicator 
                status={userProfile ? 'success' : 'error'} 
                label={`Profile: ${userProfile ? 'Loaded' : 'Missing'}`} 
              />
            </Section>

            <Section title="Current State">
              <div className="space-y-1">
                <div><strong>Route:</strong> {location.pathname}</div>
                <div><strong>Role:</strong> {getRoleDisplayName(currentRole)} 
                  {emulatedRole && <Badge variant="secondary" className="ml-2">Emulated</Badge>}
                </div>
                <div><strong>Tier:</strong> {currentTier}
                  {currentRole.includes('client') && <Badge variant="outline" className="ml-2">{currentTier}</Badge>}
                </div>
                <div><strong>Dashboard URL:</strong> {dashboardUrl}</div>
                <div><strong>Dev Mode:</strong> {isDevMode ? 'ON' : 'OFF'}</div>
              </div>
            </Section>

            <Section title="User Profile Debug">
              {userProfile ? (
                <div className="space-y-1 text-xs">
                  <div><strong>ID:</strong> {userProfile.id}</div>
                  <div><strong>Email:</strong> {userProfile.email}</div>
                  <div><strong>DB Role:</strong> {userProfile.role}</div>
                  <div><strong>DB Tier:</strong> {userProfile.client_tier}</div>
                  <div><strong>Permissions:</strong> {userProfile.permissions?.join(', ') || 'None'}</div>
                </div>
              ) : (
                <div className="text-red-600">No profile data available</div>
              )}
            </Section>

            <Section title="Navigation Structure">
              <div className="text-xs">
                <div><strong>Items:</strong> {navigation.length}</div>
                {navigation.map((item, index) => (
                  <div key={index} className="ml-2 mt-1">
                    <div>{item.title} ({item.href || 'no href'})</div>
                    {item.children && (
                      <div className="ml-2 text-muted-foreground">
                        {item.children.map((child, childIndex) => (
                          <div key={childIndex}>→ {child.title} ({child.href || 'no href'})</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Route Matching">
              {matchingNavItem ? (
                <StatusIndicator status="success" label={`Matched: ${matchingNavItem.title}`} />
              ) : (
                <StatusIndicator status="warning" label="No matching navigation item" />
              )}
            </Section>

            {(roleIssues.length > 0 || accessIssues.length > 0 || routeIssues.length > 0) && (
              <Section title="Issues Detected" isError>
                {roleIssues.map((issue, index) => (
                  <StatusIndicator key={index} status="error" label={issue} />
                ))}
                {accessIssues.map((issue, index) => (
                  <StatusIndicator key={index} status="warning" label={issue} />
                ))}
                {routeIssues.map((issue, index) => (
                  <StatusIndicator key={index} status="warning" label={issue} />
                ))}
              </Section>
            )}

            <Section title="Quick Actions">
              <div className="space-y-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => window.location.href = dashboardUrl}
                  className="w-full"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Go to Role Dashboard
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Reload Page
                </Button>
              </div>
            </Section>
          </div>
        </Card>
      )}
    </div>
  );
}