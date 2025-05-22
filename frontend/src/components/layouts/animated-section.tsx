"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedSectionProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  contentClassName?: string;
  id?: string;
  delay?: number;
  backgroundEffect?: boolean;
};

export function AnimatedSection({
  children,
  title,
  subtitle,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  contentClassName = "",
  id,
  delay = 0,
  backgroundEffect = false,
}: AnimatedSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-16 md:py-24 lg:py-32",
        className
      )}
    >
      {backgroundEffect && (
        <>
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl" />
        </>
      )}

      <div className="container relative z-10 mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  "text-3xl font-bold tracking-tight md:text-4xl",
                  titleClassName
                )}
              >
                {title}
              </motion.h2>
            )}

            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: delay + 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  "mt-4 text-lg text-muted-foreground",
                  subtitleClassName
                )}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}

        <div className={contentClassName}>{children}</div>
      </div>
    </section>
  );
}
