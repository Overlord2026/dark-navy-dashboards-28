import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

interface CelebrationProps {
  trigger: boolean;
  numberOfPieces?: number;
  recycle?: boolean;
  gravity?: number;
  wind?: number;
}

export function Celebration({ 
  trigger, 
  numberOfPieces = 200, 
  recycle = false, 
  gravity = 0.3, 
  wind = 0.02 
}: CelebrationProps) {
  const [w, h] = useWindowSize();
  
  return trigger ? (
    <Confetti 
      width={w} 
      height={h} 
      recycle={recycle}
      numberOfPieces={numberOfPieces}
      colors={[
        '#FFD700', // Gold
        '#169873', // Emerald 
        '#14213D', // Navy
        '#FFFFFF'  // White
      ]}
      gravity={gravity}
      wind={wind}
    />
  ) : null;
}