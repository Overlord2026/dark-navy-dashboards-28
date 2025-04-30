
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
      fixed top-0 left-0 w-full bg-black z-50
      flex flex-col items-center py-1 sm:py-2
    ">
      <Link to="/" className="flex flex-col items-center">
        <Logo size="medium" />
      </Link>
      {isConnected && (
        <div className="absolute right-2 sm:right-4 top-2 sm:top-4">
          <span className="bg-[#FFC700] text-black text-xs px-2 py-1 rounded-full font-medium">Connected</span>
        </div>
      )}
    </header>
  );
};

export default Header;
