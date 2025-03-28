
import { Button } from "@/components/ui/button";

export function SecurityForm({ onSave }: { onSave: () => void }) {
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
          onClick={() => {
            console.log("Enable 2FA clicked");
            // This would normally integrate with a 2FA service
            onSave();
          }}
          className="bg-white text-[#0F0F2D] hover:bg-white/90 py-6 px-8"
        >
          Turn On Two-Factor Authentication
        </Button>
      </div>
    </div>
  );
}
