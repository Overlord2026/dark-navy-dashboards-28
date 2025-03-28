
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useTheme } from "@/context/ThemeContext";
import { Card } from "@/components/ui/card";
import { WalletIcon, DollarSignIcon, LineChartIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from "lucide-react";

const CashManagement = () => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  return (
    <ThreeColumnLayout activeMainItem="cash-management" title="Cash Management">
      <div className="animate-fade-in max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Cash Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className={`p-4 ${isLightTheme ? "bg-[#F2F0E1] border-[#DCD8C0]" : "bg-[#121a2c] border-gray-800"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isLightTheme ? "text-[#555555]" : "text-gray-400"}`}>Current Balance</p>
                <p className={`text-2xl font-semibold ${isLightTheme ? "text-[#222222]" : "text-white"}`}>$128,450.32</p>
              </div>
              <div className={`p-3 rounded-full ${isLightTheme ? "bg-[#E9E7D8]" : "bg-gray-800"}`}>
                <WalletIcon className={`h-5 w-5 ${isLightTheme ? "text-[#222222]" : "text-white"}`} />
              </div>
            </div>
          </Card>
          
          <Card className={`p-4 ${isLightTheme ? "bg-[#F2F0E1] border-[#DCD8C0]" : "bg-[#121a2c] border-gray-800"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isLightTheme ? "text-[#555555]" : "text-gray-400"}`}>Cash Flow (30d)</p>
                <p className={`text-2xl font-semibold ${isLightTheme ? "text-[#222222]" : "text-white"}`}>+$12,850.00</p>
              </div>
              <div className={`p-3 rounded-full ${isLightTheme ? "bg-[#E9E7D8]" : "bg-gray-800"}`}>
                <LineChartIcon className={`h-5 w-5 ${isLightTheme ? "text-[#222222]" : "text-white"}`} />
              </div>
            </div>
          </Card>
          
          <Card className={`p-4 ${isLightTheme ? "bg-[#F2F0E1] border-[#DCD8C0]" : "bg-[#121a2c] border-gray-800"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isLightTheme ? "text-[#555555]" : "text-gray-400"}`}>Income (30d)</p>
                <p className={`text-2xl font-semibold ${isLightTheme ? "text-[#222222]" : "text-white"}`}>$25,750.00</p>
              </div>
              <div className={`p-3 rounded-full ${isLightTheme ? "bg-[#E9E7D8]" : "bg-gray-800"}`}>
                <ArrowUpCircleIcon className={`h-5 w-5 ${isLightTheme ? "text-green-600" : "text-green-400"}`} />
              </div>
            </div>
          </Card>
          
          <Card className={`p-4 ${isLightTheme ? "bg-[#F2F0E1] border-[#DCD8C0]" : "bg-[#121a2c] border-gray-800"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isLightTheme ? "text-[#555555]" : "text-gray-400"}`}>Expenses (30d)</p>
                <p className={`text-2xl font-semibold ${isLightTheme ? "text-[#222222]" : "text-white"}`}>$12,900.00</p>
              </div>
              <div className={`p-3 rounded-full ${isLightTheme ? "bg-[#E9E7D8]" : "bg-gray-800"}`}>
                <ArrowDownCircleIcon className={`h-5 w-5 ${isLightTheme ? "text-red-600" : "text-red-400"}`} />
              </div>
            </div>
          </Card>
        </div>
        
        <div className={`p-6 rounded-lg ${
          isLightTheme 
            ? "bg-[#F2F0E1] border border-[#DCD8C0]" 
            : "bg-[#121a2c] border border-gray-800"
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${isLightTheme ? "text-[#222222]" : "text-white"}`}>Cash Management Overview</h2>
          <p className={isLightTheme ? "text-[#222222]" : "text-white"}>
            Your cash management dashboard shows your current balance, income, expenses, and cash flow. 
            Use this page to monitor your liquidity and optimize your cash positions.
          </p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default CashManagement;
