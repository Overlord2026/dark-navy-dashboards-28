import React from "react";
import { Home, DollarSign, BookOpen, Settings, Users, Share2, GraduationCap, Gauge, Heart, FileText } from "lucide-react";

export const navigationData = [
  {
    category: "Main",
    items: [
      {
        name: "Dashboard",
        icon: <Home className="h-5 w-5" />,
        path: "/dashboard",
      },
      {
        name: "Accounts",
        icon: <DollarSign className="h-5 w-5" />,
        path: "/accounts",
      },
    ],
  },
  {
    category: "Planning",
    items: [
      {
        name: "Financial Plans",
        icon: <FileText className="h-5 w-5" />,
        path: "/financial-plans",
      },
      {
        name: "Properties",
        icon: <Home className="h-5 w-5" />,
        path: "/properties",
      },
      {
        name: "Estate Planning",
        icon: <FileText className="h-5 w-5" />,
        path: "/estate-planning",
      },
      {
        name: "Insurance",
        icon: <Heart className="h-5 w-5" />,
        path: "/insurance",
      },
    ],
  },
  {
    category: "Growth",
    items: [
      {
        name: "Education",
        icon: <GraduationCap className="h-5 w-5" />,
        path: "/education",
      },
      {
        name: "Professionals",
        icon: <Users className="h-5 w-5" />,
        path: "/professionals",
      },
    ],
  },
  {
    category: "Management",
    items: [
      {
        name: "Settings",
        icon: <Settings className="h-5 w-5" />,
        path: "/settings",
      },
      {
        name: "Sharing",
        icon: <Share2 className="h-5 w-5" />,
        path: "/sharing",
      },
    ],
  },
];

export default navigationData;
