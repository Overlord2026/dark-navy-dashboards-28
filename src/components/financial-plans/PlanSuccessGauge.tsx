
import { InfoIcon } from "lucide-react";

interface PlanSuccessGaugeProps {
  successRate: number; // 0-100
}

export function PlanSuccessGauge({ successRate }: PlanSuccessGaugeProps) {
  // Ensure success rate is between 0 and 100
  const rate = Math.min(100, Math.max(0, successRate));
  
  // Determine color based on success rate
  const gaugeColor = rate > 70 ? '#4CAF50' : rate > 30 ? '#FFC107' : '#FF5252';
  
  // Calculate rotation angle (180 degrees * percentage)
  const rotationAngle = rate * 1.8;
  
  return (
    <div className="flex flex-col items-center justify-center pt-4">
      <div className="relative w-64 h-32">
        {/* Gauge Background */}
        <div className="absolute w-full h-full rounded-t-full border-[20px] border-b-0 border-gray-600/50"></div>
        
        {/* Gauge Progress (dynamic based on success rate) */}
        <div 
          className="absolute w-full h-full rounded-t-full border-[20px] border-b-0 border-transparent"
          style={{ 
            borderColor: 'transparent', 
            borderTopColor: gaugeColor,
            borderRightColor: gaugeColor,
            borderLeftColor: gaugeColor,
            clipPath: `polygon(50% 50%, 0 0, ${rate}% 0, 50% 50%)`,
            transform: `rotate(${rotationAngle}deg)`,
            transformOrigin: 'bottom center'
          }}
        ></div>
        
        {/* Center Value Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className="text-6xl font-bold"
            style={{ color: gaugeColor }}
          >
            {rate}%
          </span>
          <span className="text-sm text-muted-foreground mt-1">Chance of Success</span>
        </div>
      </div>
    </div>
  );
}
