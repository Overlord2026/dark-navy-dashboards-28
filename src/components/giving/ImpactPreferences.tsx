import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImpactPreferences } from "@/hooks/useImpactReporting";
import { Settings, Mail, FileText, Share, Calendar } from "lucide-react";
import { useState } from "react";

interface ImpactPreferencesProps {
  preferences: ImpactPreferences;
  onUpdate: (updates: Partial<ImpactPreferences>) => void;
  loading?: boolean;
}

export const ImpactPreferencesComponent = ({ 
  preferences, 
  onUpdate, 
  loading = false 
}: ImpactPreferencesProps) => {
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: keyof ImpactPreferences, value: any) => {
    const newPrefs = { ...localPrefs, [key]: value };
    setLocalPrefs(newPrefs);
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(localPrefs);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalPrefs(preferences);
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Impact Reporting Preferences
        </CardTitle>
        <CardDescription>
          Customize how you receive and share your impact reports
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Public Recognition */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Share className="h-4 w-4 text-muted-foreground" />
            <Label className="text-base font-medium">Public Recognition</Label>
          </div>
          <div className="flex items-center space-x-2 pl-6">
            <Switch
              id="public-recognition"
              checked={localPrefs.allow_public_recognition}
              onCheckedChange={(checked) => handleChange('allow_public_recognition', checked)}
            />
            <Label htmlFor="public-recognition" className="text-sm">
              Allow my giving to be included in public recognition (leaderboards, testimonials)
            </Label>
          </div>
          <p className="text-xs text-muted-foreground pl-6">
            When enabled, your name and giving totals may be shared in community impact stories and recognition programs.
          </p>
        </div>

        {/* Email Notifications */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Label className="text-base font-medium">Email Notifications</Label>
          </div>
          <div className="flex items-center space-x-2 pl-6">
            <Switch
              id="email-notifications"
              checked={localPrefs.email_notifications}
              onCheckedChange={(checked) => handleChange('email_notifications', checked)}
            />
            <Label htmlFor="email-notifications" className="text-sm">
              Send me email notifications when reports are ready
            </Label>
          </div>
        </div>

        {/* Report Frequency */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Label className="text-base font-medium">Report Frequency</Label>
          </div>
          <div className="space-y-2 pl-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="quarterly-reports"
                checked={localPrefs.quarterly_reports}
                onCheckedChange={(checked) => handleChange('quarterly_reports', checked)}
              />
              <Label htmlFor="quarterly-reports" className="text-sm">
                Generate quarterly impact reports
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="annual-reports"
                checked={localPrefs.annual_reports}
                onCheckedChange={(checked) => handleChange('annual_reports', checked)}
              />
              <Label htmlFor="annual-reports" className="text-sm">
                Generate annual impact reports
              </Label>
            </div>
          </div>
        </div>

        {/* Report Format */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <Label className="text-base font-medium">Report Format</Label>
          </div>
          <div className="pl-6">
            <Select
              value={localPrefs.report_format}
              onValueChange={(value) => handleChange('report_format', value)}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="email">Email Summary</SelectItem>
                <SelectItem value="both">Both PDF and Email</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Choose how you'd like to receive your impact reports
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {hasChanges && (
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              onClick={handleSave}
              disabled={loading}
            >
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};