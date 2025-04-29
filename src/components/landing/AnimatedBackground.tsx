
import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <style>
      {`
        .landing-animated-bg {
          background-image: radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, rgba(10, 31, 68, 0) 70%);
          position: relative;
        }
        
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.03) 0%, transparent 20%),
            radial-gradient(circle at 80% 40%, rgba(212, 175, 55, 0.03) 0%, transparent 20%),
            radial-gradient(circle at 30% 70%, rgba(212, 175, 55, 0.03) 0%, transparent 20%),
            radial-gradient(circle at 70% 90%, rgba(212, 175, 55, 0.03) 0%, transparent 20%);
          animation: shiftBackground 20s ease-in-out infinite;
        }
        
        @keyframes shiftBackground {
          0% { background-position: 0% 0%; }
          25% { background-position: 10% 5%; }
          50% { background-position: 5% 10%; }
          75% { background-position: -5% 5%; }
          100% { background-position: 0% 0%; }
        }
        
        .segment-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
      `}
    </style>
  );
};
