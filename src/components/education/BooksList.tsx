
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Plus, Trash2, Star, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { EducationalResource } from "@/types/education";

// Initial books data
const initialBooks: EducationalResource[] = [
  {
    id: "book-intelligent-investor",
    title: "The Intelligent Investor",
    description: "Benjamin Graham's timeless advice on value investing.",
    isPaid: false,
    level: "Intermediate",
    author: "Benjamin Graham",
    ghlUrl: "https://www.amazon.com/Intelligent-Investor-Definitive-Investing-Essentials/dp/0060555661",
    reviews: 4.7
  },
  {
    id: "book-power-of-zero",
    title: "The Power of Zero",
    description: "How to get to the 0% tax bracket in retirement.",
    isPaid: false,
    level: "Beginner",
    author: "David McKnight",
    ghlUrl: "https://www.amazon.com/Power-Zero-Revised-Updated-Tax-Free/dp/1984823078",
    reviews: 4.6
  },
  {
    id: "book-psychology-of-money",
    title: "The Psychology of Money",
    description: "Timeless lessons on wealth, greed, and happiness.",
    isPaid: false,
    level: "All Levels",
    author: "Morgan Housel",
    ghlUrl: "https://www.amazon.com/Psychology-Money-Timeless-lessons-happiness/dp/0857197681",
    reviews: 4.8
  }
];

export function BooksList() {
  const [books, setBooks] = useState<EducationalResource[]>(initialBooks);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [newBookDescription, setNewBookDescription] = useState("");
  const [newBookUrl, setNewBookUrl] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const addBook = () => {
    if (!newBookTitle.trim()) {
      toast.error("Book title is required");
      return;
    }

    if (!newBookAuthor.trim()) {
      toast.error("Author name is required");
      return;
    }

    const newBook: EducationalResource = {
      id: `book-${Date.now()}`,
      title: newBookTitle,
      description: newBookDescription || "No description provided",
      isPaid: false,
      level: "All Levels",
      author: newBookAuthor,
      ghlUrl: newBookUrl || "#",
      reviews: 0
    };

    setBooks([...books, newBook]);
    setNewBookTitle("");
    setNewBookAuthor("");
    setNewBookDescription("");
    setNewBookUrl("");
    setShowAddForm(false);
    toast.success("Book added successfully");
  };

  const deleteBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
    toast.success("Book deleted successfully");
  };

  const moveBookUp = (index: number) => {
    if (index === 0) return;
    const newBooks = [...books];
    const temp = newBooks[index];
    newBooks[index] = newBooks[index - 1];
    newBooks[index - 1] = temp;
    setBooks(newBooks);
  };

  const moveBookDown = (index: number) => {
    if (index === books.length - 1) return;
    const newBooks = [...books];
    const temp = newBooks[index];
    newBooks[index] = newBooks[index + 1];
    newBooks[index + 1] = temp;
    setBooks(newBooks);
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-4 w-4 ${star <= Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-2 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Recommended Financial Books</h3>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? "Cancel" : "Add New Book"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="text-lg">Add New Book</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newBookTitle}
                onChange={(e) => setNewBookTitle(e.target.value)}
                className="w-full p-2 rounded-md border border-amber-300 dark:border-amber-700 bg-background"
                placeholder="Book title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                type="text"
                value={newBookAuthor}
                onChange={(e) => setNewBookAuthor(e.target.value)}
                className="w-full p-2 rounded-md border border-amber-300 dark:border-amber-700 bg-background"
                placeholder="Author name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newBookDescription}
                onChange={(e) => setNewBookDescription(e.target.value)}
                className="w-full p-2 rounded-md border border-amber-300 dark:border-amber-700 bg-background"
                rows={3}
                placeholder="Book description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amazon URL</label>
              <input
                type="text"
                value={newBookUrl}
                onChange={(e) => setNewBookUrl(e.target.value)}
                className="w-full p-2 rounded-md border border-amber-300 dark:border-amber-700 bg-background"
                placeholder="https://www.amazon.com/..."
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="default" 
              className="bg-amber-500 hover:bg-amber-600"
              onClick={addBook}
            >
              Add Book
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <Card key={book.id} className="border-amber-200 dark:border-amber-800 hover:shadow-md transition-shadow">
            <CardHeader className="bg-amber-100 dark:bg-amber-900/40 rounded-t-lg">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{book.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => moveBookUp(index)}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUpDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => moveBookDown(index)}
                    disabled={index === books.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUpDown className="h-4 w-4 -rotate-90" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteBook(book.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {book.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>By {book.author}</span>
              </div>
              {renderStars(book.reviews)}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50 flex items-center gap-2"
                onClick={() => window.open(book.ghlUrl, "_blank")}
              >
                View on Amazon
                <ExternalLink className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
