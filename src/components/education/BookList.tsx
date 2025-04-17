
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { EducationalResource } from "@/types/education";

interface BookListProps {
  books: EducationalResource[];
  isAdmin?: boolean;
  onEditBook?: (book: EducationalResource) => void;
  onDeleteBook?: (bookId: string) => void;
  onMoveBook?: (bookId: string, direction: 'up' | 'down') => void;
}

export const BookList: React.FC<BookListProps> = ({ 
  books, 
  isAdmin = false,
  onEditBook,
  onDeleteBook,
  onMoveBook
}) => {
  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No books available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book, index) => (
        <Card key={book.id} className="flex flex-col h-full bg-card hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
            {book.author && (
              <p className="text-sm text-muted-foreground">By {book.author}</p>
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex flex-col items-center mb-4">
              {book.coverImage ? (
                <img 
                  src={book.coverImage} 
                  alt={`Cover of ${book.title}`}
                  className="h-64 w-auto object-contain rounded-md shadow-sm"
                  loading="lazy"
                />
              ) : (
                <div className="h-64 w-48 bg-muted flex items-center justify-center rounded-md">
                  <span className="text-muted-foreground">No cover available</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{book.description}</p>
          </CardContent>
          <CardFooter className={`flex ${isAdmin ? 'flex-col gap-2' : 'justify-between'}`}>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleExternalLink(book.ghlUrl)}
            >
              View on Amazon <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            
            {isAdmin && (
              <div className="flex justify-between w-full mt-2">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditBook && onEditBook(book)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => onDeleteBook && onDeleteBook(book.id)}
                  >
                    Delete
                  </Button>
                </div>
                <div className="flex gap-2">
                  {index > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMoveBook && onMoveBook(book.id, 'up')}
                    >
                      Move Up
                    </Button>
                  )}
                  {index < books.length - 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMoveBook && onMoveBook(book.id, 'down')}
                    >
                      Move Down
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
