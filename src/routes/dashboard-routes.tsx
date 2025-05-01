// src/routes/dashboard-routes.tsx
import React from 'react'
import { RouteObject } from 'react-router-dom'
import Dashboard from '@/pages/Dashboard'
import SystemHealthDashboard from '@/pages/SystemHealthDashboard'
import FullSystemDiagnostics from '@/pages/FullSystemDiagnostics'

const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/dashboard/health',
    element: <SystemHealthDashboard />,
  },
  {
    path: '/dashboard/diagnostics',
    element: <FullSystemDiagnostics />,
  },
]

export default dashboardRoutes

