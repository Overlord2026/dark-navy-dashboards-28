import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLinkIcon, PlusCircleIcon, TrashIcon, UserIcon, CalendarIcon, BellRingIcon } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

type EstimatesByAge = {
  age62: number;
  age67: number;
  age70: number;
};

type FamilyMemberAccount = {
  id: string;
  name: string;
  relationship: string;
  estimates: EstimatesByAge;
  preferredRetirementAge: number;
  accountLinked: boolean;
};

export const SocialSecurityTracker = () => {
  const { userProfile } = useUser();
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberAccount[]>([
    {
      id: "1",
      name: userProfile?.firstName && userProfile?.lastName 
        ? `${userProfile.firstName} ${userProfile.lastName}` 
        : "Primary User",
      relationship: "Self",
      estimates: {
        age62: 2100,
        age67: 2800,
        age70: 3500
      },
      preferredRetirementAge: 67,
      accountLinked: true
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<Omit<FamilyMemberAccount, "id" | "accountLinked" | "estimates">>({
    name: "",
    relationship: "",
    preferredRetirementAge: 67
  });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.relationship) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    const id = Date.now().toString();
    setFamilyMembers([...familyMembers, {
      ...newMember,
      id,
      estimates: {
        age62: 0,
        age67: 0,
        age70: 0
      },
      accountLinked: false
    }]);
    
    setNewMember({
      name: "",
      relationship: "",
      preferredRetirementAge: 67
    });
    
    setIsAddDialogOpen(false);
    toast.success("Family member added successfully");
  };

  const handleLinkAccount = (id: string) => {
    // In a real implementation, this would open SSA.gov authentication
    window.open("https://www.ssa.gov/myaccount/", "_blank");
    
    // For demo purposes, we'll just update the state with estimated values
    setTimeout(() => {
      setFamilyMembers(members => 
        members.map(member => {
          if (member.id === id) {
            // Generate realistic estimates based on age
            const baseEstimate = 2000 + Math.floor(Math.random() * 1000);
            return { 
              ...member, 
              accountLinked: true,
              estimates: {
                age62: Math.floor(baseEstimate * 0.75),
                age67: baseEstimate,
                age70: Math.floor(baseEstimate * 1.25)
              }
            };
          }
          return member;
        })
      );
      toast.success("Account linked successfully - benefit estimates updated");
    }, 1000);
  };

  const handleRemoveMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
    toast.success("Family member removed");
  };

  const calculateAnnualBenefit = (monthlyEstimate: number) => {
    return monthlyEstimate * 12;
  };

  const handleGetAssistance = () => {
    toast.success("Your request for assistance has been sent to your advisor");
    // In a real app, this would send a notification to the advisor
  };

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
                    value={newMember.preferredRetirementAge}
                    onChange={(e) => setNewMember({...newMember, preferredRetirementAge: Number(e.target.value)})}
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
        {familyMembers.map((member) => (
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
                {member.id !== "1" && (
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
              {member.accountLinked ? (
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded-md space-y-2">
                    <h4 className="font-medium text-sm flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Retirement Benefit Estimates
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-card p-2 rounded border">
                        <div className="text-xs text-muted-foreground">Age 62</div>
                        <div className="font-medium">${member.estimates.age62}</div>
                        <div className="text-xs text-muted-foreground">per month</div>
                      </div>
                      <div className="bg-card p-2 rounded border border-primary">
                        <div className="text-xs text-muted-foreground">Age 67</div>
                        <div className="font-medium">${member.estimates.age67}</div>
                        <div className="text-xs text-muted-foreground">per month</div>
                      </div>
                      <div className="bg-card p-2 rounded border">
                        <div className="text-xs text-muted-foreground">Age 70</div>
                        <div className="font-medium">${member.estimates.age70}</div>
                        <div className="text-xs text-muted-foreground">per month</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-sm text-muted-foreground">Preferred Retirement Age:</span>
                    <span className="text-sm font-medium">{member.preferredRetirementAge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Annual at preferred age:</span>
                    <span className="text-sm font-medium">
                      ${calculateAnnualBenefit(
                        member.preferredRetirementAge <= 62 ? member.estimates.age62 : 
                        member.preferredRetirementAge >= 70 ? member.estimates.age70 : 
                        member.estimates.age67
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
                    <span className="text-sm font-medium">{member.preferredRetirementAge}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-muted-foreground">Account Status:</span>
                <span className={`text-sm font-medium ${member.accountLinked ? 'text-green-500' : 'text-yellow-500'}`}>
                  {member.accountLinked ? 'Linked' : 'Not Linked'}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              {member.accountLinked ? (
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
