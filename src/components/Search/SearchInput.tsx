// src/components/Search/SearchInput.tsx
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onSearch: (query: string) => void;
  debounce?: number;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function SearchInput({
  placeholder = "Search...",
  value = "",
  onSearch,
  debounce = 300,
  className,
  onFocus,
  onBlur,
  onKeyDown,
}: SearchInputProps) {
  const [query, setQuery] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // -----------------------------------------------------------------
  // 1. Sync the external `value` (when the parent clears the field)
  // -----------------------------------------------------------------
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // -----------------------------------------------------------------
  // 2. Debounced search – **only one timer ever runs**
  // -----------------------------------------------------------------
  useEffect(() => {
    // Skip debounce if query matches external value (e.g. after selection)
    if (query === value) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      onSearch(query);
    }, debounce);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, debounce, onSearch, value]);


  // -----------------------------------------------------------------
  // 3. Click‑through / focus handling
  // -----------------------------------------------------------------
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className={`relative ${className}`} onMouseDown={stopPropagation}>
      <i className="fa fa-search absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className="pl-10"
        autoComplete="off"
        onMouseDown={(e) => {
          e.stopPropagation();
          inputRef.current?.focus();
        }}
      />
    </div>
  );
}