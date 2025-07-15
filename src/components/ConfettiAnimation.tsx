import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

export function Celebration({ trigger }: { trigger: boolean }) {
  const [w, h] = useWindowSize();
  return trigger ? <Confetti width={w} height={h} recycle={false} /> : null;
}