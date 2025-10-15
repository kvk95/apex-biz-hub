import { Input } from "@/components/ui/input";
// Icons replaced with Font Awesome
import { useState, useEffect } from "react";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounce?: number;
  className?: string;
}

export function SearchInput({
  placeholder = "Search...",
  onSearch,
  debounce = 300,
  className,
}: SearchInputProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounce);

    return () => clearTimeout(timer);
  }, [query, debounce, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <i className="fa fa-search absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
