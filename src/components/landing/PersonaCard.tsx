
import React from 'react';
import { Card } from "@/components/ui/card";

interface PersonaCardProps {
  title: string;
  subtitle: string;
  onClick: () => void;
}

export default function PersonaCard({ title, subtitle, onClick }: PersonaCardProps) {
  return (
    <Card
      className="p-8 cursor-pointer transition-all hover:shadow-xl group hover:border-[#D4AF37] hover:border-2"
      onClick={onClick}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-2xl">{title}</h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </Card>
  );
}
