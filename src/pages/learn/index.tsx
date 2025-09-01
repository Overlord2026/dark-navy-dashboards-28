import React from 'react';
import { Hero } from '@/components/landing/Hero';
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
      <Hero
        title="Learning & Development"
        subtitle="Expand your knowledge with comprehensive educational resources and professional development"
        onCtaClick={handleDemoClick}
      />

      <ToolsGrid
        tools={learningTools}
        title="Learning Resources"
      />
    </div>
  );
}