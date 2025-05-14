
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '@/context/SidebarContext';
import { homeNavItems } from './config/homeNavConfig';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';

const MainSidebar = () => {
  const { isOpen } = useSidebar();
  const location = useLocation();
  const { userProfile } = useUser();
  
  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-card transition-all duration-300",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="text-sm font-bold text-primary-foreground">FO</span>
          </div>
          {isOpen && <span className="text-lg font-semibold">Family Office</span>}
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {homeNavItems.map((item, index) => {
            const isActive = location.pathname === item.href || 
                             location.pathname.startsWith(item.href + '/');
                             
            return (
              <React.Fragment key={index}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {isOpen && <span>{item.title}</span>}
                </Link>
                
                {isOpen && isActive && item.sections && item.sections.length > 0 && (
                  <div className="ml-6 mt-1 grid gap-1">
                    {item.sections.map((section, sectionIndex) => (
                      <Link
                        key={sectionIndex}
                        to={section.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-1 text-xs font-medium",
                          location.pathname === section.href
                            ? "bg-accent/50 text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        )}
                      >
                        {section.title}
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
      
      {isOpen && (
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {userProfile?.firstName?.[0] || userProfile?.name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium">{userProfile?.name || 'User'}</p>
              <p className="truncate text-xs text-muted-foreground">{userProfile?.role || 'client'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSidebar;
