
import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { AdminPortal } from '@/pages/AdminPortal';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { AuthPage } from '@/pages/AuthPage';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminPortalDashboard } from '@/components/admin/AdminPortalDashboard';
import { SystemHealthPage } from '@/pages/admin/SystemHealthPage';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminClients } from '@/pages/admin/AdminClients';

const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/admin-portal',
    element: (
      <ProtectedRoute>
        <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
          <AdminLayout>
            <AdminPortalDashboard />
          </AdminLayout>
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin-portal/users',
    element: (
      <ProtectedRoute>
        <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
          <AdminLayout>
            <AdminUsers />
          </AdminLayout>
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin-portal/clients',
    element: (
      <ProtectedRoute>
        <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
          <AdminLayout>
            <AdminClients />
          </AdminLayout>
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin-portal/system-health',
    element: (
      <ProtectedRoute>
        <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
          <AdminLayout>
            <SystemHealthPage />
          </AdminLayout>
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
]);

export default routes;
