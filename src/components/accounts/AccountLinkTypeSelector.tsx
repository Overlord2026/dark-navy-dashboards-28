
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AccountLinkTypeSelectorProps {
  onSelectPlaid: () => void;
  onSelectManual: () => void;
  onBack: () => void;
}

export function AccountLinkTypeSelector({ 
  onSelectPlaid, 
  onSelectManual,
  onBack
}: AccountLinkTypeSelectorProps) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const isLightTheme = theme === "light";

  return (
    <div className={cn(
      "mx-auto px-4 py-8 animate-fade-in",
      isMobile ? "max-w-full" : "max-w-md"
    )}>
      <h2 className={cn(
        "font-semibold mb-6 text-center",
        isMobile ? "text-lg" : "text-2xl",
        isLightTheme ? "text-[#222222]" : "text-white"
      )}>
        Add Account
      </h2>
      <p className={cn(
        "text-center mb-8",
        isMobile ? "text-sm px-2" : "text-base",
        isLightTheme ? "text-[#666666]" : "text-gray-400"
      )}>
        Please select the type of account you would like to add
      </p>
      
      <div className={cn(
        "space-y-4",
        isMobile ? "space-y-3" : "space-y-4"
      )}>
        <Button
          onClick={onSelectPlaid}
          variant="outline"
          className={cn(
            "w-full flex items-center justify-between text-left",
            isMobile ? "py-4 px-4" : "py-6 px-6",
            isLightTheme 
              ? "bg-[#F2F0E1] border-[#DCD8C0] hover:bg-[#E9E7D8]" 
              : "bg-[#121a2c] border-gray-700 hover:bg-[#1c2e4a]"
          )}
        >
          <div className={cn(
            "flex-1",
            isMobile ? "pr-4" : "pr-8"
          )}>
            <p className={cn(
              "font-medium",
              isMobile ? "text-sm" : "text-base",
              isLightTheme ? "text-[#222222]" : "text-white"
            )}>
              Link Account via Plaid
            </p>
            <p className={cn(
              "mt-1 break-words",
              isMobile ? "text-xs" : "text-sm",
              isLightTheme ? "text-[#666666]" : "text-gray-400"
            )}>
              Securely connect your bank, investment, or credit card accounts
            </p>
          </div>
          <ArrowRight className={cn(
            "flex-shrink-0 ml-2",
            isMobile ? "h-4 w-4" : "h-5 w-5",
            isLightTheme ? "text-[#666666]" : "text-gray-400"
          )} />
        </Button>
        
        <Button
          onClick={onSelectManual}
          variant="outline"
          className={cn(
            "w-full flex items-center justify-between text-left",
            isMobile ? "py-4 px-4" : "py-6 px-6",
            isLightTheme 
              ? "bg-[#F2F0E1] border-[#DCD8C0] hover:bg-[#E9E7D8]" 
              : "bg-[#121a2c] border-gray-700 hover:bg-[#1c2e4a]"
          )}
        >
          <div className={cn(
            "flex-1",
            isMobile ? "pr-4" : "pr-8"
          )}>
            <p className={cn(
              "font-medium",
              isMobile ? "text-sm" : "text-base",
              isLightTheme ? "text-[#222222]" : "text-white"
            )}>
              Add Manually-Tracked Account
            </p>
            <p className={cn(
              "mt-1 break-words",
              isMobile ? "text-xs" : "text-sm",
              isLightTheme ? "text-[#666666]" : "text-gray-400"
            )}>
              Manually enter and track account details yourself
            </p>
          </div>
          <ArrowRight className={cn(
            "flex-shrink-0 ml-2",
            isMobile ? "h-4 w-4" : "h-5 w-5",
            isLightTheme ? "text-[#666666]" : "text-gray-400"
          )} />
        </Button>
      </div>

      <div className={cn(
        "mt-8",
        isMobile ? "mt-6" : "mt-8"
      )}>
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className={cn(
            isMobile ? "text-sm" : "text-base",
            isLightTheme ? "text-[#666666] hover:text-[#222222]" : "text-gray-400 hover:text-white"
          )}
        >
          <ArrowLeft className={cn(
            "mr-2",
            isMobile ? "h-3 w-3" : "h-4 w-4"
          )} />
          Back to Accounts
        </Button>
      </div>
    </div>
  );
}
