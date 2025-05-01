
import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export interface SegmentCardProps {
  id: string;
  label: string;
  description: string;
  bulletPoints: string[];
  icon: React.ElementType;
  tagline: string;
  buttonText: string;
  onClick: (segmentId: string) => void;
  isMobile: boolean;
  benefits?: string[];
}

export const SegmentCard: React.FC<SegmentCardProps> = ({
  id,
  label,
  description,
  bulletPoints,
  icon: Icon,
  tagline,
  buttonText,
  onClick,
  isMobile,
  benefits,
}) => {
  const navigate = useNavigate();

  const handleMainButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/auth?segment=${id}`);
  };

  const handleTrialButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/auth?segment=${id}&trial=true`);
  };

  return (
    <div 
      className={`
        bg-black bg-opacity-30 backdrop-blur-md border border-white/10
        rounded-2xl p-6 flex flex-col
        hover:bg-opacity-40 transition-all duration-300
        ${isMobile ? 'mx-4' : ''}
      `}
    >
      <div className="flex items-center mb-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md mr-3">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="bg-gradient-to-r from-blue-300 to-purple-300 text-transparent bg-clip-text font-semibold">
          {tagline}
        </span>
      </div>
      
      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{label}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      
      <div className="flex-grow">
        <ul className="space-y-2 mb-6">
          {bulletPoints.map((point, index) => (
            <li key={index} className="flex items-start">
              <Check className="min-w-[16px] h-4 text-green-400 mt-1 mr-2" />
              <span className="text-gray-200 text-sm">{point}</span>
            </li>
          ))}
        </ul>
        
        {benefits && benefits.length > 0 && (
          <div className="mt-4 mb-6">
            <h4 className="text-white font-semibold mb-2">Additional Benefits:</h4>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <Check className="min-w-[16px] h-4 text-blue-400 mt-1 mr-2" />
                  <span className="text-gray-200 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-2">
        <button 
          onClick={handleMainButtonClick}
          className="
            w-full py-3 px-4 bg-white bg-opacity-10 hover:bg-opacity-20
            text-white font-medium rounded-lg transition-all duration-300
            flex items-center justify-center
          "
        >
          {buttonText}
          <ArrowRight className="ml-2 w-4 h-4" />
        </button>
        
        <button 
          onClick={handleTrialButtonClick}
          className="
            w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
            text-white font-medium rounded-lg transition-all duration-300
            flex items-center justify-center text-sm
          "
        >
          Start 90-Day Free Trial
          <ArrowRight className="ml-2 w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
