
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn } from "lucide-react";

export const ArchitectureTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">System Architecture</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ZoomIn className="h-4 w-4" /> Zoom
          </Button>
        </div>
      </div>

      <Card className="border-[#333] bg-[#1F1F2E] p-4">
        <CardHeader>
          <CardTitle className="text-[#D4AF37]">Architecture Diagram</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-[#121221] border border-[#333] rounded-md p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Interactive architecture diagram will display here</p>
              <Button className="bg-black hover:bg-black/80 text-[#D4AF37]">Generate Architecture View</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#333] bg-[#1F1F2E]">
          <CardHeader>
            <CardTitle className="text-[#D4AF37]">Data Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Visualize how data moves between different components and services in your architecture.
            </p>
            <Button className="bg-black hover:bg-black/80 text-[#D4AF37] w-full">View Data Flow</Button>
          </CardContent>
        </Card>

        <Card className="border-[#333] bg-[#1F1F2E]">
          <CardHeader>
            <CardTitle className="text-[#D4AF37]">Component Dependencies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Explore relationships and dependencies between different components in your system.
            </p>
            <Button className="bg-black hover:bg-black/80 text-[#D4AF37] w-full">View Dependencies</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
