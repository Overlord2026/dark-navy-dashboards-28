// @ts-nocheck
import React from 'react';
import { ActionGuard } from './ActionGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, CheckCircle } from 'lucide-react';

interface GuardedWorkbenchProps {
  children?: React.ReactNode;
}

export default function GuardedWorkbench({ children }: GuardedWorkbenchProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Guarded Actions Workbench
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            
            {/* Advisor Actions */}
            <ActionGuard actionKey="create_proposal" showReason>
              <Button variant="cta" className="w-full">
                Create Proposal
              </Button>
            </ActionGuard>

            <ActionGuard actionKey="view_client_data" showReason>
              <Button variant="outline" className="w-full">
                View Client Data
              </Button>
            </ActionGuard>

            <ActionGuard actionKey="send_communications" showReason>
              <Button variant="outline" className="w-full">
                Send Communications
              </Button>
            </ActionGuard>

            {/* Agent Actions */}
            <ActionGuard actionKey="sign_contracts" showReason>
              <Button variant="cta" className="w-full">
                Sign Contracts
              </Button>
            </ActionGuard>

            <ActionGuard actionKey="negotiate_terms" showReason>
              <Button variant="outline" className="w-full">
                Negotiate Terms
              </Button>
            </ActionGuard>

            <ActionGuard actionKey="manage_portfolio" showReason>
              <Button variant="outline" className="w-full">
                Manage Portfolio
              </Button>
            </ActionGuard>

            {/* Sponsor Actions */}
            <ActionGuard actionKey="create_offers" showReason>
              <Button variant="cta" className="w-full">
                Create Offers
              </Button>
            </ActionGuard>

            <ActionGuard actionKey="transfer_funds" showReason>
              <Button variant="cta" className="w-full">
                Transfer Funds
              </Button>
            </ActionGuard>

            <ActionGuard actionKey="publish_content" showReason>
              <Button variant="outline" className="w-full">
                Publish Content
              </Button>
            </ActionGuard>

            {/* Guardian Actions */}
            <ActionGuard actionKey="approve_minor_actions" showReason>
              <Button variant="cta" className="w-full">
                Approve Minor Actions
              </Button>
            </ActionGuard>

            <ActionGuard actionKey="view_ward_data" showReason>
              <Button variant="outline" className="w-full">
                View Ward Data
              </Button>
            </ActionGuard>

            <ActionGuard actionKey="sign_legal_docs" showReason>
              <Button variant="outline" className="w-full">
                Sign Legal Docs
              </Button>
            </ActionGuard>

          </div>

          {children}
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              How It Works
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Switch personas using the top-right switcher</li>
              <li>• Each action is gated based on your current persona</li>
              <li>• Hover over disabled buttons to see the reason</li>
              <li>• All actions generate reason receipts with audit trails</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}