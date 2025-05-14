
import React from 'react';
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/context/SidebarContext";
import MainSidebar from "@/components/navigation/MainSidebar";
import TopNavBar from "@/components/navigation/TopNavBar";

const DefaultLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <MainSidebar />
        <div className="flex flex-col flex-1">
          <TopNavBar />
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DefaultLayout;
