
import React from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { PropertyManager } from "@/components/properties/PropertyManager";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  return (
    <div className={`flex h-screen ${isLightTheme ? 'bg-[#F9F7E8] text-[#222222]' : 'bg-[#12121C] text-white'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <PropertyManager initialFilter={filter} />
        </main>
      </div>
    </div>
  );
};

export default Properties;
