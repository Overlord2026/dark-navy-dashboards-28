import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Share2, Shield, Users, Download, Upload, Eye, Lock } from "lucide-react";

export const HealthcareShareDataPage = () => {
  const [shareSettings, setShareSettings] = useState({
    family: true,
    primaryDoctor: true,
    specialists: false,
    pharmacist: true,
    emergencyContacts: true
  });

  const sharedData = [
    {
      category: "Medical Records",
      items: ["Lab Results", "Imaging", "Prescriptions"],
      recipients: 3,
      lastShared: "2 days ago"
    },
    {
      category: "Vital Signs",
      items: ["Blood Pressure", "Heart Rate", "Weight"],
      recipients: 2,
      lastShared: "1 week ago"
    },
    {
      category: "Medications",
      items: ["Current Medications", "Allergies", "Side Effects"],
      recipients: 4,
      lastShared: "3 days ago"
    }
  ];

  const shareRequests = [
    {
      from: "Dr. Sarah Johnson",
      type: "Specialist Request",
      data: "Recent lab results",
      status: "pending"
    },
    {
      from: "Family Member",
      type: "Emergency Access",
      data: "Medical history",
      status: "approved"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Healthcare Data Sharing</h1>
        <p className="text-muted-foreground">
          Securely share your health information with family and healthcare providers
        </p>
      </div>

      {/* Privacy Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Sharing Controls
          </CardTitle>
          <CardDescription>
            Control who can access your healthcare information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(shareSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Allow access to your health data
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) =>
                    setShareSettings(prev => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Currently Shared Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Currently Shared Data
          </CardTitle>
          <CardDescription>
            Overview of data you're sharing with others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {sharedData.map((data, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{data.category}</h3>
                  <div className="flex gap-2 mt-2 mb-2">
                    {data.items.map((item, i) => (
                      <Badge key={i} variant="outline">{item}</Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Shared with {data.recipients} recipients • Last: {data.lastShared}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Share Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Sharing Requests
          </CardTitle>
          <CardDescription>
            Pending and recent requests to access your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shareRequests.map((request, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{request.from}</div>
                  <div className="text-sm text-muted-foreground">{request.type}</div>
                  <div className="text-sm">Requesting: {request.data}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={request.status === 'approved' ? 'default' : 'secondary'}>
                    {request.status}
                  </Badge>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Deny</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Upload className="h-6 w-6 mb-2" />
              Share New Data
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              Export Data
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Shield className="h-6 w-6 mb-2" />
              Privacy Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};