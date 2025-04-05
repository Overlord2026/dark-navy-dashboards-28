
import React from "react";

interface RightSidebarProps {
  children?: React.ReactNode;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ children }) => {
  return (
    <aside className="hidden md:block w-64 border-l border-border bg-background overflow-y-auto">
      <div className="p-4">
        {children ? children : (
          <div className="text-muted-foreground text-sm">
            <p>Right sidebar content</p>
          </div>
        )}
      </div>
    </aside>
  );
};
