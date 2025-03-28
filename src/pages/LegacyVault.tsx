
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LockIcon, FileIcon, UsersIcon, KeyIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const vaultCategories = [
  { id: "documents", name: "Important Documents", icon: FileIcon },
  { id: "access", name: "Access & Permissions", icon: KeyIcon },
  { id: "beneficiaries", name: "Beneficiaries", icon: UsersIcon },
  { id: "timeline", name: "Timeline Events", icon: ClockIcon },
];

export default function LegacyVault() {
  return (
    <ThreeColumnLayout 
      title="Legacy Vault" 
      activeMainItem="vault"
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Your Legacy Vault</h2>
            <p className="text-muted-foreground mt-2">
              Securely store and organize your important documents and legacy instructions
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <LockIcon className="h-4 w-4" />
            Manage Security
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vaultCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <category.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  {category.id === "documents" && "Store and organize important legal and financial documents"}
                  {category.id === "access" && "Manage access permissions for your designated trustees"}
                  {category.id === "beneficiaries" && "Add and update beneficiary information"}
                  {category.id === "timeline" && "Create timed release of information and instructions"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  Open Section
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Vault Activity</CardTitle>
            <CardDescription>Recent actions and access to your vault</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Will document uploaded</p>
                    <p className="text-sm text-muted-foreground">by You</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Today at 10:30 AM</span>
                </div>
              </div>
              
              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Trustee access granted</p>
                    <p className="text-sm text-muted-foreground">to James Wilson</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Yesterday at 3:15 PM</span>
                </div>
              </div>
              
              <div className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Insurance policy updated</p>
                    <p className="text-sm text-muted-foreground">by You</p>
                  </div>
                  <span className="text-sm text-muted-foreground">May 10, 2023</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
}
