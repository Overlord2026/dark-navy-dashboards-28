import React from 'react';
import { ToolsGrid } from '@/components/landing/ToolsGrid';
import { BookOpen, Video, Users, Award, MessageSquare, Lightbulb } from 'lucide-react';

const learningTools = [
  {
    title: 'Knowledge Library',
    description: 'Comprehensive library of wealth management education',
    icon: BookOpen,
    href: '/learn/library'
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step video guides for platform features',
    icon: Video,
    href: '/learn/videos'
  },
  {
    title: 'Webinar Series',
    description: 'Live and recorded expert sessions on financial topics',
    icon: Users,
    href: '/learn/webinars'
  },
  {
    title: 'Certification Courses',
    description: 'Professional development and continuing education',
    icon: Award,
    href: '/learn/certification'
  },
  {
    title: 'Community Forum',
    description: 'Connect and learn from other platform users',
    icon: MessageSquare,
    href: '/learn/community'
  },
  {
    title: 'Best Practices',
    description: 'Industry insights and proven strategies',
    icon: Lightbulb,
    href: '/learn/best-practices'
  }
];

export default function LearnIndex() {
  const handleDemoClick = () => {
    // Placeholder for demo functionality
    console.log('Starting learning demo');
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-black))]">
      <section className="relative overflow-hidden bg-bfo-navy text-bfo-ivory">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Learning & Development
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80">
              Expand your knowledge with comprehensive educational resources and professional development
            </p>
          </div>
        </div>
      </section>

      <ToolsGrid
        tools={learningTools}
        title="Learning Resources"
      />
    </div>
  );
}