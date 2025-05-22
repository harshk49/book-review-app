"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export const MotionChildren = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const MotionContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.15
    }
  }
};

type StaggerContainerProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  viewportOptions?: {
    once?: boolean;
    amount?: number | "all" | "some";
  };
};

export function StaggerContainer({
  children,
  className = "",
  delay = 0,
  viewportOptions = { once: true, amount: 0.3 }
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: 0.15
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}
