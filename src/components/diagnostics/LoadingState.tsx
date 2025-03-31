
import React from "react";

export const LoadingState = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-muted-foreground">{message}</p>
  </div>
);
