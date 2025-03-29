
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLinkIcon, PlusCircleIcon, TrashIcon, UserIcon } from "lucide-react";
import { toast } from "sonner";

type FamilyMemberAccount = {
  id: string;
  name: string;
  relationship: string;
  monthlyEstimate: number;
  retirementAge: number;
  accountLinked: boolean;
};

export const SocialSecurityTracker = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberAccount[]>([
    {
      id: "1",
      name: "Anthony Gomez",
      relationship: "Self",
      monthlyEstimate: 2800,
      retirementAge: 67,
      accountLinked: true
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<Omit<FamilyMemberAccount, "id" | "accountLinked">>({
    name: "",
    relationship: "",
    monthlyEstimate: 0,
    retirementAge: 67
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
      accountLinked: false
    }]);
    
    setNewMember({
      name: "",
      relationship: "",
      monthlyEstimate: 0,
      retirementAge: 67
    });
    
    setIsAddDialogOpen(false);
    toast.success("Family member added successfully");
  };

  const handleLinkAccount = (id: string) => {
    // In a real implementation, this would open SSS.gov authentication
    window.open("https://www.ssa.gov/myaccount/", "_blank");
    
    // For demo purposes, we'll just update the state
    setTimeout(() => {
      setFamilyMembers(members => 
        members.map(member => 
          member.id === id ? { ...member, accountLinked: true } : member
        )
      );
      toast.success("Account linked successfully");
    }, 1000);
  };

  const handleRemoveMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
    toast.success("Family member removed");
  };

  const calculateAnnualBenefit = (monthlyEstimate: number) => {
    return monthlyEstimate * 12;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Family Social Security Estimates</h2>
          <p className="text-muted-foreground">Track and manage social security benefits for your family members</p>
        </div>
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
                <Label htmlFor="estimate">Monthly Estimate ($)</Label>
                <Input 
                  id="estimate" 
                  type="number" 
                  placeholder="0" 
                  value={newMember.monthlyEstimate || ''}
                  onChange={(e) => setNewMember({...newMember, monthlyEstimate: Number(e.target.value)})}
                />
                <p className="text-xs text-muted-foreground">Enter 0 if unknown, you can update after linking account</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Retirement Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  value={newMember.retirementAge}
                  onChange={(e) => setNewMember({...newMember, retirementAge: Number(e.target.value)})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMember}>Add Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Benefit:</span>
                  <span className="font-medium">${member.monthlyEstimate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annual Benefit:</span>
                  <span className="font-medium">${calculateAnnualBenefit(member.monthlyEstimate).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Retirement Age:</span>
                  <span className="font-medium">{member.retirementAge}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground">Account Status:</span>
                  <span className={`text-sm font-medium ${member.accountLinked ? 'text-green-500' : 'text-yellow-500'}`}>
                    {member.accountLinked ? 'Linked' : 'Not Linked'}
                  </span>
                </div>
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
          Social Security provides a foundation of income for millions of Americans when they retire. You can link family members' accounts to track their benefits.
        </p>
        <p className="text-muted-foreground text-sm">
          Visit <a href="https://www.ssa.gov/myaccount/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">SSA.gov</a> to create or access your account and get personalized benefit estimates.
        </p>
      </div>
    </div>
  );
};
