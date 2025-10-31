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
  disabled?: boolean;
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
  disabled = false,
}: SearchInputProps) {
  const [query, setQuery] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (disabled || query === value) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      onSearch(query);
    }, debounce);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, debounce, onSearch, value, disabled]);

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
        disabled={disabled}
        className={`block w-full p-4 ps-10 text-sm ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
        autoComplete="off"
        onMouseDown={(e) => {
          e.stopPropagation();
          if (!disabled) inputRef.current?.focus();
        }}
      />
    </div>
  );
}
