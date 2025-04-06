
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationDiagnosticModule } from "@/components/diagnostics/NavigationDiagnosticModule";

const AdminDiagnostics = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">System Diagnostics</h1>
      <p className="text-muted-foreground">
        Use these tools to diagnose issues with the system
      </p>

      <NavigationDiagnosticModule />
    </div>
  );
};

export default AdminDiagnostics;
