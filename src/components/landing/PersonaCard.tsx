
import React from 'react';

interface Props {
  title: string;
  subtitle: string;
  imagePath: string;
  onClick(): void;
}

export default function PersonaCard({ title, subtitle, imagePath, onClick }: Props) {
  return (
    <div 
      onClick={onClick}
      className="cursor-pointer rounded-xl overflow-hidden group transition-all duration-300 hover:scale-105"
    >
      <div className="relative h-80">
        <img 
          src={imagePath} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
            <p className="text-gray-200 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
