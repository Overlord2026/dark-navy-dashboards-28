
import React from "react";

interface ProfileFormHeaderProps {
  title: string;
  description?: string;
}

export const ProfileFormHeader = ({ 
  title, 
  description 
}: ProfileFormHeaderProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  );
};
