
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, MessageSquare, Phone, Mail, Star, Award, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvisorSectionProps {
  onViewProfile: (tabId: string) => void;
  onBookSession: () => void;
  collapsed?: boolean;
}

export const AdvisorSection: React.FC<AdvisorSectionProps> = ({
  onViewProfile,
  onBookSession,
  collapsed = false
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewProfile = () => {
    setIsDialogOpen(true);
  };

  const handleBookSession = () => {
    onBookSession();
    console.log("Book session clicked");
  };

  const handleTabClick = (tabId: string) => {
    onViewProfile(tabId);
  };

  return (
    <>
      <div className={cn(
        "border-t border-sidebar-border pt-4",
        collapsed ? "px-2" : "px-0"
      )}>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src="/lovable-uploads/cfb9898e-86f6-43a4-816d-9ecd35536845.png" alt="Sarah Johnson" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">SJ</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Sarah Johnson</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">Senior Financial Advisor</p>
              </div>
            )}
          </div>
          
          {!collapsed && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewProfile}
                className="flex-1 text-xs h-8 bg-sidebar-accent/50 hover:bg-sidebar-accent border-sidebar-border"
              >
                View Profile
              </Button>
              <Button
                size="sm"
                onClick={handleBookSession}
                className="flex-1 text-xs h-8 bg-primary hover:bg-primary/90"
              >
                Book Session
              </Button>
            </div>
          )}
          
          {collapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewProfile}
              className="w-full p-2 h-8"
              title="View Advisor Profile"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background border-border z-50">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Your Financial Advisor</DialogTitle>
            <DialogDescription>
              Connect with your dedicated financial advisor for personalized guidance
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger 
                value="profile" 
                onClick={() => handleTabClick('profile')}
                className="text-sm"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="services" 
                onClick={() => handleTabClick('services')}
                className="text-sm"
              >
                Services
              </TabsTrigger>
              <TabsTrigger 
                value="contact" 
                onClick={() => handleTabClick('contact')}
                className="text-sm"
              >
                Contact
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarImage src="/lovable-uploads/cfb9898e-86f6-43a4-816d-9ecd35536845.png" alt="Sarah Johnson" />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">SJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">Sarah Johnson, CFP®</CardTitle>
                      <p className="text-muted-foreground">Senior Financial Advisor</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </div>
                        <span className="text-sm text-muted-foreground">5.0 (127 reviews)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      With over 12 years of experience in wealth management and financial planning, 
                      Sarah specializes in helping high-net-worth individuals and families achieve 
                      their long-term financial goals through comprehensive planning strategies.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Credentials & Experience</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="text-sm">Certified Financial Planner (CFP®)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm">12+ years in wealth management</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">Estate Planning</Badge>
                        <Badge variant="secondary" className="text-xs">Tax Strategy</Badge>
                        <Badge variant="secondary" className="text-xs">Investment Management</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="services" className="space-y-4">
              <div className="grid gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Comprehensive Financial Planning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Holistic approach to your financial future including retirement planning, 
                      investment strategy, and risk management.
                    </p>
                    <Badge variant="outline" className="text-xs">60-min consultation</Badge>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Estate & Tax Planning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Strategic planning to minimize tax burden and ensure smooth wealth transfer 
                      to beneficiaries.
                    </p>
                    <Badge variant="outline" className="text-xs">90-min consultation</Badge>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Investment Portfolio Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Regular portfolio analysis and rebalancing to align with your risk tolerance 
                      and financial objectives.
                    </p>
                    <Badge variant="outline" className="text-xs">30-min consultation</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">(555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">sarah.johnson@bfo.com</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Button 
                      onClick={handleBookSession} 
                      className="w-full"
                      size="sm"
                    >
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Schedule Consultation
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      size="sm"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
