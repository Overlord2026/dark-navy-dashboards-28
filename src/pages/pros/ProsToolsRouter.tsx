import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TOOLS_HOME_PATH } from "@/config/toolsHome";

const VALID = new Set([
  "advisors","accountants","attorneys","insurance","medicare","realtors","consultants"
]);

export default function ProsToolsRouter() {
  const { role } = useParams<{ role: string }>();
  const nav = useNavigate();

  useEffect(() => {
    if (!role || !VALID.has(role)) {
      nav("/pros", { replace: true });
      return;
    }
    
    console.log("ProsToolsRouter: navigating to", TOOLS_HOME_PATH, "with persona", role);
    
    // Direct navigation to avoid any auth redirects
    nav(`${TOOLS_HOME_PATH}?persona=${role}&src=pros-hub`, { replace: true });
  }, [role, nav]);

  return null;
}