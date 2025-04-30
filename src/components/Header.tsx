
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  isConnected?: boolean;
  isAdvisor?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isConnected = false, isAdvisor = false }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  
  return (
    <header className="
      fixed top-0 left-0 w-full bg-black z-50
      flex flex-col items-center py-1 sm:py-2
    ">
      <Link to="/" className="flex flex-col items-center">
        <div className="w-8 sm:w-10 h-8 sm:h-10 mb-1">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15C45 30 30 45 25 65C28 70 40 75 50 75C60 75 72 70 75 65C70 45 55 30 50 15Z" fill="#D4AF37"/>
            <path d="M50 20C46 33 35 46 30 62C32.5 66 42 70 50 70C58 70 67.5 66 70 62C65 46 54 33 50 20Z" fill="#D4AF37"/>
            <path d="M50 80V85M45 77.5C45 77.5 50 82.5 55 77.5M38 72.5C38 72.5 50 82.5 62 72.5" stroke="#D4AF37" strokeWidth="3"/>
          </svg>
        </div>
        <div className="text-center px-4">
          <p className="text-lg sm:text-xl font-semibold text-[#D4AF37]">Organize & Maximize</p>
          <p className="text-xs sm:text-sm text-gray-300 uppercase tracking-wide">
            Your personalized path to lasting prosperity
          </p>
        </div>
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
