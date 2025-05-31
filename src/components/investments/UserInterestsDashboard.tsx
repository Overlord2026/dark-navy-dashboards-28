
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Trash2 } from "lucide-react";
import { useInvestmentData } from "@/hooks/useInvestmentData";
import { useInvestmentMeetings } from "@/hooks/useInvestmentMeetings";
import { toast } from "sonner";

export const UserInterestsDashboard: React.FC = () => {
  const { offerings, userInterests, removeUserInterest, loading } = useInvestmentData();
  const { meetings } = useInvestmentMeetings();

  const interestedOfferings = offerings.filter(offering => 
    userInterests.some(interest => interest.offering_id === offering.id)
  );

  const handleRemoveInterest = async (offeringId: string, offeringName: string) => {
    try {
      await removeUserInterest(offeringId);
      toast.success(`Removed interest in ${offeringName}`);
    } catch (error) {
      toast.error("Failed to remove interest");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Your Investment Interests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading your interests...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Your Investment Interests
        </CardTitle>
      </CardHeader>
      <CardContent>
        {interestedOfferings.length === 0 ? (
          <p className="text-muted-foreground">
            You haven't expressed interest in any investments yet. Browse our offerings to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {interestedOfferings.map((offering) => {
              const hasMeeting = meetings.some(meeting => meeting.offering_id === offering.id);
              
              return (
                <div key={offering.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{offering.name}</h3>
                        {offering.featured && (
                          <Badge variant="secondary" className="text-xs">Featured</Badge>
                        )}
                        {hasMeeting && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            Meeting Scheduled
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {offering.firm} • {offering.minimum_investment}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {offering.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveInterest(offering.id, offering.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
