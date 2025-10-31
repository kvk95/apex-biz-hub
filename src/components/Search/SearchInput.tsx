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
  style?: React.DetailedHTMLProps<
    React.StyleHTMLAttributes<HTMLStyleElement>,
    HTMLStyleElement
  >;
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
  style
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
    <div className={`relative  max-w-md ${className}`} onMouseDown={stopPropagation}>
      <div className="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
        <i className="fa-light fa-magnifying-glass absolute top-4 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground text-xs"></i>
      </div>
      <input
        type="search"
        ref={inputRef}
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className={` border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-8 px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
          disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
        }`}
        autoComplete="off"
        onMouseDown={(e) => {
          e.stopPropagation();
          if (!disabled) inputRef.current?.focus();
        }}
        style={style}
      />
    </div>
  );
}
