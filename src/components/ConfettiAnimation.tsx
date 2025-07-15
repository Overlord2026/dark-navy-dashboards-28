import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

interface ConfettiAnimationProps {
  trigger: boolean;
}

export function ConfettiAnimation({ trigger }: ConfettiAnimationProps) {
  const [width, height] = useWindowSize();
  
  return trigger ? (
    <Confetti 
      width={width} 
      height={height} 
      recycle={false}
      numberOfPieces={300}
      gravity={0.3}
    />
  ) : null;
}