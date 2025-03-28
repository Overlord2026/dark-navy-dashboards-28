
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useTheme } from "@/context/ThemeContext";

const CashManagement = () => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  return (
    <ThreeColumnLayout activeMainItem="cash-management" title="Cash Management">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold mb-6">Cash Management</h1>
        <div className={`p-6 rounded-lg ${
          isLightTheme 
            ? "bg-[#F2F0E1] border border-[#DCD8C0]" 
            : "bg-[#121a2c] border border-gray-800"
        }`}>
          <p className={isLightTheme ? "text-[#222222]" : "text-white"}>
            Your cash management information will appear here.
          </p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default CashManagement;
