
import React from "react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Loading diagnostics..." }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-12 h-12 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};
