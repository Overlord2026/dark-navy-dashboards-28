
import { RouteObject } from "react-router-dom";
import Settings from "@/pages/Settings";
import IPProtection from "@/pages/IPProtection";
import SecuritySettings from "@/pages/SecuritySettings";

export const settingsRoutes: RouteObject[] = [
  {
    path: "/settings",
    element: <Settings />
  },
  {
    path: "/ip-protection",
    element: <IPProtection />
  },
  {
    path: "/security-settings",
    element: <SecuritySettings />
  }
];
