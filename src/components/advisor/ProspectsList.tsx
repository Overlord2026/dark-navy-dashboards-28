import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, User, Mail, Calendar, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { clientSegments } from "@/components/solutions/WhoWeServe";

interface Prospect {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  client_segment?: string;
  lead_stage?: string;
  advisor_id?: string;
  created_at: string;
  last_login_at?: string;
  utm_source?: string;
  utm_campaign?: string;
}

interface ProspectsListProps {
  onInviteClick: () => void;
}

export function ProspectsList({ onInviteClick }: ProspectsListProps) {
  const { userProfile } = useUser();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  useEffect(() => {
    loadProspects();
  }, [userProfile]);

  const loadProspects = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .in('role', ['prospect', 'client'])
        .order('created_at', { ascending: false });

      // If not admin, only show prospects assigned to this advisor
      if (userProfile.role !== 'admin') {
        query = query.eq('advisor_id', userProfile.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      setProspects(data || []);
    } catch (error) {
      console.error('Error loading prospects:', error);
      toast.error("Failed to load prospects");
    } finally {
      setLoading(false);
    }
  };

  const getSegmentName = (segmentId?: string): string => {
    if (!segmentId || segmentId === 'general') return 'General';
    const segment = clientSegments.find(s => s.id === segmentId);
    return segment ? segment.title : segmentId;
  };

  const getStageColor = (stage?: string): string => {
    switch (stage) {
      case 'invited': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = 
      prospect.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSegment = segmentFilter === 'all' || prospect.client_segment === segmentFilter;
    const matchesStage = stageFilter === 'all' || prospect.lead_stage === stageFilter;
    
    return matchesSearch && matchesSegment && matchesStage;
  });

  const reassignProspect = async (prospectId: string, newAdvisorId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ advisor_id: newAdvisorId })
        .eq('id', prospectId);

      if (error) throw error;

      toast.success("Prospect reassigned successfully");
      loadProspects();
    } catch (error) {
      console.error('Error reassigning prospect:', error);
      toast.error("Failed to reassign prospect");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              My Prospects
            </CardTitle>
            <CardDescription>
              {userProfile?.role === 'admin' ? 'All prospects in the system' : 'Prospects assigned to you'}
            </CardDescription>
          </div>
          <Button onClick={onInviteClick} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Prospect
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search prospects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Segments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="general">General</SelectItem>
              {clientSegments.map((segment) => (
                <SelectItem key={segment.id} value={segment.id}>
                  {segment.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prospects List */}
        <div className="space-y-4">
          {filteredProspects.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No prospects found</p>
              <Button onClick={onInviteClick} className="mt-4">
                Invite Your First Prospect
              </Button>
            </div>
          ) : (
            filteredProspects.map((prospect) => (
              <div
                key={prospect.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {prospect.first_name} {prospect.last_name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {prospect.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStageColor(prospect.lead_stage)}>
                      {prospect.lead_stage || 'New'}
                    </Badge>
                    <Badge variant="outline">
                      {getSegmentName(prospect.client_segment)}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Invited: {new Date(prospect.created_at).toLocaleDateString()}
                    </span>
                    {prospect.last_login_at && (
                      <span>
                        Last active: {new Date(prospect.last_login_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  {prospect.utm_source && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Source: {prospect.utm_source}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}