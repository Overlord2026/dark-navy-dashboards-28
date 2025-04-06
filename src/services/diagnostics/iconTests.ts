
import { IconTestResult } from './types';
import { v4 as uuidv4 } from 'uuid';

export const testIcons = (): IconTestResult[] => {
  // Sample icon tests for different parts of the application
  return [
    {
      id: uuidv4(),
      name: "HomeIcon", 
      icon: "HomeIcon",
      iconName: "HomeIcon",
      location: "Navigation Menu",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      id: uuidv4(),
      name: "SettingsIcon",
      icon: "SettingsIcon",
      iconName: "SettingsIcon",
      location: "Profile Dropdown",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      id: uuidv4(),
      name: "NotificationIcon",
      icon: "BellIcon",
      iconName: "BellIcon",
      location: "Header",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      id: uuidv4(),
      name: "SearchIcon",
      icon: "SearchIcon",
      iconName: "SearchIcon",
      location: "Global Search",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      id: uuidv4(),
      name: "AlertIcon",
      icon: "AlertTriangleIcon",
      iconName: "AlertTriangleIcon",
      location: "Error Messages",
      status: "warning",
      message: "Icon may not be visible in high contrast mode"
    },
    {
      id: uuidv4(),
      name: "UserIcon",
      icon: "UserIcon",
      iconName: "UserIcon",
      location: "Profile Section",
      status: "success",
      message: "Icon renders correctly in all themes"
    },
    {
      id: uuidv4(),
      name: "DocsIcon",
      icon: "FileTextIcon",
      iconName: "FileTextIcon", 
      location: "Documentation Links",
      status: "error",
      message: "Icon fails to render in Safari browser"
    }
  ];
};
