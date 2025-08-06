import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import wireframe images
import desktopWireframe from "@/assets/billpay-desktop-wireframe.jpg";
import mobileWireframe from "@/assets/billpay-mobile-wireframe.jpg";
import sharingWireframe from "@/assets/billpay-sharing-wireframe.jpg";

export const BillPayWireframes: React.FC = () => {
  const wireframes = [
    {
      title: "Desktop Dashboard",
      description: "Full-featured desktop interface with navigation tabs, statistics cards, and bill management",
      image: desktopWireframe,
      features: ["Tabbed navigation", "Statistics overview", "Bill listing", "Quick actions"],
      viewport: "Desktop (1792x1024)"
    },
    {
      title: "Mobile Interface", 
      description: "Mobile-first design with touch-friendly controls and floating action button",
      image: mobileWireframe,
      features: ["Touch targets 44px+", "Floating add button", "Bottom navigation", "Expense charts"],
      viewport: "Mobile (1024x1536)"
    },
    {
      title: "Family Sharing",
      description: "Collaborative dashboard for family and advisor bill management with permissions",
      image: sharingWireframe,
      features: ["Permission management", "Activity feed", "Advisor invitations", "Role-based access"],
      viewport: "Desktop (1792x1024)"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">BillPay UI Wireframes</h2>
        <p className="text-muted-foreground">
          Professional wireframes showcasing the complete BillPay user experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {wireframes.map((wireframe, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-video bg-muted relative group">
              <img 
                src={wireframe.image} 
                alt={wireframe.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button variant="secondary" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Size
                </Button>
              </div>
            </div>
            
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{wireframe.title}</CardTitle>
                <Badge variant="outline">{wireframe.viewport}</Badge>
              </div>
              <CardDescription>
                {wireframe.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {wireframe.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Wireframe
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Design Principles</CardTitle>
          <CardDescription>
            Core principles guiding the BillPay interface design
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">👥</span>
              </div>
              <h4 className="font-medium">Family-Friendly</h4>
              <p className="text-sm text-muted-foreground">Accessible to all ages with large fonts and clear navigation</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-medium">Mobile-First</h4>
              <p className="text-sm text-muted-foreground">Optimized for touch with 44px+ targets and responsive design</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="font-medium">Security-First</h4>
              <p className="text-sm text-muted-foreground">Bank-level encryption with clear privacy controls</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">✨</span>
              </div>
              <h4 className="font-medium">Premium Feel</h4>
              <p className="text-sm text-muted-foreground">Navy and gold theme with professional fintech styling</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};