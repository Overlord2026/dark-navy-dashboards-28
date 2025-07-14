import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Shield, Smartphone } from "lucide-react";

export default function HealthSettings() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Health Settings</h1>
        <p className="text-muted-foreground">
          Configure your health app preferences and privacy settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your health-related notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Medication reminders</p>
                <p className="text-sm text-muted-foreground">Get notified about medications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Appointment reminders</p>
                <p className="text-sm text-muted-foreground">24h before appointments</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Health insights</p>
                <p className="text-sm text-muted-foreground">Weekly health summaries</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Goal achievements</p>
                <p className="text-sm text-muted-foreground">Celebrate milestones</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Data
            </CardTitle>
            <CardDescription>Control your health data privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Anonymous analytics</p>
                <p className="text-sm text-muted-foreground">Help improve our services</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Research participation</p>
                <p className="text-sm text-muted-foreground">Contribute to health research</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Data sharing</p>
                <p className="text-sm text-muted-foreground">Share with healthcare providers</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button variant="outline" className="w-full mt-4">
              Export Health Data
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Device Integration
          </CardTitle>
          <CardDescription>Connect health devices and apps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-red-600 font-bold">A</span>
              </div>
              <h4 className="font-medium">Apple Health</h4>
              <p className="text-sm text-muted-foreground">Connected</p>
              <Button variant="outline" size="sm" className="mt-2">Configure</Button>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-blue-600 font-bold">F</span>
              </div>
              <h4 className="font-medium">Fitbit</h4>
              <p className="text-sm text-muted-foreground">Not connected</p>
              <Button size="sm" className="mt-2">Connect</Button>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-green-600 font-bold">O</span>
              </div>
              <h4 className="font-medium">Oura Ring</h4>
              <p className="text-sm text-muted-foreground">Not connected</p>
              <Button size="sm" className="mt-2">Connect</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}