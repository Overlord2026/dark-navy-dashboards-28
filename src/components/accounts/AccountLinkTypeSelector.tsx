
import { ArrowLeft, ArrowRight, Building2, Edit3 } from "lucide-react";
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
      "mx-auto px-6 py-8 animate-fade-in",
      isMobile ? "max-w-full" : "max-w-lg"
    )}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={cn(
          "font-semibold mb-3",
          isMobile ? "text-xl" : "text-2xl",
          isLightTheme ? "text-[#222222]" : "text-white"
        )}>
          Connect Your Account
        </h2>
        <p className={cn(
          "leading-relaxed",
          isMobile ? "text-sm px-2" : "text-base",
          isLightTheme ? "text-[#666666]" : "text-gray-400"
        )}>
          Choose how you'd like to add your bank account
        </p>
      </div>
      
      {/* Options */}
      <div className={cn(
        "space-y-4 mb-8",
        isMobile ? "space-y-3" : "space-y-4"
      )}>
        {/* Plaid Option */}
        <div
          onClick={onSelectPlaid}
          className={cn(
            "group relative overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer",
            isMobile ? "p-4" : "p-6",
            isLightTheme 
              ? "bg-[#F9F7E8] border-[#DCD8C0] hover:border-[#B8B594] hover:shadow-lg hover:shadow-[#DCD8C0]/20" 
              : "bg-[#1B1B32] border-[#2A2A40] hover:border-[#3A3A50] hover:shadow-lg hover:shadow-black/20"
          )}
        >
          {/* Gradient accent */}
          <div className={cn(
            "absolute top-0 left-0 h-1 w-full transition-all duration-200",
            isLightTheme 
              ? "bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-100" 
              : "bg-gradient-to-r from-blue-400 to-green-400 opacity-0 group-hover:opacity-100"
          )} />
          
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={cn(
              "flex-shrink-0 rounded-lg p-3 transition-colors duration-200",
              isMobile ? "p-2.5" : "p-3",
              isLightTheme 
                ? "bg-blue-50 text-blue-600 group-hover:bg-blue-100" 
                : "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20"
            )}>
              <Building2 className={cn(
                isMobile ? "h-5 w-5" : "h-6 w-6"
              )} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className={cn(
                  "font-semibold transition-colors duration-200",
                  isMobile ? "text-base" : "text-lg",
                  isLightTheme ? "text-[#222222] group-hover:text-blue-600" : "text-white group-hover:text-blue-400"
                )}>
                  Link via Plaid
                </h3>
                <ArrowRight className={cn(
                  "transition-all duration-200 group-hover:translate-x-1",
                  isMobile ? "h-4 w-4" : "h-5 w-5",
                  isLightTheme ? "text-[#666666] group-hover:text-blue-600" : "text-gray-400 group-hover:text-blue-400"
                )} />
              </div>
              <p className={cn(
                "leading-relaxed",
                isMobile ? "text-xs" : "text-sm",
                isLightTheme ? "text-[#666666]" : "text-gray-400"
              )}>
                Securely connect your bank, investment, or credit card accounts in seconds
              </p>
              <div className={cn(
                "flex items-center gap-2 mt-3",
                isMobile ? "mt-2" : "mt-3"
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isLightTheme ? "bg-green-500" : "bg-green-400"
                )} />
                <span className={cn(
                  "font-medium",
                  isMobile ? "text-xs" : "text-sm",
                  isLightTheme ? "text-green-600" : "text-green-400"
                )}>
                  Bank-level security
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Manual Option */}
        <div
          onClick={onSelectManual}
          className={cn(
            "group relative overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer",
            isMobile ? "p-4" : "p-6",
            isLightTheme 
              ? "bg-[#F9F7E8] border-[#DCD8C0] hover:border-[#B8B594] hover:shadow-lg hover:shadow-[#DCD8C0]/20" 
              : "bg-[#1B1B32] border-[#2A2A40] hover:border-[#3A3A50] hover:shadow-lg hover:shadow-black/20"
          )}
        >
          {/* Gradient accent */}
          <div className={cn(
            "absolute top-0 left-0 h-1 w-full transition-all duration-200",
            isLightTheme 
              ? "bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100" 
              : "bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100"
          )} />
          
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={cn(
              "flex-shrink-0 rounded-lg p-3 transition-colors duration-200",
              isMobile ? "p-2.5" : "p-3",
              isLightTheme 
                ? "bg-purple-50 text-purple-600 group-hover:bg-purple-100" 
                : "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20"
            )}>
              <Edit3 className={cn(
                isMobile ? "h-5 w-5" : "h-6 w-6"
              )} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className={cn(
                  "font-semibold transition-colors duration-200",
                  isMobile ? "text-base" : "text-lg",
                  isLightTheme ? "text-[#222222] group-hover:text-purple-600" : "text-white group-hover:text-purple-400"
                )}>
                  Add Manually
                </h3>
                <ArrowRight className={cn(
                  "transition-all duration-200 group-hover:translate-x-1",
                  isMobile ? "h-4 w-4" : "h-5 w-5",
                  isLightTheme ? "text-[#666666] group-hover:text-purple-600" : "text-gray-400 group-hover:text-purple-400"
                )} />
              </div>
              <p className={cn(
                "leading-relaxed",
                isMobile ? "text-xs" : "text-sm",
                isLightTheme ? "text-[#666666]" : "text-gray-400"
              )}>
                Enter account details yourself and track balances manually
              </p>
              <div className={cn(
                "flex items-center gap-2 mt-3",
                isMobile ? "mt-2" : "mt-3"
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isLightTheme ? "bg-orange-500" : "bg-orange-400"
                )} />
                <span className={cn(
                  "font-medium",
                  isMobile ? "text-xs" : "text-sm",
                  isLightTheme ? "text-orange-600" : "text-orange-400"
                )}>
                  Full control
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className={cn(
            "group transition-all duration-200",
            isMobile ? "text-sm px-4 py-2" : "text-base px-6 py-2",
            isLightTheme 
              ? "text-[#666666] hover:text-[#222222] hover:bg-[#F2F0E1]" 
              : "text-gray-400 hover:text-white hover:bg-[#2A2A40]"
          )}
        >
          <ArrowLeft className={cn(
            "mr-2 transition-transform duration-200 group-hover:-translate-x-1",
            isMobile ? "h-3 w-3" : "h-4 w-4"
          )} />
          Back to Account Types
        </Button>
      </div>
    </div>
  );
}
