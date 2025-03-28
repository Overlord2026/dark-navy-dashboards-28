
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Turn On Two-Factor Authentication</h2>
        <p className="text-sm text-gray-400 mt-4 mb-8">
          For additional security, turn on Two-Factor Authentication. A code will be sent to your
          mobile device for you to enter each time you log in.
        </p>
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
