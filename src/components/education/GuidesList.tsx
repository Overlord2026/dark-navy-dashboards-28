
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trash2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { EducationalResource } from "@/types/education";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  const [newGuideTitle, setNewGuideTitle] = useState("");
  const [newGuideDescription, setNewGuideDescription] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const addGuide = () => {
    if (!newGuideTitle.trim()) {
      toast.error("Guide title is required");
      return;
    }

    const newGuide: EducationalResource = {
      id: `guide-${Date.now()}`,
      title: newGuideTitle,
      description: newGuideDescription || "No description provided",
      isPaid: false,
      level: "All Levels",
      duration: "Self-paced",
      ghlUrl: "#",
      author: "Tony Gomes",
      image: "/placeholder.svg" // Default placeholder for new guides
    };

    setGuides([...guides, newGuide]);
    setNewGuideTitle("");
    setNewGuideDescription("");
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
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-lg">Add New Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newGuideTitle}
                onChange={(e) => setNewGuideTitle(e.target.value)}
                className="w-full p-2 rounded-md border border-blue-300 dark:border-blue-700 bg-background"
                placeholder="Guide title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newGuideDescription}
                onChange={(e) => setNewGuideDescription(e.target.value)}
                className="w-full p-2 rounded-md border border-blue-300 dark:border-blue-700 bg-background"
                rows={3}
                placeholder="Guide description"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="default" 
              className="bg-blue-500 hover:bg-blue-600"
              onClick={addGuide}
            >
              Add Guide
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Improved responsive grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {guides.map((guide, index) => (
          <Card 
            key={guide.id} 
            className="border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow flex flex-col overflow-hidden h-full"
          >
            <div className="relative">
              <AspectRatio ratio={4/3} className="bg-muted">
                <img 
                  src={guide.image || "/placeholder.svg"} 
                  alt={guide.title} 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => moveGuideUp(index)}
                  disabled={index === 0}
                  className="h-8 w-8 p-0 bg-black/30 hover:bg-black/50 text-white rounded-full"
                >
                  <ArrowUpDown className="h-4 w-4 rotate-90" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => moveGuideDown(index)}
                  disabled={index === guides.length - 1}
                  className="h-8 w-8 p-0 bg-black/30 hover:bg-black/50 text-white rounded-full"
                >
                  <ArrowUpDown className="h-4 w-4 -rotate-90" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => deleteGuide(guide.id)}
                  className="h-8 w-8 p-0 bg-black/30 hover:bg-black/50 text-white rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-lg line-clamp-2">{guide.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {guide.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-3 flex-grow">
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="mr-2 h-4 w-4" />
                  <span className="line-clamp-1">By {guide.author || "Unknown"} • {guide.level}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 mt-auto">
                <Button 
                  variant="outline" 
                  className="w-full border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                  onClick={() => window.open(guide.ghlUrl, "_blank")}
                >
                  Read Guide
                </Button>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
