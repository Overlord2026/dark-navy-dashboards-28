import React from 'react';

export function AccessDeniedPage() {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
      <p className="text-muted-foreground">You don't have permission to access this resource.</p>
    </div>
  );
}