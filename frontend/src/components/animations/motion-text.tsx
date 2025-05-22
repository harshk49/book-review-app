"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type MotionTextProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  inline?: boolean;
  animation?: "fadeUp" | "fadeIn" | "fadeInScale";
};

export function MotionText({
  children,
  delay = 0,
  className = "",
  inline = false,
  animation = "fadeUp",
}: MotionTextProps) {
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
  };

  const Component = inline ? motion.span : motion.div;

  return (
    <Component
      className={className}
      initial={animations[animation].initial}
      animate={animations[animation].animate}
      transition={animations[animation].transition}
    >
      {children}
    </Component>
  );
}
