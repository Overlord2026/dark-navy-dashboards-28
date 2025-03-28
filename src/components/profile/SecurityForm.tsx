
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LockIcon, ShieldIcon } from "lucide-react";

export function SecurityForm({ onSave }: { onSave: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleEnableTwoFactor = () => {
    setLoading(true);
    console.log("Enable 2FA clicked");
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Two-factor authentication enabled successfully");
      onSave();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">
          <ShieldIcon className="inline-block mr-2 h-6 w-6" />
          Turn On Two-Factor Authentication
        </h2>
        <p className="text-sm text-gray-400 mt-4 mb-8">
          For additional security, turn on Two-Factor Authentication. A code will be sent to your
          mobile device for you to enter each time you log in.
        </p>
        
        <div className="bg-[#1a1a3a] p-4 rounded-md border border-[#2d2d50] mb-8">
          <h3 className="flex items-center text-white text-lg font-medium mb-2">
            <LockIcon className="h-5 w-5 mr-2 text-blue-400" />
            Enhanced Security Benefits
          </h3>
          <ul className="list-disc list-inside text-gray-400 space-y-2 text-sm">
            <li>Adds an additional layer of security to your account</li>
            <li>Protects against unauthorized access even if your password is compromised</li>
            <li>Verifies your identity using your mobile device</li>
            <li>Receive immediate notifications of login attempts</li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={handleEnableTwoFactor}
          className="bg-white text-[#0F0F2D] hover:bg-white/90 py-6 px-8"
          disabled={loading}
        >
          {loading ? "Enabling..." : "Turn On Two-Factor Authentication"}
        </Button>
      </div>
    </div>
  );
}
