import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Trash2, 
  XCircle, 
  LogOut,
  Database,
  Users,
  Link as LinkIcon
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function DangerZoneSection() {
  const dangerousActions = [
    {
      id: 'revoke_access',
      title: 'Revoke All Professional Access',
      description: 'Remove access for all advisors, CPAs, and other professionals',
      icon: Users,
      severity: 'medium',
      consequences: [
        'All professionals will lose access to your data',
        'Active collaborations will be paused',
        'You can re-invite professionals later'
      ]
    },
    {
      id: 'disconnect_accounts',
      title: 'Disconnect All Integrations',
      description: 'Remove all connected bank accounts, investments, and services',
      icon: LinkIcon,
      severity: 'medium',
      consequences: [
        'All account connections will be removed',
        'Data sync will stop immediately',
        'Historical data will remain in your profile'
      ]
    },
    {
      id: 'export_delete',
      title: 'Export Data & Close Account',
      description: 'Download all your data and permanently delete your account',
      icon: Database,
      severity: 'high',
      consequences: [
        'All your data will be exported for download',
        'Your account will be permanently deleted',
        'This action cannot be undone'
      ]
    },
    {
      id: 'immediate_delete',
      title: 'Delete Account Immediately',
      description: 'Permanently delete your account and all associated data',
      icon: Trash2,
      severity: 'critical',
      consequences: [
        'All your data will be permanently deleted',
        'Professional relationships will be severed',
        'This action cannot be undone',
        'No data export will be provided'
      ]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'medium': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      case 'high': return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'critical': return 'text-red-600 border-red-200 bg-red-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'medium': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
      case 'high': return <Badge variant="secondary" className="bg-orange-100 text-orange-800">High Risk</Badge>;
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      default: return <Badge variant="outline">Low Risk</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            These actions are irreversible and will have significant impact on your account. 
            Please read all warnings carefully before proceeding.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Dangerous Actions */}
      {dangerousActions.map((action) => (
        <Card key={action.id} className={`border ${getSeverityColor(action.severity)}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <action.icon className="h-5 w-5" />
                <div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </div>
              </div>
              {getSeverityBadge(action.severity)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-destructive mb-2 block">
                  Consequences of this action:
                </Label>
                <ul className="space-y-1">
                  {action.consequences.map((consequence, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      {consequence}
                    </li>
                  ))}
                </ul>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant={action.severity === 'critical' ? 'destructive' : 'outline'}
                    className={action.severity !== 'critical' ? 'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground' : ''}
                  >
                    {action.id === 'revoke_access' && 'Revoke All Access'}
                    {action.id === 'disconnect_accounts' && 'Disconnect All Accounts'}
                    {action.id === 'export_delete' && 'Export & Delete Account'}
                    {action.id === 'immediate_delete' && 'Delete Account Now'}
                  </Button>
                </AlertDialogTrigger>
                
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Confirm {action.title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will {action.description.toLowerCase()}. This may have serious consequences for your account and data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="space-y-4">
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <Label className="text-sm font-medium text-destructive">
                        What will happen:
                      </Label>
                      <ul className="mt-2 space-y-1">
                        {action.consequences.map((consequence, index) => (
                          <li key={index} className="text-sm text-destructive flex items-start gap-2">
                            <span className="mt-1">•</span>
                            {consequence}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {(action.id === 'export_delete' || action.id === 'immediate_delete') && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="confirmText" className="text-sm">
                            Type "DELETE" to confirm:
                          </Label>
                          <Input 
                            id="confirmText" 
                            placeholder="DELETE"
                            className="font-mono"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox id="understand" />
                          <Label htmlFor="understand" className="text-sm">
                            I understand this action cannot be undone
                          </Label>
                        </div>
                        
                        {action.id === 'immediate_delete' && (
                          <div className="flex items-center space-x-2">
                            <Checkbox id="noExport" />
                            <Label htmlFor="noExport" className="text-sm">
                              I do not need to export my data
                            </Label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {action.id === 'revoke_access' && 'Revoke Access'}
                      {action.id === 'disconnect_accounts' && 'Disconnect All'}
                      {action.id === 'export_delete' && 'Export & Delete'}
                      {action.id === 'immediate_delete' && 'Delete Forever'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Recovery Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Need Help?
          </CardTitle>
          <CardDescription>
            If you're experiencing issues, consider these alternatives before deleting your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
            <Button variant="outline" className="w-full">
              Temporary Account Pause
            </Button>
            <Button variant="outline" className="w-full">
              Data Export Only
            </Button>
            <Button variant="outline" className="w-full">
              Professional Consultation
            </Button>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg mt-4">
            <p className="text-sm text-muted-foreground">
              <strong>Account Recovery:</strong> Deleted accounts cannot be recovered. 
              If you're unsure, contact our support team who can help you find the right solution 
              for your situation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}