
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./common/Logo";

interface HeaderProps {
  isConnected?: boolean;
  isAdvisor?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isConnected = false, isAdvisor = false }) => {
  return (
    <header className="
      fixed top-0 left-0 w-full bg-[#1B1B32] z-50
      py-3 sm:py-4 shadow-md
    ">
      <div className="container mx-auto flex justify-center items-center px-4 relative">
        <Link to="/" className="flex items-center bg-transparent">
          <Logo size="medium" showText={false} />
        </Link>
        {isConnected && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <span className="bg-[#FFC700] text-black text-xs px-2 py-1 rounded-full font-medium">Connected</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
