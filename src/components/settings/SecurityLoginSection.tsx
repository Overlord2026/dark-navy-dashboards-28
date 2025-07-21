import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Smartphone, 
  Key, 
  Monitor, 
  MapPin, 
  Clock,
  AlertCircle
} from "lucide-react";
import { useUser } from "@/context/UserContext";

export function SecurityLoginSection() {
  const { userProfile } = useUser();

  const activeSessions = [
    {
      id: '1',
      device: 'MacBook Pro',
      location: 'San Francisco, CA',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: '2',
      device: 'iPhone 15 Pro',
      location: 'San Francisco, CA',
      lastActive: '1 hour ago',
      current: false
    }
  ];

  const loginHistory = [
    {
      date: '2024-01-20 14:30',
      device: 'MacBook Pro',
      location: 'San Francisco, CA',
      status: 'success'
    },
    {
      date: '2024-01-20 09:15',
      device: 'iPhone 15 Pro',
      location: 'San Francisco, CA',
      status: 'success'
    },
    {
      date: '2024-01-19 18:45',
      device: 'Unknown Device',
      location: 'New York, NY',
      status: 'failed'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password & Authentication
          </CardTitle>
          <CardDescription>
            Manage your login credentials and authentication methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Password</Label>
              <p className="text-sm text-muted-foreground">
                Last changed 30 days ago
              </p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Label className="text-base font-medium">Two-Factor Authentication</Label>
                <Badge variant={userProfile?.twoFactorEnabled ? "default" : "secondary"}>
                  {userProfile?.twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant={userProfile?.twoFactorEnabled ? "outline" : "default"}>
              {userProfile?.twoFactorEnabled ? "Manage" : "Enable 2FA"}
            </Button>
          </div>

          {userProfile?.twoFactorEnabled && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-sm font-medium">Authenticator App</span>
                  <Badge variant="default" className="text-xs">Primary</Badge>
                </div>
                <Button variant="ghost" size="sm">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">SMS Backup</span>
                  <span className="text-xs text-muted-foreground">+1 (••••) •••-1234</span>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recovery Codes</span>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            Manage devices and locations where you're signed in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{session.device}</span>
                      {session.current && (
                        <Badge variant="default" className="text-xs">Current</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {session.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="outline" size="sm">Sign Out</Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="destructive" size="sm">
              Sign Out All Other Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Additional security features and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Login Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified of new sign-ins from unrecognized devices
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Security Questions</Label>
              <p className="text-sm text-muted-foreground">
                Set up backup questions for account recovery
              </p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Session Timeout</Label>
              <p className="text-sm text-muted-foreground">
                Automatically sign out after 30 minutes of inactivity
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Login Activity
          </CardTitle>
          <CardDescription>
            Review your recent sign-in attempts and locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loginHistory.map((login, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {login.status === 'failed' ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <Shield className="h-4 w-4 text-success" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{login.device}</span>
                      <Badge variant={login.status === 'success' ? "default" : "destructive"} className="text-xs">
                        {login.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{login.date}</span>
                      <span>{login.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm">View Full History</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}