
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeaderComponent: React.FC = () => {
  return (
    <header className="w-full flex justify-center items-center py-4 border-b border-[#DCD8C0] bg-[#F9F7E8] sticky top-0 z-50">
      <div className="container flex justify-between items-center max-w-7xl px-4">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
            alt="Boutique Family Office Logo" 
            className="h-16 w-auto"
          />
        </div>
        <div className="hidden md:flex gap-8 text-[#222222]">
          <Link to="/services" className="hover:text-primary font-medium">Services</Link>
          <Link to="/about" className="hover:text-primary font-medium">About Us</Link>
          <Link to="/contact" className="hover:text-primary font-medium">Contact</Link>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link to="/advisor/login">Advisor Login</Link>
          </Button>
          <Button className="bg-black text-white hover:bg-black/80" asChild>
            <Link to="/client-portal">Client Portal</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
