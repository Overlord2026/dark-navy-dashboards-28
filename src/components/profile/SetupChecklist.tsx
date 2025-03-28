
import React from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ChecklistItem {
  id: string;
  name: string;
  completed: boolean;
  description?: string; // Optional custom description text for incomplete items
}

interface SetupChecklistProps {
  items: ChecklistItem[];
  onItemClick: (itemId: string) => void;
}

export function SetupChecklist({ items, onItemClick }: SetupChecklistProps) {
  const completedCount = items.filter(item => item.completed).length;
  const total = items.length;
  
  const progressPercentage = Math.round((completedCount / total) * 100);
  
  return (
    <div className="rounded-lg border bg-[#1B1B32] text-[#E2E2E2] shadow-sm dark:bg-[#1B1B32] dark:text-[#E2E2E2] light:bg-[#F9F7E8] light:text-[#222222] light:border-[#DCD8C0]">
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Setup Checklist</h3>
          <span className="text-sm text-muted-foreground">{completedCount}/{total}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Complete at your own pace.</p>
        
        {/* Progress bar */}
        <div className="h-2 w-full bg-muted rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <ul className="space-y-4">
          {items.map((item) => (
            <li 
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className="flex items-center justify-between p-3 rounded-md hover:bg-black/30 cursor-pointer dark:hover:bg-black/30 light:hover:bg-gray-200/50"
            >
              <div className="flex items-center">
                <div className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3",
                  item.completed ? "bg-green-500" : "bg-gray-700"
                )}>
                  {item.completed ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <span className="h-4 w-4 flex items-center justify-center text-white text-xs"></span>
                  )}
                </div>
                <div>
                  <p className={cn(
                    "font-medium text-[16px]",
                    item.completed ? "line-through text-muted-foreground" : ""
                  )}>
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.completed 
                      ? "Complete" 
                      : item.description || "Please fill out"}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
