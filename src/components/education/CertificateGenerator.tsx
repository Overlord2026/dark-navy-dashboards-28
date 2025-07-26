import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Award, Calendar } from "lucide-react";
import { toast } from "sonner";

interface CertificateGeneratorProps {
  courseName: string;
  userName?: string;
  completionDate: string;
  trackType: "Foundation" | "Advanced";
  onDownload: () => void;
}

export function CertificateGenerator({
  courseName,
  userName = "Valued Client",
  completionDate,
  trackType,
  onDownload
}: CertificateGeneratorProps) {
  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    toast.success("Certificate downloaded successfully!");
    onDownload();
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-12 w-12 text-primary mr-3" />
            <div>
              <h3 className="text-2xl font-bold text-primary">Certificate of Completion</h3>
              <Badge variant="secondary" className="mt-1">
                {trackType} Track
              </Badge>
            </div>
          </div>
          
          <div className="bg-background/80 backdrop-blur rounded-lg p-6 border border-border/50">
            <p className="text-lg mb-2">This certifies that</p>
            <p className="text-2xl font-bold text-primary mb-3">{userName}</p>
            <p className="text-lg mb-2">has successfully completed</p>
            <p className="text-xl font-semibold mb-4">{courseName}</p>
            
            <div className="flex items-center justify-center text-muted-foreground mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Completed: {new Date(completionDate).toLocaleDateString()}</span>
            </div>
            
            <div className="border-t border-border/50 pt-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium">BFO Wealth Management</p>
                  <p>CFP® Professional</p>
                </div>
                <div>
                  <p className="font-medium">Fiduciary Standard</p>
                  <p>Educational Excellence</p>
                </div>
              </div>
            </div>
          </div>
          
          <Button onClick={handleDownload} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Certificate (PDF)
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Present this certificate as proof of your commitment to financial education excellence.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}