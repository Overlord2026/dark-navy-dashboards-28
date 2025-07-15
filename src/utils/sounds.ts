import { Howl } from "howler";

export const playSound = (type: "cash" | "champagne" | "fanfare" | "fireworks") => {
  const files = {
    cash: "/sounds/cash-register.mp3",
    champagne: "/sounds/champagne-pop.mp3",
    fanfare: "/sounds/fanfare.mp3",
    fireworks: "/sounds/fireworks.mp3"
  };
  new Howl({ src: [files[type]] }).play();
};