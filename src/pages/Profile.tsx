
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";

const Profile = () => {
  const { userProfile } = useUser();
  
  return (
    <ThreeColumnLayout title="Profile" activeMainItem="profile">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-4">
                  <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold mb-2">
                    {userProfile.firstName?.charAt(0)}{userProfile.lastName?.charAt(0)}
                  </div>
                  <h2 className="text-xl font-semibold">{userProfile.firstName} {userProfile.lastName}</h2>
                  <p className="text-muted-foreground">{userProfile.email}</p>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{userProfile.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p>{userProfile.address ? "Address provided" : "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p>{userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "Not available"}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">Change Password</Button>
                <Button variant="outline" className="w-full">Privacy Settings</Button>
                <Button variant="outline" className="w-full">Notification Preferences</Button>
                <Button variant="destructive" className="w-full">Delete Account</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="accounts">
              <TabsList className="w-full">
                <TabsTrigger value="accounts" className="flex-1">Linked Accounts</TabsTrigger>
                <TabsTrigger value="subscription" className="flex-1">Subscription</TabsTrigger>
                <TabsTrigger value="preferences" className="flex-1">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="accounts" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Linked Accounts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>Manage your connected financial accounts and services.</p>
                      <Button>Link New Account</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="subscription" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-lg font-medium">Current Plan: Premium</p>
                        <p className="text-muted-foreground">Billed annually</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Next billing date</p>
                        <p>December 31, 2023</p>
                      </div>
                      <Button>Manage Subscription</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Communication Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>Manage how and when you receive notifications and updates.</p>
                      <Button>Update Preferences</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Profile;
