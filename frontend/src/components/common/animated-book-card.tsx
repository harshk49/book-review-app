"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type BookCardProps = {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating?: number;
  className?: string;
  index?: number;
};

export function AnimatedBookCard({
  id,
  title,
  author,
  cover,
  rating = 0,
  className = "",
  index = 0,
}: BookCardProps) {
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
      whileHover={{ y: -5 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-md transition-all duration-300 hover:shadow-xl",
        className
      )}
    >
      <Link href={`/dashboard/books/${id}`} className="block h-full w-full">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {rating > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="line-clamp-1 text-sm sm:text-base font-semibold group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <div className="mt-1 flex items-center text-xs sm:text-sm text-muted-foreground">
            <BookOpen className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="line-clamp-1">{author}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
