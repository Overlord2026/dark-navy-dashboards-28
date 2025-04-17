
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ResourcesTabContentProps {
  onInterestClick: () => void;
}

export const ResourcesTabContent: React.FC<ResourcesTabContentProps> = ({ onInterestClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Estate Planning Guides</CardTitle>
          <CardDescription>Free resources to help you understand estate planning</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "Estate Planning 101: The Basics",
            "Understanding Wills vs. Trusts",
            "How to Choose an Executor",
            "Estate Tax Planning Strategies",
            "Digital Asset Protection Guide"
          ].map((guide) => (
            <div key={guide} className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>{guide}</span>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => toast.info("Downloading resources...")}>
            Download Guides
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Family Legacy Box</CardTitle>
          <CardDescription>Preserve your family history and values</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Our Family Legacy Box is a comprehensive digital solution that helps you preserve important memories, 
            documents, and personal messages for future generations. It includes:
          </p>
          <ul className="space-y-2">
            {[
              "Digital storage of important documents",
              "Family history preservation",
              "Video and audio recording capabilities",
              "Ethical will creation tools",
              "Secure access for designated family members"
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onInterestClick}>
            Learn More About Legacy Box
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
