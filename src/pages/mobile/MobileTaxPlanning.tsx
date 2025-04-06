
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Link } from "react-router-dom";
import { 
  Calculator, 
  BookOpen, 
  ArrowRight, 
  PieChart,
  BarChart,
  FileText,
  Calendar,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MobileTaxPlanning() {
  return (
    <MobileLayout title="Tax Planning">
      <div className="p-4 space-y-6 pb-20">
        {/* Introduction */}
        <div>
          <h2 className="text-xl font-bold mb-2">Tax Planning Education</h2>
          <p className="text-gray-400 text-sm">
            Learn strategies to optimize your tax situation and reduce your tax burden.
          </p>
        </div>

        {/* Featured Courses */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Featured Courses</h3>

          <Card className="bg-[#1B1B32] border border-[#2A2A45]">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-green-400" />
                Tax Planning Essentials
              </CardTitle>
              <CardDescription className="text-xs">
                Learn fundamental tax strategies
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-400">
                  <span className="mr-2">Beginner</span>
                  <span>2 hours</span>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  Start <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1B1B32] border border-[#2A2A45]">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base flex items-center">
                <Calculator className="h-4 w-4 mr-2 text-blue-400" />
                Tax-Efficient Investing
              </CardTitle>
              <CardDescription className="text-xs">
                Structure investments for tax optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-400">
                  <span className="mr-2">Intermediate</span>
                  <span>2.5 hours</span>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  Start <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tax Planning Tools */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Tax Planning Tools</h3>
          
          <Card className="bg-[#1B1B32] border border-[#2A2A45]">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="mr-4 p-2 bg-[#2A2A45] rounded-full">
                  <PieChart className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium">Roth Conversion Calculator</h3>
                  <p className="text-xs text-gray-400">
                    Analyze the benefits of converting to a Roth IRA
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1B1B32] border border-[#2A2A45]">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="mr-4 p-2 bg-[#2A2A45] rounded-full">
                  <Calendar className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-medium">Tax Calendar</h3>
                  <p className="text-xs text-gray-400">
                    Important dates and deadlines
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tax Resources */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Resources</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-[#1B1B32] border border-[#2A2A45]">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <FileText className="h-6 w-6 mb-2 text-blue-400" />
                  <h4 className="text-sm font-medium">Tax Guides</h4>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1B1B32] border border-[#2A2A45]">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <BarChart className="h-6 w-6 mb-2 text-green-400" />
                  <h4 className="text-sm font-medium">Tax Strategies</h4>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1B1B32] border border-[#2A2A45]">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <Building className="h-6 w-6 mb-2 text-purple-400" />
                  <h4 className="text-sm font-medium">State Planning</h4>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1B1B32] border border-[#2A2A45]">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <Calculator className="h-6 w-6 mb-2 text-orange-400" />
                  <h4 className="text-sm font-medium">Calculators</h4>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
