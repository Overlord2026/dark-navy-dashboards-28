import React, { useState, useEffect } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Palette,
  CreditCard,
  Settings as SettingsIcon
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/context/SubscriptionContext';
import { useStripePortal } from '@/hooks/useStripePortal';

export default function EnhancedSettings() {
  const { userProfile, updateUserProfile } = useUser();
  const { user } = useAuth();
  const { currentTier, isInFreeTrial } = useSubscription();
  const { toast } = useToast();
  const { openPortal, isLoading: isPortalLoading } = useStripePortal();
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
      });
    }
  }, [userProfile]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      updateUserProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <ThreeColumnLayout title="Settings" activeMainItem="settings">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and billing information.</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-6 h-auto">
            <TabsTrigger value="profile" className="flex flex-col md:flex-row items-center gap-2 py-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex flex-col md:flex-row items-center gap-2 py-2">
              <CreditCard className="h-4 w-4" />
              <span>Billing</span>
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
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Email cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Role</Label>
                  <div>
                    <Badge variant="outline" className="capitalize">
                      {userProfile?.role || 'user'}
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  className="w-full md:w-auto"
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Subscription & Billing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Plan</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {currentTier}
                      </p>
                    </div>
                    <Badge variant={currentTier !== 'basic' ? "default" : "secondary"}>
                      {currentTier !== 'basic' ? 'Active' : 'Basic'}
                    </Badge>
                  </div>

                  {isInFreeTrial && (
                    <div>
                      <p className="font-medium">Trial Status</p>
                      <p className="text-sm text-muted-foreground">
                        Free trial active
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <Button onClick={openPortal} disabled={isPortalLoading} className="w-full">
                      {isPortalLoading ? 'Loading...' : 'Manage Subscription'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Update payment method, change plan, or cancel subscription
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Notification settings will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Security settings including password change and two-factor authentication will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Theme</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choose your preferred theme for the application.
                    </p>
                    <ThemeSwitcher />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Language Settings</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Language preferences will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}