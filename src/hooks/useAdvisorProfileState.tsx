
import { useState } from "react";
import { useAdvisor } from "@/context/AdvisorContext";

export const useAdvisorProfileState = () => {
  const [activeTab, setActiveTab] = useState("bio");
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { advisorInfo, updateAdvisorInfo } = useAdvisor();

  const handleSaveAdvisorInfo = (updatedInfo) => {
    updateAdvisorInfo(updatedInfo);
    setIsEditing(false);
  };

  return {
    activeTab,
    setActiveTab,
    isBookingDrawerOpen,
    setIsBookingDrawerOpen,
    showDetailView,
    setShowDetailView,
    isEditing,
    setIsEditing,
    advisorInfo,
    handleSaveAdvisorInfo
  };
};
