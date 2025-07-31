import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink, BookOpen } from 'lucide-react';

interface RecommendedBooksSectionProps {
  searchQuery?: string;
  category?: string;
}

const recommendedBooks = [
  {
    id: 'rich-dad-poor-dad',
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    description: 'What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!',
    rating: 4.6,
    reviews: 15420,
    category: 'investments',
    coverImage: '/placeholder.svg',
    amazonUrl: 'https://amazon.com/rich-dad-poor-dad',
    tonysPick: true,
    summary: 'A classic that challenges conventional thinking about money and investing.'
  },
  {
    id: 'total-money-makeover',
    title: 'The Total Money Makeover',
    author: 'Dave Ramsey',
    description: 'A Proven Plan for Financial Fitness',
    rating: 4.7,
    reviews: 8932,
    category: 'retirement',
    coverImage: '/placeholder.svg',
    amazonUrl: 'https://amazon.com/total-money-makeover',
    tonysPick: false,
    summary: 'Step-by-step plan to get out of debt and build wealth.'
  },
  {
    id: 'bogleheads-guide',
    title: 'The Bogleheads\' Guide to Investing',
    author: 'Taylor Larimore',
    description: 'Simple Investment Strategies for Building Wealth',
    rating: 4.5,
    reviews: 3241,
    category: 'investments',
    coverImage: '/placeholder.svg',
    amazonUrl: 'https://amazon.com/bogleheads-guide-investing',
    tonysPick: true,
    summary: 'Time-tested investment principles for long-term wealth building.'
  },
  {
    id: 'estate-planning-dummies',
    title: 'Estate Planning For Dummies',
    author: 'N. Brian Caverly',
    description: 'Comprehensive Guide to Estate Planning',
    rating: 4.3,
    reviews: 1876,
    category: 'estate',
    coverImage: '/placeholder.svg',
    amazonUrl: 'https://amazon.com/estate-planning-dummies',
    tonysPick: false,
    summary: 'Easy-to-understand guide for protecting your legacy.'
  }
];

export function RecommendedBooksSection({ searchQuery = '', category = 'all' }: RecommendedBooksSectionProps) {
  const filteredBooks = recommendedBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || book.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Recommended Books</h2>
        <p className="text-muted-foreground">
          Hand-picked financial books to expand your knowledge and perspective
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="h-full hover:shadow-lg transition-all duration-300">
            <CardHeader className="p-4">
              <div className="relative">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                {book.tonysPick && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                    Tony's Pick!
                  </Badge>
                )}
              </div>
              
              <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
              <CardDescription className="text-sm">by {book.author}</CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {book.description}
              </p>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{book.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  ({book.reviews.toLocaleString()} reviews)
                </span>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground italic">
                  "{book.summary}"
                </p>
              </div>

              <Button 
                className="w-full" 
                onClick={() => window.open(book.amazonUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Buy on Amazon
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No books found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}