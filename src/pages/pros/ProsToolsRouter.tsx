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
    // Carry persona via query; tools read it for the banner/checklist.
    const url = new URL(TOOLS_HOME_PATH, window.location.origin);
    url.searchParams.set("persona", role);
    url.searchParams.set("src", "pros-hub");
    nav(url.pathname + url.search, { replace: true });
  }, [role, nav]);

  return null;
}