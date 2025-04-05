
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";

const Profile = () => {
  const { userProfile } = useUser();

  return (
    <ThreeColumnLayout title="User Profile">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Summary Card */}
          <Card className="p-6 flex-1">
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            <div className="flex mb-6">
              <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary mr-4">
                {userProfile?.name?.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="text-xl font-medium">{userProfile?.name || "User Name"}</h3>
                <p className="text-muted-foreground">{userProfile?.email || "user@example.com"}</p>
                <p className="text-sm mt-1">Member since {userProfile?.memberSince || "January 2025"}</p>
              </div>
            </div>

            <Separator className="my-4" />
            
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Full Name:</span>
                <span className="font-medium">{userProfile?.name || "User Name"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Address:</span>
                <span className="font-medium">{userProfile?.email || "user@example.com"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone Number:</span>
                <span className="font-medium">{userProfile?.phone || "+1 (555) 123-4567"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date of Birth:</span>
                <span className="font-medium">{userProfile?.dateOfBirth || "January 1, 1980"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address:</span>
                <span className="font-medium text-right">{userProfile?.address || "123 Main Street, New York, NY 10001"}</span>
              </div>
            </div>
          </Card>

          {/* Account Actions Card */}
          <Card className="p-6 flex-1">
            <h2 className="text-2xl font-semibold mb-4">Account Actions</h2>
            <div className="grid gap-3">
              <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">
                Edit Profile Information
              </button>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90 transition-colors">
                Change Password
              </button>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90 transition-colors">
                Two-Factor Authentication
              </button>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90 transition-colors">
                Privacy Settings
              </button>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90 transition-colors">
                Notification Preferences
              </button>
              <button className="bg-destructive/10 text-destructive px-4 py-2 rounded hover:bg-destructive/20 transition-colors">
                Delete Account
              </button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Linked Accounts */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Linked Accounts</h2>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#1877F2] rounded flex items-center justify-center mr-3">
                    <span className="text-white text-sm">f</span>
                  </div>
                  <span>Facebook</span>
                </div>
                <button className="text-sm text-primary hover:underline">Link</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#1DA1F2] rounded flex items-center justify-center mr-3">
                    <span className="text-white text-sm">t</span>
                  </div>
                  <span>Twitter</span>
                </div>
                <button className="text-sm text-primary hover:underline">Link</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#0A66C2] rounded flex items-center justify-center mr-3">
                    <span className="text-white text-sm">in</span>
                  </div>
                  <span>LinkedIn</span>
                </div>
                <button className="text-sm text-primary hover:underline">Link</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#EA4335] rounded flex items-center justify-center mr-3">
                    <span className="text-white text-sm">G</span>
                  </div>
                  <span>Google</span>
                </div>
                <span className="text-sm text-muted-foreground">Linked</span>
              </div>
            </div>
          </Card>
          
          {/* Subscription Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Subscription</h2>
            <Separator className="mb-4" />
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Current Plan:</span>
                <span className="font-medium">Premium</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Billing Cycle:</span>
                <span className="font-medium">Annual</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Next Billing:</span>
                <span className="font-medium">January 1, 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">$1,200/year</span>
              </div>
            </div>
            <Separator className="mb-4" />
            <div className="flex flex-col space-y-2">
              <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">
                Manage Subscription
              </button>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90 transition-colors">
                View Billing History
              </button>
            </div>
          </Card>
          
          {/* Communication Preferences */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Communication Preferences</h2>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Account Updates</span>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <span>New Features</span>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <span>Marketing Emails</span>
                <input type="checkbox" className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <span>Newsletter</span>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <span>SMS Notifications</span>
                <input type="checkbox" className="h-4 w-4" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Profile;
