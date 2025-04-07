
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { BookList } from "./BookList";
import { EducationalResource } from "@/types/education";
import { BookFormDialog } from "./BookFormDialog";
import { PlusCircle } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface BookManagementProps {
  books: EducationalResource[];
  onUpdateBooks: (books: EducationalResource[]) => void;
}

export const BookManagement: React.FC<BookManagementProps> = ({ books, onUpdateBooks }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<EducationalResource | null>(null);

  const handleAddBook = (book: EducationalResource) => {
    const newBook = {
      ...book,
      id: `book-${Date.now()}`,
    };
    
    onUpdateBooks([...books, newBook]);
    toast.success("Book added successfully");
    setIsAddDialogOpen(false);
  };

  const handleEditBook = (book: EducationalResource) => {
    setCurrentBook(book);
    setIsEditDialogOpen(true);
  };

  const handleUpdateBook = (updatedBook: EducationalResource) => {
    const updatedBooks = books.map(book => 
      book.id === updatedBook.id ? updatedBook : book
    );
    
    onUpdateBooks(updatedBooks);
    toast.success("Book updated successfully");
    setIsEditDialogOpen(false);
  };

  const handleDeletePrompt = (bookId: string) => {
    const bookToDelete = books.find(book => book.id === bookId);
    if (bookToDelete) {
      setCurrentBook(bookToDelete);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (currentBook) {
      const filteredBooks = books.filter(book => book.id !== currentBook.id);
      onUpdateBooks(filteredBooks);
      toast.success("Book deleted successfully");
      setIsDeleteDialogOpen(false);
      setCurrentBook(null);
    }
  };

  const handleMoveBook = (bookId: string, direction: 'up' | 'down') => {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex === -1) return;
    
    const newBooks = [...books];
    const newIndex = direction === 'up' ? bookIndex - 1 : bookIndex + 1;
    
    // Swap the books
    if (newIndex >= 0 && newIndex < books.length) {
      const temp = newBooks[bookIndex];
      newBooks[bookIndex] = newBooks[newIndex];
      newBooks[newIndex] = temp;
      
      onUpdateBooks(newBooks);
      toast.success(`Book moved ${direction}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Books</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>
      
      <BookList 
        books={books} 
        isAdmin={true}
        onEditBook={handleEditBook}
        onDeleteBook={handleDeletePrompt}
        onMoveBook={handleMoveBook}
      />
      
      {/* Add Book Dialog */}
      <BookFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddBook}
      />
      
      {/* Edit Book Dialog */}
      {currentBook && (
        <BookFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          book={currentBook}
          onSave={handleUpdateBook}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the book
              "{currentBook?.title}" from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
