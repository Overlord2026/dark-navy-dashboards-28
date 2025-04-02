
import { IconTestResult } from './types';

export const testIcons = (): IconTestResult[] => {
  // Sample icon tests for different parts of the application
  return [
    {
      name: "HomeIcon", // Added the required name property
      icon: "HomeIcon",
      location: "Navigation Menu",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      name: "SettingsIcon", // Added the required name property
      icon: "SettingsIcon",
      location: "Profile Dropdown",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      name: "NotificationIcon", // Added the required name property
      icon: "BellIcon",
      location: "Header",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      name: "SearchIcon", // Added the required name property
      icon: "SearchIcon",
      location: "Global Search",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      name: "AlertIcon", // Added the required name property
      icon: "AlertTriangleIcon",
      location: "Error Messages",
      status: "warning",
      message: "Icon may not be visible in high contrast mode"
    },
    {
      name: "UserIcon", // Added the required name property
      icon: "UserIcon",
      location: "Profile Section",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      name: "DocsIcon", // Added the required name property
      icon: "FileTextIcon",
      location: "Documentation Links",
      status: "error",
      message: "Icon fails to render in Safari browser"
    }
  ];
};
