
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, Info, ArrowRight } from 'lucide-react';

export const MobileEducationResources = () => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Other Resources</h3>
      <Card className="bg-[#1B1B32] border border-[#2A2A45]">
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="mr-4 p-2 bg-[#2A2A45] rounded-full">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium">Financial Guides</h3>
              <p className="text-xs text-gray-400">Essential guides for financial planning</p>
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
              <BookOpen className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-medium">Recommended Books</h3>
              <p className="text-xs text-gray-400">Essential financial literature</p>
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
              <Info className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium">Financial Calculators</h3>
              <p className="text-xs text-gray-400">Tools to help with financial decisions</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
