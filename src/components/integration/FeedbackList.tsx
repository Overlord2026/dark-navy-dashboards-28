
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { useUser } from '@/context/UserContext';

type Feedback = {
  id: string;
  page: string;
  category: string;
  comments: string;
  created_at: string;
  user_id: string | null;
};

export function FeedbackList() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useUser();
  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'system_administrator';

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFeedback(data || []);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchFeedback();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>You don't have permission to view this content</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return <p className="text-center py-4">Loading feedback...</p>;
  }

  if (feedback.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Feedback</CardTitle>
          <CardDescription>No feedback has been submitted yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'integration_issue':
        return 'bg-red-100 text-red-800';
      case 'feature_request':
        return 'bg-blue-100 text-blue-800';
      case 'ui_improvement':
        return 'bg-purple-100 text-purple-800';
      case 'documentation':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCategoryName = (category: string): string => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback Submissions</CardTitle>
        <CardDescription>Review user feedback for our integration platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Page</TableHead>
              <TableHead className="max-w-[300px]">Comments</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Badge className={getCategoryColor(item.category)}>
                    {formatCategoryName(item.category)}
                  </Badge>
                </TableCell>
                <TableCell>{item.page}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {item.comments}
                </TableCell>
                <TableCell>
                  {format(new Date(item.created_at), 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
