
import React from "react";
import { ArchiveIcon, FileText, Shield, Users2, List, Clock } from "lucide-react";
import { ServiceCard } from "./ServiceCard";

interface ServicesSectionProps {
  onInterestClick: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onInterestClick }) => {
  const services = [
    {
      title: "Family Legacy Box",
      icon: ArchiveIcon,
      description: "Preserve your family history, values, and wishes in a comprehensive digital format for future generations."
    },
    {
      title: "Will & Trust Creation",
      icon: FileText,
      description: "Professional drafting of legally binding wills and trusts tailored to your specific wishes and circumstances."
    },
    {
      title: "Estate Tax Planning",
      icon: Shield,
      description: "Strategic planning to minimize tax burdens on your estate and maximize the wealth passed to your beneficiaries."
    },
    {
      title: "Succession Planning",
      icon: Users2,
      description: "Structured approach to transitioning business ownership and management to ensure continuity."
    },
    {
      title: "Estate Administration",
      icon: List,
      description: "Professional management of estate settlement processes, including probate navigation and asset distribution."
    },
    {
      title: "Regular Review Services",
      icon: Clock,
      description: "Scheduled reviews of your estate plan to ensure it remains aligned with your goals as laws and circumstances change."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <ServiceCard
          key={service.title}
          title={service.title}
          description={service.description}
          icon={service.icon}
          onInterestClick={onInterestClick}
        />
      ))}
    </div>
  );
};
