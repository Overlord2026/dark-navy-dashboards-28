
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Landmark, 
  CreditCard,
  Building,
  TrendingUp,
  ClipboardList,
  DollarSign
} from "lucide-react";

type AccountSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  balance?: string;
  status?: string;
  isExpanded: boolean;
};

const Accounts = () => {
  const [accountSections, setAccountSections] = useState<AccountSection[]>([
    {
      id: "bfo-managed",
      title: "BFO Managed",
      icon: <Landmark className="h-5 w-5 text-blue-400" />,
      status: "Unable to retrieve balance",
      isExpanded: true,
    },
    {
      id: "external-investment",
      title: "External Investment",
      icon: <TrendingUp className="h-5 w-5 text-green-400" />,
      balance: "$0.00",
      isExpanded: false,
    },
    {
      id: "external-manually-tracked",
      title: "External Manually-Tracked",
      icon: <ClipboardList className="h-5 w-5 text-amber-400" />,
      balance: "$0.00",
      isExpanded: false,
    },
    {
      id: "external-loans",
      title: "External Loans",
      icon: <DollarSign className="h-5 w-5 text-indigo-400" />,
      balance: "$0.00",
      isExpanded: false,
    },
    {
      id: "external-banking",
      title: "External Banking",
      icon: <Building className="h-5 w-5 text-red-400" />,
      balance: "$0.00",
      isExpanded: false,
    },
    {
      id: "external-credit-cards",
      title: "External Credit Cards",
      icon: <CreditCard className="h-5 w-5 text-cyan-400" />,
      balance: "$0.00",
      isExpanded: false,
    },
  ]);

  const toggleSection = (id: string) => {
    setAccountSections(
      accountSections.map((section) =>
        section.id === id
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  return (
    <ThreeColumnLayout activeMainItem="accounts" title="Accounts">
      <div className="mx-auto max-w-6xl animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold mb-1">Accounts</h1>
          <Button className="bg-white text-black hover:bg-slate-100">
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>

        <div className="space-y-4">
          {accountSections.map((section) => (
            <div
              key={section.id}
              className="rounded-lg bg-[#121a2c] border border-gray-800 overflow-hidden"
            >
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <span className="font-medium text-white">{section.title}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {section.balance ? (
                    <span className="text-white">{section.balance}</span>
                  ) : (
                    <span className="text-gray-400">{section.status}</span>
                  )}
                  {section.isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {section.isExpanded && (
                <div className="p-6 border-t border-gray-800">
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <p className="mb-4">No accounts added yet</p>
                    <Button variant="outline" className="border-gray-700 text-white hover:bg-[#1c2e4a] hover:text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Add {section.title.replace("External ", "").replace("BFO ", "")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Accounts;
