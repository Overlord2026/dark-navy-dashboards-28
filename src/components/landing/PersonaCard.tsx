
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
      className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition rounded-lg p-6 flex flex-col justify-between"
    >
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-gray-400">{subtitle}</p>
    </div>
  );
}
