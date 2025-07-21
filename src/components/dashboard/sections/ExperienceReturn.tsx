import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { 
  Camera, 
  MapPin, 
  Heart, 
  Calendar, 
  Users, 
  Plus,
  Share,
  Star
} from "lucide-react";
import { ExperienceMemory } from "@/types/familyOffice";

interface ExperienceReturnProps {
  experiences: ExperienceMemory[];
}

export const ExperienceReturn: React.FC<ExperienceReturnProps> = ({ experiences }) => {
  const totalExperienceValue = experiences.reduce((sum, exp) => sum + (exp.cost || 0), 0);
  const recentExperiences = experiences
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const getCategoryIcon = (category: ExperienceMemory['category']) => {
    switch (category) {
      case 'travel': return <MapPin className="h-4 w-4 text-blue-500" />;
      case 'family': return <Heart className="h-4 w-4 text-pink-500" />;
      case 'milestone': return <Star className="h-4 w-4 text-amber-500" />;
      case 'charitable': return <Users className="h-4 w-4 text-green-500" />;
      default: return <Camera className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: ExperienceMemory['category']) => {
    switch (category) {
      case 'travel': return 'bg-blue-100 text-blue-700';
      case 'family': return 'bg-pink-100 text-pink-700';
      case 'milestone': return 'bg-amber-100 text-amber-700';
      case 'charitable': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Return on Experience</h2>
          <p className="text-muted-foreground">Your family memory bank and meaningful moments</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Memory</span>
        </Button>
      </div>

      {/* Experience Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">
                {experiences.length}
              </div>
              <div className="text-sm text-purple-600">Memories Captured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-700">
                {formatCurrency(totalExperienceValue)}
              </div>
              <div className="text-sm text-pink-600">Experience Investment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-700">
                {new Set(experiences.flatMap(exp => exp.participants)).size}
              </div>
              <div className="text-sm text-indigo-600">Family Members Included</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Experiences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Family Moments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentExperiences.map((experience) => (
            <Card key={experience.id} className="hover-scale overflow-hidden">
              <div className="relative">
                {/* Mock Image Placeholder */}
                <div className="w-full h-32 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className={getCategoryColor(experience.category)}>
                    <span className="flex items-center space-x-1">
                      {getCategoryIcon(experience.category)}
                      <span className="capitalize">{experience.category}</span>
                    </span>
                  </Badge>
                </div>

                {/* Cost Badge */}
                {experience.cost && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/50 text-white border-none">
                      {formatCurrency(experience.cost)}
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h4 className="font-semibold">{experience.title}</h4>
                  <p className="text-sm text-muted-foreground">{experience.description}</p>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(experience.date)}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{experience.participants.join(', ')}</span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Camera className="h-3 w-3 mr-1" />
                    Photos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Experiences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Upcoming Experiences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Greece Trip */}
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">Greece Family Trip</div>
                <div className="text-sm text-muted-foreground">June 15, 2025</div>
                <div className="text-sm text-blue-600">157 days to go</div>
              </div>
              <Badge variant="outline">Planned</Badge>
            </div>

            {/* Family Reunion */}
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Heart className="h-5 w-5 text-pink-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">Annual Family Reunion</div>
                <div className="text-sm text-muted-foreground">August 10, 2025</div>
                <div className="text-sm text-pink-600">213 days to go</div>
              </div>
              <Badge variant="outline">Confirmed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Story Timeline CTA */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900">
                  Build Your Family Story Timeline
                </h3>
                <p className="text-sm text-amber-700">
                  Create a beautiful timeline of your family's journey and share it with future generations.
                </p>
              </div>
            </div>
            <Button variant="outline" className="bg-white">
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};