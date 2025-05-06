
import React from "react";
import { RouteObject } from "react-router-dom";
import TaxPlanning from "@/pages/TaxPlanning";
import EstatePlanning from "@/pages/EstatePlanning";
import Insurance from "@/pages/Insurance";
import Lending from "@/pages/Lending";
import LegacyVault from "@/pages/LegacyVault";
import Investments from "@/pages/Investments";

export const planningRoutes: RouteObject[] = [
  {
    path: "/tax-planning",
    element: <TaxPlanning />,
  },
  {
    path: "/estate-planning",
    element: <EstatePlanning />,
  },
  {
    path: "/insurance",
    element: <Insurance />,
  },
  {
    path: "/lending",
    element: <Lending />,
  },
  {
    path: "/legacy-vault",
    element: <LegacyVault />,
  },
  {
    path: "/investments",
    element: <Investments />,
  },
];
