
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Save, Eye, Edit, CheckCircle2 } from "lucide-react";
import { auditLog } from "@/services/auditLog/auditLogService";
import { toast } from "sonner";

export function CollaborationGuidelines() {
  const [guidelines, setGuidelines] = useState<string>(
    `Collaboration Guidelines for [Project/Module]:
• Do not store credentials, keys, or sensitive data in plain text
• Use only company-approved channels for code reviews and discussions
• Keep private Slack/email chains for sensitive IP discussions`
  );
  
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(guidelines);
  
  const handleSaveGuidelines = () => {
    setGuidelines(editValue);
    setEditMode(false);
    
    // Log this action to the audit trail
    auditLog.log(
      "system-user",
      "settings_change",
      "success",
      {
        userName: "Admin User",
        userRole: "Admin",
        resourceType: "Collaboration Guidelines",
        details: {
          action: "update_guidelines",
          timeStamp: new Date().toISOString()
        }
      }
    );
    
    toast.success("Collaboration guidelines updated successfully");
  };
  
  const handleConfirmGuidelines = () => {
    const newConfirmed = !confirmed;
    setConfirmed(newConfirmed);
    
    // Log the confirmation action
    auditLog.log(
      "system-user",
      "settings_change",
      "success",
      {
        userName: "Admin User",
        userRole: "Admin",
        resourceType: "Collaboration Guidelines",
        details: {
          action: newConfirmed ? "confirm_guidelines" : "unconfirm_guidelines",
          timeStamp: new Date().toISOString()
        }
      }
    );
    
    toast.success(newConfirmed 
      ? "Collaboration guidelines accepted" 
      : "Collaboration guidelines confirmation removed");
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          <CardTitle>Collaboration Guidelines</CardTitle>
        </div>
        <CardDescription>
          Guidelines for team collaboration and sensitive data handling
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="view" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="view">
              <Eye className="h-4 w-4 mr-2" />
              View Guidelines
            </TabsTrigger>
            <TabsTrigger value="edit" disabled={confirmed}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Guidelines
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="space-y-4">
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <ScrollArea className="h-[250px] w-full pr-4">
                  <div className="whitespace-pre-wrap">
                    {guidelines}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="confirm-guidelines" 
                  checked={confirmed} 
                  onCheckedChange={handleConfirmGuidelines}
                />
                <Label htmlFor="confirm-guidelines" className="text-sm font-medium">
                  I confirm that I understand and will follow these guidelines
                </Label>
              </div>
              
              {confirmed && (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <span className="text-sm">Confirmed</span>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="edit">
            <div className="space-y-4">
              <Textarea 
                value={editValue} 
                onChange={(e) => setEditValue(e.target.value)} 
                placeholder="Enter collaboration guidelines..."
                className="min-h-[250px] font-mono text-sm"
              />
              
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveGuidelines}
                  disabled={!editValue.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Guidelines
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
