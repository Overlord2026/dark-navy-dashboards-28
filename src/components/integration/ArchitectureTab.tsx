
import React from "react";
import { Card } from "@/components/ui/card";
import { Database, Lock, Server, Shield, Users } from "lucide-react";

export function ArchitectureTab() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">System Architecture</h2>
        <p className="text-muted-foreground mt-1">
          Overview of how your system integrates with the Family Office Marketplace ecosystem
        </p>
      </div>
      
      <div className="relative">
        {/* Architecture Diagram */}
        <div className="bg-card p-8 rounded-lg border border-border mb-6">
          <div className="flex flex-col items-center">
            {/* Your System */}
            <Card className="p-4 w-full max-w-sm mb-6 bg-primary/5 border-primary/30 border-2">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Server className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Your Boutique Family Office Portal</h3>
                  <p className="text-xs text-muted-foreground">Secure client engagement platform</p>
                </div>
              </div>
            </Card>
            
            {/* Connection Lines */}
            <div className="h-6 w-px bg-border"></div>
            <div className="h-6 w-6 rounded-full border border-border flex items-center justify-center">
              <Lock className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="h-6 w-px bg-border"></div>
            
            {/* Marketplace Hub */}
            <Card className="p-4 w-full max-w-sm mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Family Office Marketplace Hub</h3>
                  <p className="text-xs text-muted-foreground">Central integration and security layer</p>
                </div>
              </div>
            </Card>
            
            {/* Branches */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
              {/* Data Store */}
              <Card className="p-3">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="bg-purple-500/10 p-2 rounded-full">
                    <Database className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Secure Data Store</h4>
                    <p className="text-xs text-muted-foreground">Encrypted client data</p>
                  </div>
                </div>
              </Card>
              
              {/* API Layer */}
              <Card className="p-3">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="bg-green-500/10 p-2 rounded-full">
                    <Server className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">API Layer</h4>
                    <p className="text-xs text-muted-foreground">Secure data exchange</p>
                  </div>
                </div>
              </Card>
              
              {/* User Management */}
              <Card className="p-3">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="bg-orange-500/10 p-2 rounded-full">
                    <Users className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Permission System</h4>
                    <p className="text-xs text-muted-foreground">Role-based access</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Architecture Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Security Architecture</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">End-to-end Encryption</p>
                  <p className="text-sm text-muted-foreground">All data transfers are encrypted using industry standard protocols</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Secure Authentication</p>
                  <p className="text-sm text-muted-foreground">OAuth 2.0 and MFA protect all integrations</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Users className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Granular Permissions</p>
                  <p className="text-sm text-muted-foreground">Control exactly what data is shared with each integration</p>
                </div>
              </li>
            </ul>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Data Flow</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="bg-blue-500/20 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold text-blue-500">1</div>
                <p className="text-sm">Client requests data from integrated project</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-500/20 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold text-blue-500">2</div>
                <p className="text-sm">Request routed through Marketplace Hub for authentication</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-500/20 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold text-blue-500">3</div>
                <p className="text-sm">Permission system verifies access rights</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-500/20 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold text-blue-500">4</div>
                <p className="text-sm">Data is encrypted and transferred securely</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-500/20 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold text-blue-500">5</div>
                <p className="text-sm">Activity logged for audit and compliance</p>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
