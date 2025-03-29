
import React, { useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ModuleOption {
  id: string;
  name: string;
  description: string;
  included: boolean;
}

export function ModuleSelectionForm() {
  const [modules, setModules] = useState<ModuleOption[]>([
    {
      id: "lead-optimization",
      name: "Lead Optimization",
      description: "AI-powered tools to identify and convert high-value prospects",
      included: true,
    },
    {
      id: "tax-analysis",
      name: "Tax Analysis Engine",
      description: "Comprehensive tax planning and optimization for clients",
      included: false,
    },
    {
      id: "marketing-engine",
      name: "Marketing Engine",
      description: "Content library and automation for client communications",
      included: false,
    },
    {
      id: "catchlight",
      name: "Catchlight Integration",
      description: "Enhanced prospect insights and scoring",
      included: false,
    },
    {
      id: "emoney",
      name: "eMoney Integration",
      description: "Seamless financial planning tool integration",
      included: false,
    },
    {
      id: "compliance",
      name: "Compliance Suite",
      description: "Automated compliance monitoring and documentation",
      included: false,
    },
  ]);

  const handleToggleModule = (id: string) => {
    setModules(modules.map(module => 
      module.id === id ? { ...module, included: !module.included } : module
    ));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select Platform Modules</h2>
        <p className="text-gray-400">
          Choose which modules you want to enable for your practice
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module) => (
          <Card 
            key={module.id}
            className={`cursor-pointer transition-all duration-200 border ${
              module.included 
                ? "bg-[#1EAEDB]/10 border-[#1EAEDB]" 
                : "bg-gray-900/30 border-gray-700 hover:bg-gray-900/50"
            }`}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{module.name}</h3>
                  {module.included && (
                    <span className="bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded-full flex items-center">
                      <Check className="h-3 w-3 mr-1" /> Selected
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">{module.description}</p>
              </div>
              <div className="ml-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id={`module-${module.id}`}
                    checked={module.included}
                    onCheckedChange={() => handleToggleModule(module.id)}
                  />
                  <Label htmlFor={`module-${module.id}`} className="sr-only">
                    {module.included ? "Disable" : "Enable"} {module.name}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-md p-4 mt-8">
        <p className="text-sm text-yellow-400">
          <strong>Note:</strong> Some modules may require additional subscription fees 
          or separate license agreements. Contact your account manager for details.
        </p>
      </div>
    </div>
  );
}
