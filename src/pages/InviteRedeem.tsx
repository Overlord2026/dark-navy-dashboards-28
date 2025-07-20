import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus, Shield, CheckCircle } from "lucide-react";

interface InvitationData {
  id: string;
  email: string;
  advisor_id: string;
  client_segment: string;
  personal_note: string | null;
  status: string;
  expires_at: string;
  advisor_name?: string;
}

export default function InviteRedeem() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: "",
    clientSegment: "",
  });

  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  const validateToken = async () => {
    try {
      // Get invitation details
      const { data: invitationData, error: invitationError } = await supabase
        .from("prospect_invitations")
        .select(`
          id,
          email,
          advisor_id,
          client_segment,
          personal_note,
          status,
          expires_at
        `)
        .eq("magic_token", token)
        .eq("status", "pending")
        .single();

      if (invitationError || !invitationData) {
        throw new Error("Invalid or expired invitation link");
      }

      // Check if expired
      if (new Date(invitationData.expires_at) < new Date()) {
        throw new Error("This invitation has expired");
      }

      // Get advisor details
      const { data: advisorData, error: advisorError } = await supabase
        .from("profiles")
        .select("display_name, first_name, last_name")
        .eq("id", invitationData.advisor_id)
        .single();

      const advisorName = advisorData?.display_name || 
                         `${advisorData?.first_name} ${advisorData?.last_name}` || 
                         "Your Advisor";

      setInvitation({
        ...invitationData,
        advisor_name: advisorName
      });

      setFormData(prev => ({
        ...prev,
        clientSegment: invitationData.client_segment
      }));

    } catch (error: any) {
      console.error("Error validating token:", error);
      toast.error(error.message || "Invalid invitation link");
      setTimeout(() => navigate("/"), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitation!.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            email: invitation!.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            display_name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
            date_of_birth: formData.dateOfBirth || null,
            role: "client",
            lead_stage: "qualified",
            client_segment: formData.clientSegment,
            advisor_id: invitation!.advisor_id,
            tenant_id: "default", // You may want to get this from the advisor
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Don't throw here, as the user is already created
        }

        // Update invitation status
        await supabase
          .from("prospect_invitations")
          .update({
            status: "activated",
            activated_at: new Date().toISOString()
          })
          .eq("id", invitation!.id);

        toast.success("Welcome! Your account has been created successfully.");
        
        // Navigate to dashboard or onboarding
        setTimeout(() => {
          navigate("/", { state: { 
            welcomeMessage: `Welcome! You've been connected with ${invitation!.advisor_name} as your advisor.` 
          }});
        }, 1500);
      }

    } catch (error: any) {
      console.error("Error creating account:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">Loading invitation...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2">Invalid Invitation</h2>
              <p className="text-muted-foreground mb-4">
                This invitation link is invalid or has expired.
              </p>
              <Button onClick={() => navigate("/")}>
                Go to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <UserPlus className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome to Boutique Family Office!</CardTitle>
            <p className="text-muted-foreground">
              {invitation.advisor_name} has invited you to join. Complete your profile to get started.
            </p>
            
            {invitation.personal_note && (
              <div className="bg-accent p-4 rounded-lg mt-4">
                <h4 className="font-medium mb-2">Personal Message from {invitation.advisor_name}:</h4>
                <p className="text-sm italic">"{invitation.personal_note}"</p>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={invitation.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              {/* Password Setup */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password Setup</h3>
                
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Optional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information (Optional)</h3>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  "Creating Account..."
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Registration
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}