"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedFeatureProps = {
  icon: ReactNode;
  title: string;
  description: string;
  index?: number;
  className?: string;
};

export function AnimatedFeature({
  icon,
  title,
  description,
  index = 0,
  className = "",
}: AnimatedFeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: 0.1 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 md:p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg",
        className
      )}
    >
      <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-semibold transition-colors duration-300 group-hover:text-primary">
        {title}
      </h3>

      <p className="text-sm sm:text-base text-muted-foreground">
        {description}
      </p>
    </motion.div>
  );
}
