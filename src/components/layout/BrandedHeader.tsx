
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const BrandedHeader: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-[#0F1C35] py-4 px-6 border-b border-[#2A3E5C]">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">FamilyOffice</span>
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:bg-[#1B2A47]">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="border-[#2A3E5C] text-white hover:bg-[#1B2A47]"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
