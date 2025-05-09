
import React from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Palette,
  ArrowLeft,
  LogOut
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useUser();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleLogout = () => {
    logout();
    toast.success("You have been logged out successfully");
    navigate("/");
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleGoBack}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-5 h-auto">
          <TabsTrigger value="profile" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <Globe className="h-4 w-4" />
            <span>Language</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardContent className="pt-6">
              <p>Profile settings will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardContent className="pt-6">
              <p>Notification preferences will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardContent className="pt-6">
              <p>Security settings will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Theme</h3>
                <p className="text-muted-foreground mb-4">Select your preferred theme for the application.</p>
                <ThemeSwitcher />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="language">
          <Card>
            <CardContent className="pt-6">
              <p>Language settings will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Logout Button Section */}
      <div className="mt-10 pt-6 border-t border-border">
        <Card className="bg-card/50 hover:bg-card/70 transition-colors">
          <CardContent className="pt-6 flex flex-col items-center">
            <h3 className="text-lg font-medium mb-4">Account Session</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Ready to end your current session? Click below to log out of your account.
            </p>
            <Button 
              variant="destructive" 
              size="lg" 
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
