import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Camera, 
  Plus, 
  Lock,
  Edit,
  Plane,
  Car,
  Home,
  Utensils
} from 'lucide-react';
import { toast } from 'sonner';

interface BucketItem {
  id: string;
  title: string;
  destination: string;
  targetDate: string;
  budget: number;
  saved: number;
  category: 'travel' | 'experience' | 'purchase' | 'family';
  images: string[];
  priority: 'high' | 'medium' | 'low';
  description: string;
}

export default function FamilyRoadmapBucketList() {
  const [bucketItems] = useState<BucketItem[]>([
    {
      id: '1',
      title: 'European River Cruise',
      destination: 'Rhine River, Europe',
      targetDate: '2025-05-15',
      budget: 8500,
      saved: 6200,
      category: 'travel',
      images: ['/placeholder.svg', '/placeholder.svg'],
      priority: 'high',
      description: '14-day luxury river cruise through Germany, France, and Netherlands'
    },
    {
      id: '2',
      title: 'Dream Kitchen Renovation',
      destination: 'Home',
      targetDate: '2025-03-01',
      budget: 45000,
      saved: 32000,
      category: 'purchase',
      images: ['/placeholder.svg'],
      priority: 'medium',
      description: 'Complete kitchen remodel with premium appliances and finishes'
    },
    {
      id: '3',
      title: 'Visit Grandchildren',
      destination: 'Seattle, WA',
      targetDate: '2025-07-04',
      budget: 3200,
      saved: 3200,
      category: 'family',
      images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      priority: 'high',
      description: 'Two-week summer visit with the grandkids'
    },
    {
      id: '4',
      title: 'African Safari',
      destination: 'Kenya & Tanzania',
      targetDate: '2026-09-15',
      budget: 12000,
      saved: 2800,
      category: 'travel',
      images: ['/placeholder.svg'],
      priority: 'medium',
      description: 'Once-in-a-lifetime wildlife photography expedition'
    }
  ]);

  const handleRestrictedAction = (action: string) => {
    toast.error(`${action} requires premium plan`, {
      description: 'Upgrade to manage and track your bucket list'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel': return <Plane className="h-4 w-4" />;
      case 'experience': return <Camera className="h-4 w-4" />;
      case 'purchase': return <Home className="h-4 w-4" />;
      case 'family': return <Utensils className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bucket List</h2>
          <p className="text-muted-foreground">Dreams and goals to achieve in retirement</p>
        </div>
        <Button 
          variant="default" 
          className="gap-2"
          onClick={() => handleRestrictedAction('Add bucket list item')}
        >
          <Plus className="h-4 w-4" />
          Add Dream
          <Lock className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid gap-6">
        {bucketItems.map((item) => {
          const progressPercent = Math.round((item.saved / item.budget) * 100);
          const isCompleted = item.saved >= item.budget;

          return (
            <Card key={item.id} className="p-6">
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Image Gallery */}
                <div className="lg:col-span-4">
                  <div className="grid grid-cols-2 gap-2 h-48">
                    {item.images.map((image, index) => (
                      <div 
                        key={index}
                        className={`bg-muted rounded-lg ${index === 0 && item.images.length > 1 ? 'col-span-2' : ''}`}
                        style={{
                          backgroundImage: `url(${image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="w-full h-full bg-muted/80 rounded-lg flex items-center justify-center">
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(item.category)}
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <Badge variant={getPriorityColor(item.priority) as any}>
                          {item.priority}
                        </Badge>
                        {isCompleted && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            Funded!
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {item.destination}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(item.targetDate).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRestrictedAction('Edit bucket item')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Savings Progress</span>
                      <div className="text-right">
                        <div className="font-semibold">
                          ${item.saved.toLocaleString()} / ${item.budget.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {progressPercent}% complete
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={progressPercent} 
                      className={`h-3 ${isCompleted ? '[&>div]:bg-emerald-500' : ''}`}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRestrictedAction('Auto-save setup')}
                      className="gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Setup Auto-Save
                      <Lock className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRestrictedAction('Research booking')}
                      className="gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      Research & Book
                      <Lock className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary Card */}
      <Card className="p-6 bg-muted/50">
        <h3 className="text-lg font-semibold mb-4">Bucket List Summary</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              ${bucketItems.reduce((sum, item) => sum + item.saved, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Saved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ${bucketItems.reduce((sum, item) => sum + item.budget, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Goal</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {bucketItems.filter(item => item.saved >= item.budget).length} / {bucketItems.length}
            </div>
            <div className="text-sm text-muted-foreground">Dreams Funded</div>
          </div>
        </div>
      </Card>
    </div>
  );
}