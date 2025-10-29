// src/components/Search/ProductSearchCell.tsx
import React, { useState, useEffect, useRef } from "react";
import { SearchInput } from "./SearchInput";
import { Product } from "@/types/Product";

interface ProductSearchCellProps {
    value: string;
    onSearch: (query: string) => void;
    onSelect: (product: Product) => void;
    products: Product[];
}

export const ProductSearchCell: React.FC<ProductSearchCellProps> = ({
    value,
    onSearch,
    onSelect,
    products,
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Sync parent value
    useEffect(() => setInputValue(value), [value]);

    // Filter items
    const filtered = products.filter(
        (p) =>
            p.productName.toLowerCase().includes(inputValue.toLowerCase()) ||
            p.sku.toLowerCase().includes(inputValue.toLowerCase())
    );

    const visibleItems = filtered.slice(0, 8);

    // Reset highlight when list changes
    useEffect(() => {
        setHighlightedIndex(isOpen && visibleItems.length > 0 ? 0 : -1);
    }, [isOpen, visibleItems.length]);

    // AUTO-SCROLL TO HIGHLIGHTED ITEM – CORRECT PLACE
    useEffect(() => {
        const el = itemRefs.current[highlightedIndex];
        if (el) {
            el.scrollIntoView({ block: "nearest" });
        }
    }, [highlightedIndex]);

    const handleSearch = (query: string) => {
        setInputValue(query);
        onSearch(query);
        setIsOpen(true);
    };

    const selectItem = (product: Product) => {
        setInputValue(product.productName);
        onSelect(product);
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < visibleItems.length - 1 ? prev + 1 : prev
                );
                break;

            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                break;

            case "Enter":
                e.preventDefault();
                if (highlightedIndex >= 0 && visibleItems[highlightedIndex]) {
                    selectItem(visibleItems[highlightedIndex]);
                }
                break;

            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    // Click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative">
            <SearchInput
                placeholder="Search product..."
                value={inputValue}
                onSearch={handleSearch}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
                onKeyDown={handleKeyDown}
                debounce={300}
            />

            {isOpen && inputValue && visibleItems.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {visibleItems.map((p, idx) => (
                        <div
                            key={p.id}
                            ref={(el) => (itemRefs.current[idx] = el)}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => selectItem(p)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`px-3 py-2 cursor-pointer text-sm flex justify-between ${idx === highlightedIndex
                                    ? "bg-blue-100 text-blue-900"
                                    : "hover:bg-gray-100"
                                }`}
                        >
                            <span>{p.productName}</span>
                            <span className="text-gray-500">{p.sku} | ${p.price}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};