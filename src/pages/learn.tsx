import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, FileText, Users, ArrowRight } from 'lucide-react';

export default function LearnLanding() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Learn & <span className="text-[#D4AF37]">Grow</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Educational resources, expert insights, and family office best practices
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-gold px-8 py-3 text-lg">
              60-Second Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-8 py-3 text-lg">
              Browse Resources
            </Button>
          </div>
        </div>
      </section>

      {/* Learning Categories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Learning Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bfo-card text-center">
              <BookOpen className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Articles</h3>
              <p className="text-white/70 text-sm">In-depth guides and insights</p>
            </Card>
            
            <Card className="bfo-card text-center">
              <Video className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Videos</h3>
              <p className="text-white/70 text-sm">Expert presentations</p>
            </Card>
            
            <Card className="bfo-card text-center">
              <FileText className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">White Papers</h3>
              <p className="text-white/70 text-sm">Research and analysis</p>
            </Card>
            
            <Card className="bfo-card text-center">
              <Users className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Webinars</h3>
              <p className="text-white/70 text-sm">Live expert sessions</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Learning Content</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bfo-card">
              <div className="aspect-video bg-[#D4AF37]/20 rounded-lg mb-4 flex items-center justify-center">
                <Video className="h-12 w-12 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Family Office Fundamentals</h3>
              <p className="text-white/70 mb-4">Essential concepts for high-net-worth families</p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Watch Now
              </Button>
            </Card>

            <Card className="bfo-card">
              <div className="aspect-video bg-[#D4AF37]/20 rounded-lg mb-4 flex items-center justify-center">
                <FileText className="h-12 w-12 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Estate Planning Strategies</h3>
              <p className="text-white/70 mb-4">Advanced techniques for wealth preservation</p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Read More
              </Button>
            </Card>

            <Card className="bfo-card">
              <div className="aspect-video bg-[#D4AF37]/20 rounded-lg mb-4 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Investment Trends 2024</h3>
              <p className="text-white/70 mb-4">Market insights and opportunities</p>
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                Download
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Knowledge Base */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Knowledge Base</h2>
            <p className="text-white/80">Comprehensive resources organized by topic</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bfo-card">
              <h3 className="text-xl font-semibold mb-4">Financial Planning</h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center gap-3">
                  <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
                  Retirement Planning Strategies
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
                  Investment Portfolio Management
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
                  Tax Optimization Techniques
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
                  Risk Management Solutions
                </li>
              </ul>
            </Card>

            <Card className="bfo-card">
              <h3 className="text-xl font-semibold mb-4">Family Governance</h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center gap-3">
                  <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
                  Family Constitution Development
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
                  Next Generation Preparation
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
                  Communication Best Practices
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
                  Values and Legacy Planning
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Expand Your Knowledge
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Access our complete library of educational resources and expert insights.
          </p>
          <Button className="btn-gold px-8 py-3 text-lg">
            Start Learning Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}