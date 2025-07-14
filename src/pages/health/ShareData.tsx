import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Upload, Download, Shield } from "lucide-react";

export default function ShareData() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Share Data (CCDA)</h1>
        <p className="text-muted-foreground">
          Share your health data securely with providers using CCDA format
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Health Data
            </CardTitle>
            <CardDescription>Upload CCDA documents from other providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag & drop CCDA files or browse to upload
              </p>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload CCDA
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share className="h-5 w-5" />
              Share with Providers
            </CardTitle>
            <CardDescription>Generate secure links to share your health data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Share className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Create secure, time-limited access links
              </p>
              <Button>
                <Share className="mr-2 h-4 w-4" />
                Generate Share Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Privacy & Security
          </CardTitle>
          <CardDescription>Your health data is encrypted and secure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <Shield className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <h4 className="font-medium">Encrypted</h4>
              <p className="text-sm text-muted-foreground">End-to-end encryption</p>
            </div>
            <div>
              <Shield className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <h4 className="font-medium">HIPAA Compliant</h4>
              <p className="text-sm text-muted-foreground">Meets all privacy standards</p>
            </div>
            <div>
              <Shield className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <h4 className="font-medium">Access Control</h4>
              <p className="text-sm text-muted-foreground">You control who sees what</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}