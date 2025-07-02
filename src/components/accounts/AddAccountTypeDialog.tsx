
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  TrendingUp, 
  PiggyBank, 
  Home, 
  LineChart, 
  Users, 
  Coins,
  Package,
  CreditCard,
  ArrowRight
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AddAccountTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountTypeSelect: (accountType: string) => void;
}

const accountTypes = [
  { id: 'bank', label: 'Bank Account', icon: Building2, color: 'blue' },
  { id: 'investment', label: 'Investment Account', icon: TrendingUp, color: 'green' },
  { id: 'retirement', label: 'Retirement Plans', icon: PiggyBank, color: 'purple' },
  { id: 'real-estate', label: 'Real Estate', icon: Home, color: 'orange' },
  { id: 'public-stock', label: 'Public Stock', icon: LineChart, color: 'indigo' },
  { id: 'private-equity', label: 'Private Equity', icon: Users, color: 'pink' },
  { id: 'digital-assets', label: 'Digital Assets', icon: Coins, color: 'yellow' },
  { id: 'other-assets', label: 'Other Assets', icon: Package, color: 'gray' },
  { id: 'liability', label: 'Liability', icon: CreditCard, color: 'red' },
];

const getColorClasses = (color: string, isLightTheme: boolean) => {
  const colorMap = {
    blue: isLightTheme 
      ? "bg-blue-50 text-blue-600 group-hover:bg-blue-100 border-blue-200" 
      : "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 border-blue-500/20",
    green: isLightTheme 
      ? "bg-green-50 text-green-600 group-hover:bg-green-100 border-green-200" 
      : "bg-green-500/10 text-green-400 group-hover:bg-green-500/20 border-green-500/20",
    purple: isLightTheme 
      ? "bg-purple-50 text-purple-600 group-hover:bg-purple-100 border-purple-200" 
      : "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 border-purple-500/20",
    orange: isLightTheme 
      ? "bg-orange-50 text-orange-600 group-hover:bg-orange-100 border-orange-200" 
      : "bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 border-orange-500/20",
    indigo: isLightTheme 
      ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 border-indigo-200" 
      : "bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 border-indigo-500/20",
    pink: isLightTheme 
      ? "bg-pink-50 text-pink-600 group-hover:bg-pink-100 border-pink-200" 
      : "bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20 border-pink-500/20",
    yellow: isLightTheme 
      ? "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100 border-yellow-200" 
      : "bg-yellow-500/10 text-yellow-400 group-hover:bg-yellow-500/20 border-yellow-500/20",
    gray: isLightTheme 
      ? "bg-gray-50 text-gray-600 group-hover:bg-gray-100 border-gray-200" 
      : "bg-gray-500/10 text-gray-400 group-hover:bg-gray-500/20 border-gray-500/20",
    red: isLightTheme 
      ? "bg-red-50 text-red-600 group-hover:bg-red-100 border-red-200" 
      : "bg-red-500/10 text-red-400 group-hover:bg-red-500/20 border-red-500/20",
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.gray;
};

export function AddAccountTypeDialog({ 
  open, 
  onOpenChange, 
  onAccountTypeSelect 
}: AddAccountTypeDialogProps) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const isLightTheme = theme === "light";

  const handleAccountTypeClick = (accountType: string) => {
    onAccountTypeSelect(accountType);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-2xl max-h-[90vh] overflow-y-auto",
        isMobile ? "mx-4 w-[calc(100vw-2rem)]" : "w-full"
      )}>
        <DialogHeader className="text-center mb-6">
          <DialogTitle className={cn(
            "font-semibold",
            isMobile ? "text-xl" : "text-2xl",
            isLightTheme ? "text-[#222222]" : "text-white"
          )}>
            Add Account Type
          </DialogTitle>
          <p className={cn(
            "mt-2",
            isMobile ? "text-sm" : "text-base",
            isLightTheme ? "text-[#666666]" : "text-gray-400"
          )}>
            Choose the type of account you'd like to add
          </p>
        </DialogHeader>
        
        <div className={cn(
          "grid gap-3",
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}>
          {accountTypes.map((type) => {
            const Icon = type.icon;
            const colorClasses = getColorClasses(type.color, isLightTheme);
            
            return (
              <div
                key={type.id}
                onClick={() => handleAccountTypeClick(type.id)}
                className={cn(
                  "group relative overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer",
                  isMobile ? "p-4" : "p-5",
                  isLightTheme 
                    ? "bg-[#F9F7E8] border-[#DCD8C0] hover:border-[#B8B594] hover:shadow-lg hover:shadow-[#DCD8C0]/20" 
                    : "bg-[#1B1B32] border-[#2A2A40] hover:border-[#3A3A50] hover:shadow-lg hover:shadow-black/20"
                )}
              >
                {/* Gradient accent */}
                <div className={cn(
                  "absolute top-0 left-0 h-1 w-full transition-all duration-200 opacity-0 group-hover:opacity-100",
                  `bg-gradient-to-r from-${type.color}-500 to-${type.color}-600`
                )} />
                
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "flex-shrink-0 rounded-lg p-3 transition-all duration-200 border",
                    isMobile ? "p-2.5" : "p-3",
                    colorClasses
                  )}>
                    <Icon className={cn(
                      isMobile ? "h-5 w-5" : "h-6 w-6"
                    )} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={cn(
                        "font-semibold transition-colors duration-200",
                        isMobile ? "text-base" : "text-lg",
                        isLightTheme ? "text-[#222222]" : "text-white"
                      )}>
                        {type.label}
                      </h3>
                      <ArrowRight className={cn(
                        "transition-all duration-200 group-hover:translate-x-1",
                        isMobile ? "h-4 w-4" : "h-5 w-5",
                        isLightTheme ? "text-[#666666]" : "text-gray-400"
                      )} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
