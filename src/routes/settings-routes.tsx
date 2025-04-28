
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import Sharing from "@/pages/Sharing";
import ProfessionalSignup from "@/pages/ProfessionalSignup";
import NotFound from "@/pages/NotFound";

export const settingsRoutes = [
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/help",
    element: <Help />,
  },
  {
    path: "/sharing",
    element: <Sharing />,
  },
  {
    path: "/professional-signup",
    element: <ProfessionalSignup />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
];
