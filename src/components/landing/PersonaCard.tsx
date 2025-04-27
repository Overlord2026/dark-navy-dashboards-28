
import React from 'react';

interface Props { 
  title: string; 
  subtitle: string; 
  onClick(): void;
}

export default function PersonaCard({ title, subtitle, onClick }: Props) {
  return (
    <div 
      onClick={onClick}
      className="cursor-pointer p-6 rounded-lg border-2 border-transparent hover:border-[#D4AF37] transition-all hover:shadow-xl"
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-gray-400">{subtitle}</p>
    </div>
  );
}
