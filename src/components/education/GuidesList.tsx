import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { EducationalResource } from "@/types/education";
import { GuideCard } from "./GuideCard";
import { AddGuideForm } from "./AddGuideForm";

// Initial guides data with image paths
const initialGuides: EducationalResource[] = [
  {
    id: "guide-retirement",
    title: "When to Retire",
    description: "A Quick and Easy Planning Guide by Tony Gomes.",
    isPaid: false,
    level: "All Levels",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/retirement-planning",
    author: "Tony Gomes",
    image: "/lovable-uploads/42b49110-eac9-42b1-a1eb-c0b403ab65be.png"
  },
  {
    id: "guide-investment-blunders",
    title: "13 Retirement Investment Blunders to Avoid",
    description: "What Affluent Investors Need to Know by Tony Gomes.",
    isPaid: false,
    level: "Intermediate",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/investment-blunders",
    author: "Tony Gomes",
    image: "/lovable-uploads/ce279ca6-478a-49a5-9749-1051bc26ce34.png"
  },
  {
    id: "guide-retirement-risks",
    title: "15 Risks That Can Derail Your Retirement",
    description: "Important risks to be aware of during retirement planning.",
    isPaid: false,
    level: "All Levels",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/retirement-risks",
    author: "Tony Gomes",
    image: "/lovable-uploads/23789bde-1725-406e-9009-32ed5719e159.png"
  },
  {
    id: "guide-bitcoin",
    title: "Bitcoin and Blockchain",
    description: "A Retiree's Guide to Modern Wealth Management.",
    isPaid: false,
    level: "Beginner",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/bitcoin-blockchain",
    author: "Tony Gomes",
    image: "/lovable-uploads/5db68bbf-23cc-4443-a9dc-fccbd6a26df4.png"
  },
  {
    id: "guide-estate",
    title: "Estate Planning Simplified",
    description: "A Step-by-Step Guide to creating a robust estate plan.",
    isPaid: false,
    level: "All Levels",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/estate-planning-checklist",
    author: "Tony Gomes",
    image: "/lovable-uploads/f240868c-6994-44d9-9b69-42edbf1236ff.png"
  },
  {
    id: "guide-physician-retirement",
    title: "Ultimate Retirement Guide for Physicians",
    description: "Specialized retirement planning advice for medical professionals.",
    isPaid: false,
    level: "Advanced",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/physician-retirement",
    author: "Tony Gomes",
    image: "/lovable-uploads/b6ac47ff-deed-42c5-9787-cd478b8ab5e8.png"
  },
  {
    id: "guide-tax-secrets",
    title: "GPS to Retirement Hidden Tax Secrets",
    description: "Strategic tax planning for optimal retirement outcomes.",
    isPaid: false,
    level: "Intermediate",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/tax-secrets",
    author: "Tony Gomes",
    image: "/lovable-uploads/8b82853e-39e1-4fce-a4dd-01ed42796884.png"
  },
  {
    id: "guide-social-security",
    title: "Optimizing Social Security Benefits",
    description: "Maximizing your benefits through strategic planning.",
    isPaid: false,
    level: "Beginner",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/social-security",
    author: "Tony Gomes",
    image: "/lovable-uploads/6f747e03-4db6-4ece-80a5-d63e9ffcd303.png"
  },
  {
    id: "guide-florida-money",
    title: "The Benefits of Moving Your Money to Florida",
    description: "Financial advantages of relocating assets to Florida.",
    isPaid: false,
    level: "All Levels",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/florida-benefits",
    author: "Tony Gomes",
    image: "/lovable-uploads/ba8f1476-5044-45b0-9970-da3d55fb629a.png"
  }
];

export function GuidesList() {
  const [guides, setGuides] = useState<EducationalResource[]>(initialGuides);
  const [showAddForm, setShowAddForm] = useState(false);

  const addGuide = (title: string, description: string) => {
    const newGuide: EducationalResource = {
      id: `guide-${Date.now()}`,
      title,
      description: description || "No description provided",
      isPaid: false,
      level: "All Levels",
      duration: "Self-paced",
      ghlUrl: "#",
      author: "Tony Gomes",
      image: "/placeholder.svg" // Default placeholder for new guides
    };

    setGuides([...guides, newGuide]);
    setShowAddForm(false);
    toast.success("Guide added successfully");
  };

  const deleteGuide = (id: string) => {
    setGuides(guides.filter(guide => guide.id !== id));
    toast.success("Guide deleted successfully");
  };

  const moveGuideUp = (index: number) => {
    if (index === 0) return;
    const newGuides = [...guides];
    const temp = newGuides[index];
    newGuides[index] = newGuides[index - 1];
    newGuides[index - 1] = temp;
    setGuides(newGuides);
  };

  const moveGuideDown = (index: number) => {
    if (index === guides.length - 1) return;
    const newGuides = [...guides];
    const temp = newGuides[index];
    newGuides[index] = newGuides[index + 1];
    newGuides[index + 1] = temp;
    setGuides(newGuides);
  };

  const handleCancelAddForm = () => {
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Financial Guides by Tony Gomes</h3>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? "Cancel" : "Add New Guide"}
        </Button>
      </div>

      {showAddForm && (
        <AddGuideForm 
          onAddGuide={addGuide} 
          onCancel={handleCancelAddForm} 
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {guides.map((guide, index) => (
          <GuideCard
            key={guide.id}
            guide={guide}
            index={index}
            onDelete={deleteGuide}
            onMoveUp={moveGuideUp}
            onMoveDown={moveGuideDown}
            isFirst={index === 0}
            isLast={index === guides.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
