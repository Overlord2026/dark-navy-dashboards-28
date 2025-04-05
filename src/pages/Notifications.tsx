
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const Notifications = () => {
  return (
    <ThreeColumnLayout title="Notifications">
      <div className="p-6 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-muted-foreground">You have no new notifications.</p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Notifications;
