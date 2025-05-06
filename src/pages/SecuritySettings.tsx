
import { useState } from "react";
import { SecurityForm } from "@/components/profile/SecurityForm";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Shield, 
  KeyIcon, 
  Bell,
  FingerprintIcon,
  HistoryIcon
} from "lucide-react";

const SecuritySettings = () => {
  const [activeTab, setActiveTab] = useState("2fa");

  const handleSaveComplete = () => {
    console.log("Security settings saved successfully");
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Security Settings</h1>
      
      <Tabs defaultValue="2fa" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-5 h-auto">
          <TabsTrigger value="2fa" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <Shield className="h-4 w-4" />
            <span>Two-Factor Auth</span>
          </TabsTrigger>
          <TabsTrigger value="passwords" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <KeyIcon className="h-4 w-4" />
            <span>Passwords</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <Bell className="h-4 w-4" />
            <span>Security Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <FingerprintIcon className="h-4 w-4" />
            <span>Identity Verification</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex flex-col md:flex-row items-center gap-2 py-2">
            <HistoryIcon className="h-4 w-4" />
            <span>Activity Log</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="2fa">
          <Card>
            <CardContent className="pt-6">
              <SecurityForm onSave={handleSaveComplete} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="passwords">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-xl font-semibold">Password Management</h2>
              <p className="text-muted-foreground">Change your password or set up password recovery options.</p>
              <p>Password management interface will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-xl font-semibold">Security Alerts</h2>
              <p className="text-muted-foreground">Configure how you want to be notified about security events.</p>
              <p>Security alerts configuration will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verification">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-xl font-semibold">Identity Verification</h2>
              <p className="text-muted-foreground">Manage your identity verification methods.</p>
              <p>Identity verification settings will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-xl font-semibold">Account Activity</h2>
              <p className="text-muted-foreground">Review recent account activity and security events.</p>
              <p>Activity log will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecuritySettings;
