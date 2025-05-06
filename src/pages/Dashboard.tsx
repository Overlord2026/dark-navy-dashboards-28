
import React from "react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your Family Office Management dashboard
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Dashboard cards and widgets would go here */}
        <div className="rounded-xl bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="font-semibold">Summary</h3>
            <p className="text-muted-foreground">Your portfolio overview</p>
          </div>
        </div>
      </div>
    </div>
  );
}
