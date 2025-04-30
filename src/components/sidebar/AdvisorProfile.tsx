
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export const AdvisorProfile = () => {
  return (
    <div className="p-4 border-t border-border flex items-center gap-3">
      <Avatar>
        <AvatarImage src="/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png" />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium">John Smith</span>
        <span className="text-xs text-muted-foreground">Advisor</span>
      </div>
    </div>
  );
};
