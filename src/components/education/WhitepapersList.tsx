
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trash2, Download, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { EducationalResource } from "@/types/education";

// Initial whitepapers data
const initialWhitepapers: EducationalResource[] = [
  {
    id: "whitepaper-tax-efficiency",
    title: "Tax-Efficient Withdrawal Strategies",
    description: "Research paper on optimizing retirement account withdrawals for tax efficiency.",
    isPaid: false,
    level: "Advanced",
    author: "Financial Research Team",
    ghlUrl: "https://ghl.example.com/whitepapers/tax-efficiency",
    publishDate: "2023-03-15"
  },
  {
    id: "whitepaper-sequence-risk",
    title: "Sequence of Return Risk in Retirement Planning",
    description: "Analysis of how market timing impacts retirement portfolio longevity.",
    isPaid: false,
    level: "Advanced",
    author: "Risk Analysis Department",
    ghlUrl: "https://ghl.example.com/whitepapers/sequence-risk",
    publishDate: "2023-05-22"
  },
  {
    id: "whitepaper-estate-strategies",
    title: "Advanced Estate Planning Strategies for High Net Worth Individuals",
    description: "Comprehensive examination of estate planning techniques for wealth preservation.",
    isPaid: false,
    level: "Advanced",
    author: "Estate Planning Committee",
    ghlUrl: "https://ghl.example.com/whitepapers/estate-strategies",
    publishDate: "2023-07-08"
  }
];

export function WhitepapersList() {
  const [whitepapers, setWhitepapers] = useState<EducationalResource[]>(initialWhitepapers);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const addWhitepaper = () => {
    if (!newTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!newAuthor.trim()) {
      toast.error("Author is required");
      return;
    }

    const newWhitepaper: EducationalResource = {
      id: `whitepaper-${Date.now()}`,
      title: newTitle,
      description: newDescription || "No description provided",
      isPaid: false,
      level: "Advanced",
      author: newAuthor,
      ghlUrl: "#",
      publishDate: new Date().toISOString().split('T')[0]
    };

    setWhitepapers([...whitepapers, newWhitepaper]);
    setNewTitle("");
    setNewAuthor("");
    setNewDescription("");
    setShowAddForm(false);
    toast.success("Whitepaper added successfully");
  };

  const deleteWhitepaper = (id: string) => {
    setWhitepapers(whitepapers.filter(wp => wp.id !== id));
    toast.success("Whitepaper deleted successfully");
  };

  const moveWhitepaperUp = (index: number) => {
    if (index === 0) return;
    const newWhitepapers = [...whitepapers];
    const temp = newWhitepapers[index];
    newWhitepapers[index] = newWhitepapers[index - 1];
    newWhitepapers[index - 1] = temp;
    setWhitepapers(newWhitepapers);
  };

  const moveWhitepaperDown = (index: number) => {
    if (index === whitepapers.length - 1) return;
    const newWhitepapers = [...whitepapers];
    const temp = newWhitepapers[index];
    newWhitepapers[index] = newWhitepapers[index + 1];
    newWhitepapers[index + 1] = temp;
    setWhitepapers(newWhitepapers);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Financial Research Whitepapers</h3>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? "Cancel" : "Add New Whitepaper"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-lg">Add New Whitepaper</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 rounded-md border border-purple-300 dark:border-purple-700 bg-background"
                placeholder="Whitepaper title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author/Department</label>
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full p-2 rounded-md border border-purple-300 dark:border-purple-700 bg-background"
                placeholder="Author or department name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-2 rounded-md border border-purple-300 dark:border-purple-700 bg-background"
                rows={3}
                placeholder="Whitepaper description"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="default" 
              className="bg-purple-500 hover:bg-purple-600"
              onClick={addWhitepaper}
            >
              Add Whitepaper
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {whitepapers.map((whitepaper, index) => (
          <Card key={whitepaper.id} className="border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow">
            <CardHeader className="bg-purple-100 dark:bg-purple-900/40 rounded-t-lg">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{whitepaper.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => moveWhitepaperUp(index)}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUpDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => moveWhitepaperDown(index)}
                    disabled={index === whitepapers.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUpDown className="h-4 w-4 -rotate-90" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteWhitepaper(whitepaper.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {whitepaper.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>By {whitepaper.author}</span>
                </div>
                {whitepaper.publishDate && (
                  <div className="text-sm text-muted-foreground">
                    Published: {formatDate(whitepaper.publishDate)}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/50 flex items-center gap-2"
                onClick={() => window.open(whitepaper.ghlUrl, "_blank")}
              >
                Download PDF
                <Download className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
