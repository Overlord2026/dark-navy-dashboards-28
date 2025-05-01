
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeedbackForm } from './FeedbackForm';
import { FeedbackList } from './FeedbackList';
import { useUser } from '@/context/UserContext';

export function FeedbackTab() {
  const { userProfile } = useUser();
  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'system_administrator';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integration Feedback</CardTitle>
          <CardDescription>
            Help us improve the Family Office Marketplace integration experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="submit" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
              {isAdmin && <TabsTrigger value="manage">View Feedback</TabsTrigger>}
            </TabsList>
            <TabsContent value="submit">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We value your input on how we can improve our integration platform.
                  Please share any issues, suggestions, or ideas you have.
                </p>
                <FeedbackForm />
              </div>
            </TabsContent>
            {isAdmin && (
              <TabsContent value="manage">
                <FeedbackList />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
