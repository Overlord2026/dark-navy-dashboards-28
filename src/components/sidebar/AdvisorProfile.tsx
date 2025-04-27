
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const AdvisorProfile = () => {
  const [isCollapsed] = useLocalStorage("sidebarCollapsed", false);

  return (
    <div className={cn(
      "p-4 border-t border-border flex items-center gap-3",
      isCollapsed && "justify-center"
    )}>
      <Avatar>
        <AvatarImage src="/placeholder.svg" />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="font-medium">John Smith</span>
          <span className="text-xs text-muted-foreground">Advisor</span>
        </div>
      )}
    </div>
  );
};
