
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarDiagnostics } from '@/components/diagnostics/SidebarDiagnostics';
import { useTheme } from '@/context/ThemeContext';
import { logger } from '@/services/logging/loggingService';
import { ChevronDown, ChevronUp, RotateCw } from 'lucide-react';

export const DebugPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('sidebar');
  const [menuState, setMenuState] = useState<Record<string, boolean>>({});

  const isLightTheme = theme === 'light';

  const expandAllMenus = () => {
    try {
      // Get all menu triggers
      const triggers = document.querySelectorAll('[data-submenu-trigger]');
      const unexpandedTriggers = Array.from(triggers).filter(
        trigger => trigger.getAttribute('data-expanded') !== 'true'
      );
      
      // Click all unexpanded triggers
      unexpandedTriggers.forEach(trigger => {
        (trigger as HTMLElement).click();
      });
      
      // Expand all categories
      const categoryHeaders = document.querySelectorAll('[data-category-header]');
      const collapsedCategories = Array.from(categoryHeaders).filter(
        header => {
          const categoryId = header.getAttribute('data-category-header');
          const category = document.querySelector(`[data-sidebar-category="${categoryId}"]`);
          return category?.getAttribute('data-expanded') !== 'true';
        }
      );
      
      collapsedCategories.forEach(header => {
        (header as HTMLElement).click();
      });
      
      logger.debug('Expanded all menus', {
        triggersExpanded: unexpandedTriggers.length,
        categoriesExpanded: collapsedCategories.length
      }, 'DebugPage');
    } catch (error) {
      logger.error('Error expanding menus', error, 'DebugPage');
    }
  };

  const collapseAllMenus = () => {
    try {
      // Get all expanded menu triggers
      const triggers = document.querySelectorAll('[data-submenu-trigger][data-expanded="true"]');
      
      // Click all expanded triggers to collapse them
      triggers.forEach(trigger => {
        (trigger as HTMLElement).click();
      });
      
      logger.debug('Collapsed all menus', {
        triggersCollapsed: triggers.length
      }, 'DebugPage');
    } catch (error) {
      logger.error('Error collapsing menus', error, 'DebugPage');
    }
  };

  const refreshState = () => {
    try {
      const newState: Record<string, boolean> = {};
      
      // Get all menu triggers
      const triggers = document.querySelectorAll('[data-submenu-trigger]');
      triggers.forEach(trigger => {
        const title = trigger.getAttribute('data-submenu-trigger');
        const expanded = trigger.getAttribute('data-expanded') === 'true';
        if (title) {
          newState[title] = expanded;
        }
      });
      
      // Get all category states
      const categories = document.querySelectorAll('[data-sidebar-category]');
      categories.forEach(category => {
        const id = category.getAttribute('data-sidebar-category');
        const expanded = category.getAttribute('data-expanded') === 'true';
        if (id) {
          newState[`category_${id}`] = expanded;
        }
      });
      
      setMenuState(newState);
      logger.debug('Menu state refreshed', { state: newState }, 'DebugPage');
    } catch (error) {
      logger.error('Error refreshing menu state', error, 'DebugPage');
    }
  };

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">System Diagnostics</h1>
      
      <Tabs defaultValue="sidebar" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
          <TabsTrigger value="state">State</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sidebar">
          <SidebarDiagnostics />
        </TabsContent>
        
        <TabsContent value="state">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Menu State</span>
                <Button variant="outline" size="sm" onClick={refreshState}>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>
                View the current expanded/collapsed state of all menus and categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-medium">Menus</h3>
                {Object.entries(menuState)
                  .filter(([key]) => !key.startsWith('category_'))
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 border rounded-md">
                      <span>{key}</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${value 
                        ? (isLightTheme ? 'bg-green-100 text-green-800' : 'bg-green-900/20 text-green-400')
                        : (isLightTheme ? 'bg-red-100 text-red-800' : 'bg-red-900/20 text-red-400')
                      }`}>
                        {value ? 'Expanded' : 'Collapsed'}
                      </span>
                    </div>
                  ))}
                
                <h3 className="font-medium mt-4">Categories</h3>
                {Object.entries(menuState)
                  .filter(([key]) => key.startsWith('category_'))
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 border rounded-md">
                      <span>{key.replace('category_', '')}</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${value 
                        ? (isLightTheme ? 'bg-green-100 text-green-800' : 'bg-green-900/20 text-green-400')
                        : (isLightTheme ? 'bg-red-100 text-red-800' : 'bg-red-900/20 text-red-400')
                      }`}>
                        {value ? 'Expanded' : 'Collapsed'}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Menu Actions</CardTitle>
              <CardDescription>
                Perform actions on the sidebar menu system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={expandAllMenus}
                    className="flex items-center"
                    variant="outline"
                  >
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Expand All Menus
                  </Button>
                  
                  <Button
                    onClick={collapseAllMenus}
                    className="flex items-center"
                    variant="outline"
                  >
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Collapse All Menus
                  </Button>
                </div>
                
                <Button
                  onClick={() => {
                    // Force page reload
                    window.location.reload();
                  }}
                  className="flex items-center"
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Reload Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
