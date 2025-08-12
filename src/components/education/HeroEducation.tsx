import React from 'react';
import { PlayCircle, BookOpen, Users } from 'lucide-react';

const HeroEducation = () => {
  const title = "Financial Education Center";
  const subtitle = "Comprehensive guides, courses, and resources to enhance your financial knowledge.";
  const pills = [
    { label: "Interactive Courses", icon: PlayCircle },
    { label: "Expert Guides", icon: BookOpen },
    { label: "Community Resources", icon: Users }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10 sm:pt-20 sm:pb-14">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white">
            {title}
          </h1>
          
          <p className="mt-4 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
            {subtitle}
          </p>
          
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {pills.map((pill, index) => {
              const Icon = pill.icon;
              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/40 px-3 py-1 text-sm text-slate-200"
                >
                  <Icon className="h-4 w-4" />
                  {pill.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroEducation;