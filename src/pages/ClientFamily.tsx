
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddFamilyMemberDialog } from "@/components/family/AddFamilyMemberDialog";
import { FamilyMembersList } from "@/components/family/FamilyMembersList";

export default function ClientFamily() {
  const [activeTab, setActiveTab] = useState("members");

  return (
    <ThreeColumnLayout activeMainItem="client-family" title="Family Members">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Family Members</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your family members and their access to your financial information
            </p>
          </div>
          <div className="flex-shrink-0">
            <AddFamilyMemberDialog>
              <Button className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Family Member
              </Button>
            </AddFamilyMemberDialog>
          </div>
        </div>

        <Tabs defaultValue="members" onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full flex-col sm:flex-row h-auto p-1">
            <TabsTrigger value="members" className="flex gap-2 items-center w-full sm:w-auto justify-center">
              <Users size={16} />
              <span className="text-xs sm:text-sm">Family Members</span>
            </TabsTrigger>
            <div className="relative w-full sm:w-auto">
              <TabsTrigger 
                value="permissions" 
                className="flex gap-2 items-center opacity-70 cursor-not-allowed w-full sm:w-auto justify-center"
                disabled={true}
              >
                <Shield size={16} />
                <span className="text-xs sm:text-sm">Permissions</span>
                <Badge variant="warning" className="ml-1 text-xs px-2 py-0.5 bg-yellow-500 text-black">
                  Coming Soon
                </Badge>
              </TabsTrigger>
            </div>
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
                  <CardTitle className="text-lg">Access Permissions</CardTitle>
                  <CardDescription className="text-sm">
                    Control what information each family member can access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Advanced Permissions</h3>
                    <p className="text-muted-foreground text-sm">
                      Detailed permission management for family members will be available soon.
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
