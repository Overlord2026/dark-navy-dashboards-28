import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, UserPlus, Users, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface SeatManagementPanelProps {
  organizationId: string;
}

export const SeatManagementPanel: React.FC<SeatManagementPanelProps> = ({
  organizationId
}) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');

  // Mock data - in real implementation, fetch from Supabase
  const seatData = {
    totalPurchased: 50,
    assigned: 32,
    active: 28,
    remaining: 18
  };

  const branches = [
    { id: '1', name: 'Main Office', allocated: 25, used: 18 },
    { id: '2', name: 'Downtown Branch', allocated: 15, used: 10 },
    { id: '3', name: 'Uptown Branch', allocated: 10, used: 4 }
  ];

  const seatAssignments = [
    { id: '1', user: 'John Doe', email: 'john@example.com', branch: 'Main Office', role: 'Advisor', status: 'Active', assignedDate: '2024-01-15' },
    { id: '2', user: 'Jane Smith', email: 'jane@example.com', branch: 'Downtown', role: 'Client Manager', status: 'Active', assignedDate: '2024-01-20' },
    { id: '3', user: 'Mike Johnson', email: 'mike@example.com', branch: 'Main Office', role: 'Compliance', status: 'Inactive', assignedDate: '2024-02-01' }
  ];

  const handleAssignSeat = () => {
    toast.success('Seat assigned successfully');
    setIsAssignDialogOpen(false);
  };

  const handleBulkImport = () => {
    toast.success('Bulk import initiated');
    setIsBulkImportOpen(false);
  };

  const handleTransferSeat = (seatId: string) => {
    toast.success('Seat transfer initiated');
  };

  return (
    <div className="space-y-6">
      {/* Seat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Purchased</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seatData.totalPurchased}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seatData.assigned}</div>
            <Progress value={(seatData.assigned / seatData.totalPurchased) * 100} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{seatData.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{seatData.remaining}</div>
          </CardContent>
        </Card>
      </div>

      {/* Branch Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Branch Seat Allocation</CardTitle>
          <CardDescription>Seat distribution across branches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {branches.map((branch) => (
              <div key={branch.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{branch.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {branch.used}/{branch.allocated} seats used
                  </p>
                </div>
                <div className="w-32">
                  <Progress value={(branch.used / branch.allocated) * 100} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Assign Seat
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign New Seat</DialogTitle>
              <DialogDescription>
                Assign a seat to a user or advisor
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="user@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advisor">Advisor</SelectItem>
                    <SelectItem value="client_manager">Client Manager</SelectItem>
                    <SelectItem value="compliance">Compliance Officer</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAssignSeat} className="w-full">
                Assign Seat
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Import
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bulk Import Users</DialogTitle>
              <DialogDescription>
                Upload a CSV file to assign multiple seats at once
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drop your CSV file here or click to browse
                </p>
                <Button variant="outline" className="mt-2">
                  Choose File
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>CSV should include columns: email, name, branch, role</p>
                <Button variant="link" className="p-0 h-auto">
                  Download sample template
                </Button>
              </div>
              <Button onClick={handleBulkImport} className="w-full">
                Import Users
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export List
        </Button>
      </div>

      {/* Seat Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Seat Assignments</CardTitle>
          <CardDescription>Manage individual seat assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seatAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{assignment.user}</p>
                      <p className="text-sm text-muted-foreground">{assignment.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{assignment.branch}</TableCell>
                  <TableCell>{assignment.role}</TableCell>
                  <TableCell>
                    <Badge variant={assignment.status === 'Active' ? 'default' : 'secondary'}>
                      {assignment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{assignment.assignedDate}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTransferSeat(assignment.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Transfer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};