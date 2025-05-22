"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedCalloutProps = {
  children: ReactNode;
  label?: string;
  className?: string;
  labelClassName?: string;
  contentClassName?: string;
  delay?: number;
};

export function AnimatedCallout({
  children,
  label,
  className = "",
  labelClassName = "",
  contentClassName = "",
  delay = 0,
}: AnimatedCalloutProps) {
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
        "rounded-2xl border border-primary/20 bg-primary/5 p-0.5 sm:p-1",
        className
      )}
    >
      {label && (
        <div
          className={cn(
            "mb-1 inline-block rounded-xl bg-primary/10 px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium text-primary",
            labelClassName
          )}
        >
          {label}
        </div>
      )}
      <div className={cn("px-2 sm:px-3 py-1 sm:py-2", contentClassName)}>
        {children}
      </div>
    </motion.div>
  );
}
