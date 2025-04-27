
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
      className="cursor-pointer p-8 rounded-lg border border-gray-700 bg-card hover:border-primary/50 transition-all hover:shadow-xl"
    >
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
    </div>
  );
}
