
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export const FamilyProfile = () => {
  return (
    <div className="p-4 border-b border-border flex items-center gap-3">
      <Avatar>
        <AvatarImage src="/placeholder.svg" />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium">Tom Brady</span>
        <span className="text-xs text-muted-foreground">Premium Client</span>
      </div>
    </div>
  );
};
