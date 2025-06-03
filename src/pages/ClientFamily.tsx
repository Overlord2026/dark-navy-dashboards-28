
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddFamilyMemberDialog } from "@/components/family/AddFamilyMemberDialog";
import { FamilyMembersList } from "@/components/family/FamilyMembersList";
import { EmailJSSetup } from "@/components/family/EmailJSSetup";

export default function ClientFamily() {
  const [activeTab, setActiveTab] = useState("members");

  return (
    <ThreeColumnLayout activeMainItem="client-family" title="Family Members">
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Family Members</h1>
            <p className="text-muted-foreground">
              Manage your family members and their access to your financial information
            </p>
          </div>
          <AddFamilyMemberDialog>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Family Member
            </Button>
          </AddFamilyMemberDialog>
        </div>

        <EmailJSSetup />

        <Tabs defaultValue="members" onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="members" className="flex gap-2 items-center">
              <Users size={16} />
              <span>Family Members</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex gap-2 items-center">
              <Shield size={16} />
              <span>Permissions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex gap-2 items-center opacity-50 cursor-not-allowed relative"
              disabled
            >
              <Settings size={16} />
              <span>Settings</span>
              <Badge variant="secondary" className="ml-2 text-xs px-2 py-0.5 bg-yellow-500 text-black">
                Coming Soon
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="members">
            <div className="space-y-6">
              <FamilyMembersList />
            </div>
          </TabsContent>
          
          <TabsContent value="permissions">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Access Permissions</CardTitle>
                  <CardDescription>
                    Control what information each family member can access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Advanced Permissions</h3>
                    <p className="text-muted-foreground">
                      Detailed permission management for family members will be available soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Family Settings</CardTitle>
                  <CardDescription>
                    Configure general family sharing settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Settings Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Advanced family settings will be available in a future update.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
