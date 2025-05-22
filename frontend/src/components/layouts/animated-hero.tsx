"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedHeroProps = {
  children: ReactNode;
  className?: string;
  backgroundClassName?: string;
};

export function AnimatedHero({
  children,
  className = "",
  backgroundClassName = "",
}: AnimatedHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden py-24 md:py-32 lg:py-40",
        className
      )}
    >
      {/* Background gradient and effects */}
      <div
        className={cn(
          "absolute inset-0 -z-10",
          backgroundClassName ||
            "bg-gradient-to-br from-background via-background to-background/80"
        )}
      />

      {/* Background decorative elements */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="container relative z-10 mx-auto max-w-7xl"
      >
        {children}
      </motion.div>
    </section>
  );
}
