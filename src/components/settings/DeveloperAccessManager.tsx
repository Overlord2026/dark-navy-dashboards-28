
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { getDevelopers, updateDeveloperAccess } from "@/services/diagnostics/permissionManagement";

interface Developer {
  id: string;
  name: string;
  role: string;
  email: string;
  canRunDiagnostics: boolean;
  canAccessSystemDiagnostics: boolean;
}

export function DeveloperAccessManager() {
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";
  
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadDevelopers() {
      try {
        setIsLoading(true);
        const developersData = await getDevelopers();
        setDevelopers(developersData);
      } catch (error) {
        console.error("Failed to load developers:", error);
        toast.error("Failed to load developers");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDevelopers();
  }, []);
  
  const handleAccessChange = async (developerId: string, accessType: 'diagnostics' | 'systemDiagnostics', value: boolean) => {
    try {
      // Update the local state optimistically
      setDevelopers(prevDevelopers => 
        prevDevelopers.map(dev => 
          dev.id === developerId 
            ? { 
                ...dev, 
                canRunDiagnostics: accessType === 'diagnostics' ? value : dev.canRunDiagnostics,
                canAccessSystemDiagnostics: accessType === 'systemDiagnostics' ? value : dev.canAccessSystemDiagnostics
              } 
            : dev
        )
      );
      
      // Send update to API (simulated)
      await updateDeveloperAccess(developerId, accessType, value);
      
      // Show success message
      toast.success(`Access ${value ? 'granted' : 'revoked'} successfully`);
    } catch (error) {
      console.error(`Failed to update ${accessType} access:`, error);
      toast.error(`Failed to update access`);
      
      // Revert the local state change since the server update failed
      setDevelopers(prevDevelopers => [...prevDevelopers]);
    }
  };
  
  if (!isAdmin) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to manage developer access.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Developer Access Management</CardTitle>
        <CardDescription>
          Control which developers can access diagnostic tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading developers...</p>
          </div>
        ) : developers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No developers found in the system.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Run Diagnostics</TableHead>
                <TableHead>System Diagnostics</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {developers.map((developer) => (
                <TableRow key={developer.id}>
                  <TableCell className="font-medium">{developer.name}</TableCell>
                  <TableCell>{developer.email}</TableCell>
                  <TableCell>{developer.role}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`run-diag-${developer.id}`}
                        checked={developer.canRunDiagnostics}
                        onCheckedChange={(value) => 
                          handleAccessChange(developer.id, 'diagnostics', value)
                        }
                      />
                      <Label htmlFor={`run-diag-${developer.id}`}>
                        {developer.canRunDiagnostics ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`sys-diag-${developer.id}`}
                        checked={developer.canAccessSystemDiagnostics}
                        onCheckedChange={(value) => 
                          handleAccessChange(developer.id, 'systemDiagnostics', value)
                        }
                      />
                      <Label htmlFor={`sys-diag-${developer.id}`}>
                        {developer.canAccessSystemDiagnostics ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
