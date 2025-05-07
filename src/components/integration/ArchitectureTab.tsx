
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const ArchitectureTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">System Architecture</h2>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg">
            <p className="text-center text-muted-foreground mb-4">
              Architecture diagram will render here when connected to your ecosystem.
            </p>
            <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
              {Array(6).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className="h-24 bg-muted rounded-md flex items-center justify-center border border-border"
                >
                  <span className="text-muted-foreground text-sm">Component {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Data Flow</h3>
            <p className="text-muted-foreground mb-4">
              Connect your system to visualize how data flows between applications in your ecosystem.
            </p>
            <div className="h-40 bg-muted/50 rounded-md flex items-center justify-center">
              <span className="text-muted-foreground">Data flow visualization</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">System Components</h3>
            <p className="text-muted-foreground mb-4">
              View all connected components and their relationships within your ecosystem.
            </p>
            <div className="h-40 bg-muted/50 rounded-md flex items-center justify-center">
              <span className="text-muted-foreground">Component relationship diagram</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
