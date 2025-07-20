
import { Variants } from "framer-motion";

// Dialog animation variants (scale + fade)
export const dialogVariants: Variants = {
  hidden: {
    scale: 0.95,
    opacity: 0,
    y: 10,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.25,
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

// Alert dialog variants (similar but with subtle differences)
export const alertDialogVariants: Variants = {
  hidden: {
    scale: 0.96,
    opacity: 0,
    y: 8,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 400,
      duration: 0.2,
    },
  },
  exit: {
    scale: 0.96,
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};

// Sheet animation variants (slide from sides)
export const sheetVariants = {
  right: {
    hidden: { x: "100%", opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
      },
    },
    exit: { 
      x: "100%", 
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
  },
  left: {
    hidden: { x: "-100%", opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
      },
    },
    exit: { 
      x: "-100%", 
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
  },
  top: {
    hidden: { y: "-100%", opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
      },
    },
    exit: { 
      y: "-100%", 
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
  },
  bottom: {
    hidden: { y: "100%", opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
      },
    },
    exit: { 
      y: "100%", 
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
  },
};

// Drawer animation variants (bottom-up)
export const drawerVariants: Variants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.3,
    },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  },
};

// Backdrop animation variants
export const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

// Mobile-optimized variants
export const mobileDialogVariants: Variants = {
  hidden: {
    scale: 0.98,
    opacity: 0,
    y: 5,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 35,
      stiffness: 400,
      duration: 0.2,
    },
  },
  exit: {
    scale: 0.98,
    opacity: 0,
    y: -5,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};
