
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DiagnosticsAccessButton = () => {
  const navigate = useNavigate();

  const handleDiagnosticsAccess = () => {
    navigate("/system-diagnostics");
  };

  return (
    <Button 
      onClick={handleDiagnosticsAccess}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Activity className="h-4 w-4" />
      <span>System Diagnostics</span>
    </Button>
  );
};
