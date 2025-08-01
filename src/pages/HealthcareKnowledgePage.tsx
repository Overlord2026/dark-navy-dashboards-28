import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Play, Star, Clock, Users } from "lucide-react";

export const HealthcareKnowledgePage = () => {
  const knowledgeResources = [
    {
      id: 1,
      title: "Understanding Health Savings Accounts",
      description: "Complete guide to maximizing your HSA benefits",
      type: "Guide",
      duration: "15 min read",
      rating: 4.8,
      downloads: 1234
    },
    {
      id: 2,
      title: "Medicare Planning Essentials",
      description: "Navigate Medicare options and enrollment periods",
      type: "Video",
      duration: "25 min",
      rating: 4.9,
      downloads: 892
    },
    {
      id: 3,
      title: "Healthcare Cost Optimization",
      description: "Strategies to reduce healthcare expenses",
      type: "Webinar",
      duration: "45 min",
      rating: 4.7,
      downloads: 567
    }
  ];

  const supportOptions = [
    {
      title: "Healthcare Concierge",
      description: "Personal healthcare navigation assistance",
      availability: "24/7"
    },
    {
      title: "Provider Network",
      description: "Access to curated healthcare professionals",
      availability: "Business hours"
    },
    {
      title: "Claims Support",
      description: "Help with insurance claims and disputes",
      availability: "Business hours"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Healthcare Knowledge & Support</h1>
        <p className="text-muted-foreground">
          Educational resources and expert support for healthcare decisions
        </p>
      </div>

      {/* Knowledge Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Knowledge Library
          </CardTitle>
          <CardDescription>
            Expert-curated healthcare education materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {knowledgeResources.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{resource.title}</h3>
                    <Badge variant="outline">{resource.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {resource.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {resource.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {resource.downloads}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Expert Support Services
          </CardTitle>
          <CardDescription>
            Professional healthcare guidance and assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {supportOptions.map((option, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    Available: {option.availability}
                  </div>
                  <Button className="w-full">Contact Support</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};