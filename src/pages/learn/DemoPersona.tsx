import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DemoPersona() {
  const { persona } = useParams<{ persona: string }>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">
              {persona ? `${persona.charAt(0).toUpperCase() + persona.slice(1)} Demo` : 'Demo'}
            </CardTitle>
            <CardDescription>
              Personal walkthrough and consultation
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-muted-foreground">
                Embed video + Calendly here
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This page will contain an embedded video demo and Calendly widget 
                for booking personalized consultations with our {persona} specialists.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}