import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Employee, Organization, OrganizationRole } from '@/types/operations';

export const useOrganization = () => {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrganizationData = async () => {
      try {
        // First, get the current user's employee record
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (employeeError) {
          if (employeeError.code === 'PGRST116') {
            // No employee record found - user might need to be added to an organization
            setError('No organization found. Please contact your administrator.');
          } else {
            setError(employeeError.message);
          }
          setLoading(false);
          return;
        }

        setCurrentEmployee(employeeData as Employee);

        // Then get the organization data
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', employeeData.organization_id)
          .single();

        if (orgError) {
          setError(orgError.message);
        } else {
          // Map the database response to our Organization type
          const org: Organization = {
            id: orgData.id,
            name: orgData.name,
            persona: orgData.organization_type as any, // Map organization_type to persona
            logo_url: orgData.logo_url,
            brand_colors: undefined, // Not available in database
            retention_years: 7, // Default value
            created_at: orgData.created_at,
            updated_at: orgData.updated_at
          };
          setOrganization(org);
        }
      } catch (err) {
        setError('Failed to load organization data');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, [user]);

  const hasRole = (roles: string[]): boolean => {
    return currentEmployee ? roles.includes(currentEmployee.role) : false;
  };

  const isManager = (): boolean => {
    return hasRole(['owner', 'manager']);
  };

  const canManageEmployees = (): boolean => {
    return hasRole(['owner', 'manager']);
  };

  const canManageCourses = (): boolean => {
    return hasRole(['owner', 'manager', 'trainer']);
  };

  const canViewReports = (): boolean => {
    return hasRole(['owner', 'manager', 'compliance_officer']);
  };

  return {
    organization,
    currentEmployee,
    loading,
    error,
    hasRole,
    isManager,
    canManageEmployees,
    canManageCourses,
    canViewReports,
  };
};