import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Mail, Clock, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface ProspectInvitation {
  id: string;
  email: string;
  status: string;
  client_segment: string;
  personal_note: string | null;
  sent_at: string;
  expires_at: string;
  activated_at: string | null;
}

export function PendingInvitationsList() {
  const [invitations, setInvitations] = useState<ProspectInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState<string | null>(null);

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from("prospect_invitations")
        .select("*")
        .order("sent_at", { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error: any) {
      console.error("Error fetching invitations:", error);
      toast.error("Failed to load invitations");
    } finally {
      setLoading(false);
    }
  };

  const resendInvitation = async (invitationId: string, email: string) => {
    setResending(invitationId);
    try {
      // Update the invitation to resend status and generate new token
      const newToken = crypto.randomUUID() + "-" + Date.now();
      const { error } = await supabase
        .from("prospect_invitations")
        .update({
          magic_token: newToken,
          status: "pending",
          sent_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq("id", invitationId);

      if (error) throw error;

      toast.success("Invitation resent successfully!");
      fetchInvitations();
    } catch (error: any) {
      console.error("Error resending invitation:", error);
      toast.error("Failed to resend invitation");
    } finally {
      setResending(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "activated":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "activated":
        return "bg-green-100 text-green-800 border-green-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Pending Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading invitations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Prospect Invitations
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchInvitations}
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No invitations sent yet. Use the "Invite Prospect" button to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => {
              const expired = isExpired(invitation.expires_at);
              const status = expired && invitation.status === "pending" ? "expired" : invitation.status;
              
              return (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(status)}
                      <span className="font-medium">{invitation.email}</span>
                      <Badge
                        variant="outline"
                        className={getStatusColor(status)}
                      >
                        {status}
                      </Badge>
                      <Badge variant="secondary">
                        {invitation.client_segment}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Sent {formatDistanceToNow(new Date(invitation.sent_at))} ago
                      {invitation.activated_at && (
                        <span className="ml-2">
                          • Activated {formatDistanceToNow(new Date(invitation.activated_at))} ago
                        </span>
                      )}
                      {!invitation.activated_at && (
                        <span className="ml-2">
                          • Expires {formatDistanceToNow(new Date(invitation.expires_at))} from now
                        </span>
                      )}
                    </div>
                    
                    {invitation.personal_note && (
                      <div className="text-sm text-muted-foreground mt-1 italic">
                        "{invitation.personal_note}"
                      </div>
                    )}
                  </div>
                  
                  {(status === "expired" || status === "pending") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resendInvitation(invitation.id, invitation.email)}
                      disabled={resending === invitation.id}
                    >
                      {resending === invitation.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Resend"
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}