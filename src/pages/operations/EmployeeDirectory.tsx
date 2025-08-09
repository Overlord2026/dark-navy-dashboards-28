import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Users,
  Filter
} from 'lucide-react';
import { useOrganization } from '@/hooks/useOrganization';
import { Employee } from '@/types/operations';
import { supabase } from '@/integrations/supabase/client';

export default function EmployeeDirectory() {
  const { canManageEmployees } = useOrganization();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'active')
        .order('last_name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.job_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || employee.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'default';
      case 'manager':
        return 'secondary';
      case 'trainer':
        return 'outline';
      case 'compliance_officer':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const roles = ['all', 'owner', 'manager', 'employee', 'trainer', 'compliance_officer'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
          <p className="text-muted-foreground">
            Manage your organization's team members and their information.
          </p>
        </div>
        {canManageEmployees() && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="border border-input bg-background px-3 py-2 text-sm rounded-md"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role === 'all' ? 'All Roles' : role.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={employee.profile_image_url} />
                  <AvatarFallback>
                    {getInitials(employee.first_name, employee.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {employee.first_name} {employee.last_name}
                  </CardTitle>
                  <CardDescription>{employee.job_title}</CardDescription>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={getRoleColor(employee.role)}>
                  {employee.role.replace('_', ' ').toUpperCase()}
                </Badge>
                {employee.department && (
                  <span className="text-sm text-muted-foreground">
                    {employee.department}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{employee.email}</span>
              </div>
              {employee.phone && (
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Started {new Date(employee.start_date).toLocaleDateString()}</span>
              </div>
              {employee.current_projects.length > 0 && (
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.current_projects.length} active projects</span>
                </div>
              )}
              {canManageEmployees() && (
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No employees found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterRole !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Your organization directory is empty.'}
            </p>
            {canManageEmployees() && !searchTerm && filterRole === 'all' && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First Employee
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}