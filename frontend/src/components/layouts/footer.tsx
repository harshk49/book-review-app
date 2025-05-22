"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-auto border-t border-white/10"
    >
      <div className="container mx-auto max-w-7xl grid gap-6 sm:gap-8 py-8 sm:py-10 md:py-12 md:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <h3 className="mb-4 text-xl font-bold text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
            Book Review
          </h3>
          <p className="max-w-md mb-4 text-muted-foreground">
            Your destination for discovering, reviewing, and connecting through
            the power of books.
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Book Review App. All rights
            reserved.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">
            Platform
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="transition-colors text-muted-foreground hover:text-primary"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/books"
                className="transition-colors text-muted-foreground hover:text-primary"
              >
                Books
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/search"
                className="transition-colors text-muted-foreground hover:text-primary"
              >
                Search
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">
            Company
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="transition-colors text-muted-foreground hover:text-primary"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="transition-colors text-muted-foreground hover:text-primary"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="transition-colors text-muted-foreground hover:text-primary"
              >
                Careers
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase">
            Legal
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="transition-colors text-muted-foreground hover:text-primary"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="transition-colors text-muted-foreground hover:text-primary"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="transition-colors text-muted-foreground hover:text-primary"
              >
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </motion.footer>
  );
}
