import React, { useEffect, useRef } from 'react';
import { TreePine, Users, TrendingUp, Shield, Heart, GraduationCap, Building, Store, UserCheck, Briefcase } from 'lucide-react';

export const AnimatedTreeHero: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Animation logic for tree branches growing and glowing
    const svg = svgRef.current;
    if (!svg) return;

    const branches = svg.querySelectorAll('.branch');
    const leaves = svg.querySelectorAll('.leaf');
    const labels = svg.querySelectorAll('.branch-label');

    // Animate branches growing
    branches.forEach((branch, index) => {
      setTimeout(() => {
        branch.classList.add('animate-draw');
      }, index * 200);
    });

    // Animate leaves appearing
    setTimeout(() => {
      leaves.forEach((leaf, index) => {
        setTimeout(() => {
          leaf.classList.add('animate-scale-in');
        }, index * 100);
      });
    }, 1000);

    // Animate labels appearing
    setTimeout(() => {
      labels.forEach((label, index) => {
        setTimeout(() => {
          label.classList.add('animate-fade-in');
        }, index * 150);
      });
    }, 1500);
  }, []);

  const categories = [
    { name: 'Investments', icon: TrendingUp, position: { x: 15, y: 25 }, angle: 45 },
    { name: 'Estate Planning', icon: Shield, position: { x: 85, y: 30 }, angle: -45 },
    { name: 'Healthcare', icon: Heart, position: { x: 25, y: 15 }, angle: 30 },
    { name: 'Education', icon: GraduationCap, position: { x: 75, y: 20 }, angle: -30 },
    { name: 'Lending', icon: Building, position: { x: 35, y: 35 }, angle: 60 },
    { name: 'Marketplace', icon: Store, position: { x: 65, y: 35 }, angle: -60 },
    { name: 'Compliance', icon: UserCheck, position: { x: 45, y: 10 }, angle: 0 },
    { name: 'Collaboration', icon: Users, position: { x: 55, y: 40 }, angle: 15 },
  ];

  return (
    <div className="relative w-full h-full max-h-[60vh] flex items-center justify-center">
      <svg
        ref={svgRef}
        className="w-full h-full max-w-4xl object-contain"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tree Trunk */}
        <rect
          x="390"
          y="450"
          width="20"
          height="100"
          fill="url(#trunkGradient)"
          rx="10"
          className="animate-scale-in"
        />

        {/* Main Tree Structure */}
        <g className="tree-branches">
          {/* Central trunk line */}
          <line
            x1="400"
            y1="450"
            x2="400"
            y2="300"
            stroke="url(#goldGradient)"
            strokeWidth="6"
            className="branch animate-draw"
            strokeDasharray="150"
            strokeDashoffset="150"
          />

          {/* Primary branches */}
          {categories.map((category, index) => {
            const centerX = 400;
            const centerY = 300;
            const branchX = (category.position.x / 100) * 600 + 100;
            const branchY = (category.position.y / 100) * 200 + 150;

            return (
              <g key={category.name} className="branch-group">
                {/* Branch line */}
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={branchX}
                  y2={branchY}
                  stroke="url(#goldGradient)"
                  strokeWidth="4"
                  className="branch animate-draw"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                  style={{ animationDelay: `${index * 200}ms` }}
                />

                {/* Glowing orb at branch end */}
                <circle
                  cx={branchX}
                  cy={branchY}
                  r="8"
                  fill="url(#leafGradient)"
                  className="leaf animate-scale-in glow-pulse"
                  style={{ animationDelay: `${1000 + index * 100}ms` }}
                />

                {/* Category label */}
                <g
                  className="branch-label opacity-0"
                  style={{ animationDelay: `${1500 + index * 150}ms` }}
                >
                  <rect
                    x={branchX - 40}
                    y={branchY - 25}
                    width="80"
                    height="20"
                    fill="rgba(0, 0, 0, 0.8)"
                    rx="10"
                    className="backdrop-blur-sm"
                  />
                  <text
                    x={branchX}
                    y={branchY - 10}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gold"
                    style={{ fontSize: '10px' }}
                  >
                    {category.name}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* Golden Tree Icon at Center */}
        <g className="tree-icon animate-scale-in" style={{ animationDelay: '500ms' }}>
          <circle
            cx="400"
            cy="300"
            r="30"
            fill="url(#goldRadial)"
            className="glow-pulse"
          />
          <TreePine
            x="385"
            y="285"
            width="30"
            height="30"
            className="text-navy"
          />
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(51, 100%, 60%)" />
            <stop offset="100%" stopColor="hsl(45, 100%, 50%)" />
          </linearGradient>

          <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(30, 40%, 30%)" />
            <stop offset="100%" stopColor="hsl(25, 45%, 25%)" />
          </linearGradient>

          <radialGradient id="goldRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(51, 100%, 70%)" />
            <stop offset="100%" stopColor="hsl(45, 100%, 50%)" />
          </radialGradient>

          <radialGradient id="leafGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(158, 64%, 60%)" />
            <stop offset="100%" stopColor="hsl(158, 64%, 45%)" />
          </radialGradient>
        </defs>
      </svg>

      <style>{`
        .animate-draw {
          animation: draw 1.5s ease-out forwards;
        }

        .glow-pulse {
          filter: drop-shadow(0 0 8px hsl(51, 100%, 50%));
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes glow {
          from {
            filter: drop-shadow(0 0 8px hsl(51, 100%, 50%));
          }
          to {
            filter: drop-shadow(0 0 16px hsl(51, 100%, 60%));
          }
        }

        .branch-label {
          transition: opacity 0.5s ease-in-out;
        }

        .branch-label.animate-fade-in {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};