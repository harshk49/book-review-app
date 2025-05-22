"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
};

export function GlassCard({
  children,
  className = "",
  delay = 0,
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5 p-4 sm:p-5 md:p-6 lg:p-7 shadow-[0_4px_30px_rgba(0,0,0,0.1)]",
        hover &&
          "transition-all duration-300 hover:shadow-lg hover:bg-white/10",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
