
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useUser } from '@/context/UserContext';
import { AdminActions } from '@/components/dashboard/AdminActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function HomePage() {
  const { userProfile } = useUser();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome to Family Office Platform</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive wealth management and family office solutions
            </p>
          </div>

          {userProfile && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Current user information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {userProfile.name || 'Not set'}</p>
                    <p><strong>Email:</strong> {userProfile.email}</p>
                    <p><strong>Role:</strong> {userProfile.role}</p>
                  </div>
                </CardContent>
              </Card>

              <AdminActions />

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>• Portfolio Management</p>
                    <p>• Financial Planning</p>
                    <p>• Document Management</p>
                    <p>• Family Member Access</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
