// TODO: flesh out per /out/CPA_UX_Wireframes.md
import React from 'react';
import { BrandHeader } from '@/components/site/BrandHeader';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Award, Clock } from 'lucide-react';

export default function ContinuingEducation() {
  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <section className="bfo-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-gold" />
              <h1 className="text-3xl font-bold">Continuing Education Center</h1>
            </div>
            <p className="text-muted-foreground mb-6">
              Track your CE requirements and access professional development courses
            </p>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bfo-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-gold" />
                CE Progress
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Total Hours (2024)</span>
                    <span>24 / 40</span>
                  </div>
                  <Progress value={60} className="mb-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Ethics Hours</span>
                    <span>2 / 4</span>
                  </div>
                  <Progress value={50} className="mb-2" />
                </div>
                <Button className="w-full gold-outline-button">
                  View Full Report
                </Button>
              </div>
            </div>
            
            <div className="bfo-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-gold" />
                Upcoming Deadlines
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">State License Renewal</span>
                  <span className="text-sm font-semibold text-orange-600">45 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">AICPA Membership</span>
                  <span className="text-sm font-semibold text-green-600">120 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ethics Requirement</span>
                  <span className="text-sm font-semibold text-red-600">15 days</span>
                </div>
              </div>
            </div>
            
            <div className="bfo-card p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full gold-button">
                  Browse Courses
                </Button>
                <Button className="w-full gold-outline-button">
                  Upload Certificate
                </Button>
                <Button className="w-full gold-outline-button">
                  State Requirements
                </Button>
              </div>
            </div>
          </div>
          
          <section className="bfo-card p-6">
            <h2 className="text-xl font-semibold mb-4">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Tax Update 2024</h3>
                <p className="text-sm text-muted-foreground mb-3">Latest tax law changes and their impact</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">8 Hours CE</span>
                  <Button size="sm" className="gold-outline-button">Enroll</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Ethics in Practice</h3>
                <p className="text-sm text-muted-foreground mb-3">Professional ethics and responsibility</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">4 Hours CE</span>
                  <Button size="sm" className="gold-outline-button">Enroll</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Estate Planning</h3>
                <p className="text-sm text-muted-foreground mb-3">Advanced estate tax strategies</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">6 Hours CE</span>
                  <Button size="sm" className="gold-outline-button">Enroll</Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}