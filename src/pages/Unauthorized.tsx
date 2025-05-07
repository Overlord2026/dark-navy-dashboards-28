
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F7E8]">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <Shield className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-[#222222]">Access Denied</h1>
        <p className="mt-2 text-lg text-gray-600">
          You don't have permission to access this page. This area requires additional privileges.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
