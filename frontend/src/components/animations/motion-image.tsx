"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type MotionImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  delay?: number;
  animation?: "fadeIn" | "fadeInScale" | "slideIn";
};

export function MotionImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  delay = 0,
  animation = "fadeIn",
}: MotionImageProps) {
  const MotionNextImage = motion(Image);

  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { 
        duration: 0.7, 
        delay, 
        ease: "easeOut" 
      },
    },
    fadeInScale: {
      initial: { opacity: 0, scale: 0.92 },
      animate: { opacity: 1, scale: 1 },
      transition: { 
        duration: 0.8, 
        delay, 
        ease: [0.22, 1, 0.36, 1] 
      },
    },
    slideIn: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      transition: { 
        duration: 0.8, 
        delay, 
        ease: [0.22, 1, 0.36, 1] 
      },
    },
  };

  return (
    <MotionNextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
      initial={animations[animation].initial}
      animate={animations[animation].animate}
      transition={animations[animation].transition}
    />
  );
}
