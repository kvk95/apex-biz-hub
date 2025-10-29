/* -------------------------------------------------
   AutoCompleteTextBox – reusable for Product, Customer, etc.
   ------------------------------------------------- */
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
    /** The field that will be shown in the dropdown and in the input after selection */
    display: string;
    /** Optional extra data you want to show next to the name (e.g. SKU, price…) */
    extra?: Record<string, any>;
}

/* ------------------------------------------------- */
interface AutoCompleteTextBoxProps<T extends AutoCompleteItem> {
    /** Current value shown in the input */
    value: string;
    /** Called while the user types – you must filter the list yourself */
    onSearch: (query: string) => void;
    /** Called when the user selects an item */
    onSelect: (item: T) => void;
    /** Full list of items (already filtered by you) */
    items: T[];
    /** Placeholder for the search input */
    placeholder?: string;
    /** How many items to show at once (default 8) */
    maxVisible?: number;
    /** Optional render function for a custom row */
    renderItem?: (item: T, highlighted: boolean) => React.ReactNode;
}

/* ------------------------------------------------- */
export const AutoCompleteTextBox = <T extends AutoCompleteItem>({
    value,
    onSearch,
    onSelect,
    items,
    placeholder = "Search…",
    maxVisible = 8,
    renderItem,
}: AutoCompleteTextBoxProps<T>) => {
    const [inputValue, setInputValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    /* ---- sync parent value ------------------------------------------------ */
    useEffect(() => setInputValue(value), [value]);

    /* ---- keep highlight in bounds ------------------------------------------ */
    const visible = items.slice(0, maxVisible);
    useEffect(() => {
        setHighlightedIndex(isOpen && visible.length > 0 ? 0 : -1);
    }, [isOpen, visible.length]);

    /* ---- auto‑scroll to highlighted item ----------------------------------- */
    useEffect(() => {
        const el = itemRefs.current[highlightedIndex];
        if (el) el.scrollIntoView({ block: "nearest" });
    }, [highlightedIndex]);

    /* ---- search handler ---------------------------------------------------- */
    const handleSearch = (query: string) => {
        setInputValue(query);
        onSearch(query);
        setIsOpen(true);
    };

    /* ---- selection handler ------------------------------------------------- */
    const selectItem = (item: T) => {
        setInputValue(item.display);
        onSelect(item);
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    /* ---- keyboard navigation ----------------------------------------------- */
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return;

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

    /* ---- click outside ----------------------------------------------------- */
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

    /* ---- default row rendering -------------------------------------------- */
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
                onFocus={() => setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
                onKeyDown={handleKeyDown}
                debounce={300}
            />

            {isOpen && inputValue && visible.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {visible.map((it, idx) => (
                        <div
                            key={it.id}
                            ref={(el) => (itemRefs.current[idx] = el)}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => selectItem(it)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                        >
                            {renderItem ? renderItem(it, idx === highlightedIndex) : defaultRender(it, idx === highlightedIndex)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};