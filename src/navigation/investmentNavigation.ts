
import {
  LandmarkIcon,
  CoinsIcon,
  BuildingIcon,
  BriefcaseIcon,
  SearchIcon
} from "lucide-react";
import { NavItem } from "@/types/navigation";

export const investmentCategories: NavItem[] = [
  {
    title: "Private Equity",
    href: "/investments/alternative/private-equity",
    icon: LandmarkIcon
  },
  {
    title: "Private Debt",
    href: "/investments/alternative/private-debt",
    icon: LandmarkIcon
  },
  {
    title: "Digital Assets",
    href: "/investments/alternative/digital-assets",
    icon: CoinsIcon
  },
  {
    title: "Real Assets",
    href: "/investments/alternative/real-assets",
    icon: BuildingIcon
  },
  {
    title: "Model Portfolios",
    href: "/investments/model-portfolios",
    icon: BriefcaseIcon
  },
  {
    title: "Stock Screener",
    href: "/investments/stock-screener",
    icon: SearchIcon
  }
];
