import React from "react";
import { NavItem } from "@/types/navigation";

// DEPRECATED: This tab has been reorganized into the hierarchical Client Tools > Wealth Management structure
// The items below are now part of the new hierarchical navigation in HierarchicalNavigationConfig.ts

// Legacy export for backward compatibility - use hierarchical structure instead
export const familyWealthNavItems: NavItem[] = [];

const FamilyWealthTab = () => {
  return (
    <div className="family-wealth-tab">
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Family Wealth Management</h2>
        <div className="bg-muted/50 p-6 rounded-lg">
          <p className="text-muted-foreground mb-2">
            This section has been reorganized into the new hierarchical navigation structure.
          </p>
          <p className="text-sm text-muted-foreground">
            Find wealth management tools under: <strong>Client Tools → Wealth Management</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FamilyWealthTab;