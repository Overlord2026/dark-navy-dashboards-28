import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Clock, Users, DollarSign, Eye, EyeOff, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { schedulerApi } from '@/modules/scheduler/schedulerApi';
import { nilAdapter } from '@/modules/scheduler/adapters/nilAdapter';
import { toast } from '@/lib/toast';

interface Offering {
  id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  price?: number;
  capacity?: number;
  visibility: string;
  is_published: boolean;
  offering_type: string;
  location_type: string;
  created_at: string;
  total_bookings?: number;
  upcoming_windows?: number;
}

export default function SessionsOverview() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [publishEligibility, setPublishEligibility] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Load offerings and publish eligibility in parallel
      const [offeringsData, eligibilityData] = await Promise.all([
        schedulerApi.getOfferings(user.id),
        nilAdapter.checkPublishEligibility(user.id)
      ]);

      // Map database fields to interface fields
      const mappedOfferings = (offeringsData || []).map((offering: any) => ({
        ...offering,
        duration_minutes: offering.duration_min || 0,
        is_published: offering.published || false,
        offering_type: 'one_on_one',
        location_type: 'virtual'
      }));
      setOfferings(mappedOfferings);
      setPublishEligibility(eligibilityData);
    } catch (error) {
      console.error('Error loading sessions data:', error);
      toast.err("Failed to load sessions data");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublishStatus = async (offeringId: string, currentStatus: boolean) => {
    if (!currentStatus && publishEligibility && !publishEligibility.canPublish) {
      toast.err(publishEligibility.blockReason);
      return;
    }

    try {
      await schedulerApi.updateOffering(offeringId, { is_published: !currentStatus });
      await loadData(); // Reload data
      
      toast.ok(`Offering ${!currentStatus ? 'published' : 'unpublished'}`);
    } catch (error) {
      console.error('Error updating offering:', error);
      toast.err("Failed to update offering status");
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      public: 'default',
      link_only: 'secondary',
      private: 'outline'
    };
    
    return <Badge variant={variants[visibility] || 'outline'}>{visibility.replace('_', ' ')}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="outline">
        {type === 'one_on_one' ? '1-on-1' : 'Group'}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Session Offerings</h1>
          <p className="text-muted-foreground">
            Manage your NIL session offerings and bookings
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/sessions/offerings/new">
            <Plus className="h-4 w-4 mr-2" />
            New Offering
          </Link>
        </Button>
      </div>

      {/* Publish Status Alert */}
      {publishEligibility && !publishEligibility.canPublish && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Complete Setup Required</h3>
                <p className="text-sm text-amber-700 mt-1">
                  {publishEligibility.blockReason}
                </p>
                <div className="flex gap-2 mt-3">
                  {!publishEligibility.hasTraining && (
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/nil/training">Complete Training</Link>
                    </Button>
                  )}
                  {!publishEligibility.hasDisclosure && (
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/nil/disclosures">Sign Disclosures</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offerings Grid */}
      {offerings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No session offerings yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first session offering to start connecting with fans
            </p>
            <Button asChild>
              <Link to="/dashboard/sessions/offerings/new">
                <Plus className="h-4 w-4 mr-2" />
                Create First Offering
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offerings.map((offering) => (
            <Card key={offering.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{offering.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePublishStatus(offering.id, offering.is_published)}
                    className="p-1"
                  >
                    {offering.is_published ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {getTypeBadge(offering.offering_type)}
                  {getVisibilityBadge(offering.visibility)}
                  {offering.is_published ? (
                    <Badge className="bg-green-100 text-green-800">Live</Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {offering.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {offering.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{offering.duration_minutes} min</span>
                  </div>
                  
                  {offering.price && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>${offering.price}</span>
                    </div>
                  )}
                  
                  {offering.capacity && offering.capacity > 1 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Max {offering.capacity}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{offering.upcoming_windows || 0} slots</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link to={`/dashboard/sessions/offerings/${offering.id}`}>
                      Edit
                    </Link>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link to={`/dashboard/sessions/offerings/${offering.id}/windows`}>
                      Time Slots
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard/sessions/bookings">
                <Calendar className="h-4 w-4 mr-2" />
                View All Bookings
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/nil/training">
                <Settings className="h-4 w-4 mr-2" />
                NIL Training
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/nil/disclosures">
                <Settings className="h-4 w-4 mr-2" />
                NIL Disclosures
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}