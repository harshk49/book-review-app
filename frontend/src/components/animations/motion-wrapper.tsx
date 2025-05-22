"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type MotionWrapperProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  animation?: "fadeUp" | "fadeIn" | "fadeInScale" | "staggerChildren";
  staggerAmount?: number;
};

export function MotionWrapper({
  children,
  delay = 0,
  className = "",
  animation = "fadeUp",
  staggerAmount = 0.1,
}: MotionWrapperProps) {
  const animations = {
    fadeUp: {
      initial: { opacity: 0, y: 25 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: {
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    fadeInScale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: {
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    staggerChildren: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: {
        staggerChildren: staggerAmount,
        delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial={animations[animation].initial}
      animate={animations[animation].animate}
      transition={animations[animation].transition}
    >
      {children}
    </motion.div>
  );
}
