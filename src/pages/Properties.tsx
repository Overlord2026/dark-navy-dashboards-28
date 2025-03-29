
import React from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { PropertyManager } from "@/components/properties/PropertyManager";

const Properties = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Properties Management" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <PropertyManager />
        </main>
      </div>
    </div>
  );
};

export default Properties;
