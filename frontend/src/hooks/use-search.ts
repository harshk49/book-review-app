import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface UseSearchProps {
  redirectPath?: string;
}

export function useSearch({
  redirectPath = "/dashboard/search",
}: UseSearchProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `${redirectPath}?q=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSearchChange,
    handleSearchSubmit,
  };
}
