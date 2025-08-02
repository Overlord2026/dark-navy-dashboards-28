import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

export function Celebration({ trigger }: { trigger: boolean }) {
  const [w, h] = useWindowSize();
  
  return trigger ? (
    <Confetti 
      width={w} 
      height={h} 
      recycle={false}
      numberOfPieces={200}
      colors={[
        '#FFD700', // Gold
        '#169873', // Emerald 
        '#14213D', // Navy
        '#FFFFFF'  // White
      ]}
      gravity={0.3}
      wind={0.02}
    />
  ) : null;
}