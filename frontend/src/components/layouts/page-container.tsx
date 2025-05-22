"use client";

import { ReactNode } from "react";
import Navbar from "@/components/navbar";
import { Footer } from "./footer";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  showFooter?: boolean;
}

export function PageContainer({
  children,
  className = "",
  showFooter = true,
}: PageContainerProps) {
  return (
    <>
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex min-h-[calc(100vh-64px)] flex-col w-full max-w-[100vw] overflow-x-hidden ${className}`}
      >
        {children}
        {showFooter && <Footer />}
      </motion.main>
    </>
  );
}
