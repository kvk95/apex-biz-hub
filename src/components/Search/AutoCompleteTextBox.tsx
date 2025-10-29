import React, {
    useState,
    useEffect,
    useRef,
    KeyboardEvent,
    MouseEvent,
} from "react";
import { SearchInput } from "./SearchInput";

export interface AutoCompleteItem {
    id: number;
    display: string;
    extra?: Record<string, any>;
}

interface AutoCompleteTextBoxProps<T extends AutoCompleteItem> {
    value: string;
    onSearch: (query: string) => void;
    onSelect: (item: T) => void;
    items: T[];
    placeholder?: string;
    maxVisible?: number;
    renderItem?: (item: T, highlighted: boolean) => React.ReactNode;
    disabled?: boolean;
}

export const AutoCompleteTextBox = <T extends AutoCompleteItem>({
    value,
    onSearch,
    onSelect,
    items,
    placeholder = "Search…",
    maxVisible = 8,
    renderItem,
    disabled = false,
}: AutoCompleteTextBoxProps<T>) => {
    const [inputValue, setInputValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => setInputValue(value), [value]);

    const visible = items.slice(0, maxVisible);
    useEffect(() => {
        setHighlightedIndex(!disabled && isOpen && visible.length > 0 ? 0 : -1);
    }, [isOpen, visible.length, disabled]);

    useEffect(() => {
        const el = itemRefs.current[highlightedIndex];
        if (el) el.scrollIntoView({ block: "nearest" });
    }, [highlightedIndex]);

    const handleSearch = (query: string) => {
        if (disabled) return;
        setInputValue(query);
        onSearch(query);
        setIsOpen(true);
    };

    const selectItem = (item: T) => {
        if (disabled) return;
        setInputValue(item.display);
        onSelect(item);
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled || !isOpen) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < visible.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                break;
            case "Enter":
                e.preventDefault();
                if (highlightedIndex >= 0 && visible[highlightedIndex]) {
                    selectItem(visible[highlightedIndex]);
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    useEffect(() => {
        const handler = (ev: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(ev.target as Node)
            ) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener(
            "mousedown",
            handler as unknown as EventListener
        );
        return () =>
            document.removeEventListener(
                "mousedown",
                handler as unknown as EventListener
            );
    }, []);

    const defaultRender = (item: T, highlighted: boolean) => {
        const extra = item.extra
            ? Object.entries(item.extra)
                .map(([k, v]) => `${k}: ${v}`)
                .join(" | ")
            : "";
        return (
            <div
                className={`px-3 py-2 cursor-pointer text-sm flex justify-between ${highlighted ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100"
                    }`}
            >
                <span>{item.display}</span>
                {extra && <span className="text-gray-500">{extra}</span>}
            </div>
        );
    };

    return (
        <div ref={containerRef} className="relative">
            <SearchInput
                placeholder={placeholder}
                value={inputValue}
                onSearch={handleSearch}
                onFocus={() => !disabled && setIsOpen(true)}
                onBlur={() => !disabled && setIsOpen(false)}
                onKeyDown={handleKeyDown}
                debounce={300}
                disabled={disabled}
            />

            {!disabled && isOpen && inputValue && visible.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {visible.map((it, idx) => (
                        <div
                            key={it.id}
                            ref={(el) => (itemRefs.current[idx] = el)}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => selectItem(it)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                        >
                            {renderItem
                                ? renderItem(it, idx === highlightedIndex)
                                : defaultRender(it, idx === highlightedIndex)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
