
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

export default function ProfilePage() {
  const { userProfile, updateUserProfile } = useUser();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: userProfile?.name || "",
    email: userProfile?.email || "",
    segment: userProfile?.investorType || "High Net Worth Individual",
    phone: userProfile?.phone || ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSegmentChange = (value: string) => {
    setFormData({ ...formData, segment: value });
  };
  
  const saveProfile = async () => {
    setIsLoading(true);
    
    try {
      // Update context state
      updateUserProfile({
        name: formData.fullName,
        investorType: formData.segment,
        phone: formData.phone
      });
      
      // In a real app, you would also save this to Supabase
      // const { error } = await supabase
      //   .from('profiles')
      //   .update({ 
      //     full_name: formData.fullName, 
      //     investor_type: formData.segment,
      //     phone: formData.phone 
      //   })
      //   .eq('id', userProfile?.id);
      
      // if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
        duration: 5000
      });
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ThreeColumnLayout activeMainItem="profile" title="Profile & Preferences">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Your Profile & Preferences</h1>
          <p className="text-muted-foreground mt-1">
            Update your personal information and preferences
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email (read-only)</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="segment">Investor Segment</Label>
                <Select value={formData.segment} onValueChange={handleSegmentChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select investor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aspiring Wealthy">Aspiring Wealthy</SelectItem>
                    <SelectItem value="High Net Worth Individual">High Net Worth Individual</SelectItem>
                    <SelectItem value="Ultra-High-Net-Worth">Ultra-High-Net-Worth</SelectItem>
                    <SelectItem value="Pre-Retiree">Pre-Retiree</SelectItem>
                    <SelectItem value="Retiree">Retiree</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={saveProfile} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Configure how and when you receive notifications about your wealth management, 
                investment opportunities, and account activities.
              </p>
              
              <p className="text-muted-foreground italic">
                Notification settings will be available in a future update.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Manage your account security, including password changes and two-factor authentication.
              </p>
              
              <p className="text-muted-foreground italic">
                Security settings will be available in a future update.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}
