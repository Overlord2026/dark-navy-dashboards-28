
import { RouteObject } from "react-router-dom";
import Professionals from "@/pages/Professionals";
import Sharing from "@/pages/Sharing";
import { ProfessionalsRouteWrapper } from "@/components/providers/ProfessionalsRouteWrapper";

export const collaborationRoutes: RouteObject[] = [
  {
    path: "/professionals",
    element: (
      <ProfessionalsRouteWrapper>
        <Professionals />
      </ProfessionalsRouteWrapper>
    ),
  },
  {
    path: "/sharing",
    element: <Sharing />,
  }
];
