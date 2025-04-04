
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trash2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { EducationalResource } from "@/types/education";

// Initial guides data
const initialGuides: EducationalResource[] = [
  {
    id: "guide-retirement",
    title: "Comprehensive Retirement Planning Guide",
    description: "Step-by-step guide to creating a robust retirement plan by Tony Gomes.",
    isPaid: false,
    level: "All Levels",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/retirement-planning",
    author: "Tony Gomes"
  },
  {
    id: "guide-estate",
    title: "Estate Planning Checklist",
    description: "Essential estate planning documents and considerations by Tony Gomes.",
    isPaid: false,
    level: "All Levels",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/estate-planning-checklist",
    author: "Tony Gomes"
  },
  {
    id: "guide-tax-strategies",
    title: "Advanced Tax Strategies for Retirement",
    description: "How to minimize tax burden during retirement years by Tony Gomes.",
    isPaid: false,
    level: "Advanced",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/tax-strategies",
    author: "Tony Gomes"
  },
  {
    id: "guide-social-security",
    title: "Maximizing Social Security Benefits",
    description: "Strategic planning for optimal Social Security claiming by Tony Gomes.",
    isPaid: false,
    level: "Intermediate",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/social-security",
    author: "Tony Gomes"
  },
  {
    id: "guide-ira-strategies",
    title: "IRA Conversion Strategies",
    description: "Understanding Roth conversions and tax implications by Tony Gomes.",
    isPaid: false,
    level: "Intermediate",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/ira-strategies",
    author: "Tony Gomes"
  },
  {
    id: "guide-medicare",
    title: "Medicare Enrollment Guide",
    description: "Complete guide to Medicare options and enrollment by Tony Gomes.",
    isPaid: false,
    level: "Beginner",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/medicare",
    author: "Tony Gomes"
  },
  {
    id: "guide-investment",
    title: "Investment Portfolio Diversification",
    description: "Strategies for building a diversified investment portfolio by Tony Gomes.",
    isPaid: false,
    level: "Intermediate",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/investment",
    author: "Tony Gomes"
  },
  {
    id: "guide-healthcare",
    title: "Healthcare Planning in Retirement",
    description: "Planning for healthcare costs during retirement by Tony Gomes.",
    isPaid: false,
    level: "All Levels",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/healthcare",
    author: "Tony Gomes"
  },
  {
    id: "guide-legacy",
    title: "Legacy Planning Beyond the Basics",
    description: "Advanced strategies for legacy and estate planning by Tony Gomes.",
    isPaid: false,
    level: "Advanced",
    duration: "Self-paced",
    ghlUrl: "https://ghl.example.com/guides/legacy",
    author: "Tony Gomes"
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
      author: "Tony Gomes"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide, index) => (
          <Card key={guide.id} className="border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
            <CardHeader className="bg-blue-100 dark:bg-blue-900/40 rounded-t-lg">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{guide.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => moveGuideUp(index)}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUpDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => moveGuideDown(index)}
                    disabled={index === guides.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUpDown className="h-4 w-4 -rotate-90" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteGuide(guide.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {guide.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <FileText className="mr-2 h-4 w-4" />
                <span>By {guide.author || "Unknown"} • {guide.level}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                onClick={() => window.open(guide.ghlUrl, "_blank")}
              >
                Read Guide
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
