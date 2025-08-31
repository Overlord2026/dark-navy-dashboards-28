import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Calendar, BookOpen, Mic } from 'lucide-react';

export function PersonaCTARow() {
  return (
    <div className="flex flex-wrap gap-3 p-4 bg-muted/50 rounded-lg border">
      <Button size="sm" className="gap-2">
        <Play className="h-4 w-4" />
        Start Workspace
      </Button>
      
      <Button variant="outline" size="sm" className="gap-2">
        <Calendar className="h-4 w-4" />
        Book Demo
      </Button>
      
      <Button variant="outline" size="sm" className="gap-2">
        <BookOpen className="h-4 w-4" />
        Explore Catalog
      </Button>
      
      <Button variant="outline" size="sm" className="gap-2">
        <Mic className="h-4 w-4" />
        Voice Assistant
      </Button>
    </div>
  );
}