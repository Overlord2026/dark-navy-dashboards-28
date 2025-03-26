
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  name: string;
  completed: boolean;
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
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-medium">Setup Checklist</h3>
          <span className="text-sm text-muted-foreground">{completedCount}/{total}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Complete at your own pace.</p>
        
        <div className="h-2 w-full bg-muted rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <ul className="space-y-3">
          {items.map((item) => (
            <li 
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className="flex items-center justify-between p-3 rounded-md hover:bg-muted cursor-pointer"
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
                    "font-medium",
                    item.completed ? "line-through text-muted-foreground" : ""
                  )}>
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.completed ? "Complete" : "Please fill out"}
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
