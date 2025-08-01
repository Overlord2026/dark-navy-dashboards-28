import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  DollarSign, 
  Clock,
  Mail,
  Phone,
  Calendar,
  Settings,
  UserPlus,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type StaffRole = 'tax_only' | 'bookkeeping' | 'planning' | 'admin' | 'advisor';

interface StaffPermissions {
  can_view_clients: boolean;
  can_edit_clients: boolean;
  can_assign_clients: boolean;
  can_view_documents: boolean;
  can_upload_documents: boolean;
  can_view_organizers: boolean;
  can_edit_organizers: boolean;
  can_send_communications: boolean;
  can_manage_staff: boolean;
  can_view_analytics: boolean;
  can_manage_settings: boolean;
}

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: StaffRole;
  permissions: StaffPermissions;
  isActive: boolean;
  hiredDate: string;
  hourlyRate?: number;
  assignedClients: number;
  hoursThisWeek: number;
  notes?: string;
}

const defaultPermissions: Record<StaffRole, StaffPermissions> = {
  tax_only: {
    can_view_clients: true,
    can_edit_clients: false,
    can_assign_clients: false,
    can_view_documents: true,
    can_upload_documents: false,
    can_view_organizers: true,
    can_edit_organizers: false,
    can_send_communications: false,
    can_manage_staff: false,
    can_view_analytics: false,
    can_manage_settings: false
  },
  bookkeeping: {
    can_view_clients: true,
    can_edit_clients: true,
    can_assign_clients: false,
    can_view_documents: true,
    can_upload_documents: true,
    can_view_organizers: true,
    can_edit_organizers: true,
    can_send_communications: true,
    can_manage_staff: false,
    can_view_analytics: false,
    can_manage_settings: false
  },
  planning: {
    can_view_clients: true,
    can_edit_clients: true,
    can_assign_clients: false,
    can_view_documents: true,
    can_upload_documents: true,
    can_view_organizers: true,
    can_edit_organizers: true,
    can_send_communications: true,
    can_manage_staff: false,
    can_view_analytics: true,
    can_manage_settings: false
  },
  admin: {
    can_view_clients: true,
    can_edit_clients: true,
    can_assign_clients: true,
    can_view_documents: true,
    can_upload_documents: true,
    can_view_organizers: true,
    can_edit_organizers: true,
    can_send_communications: true,
    can_manage_staff: true,
    can_view_analytics: true,
    can_manage_settings: true
  },
  advisor: {
    can_view_clients: true,
    can_edit_clients: true,
    can_assign_clients: true,
    can_view_documents: true,
    can_upload_documents: true,
    can_view_organizers: true,
    can_edit_organizers: true,
    can_send_communications: true,
    can_manage_staff: false,
    can_view_analytics: true,
    can_manage_settings: false
  }
};

const mockStaff: StaffMember[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@smithcpas.com',
    role: 'admin',
    permissions: defaultPermissions.admin,
    isActive: true,
    hiredDate: '2022-01-15',
    hourlyRate: 45,
    assignedClients: 25,
    hoursThisWeek: 38,
    notes: 'Senior staff member, handles complex cases'
  },
  {
    id: '2',
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'mike@smithcpas.com',
    role: 'tax_only',
    permissions: defaultPermissions.tax_only,
    isActive: true,
    hiredDate: '2023-03-01',
    hourlyRate: 25,
    assignedClients: 15,
    hoursThisWeek: 40,
    notes: 'Tax preparation specialist'
  },
  {
    id: '3',
    firstName: 'Lisa',
    lastName: 'Rodriguez',
    email: 'lisa@smithcpas.com',
    role: 'bookkeeping',
    permissions: defaultPermissions.bookkeeping,
    isActive: true,
    hiredDate: '2023-06-15',
    hourlyRate: 35,
    assignedClients: 20,
    hoursThisWeek: 42,
    notes: 'QuickBooks certified'
  }
];

export function StaffRoleManagement() {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'tax_only',
    permissions: defaultPermissions.tax_only,
    isActive: true,
    hiredDate: new Date().toISOString().split('T')[0],
    hourlyRate: 25
  });
  const { toast } = useToast();

  const getRoleBadgeColor = (role: StaffRole) => {
    const colors = {
      tax_only: 'bg-blue-500',
      bookkeeping: 'bg-green-500',
      planning: 'bg-purple-500',
      admin: 'bg-red-500',
      advisor: 'bg-yellow-500'
    };
    return colors[role];
  };

  const getRoleDisplayName = (role: StaffRole) => {
    const names = {
      tax_only: 'Tax Only',
      bookkeeping: 'Bookkeeping',
      planning: 'Planning',
      admin: 'Admin',
      advisor: 'Advisor'
    };
    return names[role];
  };

  const handleRoleChange = (role: StaffRole) => {
    if (isEditing && selectedStaff) {
      setSelectedStaff({
        ...selectedStaff,
        role,
        permissions: defaultPermissions[role]
      });
    } else if (isAddingNew) {
      setNewStaff({
        ...newStaff,
        role,
        permissions: defaultPermissions[role]
      });
    }
  };

  const handlePermissionChange = (permission: keyof StaffPermissions, value: boolean) => {
    if (isEditing && selectedStaff) {
      setSelectedStaff({
        ...selectedStaff,
        permissions: {
          ...selectedStaff.permissions,
          [permission]: value
        }
      });
    } else if (isAddingNew) {
      setNewStaff({
        ...newStaff,
        permissions: {
          ...newStaff.permissions!,
          [permission]: value
        }
      });
    }
  };

  const saveStaff = () => {
    if (isEditing && selectedStaff) {
      setStaff(prev => prev.map(s => s.id === selectedStaff.id ? selectedStaff : s));
      toast({
        title: "Staff member updated",
        description: `${selectedStaff.firstName} ${selectedStaff.lastName} has been updated`,
      });
      setIsEditing(false);
      setSelectedStaff(null);
    } else if (isAddingNew && newStaff.firstName && newStaff.lastName && newStaff.email) {
      const staffMember: StaffMember = {
        id: Date.now().toString(),
        firstName: newStaff.firstName,
        lastName: newStaff.lastName,
        email: newStaff.email,
        role: newStaff.role as StaffRole,
        permissions: newStaff.permissions!,
        isActive: true,
        hiredDate: newStaff.hiredDate!,
        hourlyRate: newStaff.hourlyRate,
        assignedClients: 0,
        hoursThisWeek: 0,
        notes: newStaff.notes
      };
      setStaff(prev => [...prev, staffMember]);
      toast({
        title: "Staff member added",
        description: `${staffMember.firstName} ${staffMember.lastName} has been added to your team`,
      });
      setIsAddingNew(false);
      setNewStaff({
        firstName: '',
        lastName: '',
        email: '',
        role: 'tax_only',
        permissions: defaultPermissions.tax_only,
        isActive: true,
        hiredDate: new Date().toISOString().split('T')[0],
        hourlyRate: 25
      });
    }
  };

  const removeStaff = (staffId: string) => {
    const member = staff.find(s => s.id === staffId);
    if (member) {
      setStaff(prev => prev.filter(s => s.id !== staffId));
      toast({
        title: "Staff member removed",
        description: `${member.firstName} ${member.lastName} has been removed from your team`,
      });
    }
  };

  const getPermissionLabel = (permission: keyof StaffPermissions) => {
    const labels = {
      can_view_clients: 'View Clients',
      can_edit_clients: 'Edit Clients',
      can_assign_clients: 'Assign Clients',
      can_view_documents: 'View Documents',
      can_upload_documents: 'Upload Documents',
      can_view_organizers: 'View Organizers',
      can_edit_organizers: 'Edit Organizers',
      can_send_communications: 'Send Communications',
      can_manage_staff: 'Manage Staff',
      can_view_analytics: 'View Analytics',
      can_manage_settings: 'Manage Settings'
    };
    return labels[permission];
  };

  const currentStaff = isEditing ? selectedStaff : (isAddingNew ? newStaff : null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Staff & Role Management
          </h3>
          <p className="text-muted-foreground">
            Manage your team members and their permissions
          </p>
        </div>
        <Button onClick={() => setIsAddingNew(true)} className="bg-green-600 hover:bg-green-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-600">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.filter(s => s.isActive).length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-600">Active This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.filter(s => s.hoursThisWeek > 0).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-600">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.reduce((sum, s) => sum + s.hoursThisWeek, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-yellow-600">Client Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.reduce((sum, s) => sum + s.assignedClients, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff List */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staff.map((member) => (
                <div key={member.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">
                          {member.firstName} {member.lastName}
                        </h4>
                        <Badge className={`${getRoleBadgeColor(member.role)} text-white`}>
                          {getRoleDisplayName(member.role)}
                        </Badge>
                        {!member.isActive && (
                          <Badge variant="outline" className="text-gray-500">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {member.assignedClients} clients
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {member.hoursThisWeek}h this week
                        </div>
                        {member.hourlyRate && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ${member.hourlyRate}/hr
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedStaff(member);
                          setIsEditing(true);
                          setIsAddingNew(false);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeStaff(member.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Staff Editor */}
        {(isEditing || isAddingNew) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        value={currentStaff?.firstName || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (isEditing && selectedStaff) {
                            setSelectedStaff({ ...selectedStaff, firstName: value });
                          } else {
                            setNewStaff({ ...newStaff, firstName: value });
                          }
                        }}
                        placeholder="First name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        value={currentStaff?.lastName || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (isEditing && selectedStaff) {
                            setSelectedStaff({ ...selectedStaff, lastName: value });
                          } else {
                            setNewStaff({ ...newStaff, lastName: value });
                          }
                        }}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={currentStaff?.email || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (isEditing && selectedStaff) {
                          setSelectedStaff({ ...selectedStaff, email: value });
                        } else {
                          setNewStaff({ ...newStaff, email: value });
                        }
                      }}
                      placeholder="email@company.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={currentStaff?.role || 'tax_only'}
                      onValueChange={(value) => handleRoleChange(value as StaffRole)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tax_only">Tax Only</SelectItem>
                        <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="advisor">Advisor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                      <Input
                        id="hourly-rate"
                        type="number"
                        value={currentStaff?.hourlyRate || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          if (isEditing && selectedStaff) {
                            setSelectedStaff({ ...selectedStaff, hourlyRate: value });
                          } else {
                            setNewStaff({ ...newStaff, hourlyRate: value });
                          }
                        }}
                        placeholder="25.00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="hired-date">Hired Date</Label>
                      <Input
                        id="hired-date"
                        type="date"
                        value={currentStaff?.hiredDate || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (isEditing && selectedStaff) {
                            setSelectedStaff({ ...selectedStaff, hiredDate: value });
                          } else {
                            setNewStaff({ ...newStaff, hiredDate: value });
                          }
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="permissions" className="space-y-4">
                  <div className="space-y-3">
                    {Object.entries(currentStaff?.permissions || {}).map(([permission, value]) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission}
                          checked={value}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission as keyof StaffPermissions, checked as boolean)
                          }
                        />
                        <Label htmlFor={permission} className="text-sm">
                          {getPermissionLabel(permission as keyof StaffPermissions)}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Permission Note</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Permissions are automatically set based on the selected role, but can be customized as needed.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex gap-2 mt-6">
                <Button onClick={saveStaff} className="flex-1">
                  {isEditing ? 'Update Staff Member' : 'Add Staff Member'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setIsAddingNew(false);
                    setSelectedStaff(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}