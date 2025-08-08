import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, Users, CheckCircle2, Video, FileSignature } from 'lucide-react';

interface EstateHeroProps {
  onStartPlan: () => void;
  onCreateForClient: () => void;
  userRole?: string;
}

export const EstateHero: React.FC<EstateHeroProps> = ({
  onStartPlan,
  onCreateForClient,
  userRole
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <Badge variant="secondary" className="text-sm font-medium">
            Attorney-Reviewed Estate Planning
          </Badge>
          <h1 className="text-4xl font-bold text-foreground">
            Your estate plan, attorney-reviewed, fully digital
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete estate planning with digital notary and witness coordination. 
            Everything handled for you, stored in your Secure Family Vault.
          </p>
        </div>

        {/* Safety Bar */}
        <div className="flex items-center justify-center gap-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Bank-level encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Full audit trail</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Secure Family Vault storage</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={onStartPlan} className="text-lg px-8 py-3">
            Start My Estate Plan
          </Button>
          {(userRole === 'advisor' || userRole === 'attorney') && (
            <Button variant="outline" size="lg" onClick={onCreateForClient} className="text-lg px-8 py-3">
              Create for a Client
            </Button>
          )}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <FileSignature className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Digital Execution</h3>
            <p className="text-muted-foreground">
              Complete signing, notarization, and witness coordination entirely online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Remote Notarization</h3>
            <p className="text-muted-foreground">
              RON/RIN compliant digital notary sessions with video recording
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Witness Coordination</h3>
            <p className="text-muted-foreground">
              Automated witness invites with ID verification and scheduling
            </p>
          </CardContent>
        </Card>
      </div>

      {/* What's Included */}
      <Card>
        <CardContent className="p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">What's Included</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Core Documents</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Last Will and Testament</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Durable Power of Attorney</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Advance Health Care Directive</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Revocable Trust (Premium)</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Professional Services</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Attorney review and approval</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Digital notary coordination</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Witness verification & scheduling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>State filing (where applicable)</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};