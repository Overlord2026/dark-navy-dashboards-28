import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Plus } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

export default function ProspectsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Prospect Pipeline</h1>
            <p className="text-muted-foreground">Track and nurture potential new clients</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Prospect
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Prospect Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Prospect Pipeline Coming Soon</h3>
              <p className="text-muted-foreground">
                This feature is under development. You'll be able to track and manage prospects here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}