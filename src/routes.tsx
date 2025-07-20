
import { createBrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
import InviteRedeem from '@/pages/InviteRedeem';
import { AdvisorInviteRedeem } from '@/pages/AdvisorInviteRedeem';
import { RouteTransition } from '@/components/animations/RouteTransition';

const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RouteTransition>
          <HomePage />
        </RouteTransition>
      </ProtectedRoute>
    ),
  },
  {
    path: '/auth',
    element: (
      <RouteTransition>
        <AuthPage />
      </RouteTransition>
    ),
  },
  {
    path: '/invite/:token',
    element: (
      <RouteTransition>
        <InviteRedeem />
      </RouteTransition>
    ),
  },
  {
    path: '/advisor-invite/:token',
    element: (
      <RouteTransition>
        <AdvisorInviteRedeem />
      </RouteTransition>
    ),
  },
  {
    path: '/admin-portal',
    element: (
      <ProtectedRoute>
        <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
          <RouteTransition>
            <AdminLayout>
              <AdminPortalDashboard />
            </AdminLayout>
          </RouteTransition>
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin-portal/users',
    element: (
      <ProtectedRoute>
        <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
          <RouteTransition>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </RouteTransition>
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin-portal/clients',
    element: (
      <ProtectedRoute>
        <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
          <RouteTransition>
            <AdminLayout>
              <AdminClients />
            </AdminLayout>
          </RouteTransition>
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin-portal/system-health',
    element: (
      <ProtectedRoute>
        <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
          <RouteTransition>
            <AdminLayout>
              <SystemHealthPage />
            </AdminLayout>
          </RouteTransition>
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
]);

export default routes;
