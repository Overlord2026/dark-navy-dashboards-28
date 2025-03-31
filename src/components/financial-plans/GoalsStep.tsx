
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Goal {
  id: string;
  name: string;
  priority: string;
}

interface GoalsStepProps {
  goals: Goal[];
  onGoalUpdate: (goals: Goal[]) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const GoalsStep = ({ goals, onGoalUpdate, onNextStep, onPrevStep }: GoalsStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Goals</h2>
      <p className="text-muted-foreground">
        Set your financial goals to create a personalized plan.
      </p>
      {/* Goal input fields and list will go here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="goal-name">Goal Name</Label>
          <Input id="goal-name" type="text" placeholder="Retirement" />
        </div>
        <div>
          <Label htmlFor="goal-priority">Priority</Label>
          <Select>
            <SelectTrigger className="bg-[#1A2333] border-blue-900/30">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A2333] border-blue-900/30">
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevStep}>Previous</Button>
        <Button onClick={onNextStep}>Next</Button>
      </div>
    </div>
  );
};
