import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TargetIcon, CalendarIcon, StarIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

const GoalsBudgets = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Goals & Budgets</h1>
          <p className="text-muted-foreground">Track your financial goals and manage budgets</p>
        </div>
        <Button asChild>
          <Link to="/wealth/goals/retirement">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Goal
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="retirement">Retirement Goals</TabsTrigger>
          <TabsTrigger value="bucket-list">Bucket-List Goals</TabsTrigger>
          <TabsTrigger value="budgets" disabled>Budgets (Coming Soon)</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Retirement Goals
                </CardTitle>
                <CardDescription>Plan for your retirement future</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/wealth/goals/retirement">Manage Goals</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StarIcon className="h-5 w-5" />
                  Bucket-List Goals
                </CardTitle>
                <CardDescription>Track your personal aspirations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/wealth/goals/bucket-list">View Goals</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="opacity-60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TargetIcon className="h-5 w-5" />
                  Budgets
                </CardTitle>
                <CardDescription>Coming Soon</CardDescription>
              </CardHeader>
              <CardContent>
                <Button disabled className="w-full">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retirement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Retirement Planning</CardTitle>
              <CardDescription>Comprehensive retirement goal tracking and planning</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Retirement planning features will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bucket-list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bucket-List Goals</CardTitle>
              <CardDescription>Track and plan for your personal aspirations</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Bucket-list goal features will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Management</CardTitle>
              <CardDescription>Coming Soon - Comprehensive budget tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Budget management features are in development.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoalsBudgets;