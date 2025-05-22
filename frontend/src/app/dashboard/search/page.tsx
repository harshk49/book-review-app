"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { bookAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { toast } from "sonner";

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string[];
  publishedYear: number;
  coverImage?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(query);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  // Perform search when query parameter changes
  useEffect(() => {
    const search = async () => {
      if (!query) {
        setBooks([]);
        return;
      }

      try {
        setLoading(true);
        const response = await bookAPI.searchBooks(query);
        setBooks(response.data.books || []);
      } catch (error) {
        console.error("Error searching books:", error);
        toast.error("Failed to search books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Search Books</h1>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mb-8">
          <Input
            type="search"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-[200px] bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {query && (
            <p className="text-lg mb-4">
              {books.length} result{books.length === 1 ? "" : "s"} for "{query}"
            </p>
          )}

          {query && books.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-3">No results found</h2>
              <p className="text-muted-foreground mb-6">
                Try searching for a different title or author.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <Link
                  href={`/dashboard/books/${book._id}`}
                  key={book._id}
                  className="group"
                >
                  <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
                    <div className="h-[200px] bg-muted relative overflow-hidden">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                          No cover image
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">
                        {book.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {book.author}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-sm">{book.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex flex-wrap gap-1">
                        {book.genre.slice(0, 2).map((genre) => (
                          <span
                            key={genre}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                          >
                            {genre}
                          </span>
                        ))}
                        {book.genre.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                            +{book.genre.length - 2}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {book.publishedYear}
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
