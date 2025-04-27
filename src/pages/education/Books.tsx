
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { BookOpen } from "lucide-react";

export default function Books() {
  const books = [
    { title: "The Psychology of Money", author: "Morgan Housel", description: "Timeless lessons on wealth, greed, and happiness.", category: "Personal Finance" },
    { title: "The Intelligent Investor", author: "Benjamin Graham", description: "The definitive book on value investing.", category: "Investing" },
    { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", description: "What the rich teach their kids about money.", category: "Financial Literacy" },
    { title: "The Total Money Makeover", author: "Dave Ramsey", description: "A proven plan for financial fitness.", category: "Debt Management" },
    { title: "The Millionaire Next Door", author: "Thomas J. Stanley", description: "The surprising secrets of America's wealthy.", category: "Wealth Building" },
  ];

  return (
    <ThreeColumnLayout title="Books" activeMainItem="education">
      <div className="space-y-6 p-4">
        <h1 className="text-2xl font-bold">Recommended Books</h1>
        <p className="text-muted-foreground">
          Discover our curated collection of financial books to expand your knowledge.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {books.map((book, index) => (
            <div 
              key={index}
              className="flex flex-col p-6 border border-border rounded-lg bg-card"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">{book.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
              <p className="text-sm">{book.description}</p>
              <div className="mt-3">
                <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                  {book.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
