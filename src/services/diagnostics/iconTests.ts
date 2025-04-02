
import { IconTestResult } from './types';

export const testIcons = (): IconTestResult[] => {
  // Sample icon tests for different parts of the application
  return [
    {
      name: "HomeIcon",
      icon: "HomeIcon",
      location: "Navigation Menu",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      name: "SettingsIcon",
      icon: "SettingsIcon",
      location: "Profile Dropdown",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      name: "NotificationIcon",
      icon: "BellIcon",
      location: "Header",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      name: "SearchIcon",
      icon: "SearchIcon",
      location: "Global Search",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      name: "AlertIcon",
      icon: "AlertTriangleIcon",
      location: "Error Messages",
      status: "warning",
      message: "Icon may not be visible in high contrast mode"
    },
    {
      name: "UserIcon",
      icon: "UserIcon",
      location: "Profile Section",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      name: "DocsIcon",
      icon: "FileTextIcon",
      location: "Documentation Links",
      status: "error",
      message: "Icon fails to render in Safari browser"
    }
  ];
};
