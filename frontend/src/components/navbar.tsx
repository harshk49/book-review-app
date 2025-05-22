"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/use-search";
import { SearchIcon } from "@/components/ui/icons";
import { UserAvatar } from "@/components/common/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { searchQuery, handleSearchChange, handleSearchSubmit } = useSearch();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b shadow-lg border-white/10 bg-background/40 backdrop-blur-xl"
      style={{ backdropFilter: "blur(12px)" }}
    >
      <div className="container flex items-center justify-between py-4 mx-auto">
        <div className="flex items-center">
          <Link
            href="/"
            className="mr-6 text-xl font-bold tracking-tight text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text"
          >
            Book Review
          </Link>

          {isAuthenticated && (
            <div className="items-center hidden space-x-4 md:flex">
              <Link
                href="/dashboard"
                className="relative px-4 py-2 text-sm font-medium transition-all duration-300 group rounded-xl hover:text-primary"
              >
                <span className="relative z-10">Dashboard</span>
                <span className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-xl bg-white/5 group-hover:opacity-100"></span>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden md:block"
            >
              <Input
                type="search"
                placeholder="Search books..."
                className="h-10 w-[250px] rounded-full pl-4 pr-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute top-0 right-0 w-10 h-10"
              >
                <SearchIcon />
              </Button>
            </form>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative flex items-center justify-center w-8 h-8 rounded-full"
                >
                  <UserAvatar username={user?.username} size="sm" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <UserAvatar username={user?.username} size="sm" />
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="rounded-full">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
