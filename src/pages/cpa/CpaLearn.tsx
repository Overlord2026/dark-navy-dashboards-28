import React from 'react';
import { BrandHeader } from '@/components/layout/BrandHeader';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Award, Clock, Calendar, CheckCircle } from 'lucide-react';

export default function CpaLearn() {
  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <section className="bfo-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-bfo-gold" />
              <h1 className="text-3xl font-bold">CPA Learning Center</h1>
            </div>
            <p className="text-muted-foreground mb-6">
              Track CE requirements, access professional development courses, and maintain your certifications
            </p>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bfo-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-bfo-gold" />
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
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Specialty Hours</span>
                    <span>16 / 32</span>
                  </div>
                  <Progress value={50} className="mb-2" />
                </div>
                <Button className="w-full gold-outline-button">
                  View Detailed Report
                </Button>
              </div>
            </div>
            
            <div className="bfo-card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-bfo-gold" />
                Upcoming Deadlines
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">State License Renewal</span>
                  <Badge variant="destructive">45 days</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">AICPA Membership</span>
                  <Badge variant="secondary">120 days</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ethics Requirement</span>
                  <Badge variant="destructive">15 days</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">CPE Reporting</span>
                  <Badge variant="outline">300 days</Badge>
                </div>
              </div>
            </div>
            
            <div className="bfo-card p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full gold-button">
                  Browse Course Catalog
                </Button>
                <Button className="w-full gold-outline-button">
                  Upload CE Certificate
                </Button>
                <Button className="w-full gold-outline-button">
                  State Requirements
                </Button>
                <Button className="w-full gold-outline-button">
                  Schedule Exam
                </Button>
              </div>
            </div>
          </div>
          
          <section className="bfo-card p-6">
            <h2 className="text-xl font-semibold mb-4">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Tax Update 2024</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Latest tax law changes and their impact on practice
                </p>
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="outline">8 Hours CE</Badge>
                  <Badge variant="secondary">New</Badge>
                </div>
                <Button size="sm" className="w-full gold-outline-button">
                  Enroll Now
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Ethics in Practice</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Professional ethics and responsibility for CPAs
                </p>
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="outline">4 Hours CE</Badge>
                  <Badge variant="default">Ethics</Badge>
                </div>
                <Button size="sm" className="w-full gold-outline-button">
                  Enroll Now
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Estate Planning Strategies</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Advanced estate tax planning and wealth transfer techniques
                </p>
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="outline">6 Hours CE</Badge>
                  <Badge variant="secondary">Advanced</Badge>
                </div>
                <Button size="sm" className="w-full gold-outline-button">
                  Enroll Now
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Cryptocurrency Taxation</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Digital assets and crypto tax compliance
                </p>
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="outline">4 Hours CE</Badge>
                  <Badge variant="secondary">Trending</Badge>
                </div>
                <Button size="sm" className="w-full gold-outline-button">
                  Enroll Now
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Business Valuation</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Valuation methods for tax and financial reporting
                </p>
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="outline">8 Hours CE</Badge>
                  <Badge variant="outline">Popular</Badge>
                </div>
                <Button size="sm" className="w-full gold-outline-button">
                  Enroll Now
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Client Communication</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Effective client relationship management
                </p>
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="outline">2 Hours CE</Badge>
                  <Badge variant="outline">Soft Skills</Badge>
                </div>
                <Button size="sm" className="w-full gold-outline-button">
                  Enroll Now
                </Button>
              </div>
            </div>
          </section>
          
          <section className="bfo-card p-6">
            <h2 className="text-xl font-semibold mb-4">Certification Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">CPA License - NY</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Active through: December 2024
                </p>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold">AICPA Membership</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Renewal due: March 2025
                </p>
                <Button size="sm" variant="outline">
                  Renew Now
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}