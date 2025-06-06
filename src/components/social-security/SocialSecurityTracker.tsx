
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLinkIcon, PlusCircleIcon, TrashIcon, UserIcon, CalendarIcon, BellRingIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSocialSecurityMembers } from "@/hooks/useSocialSecurityMembers";

export const SocialSecurityTracker = () => {
  const { members, isLoading, addMember, deleteMember, linkAccount } = useSocialSecurityMembers();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    relationship: "",
    preferred_retirement_age: 67
  });

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.relationship) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    try {
      await addMember({
        name: newMember.name,
        relationship: newMember.relationship,
        preferred_retirement_age: newMember.preferred_retirement_age,
        account_linked: false
      });
      
      setNewMember({
        name: "",
        relationship: "",
        preferred_retirement_age: 67
      });
      
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleLinkAccount = async (id: string) => {
    // In a real implementation, this would open SSA.gov authentication
    window.open("https://www.ssa.gov/myaccount/", "_blank");
    
    // Simulate the linking process
    setTimeout(async () => {
      try {
        await linkAccount(id);
      } catch (error) {
        // Error is already handled in the hook
      }
    }, 1000);
  };

  const handleRemoveMember = async (id: string) => {
    try {
      await deleteMember(id);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const calculateAnnualBenefit = (monthlyEstimate: number) => {
    return monthlyEstimate * 12;
  };

  const handleGetAssistance = () => {
    toast.success("Your request for assistance has been sent to your advisor");
    // In a real app, this would send a notification to the advisor
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Family Social Security Estimates</h2>
          <p className="text-muted-foreground">Track and manage social security benefits for your family members</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGetAssistance}>
            <BellRingIcon className="h-4 w-4 mr-2" />
            Get Assistance
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Add Family Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Family Member</DialogTitle>
                <DialogDescription>
                  Add a family member to track their social security benefits.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter name" 
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input 
                    id="relationship" 
                    placeholder="E.g., Spouse, Child, Parent" 
                    value={newMember.relationship}
                    onChange={(e) => setNewMember({...newMember, relationship: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retirement-age">Preferred Retirement Age</Label>
                  <Input 
                    id="retirement-age" 
                    type="number" 
                    value={newMember.preferred_retirement_age}
                    onChange={(e) => setNewMember({...newMember, preferred_retirement_age: Number(e.target.value)})}
                  />
                  <p className="text-xs text-muted-foreground">After linking to SSA.gov, we'll show estimates for various retirement ages</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddMember}>Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card key={member.id} className="border border-primary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2" />
                    {member.name}
                  </CardTitle>
                  <CardDescription>{member.relationship}</CardDescription>
                </div>
                {member.relationship !== "Self" && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveMember(member.id)}
                    className="h-8 w-8"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {member.account_linked && member.estimates ? (
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded-md space-y-2">
                    <h4 className="font-medium text-sm flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Retirement Benefit Estimates
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-card p-2 rounded border">
                        <div className="text-xs text-muted-foreground">Age 62</div>
                        <div className="font-medium">${member.estimates.age_62_estimate}</div>
                        <div className="text-xs text-muted-foreground">per month</div>
                      </div>
                      <div className="bg-card p-2 rounded border border-primary">
                        <div className="text-xs text-muted-foreground">Age 67</div>
                        <div className="font-medium">${member.estimates.age_67_estimate}</div>
                        <div className="text-xs text-muted-foreground">per month</div>
                      </div>
                      <div className="bg-card p-2 rounded border">
                        <div className="text-xs text-muted-foreground">Age 70</div>
                        <div className="font-medium">${member.estimates.age_70_estimate}</div>
                        <div className="text-xs text-muted-foreground">per month</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-sm text-muted-foreground">Preferred Retirement Age:</span>
                    <span className="text-sm font-medium">{member.preferred_retirement_age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Annual at preferred age:</span>
                    <span className="text-sm font-medium">
                      ${calculateAnnualBenefit(
                        member.preferred_retirement_age <= 62 ? member.estimates.age_62_estimate : 
                        member.preferred_retirement_age >= 70 ? member.estimates.age_70_estimate : 
                        member.estimates.age_67_estimate
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-4 text-center">
                    <p className="text-muted-foreground">
                      Link to SSA.gov to see benefit estimates for different retirement ages
                    </p>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-sm text-muted-foreground">Preferred Retirement Age:</span>
                    <span className="text-sm font-medium">{member.preferred_retirement_age}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-muted-foreground">Account Status:</span>
                <span className={`text-sm font-medium ${member.account_linked ? 'text-green-500' : 'text-yellow-500'}`}>
                  {member.account_linked ? 'Linked' : 'Not Linked'}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              {member.account_linked ? (
                <Button variant="outline" className="w-full" onClick={() => window.open("https://www.ssa.gov/myaccount/", "_blank")}>
                  View on SSA.gov
                  <ExternalLinkIcon className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button variant="default" className="w-full" onClick={() => handleLinkAccount(member.id)}>
                  Link SSA.gov Account
                  <ExternalLinkIcon className="h-4 w-4 ml-2" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="bg-card p-4 rounded-lg border border-primary mb-4">
        <h3 className="font-medium mb-2">About Social Security Benefits</h3>
        <p className="text-muted-foreground text-sm mb-2">
          Social Security provides different benefit amounts depending on when you choose to start receiving benefits:
        </p>
        <ul className="text-muted-foreground text-sm list-disc pl-5 space-y-1 mb-2">
          <li>Age 62: You'll receive reduced benefits (approximately 70-75% of your full retirement benefit)</li>
          <li>Age 67: Full retirement age for those born after 1960, where you receive 100% of your benefit</li>
          <li>Age 70: Maximum benefit (approximately 124-132% of your full retirement benefit)</li>
        </ul>
        <p className="text-muted-foreground text-sm">
          Visit <a href="https://www.ssa.gov/myaccount/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">SSA.gov</a> to create or access your account and get personalized benefit estimates.
        </p>
      </div>
    </div>
  );
};
