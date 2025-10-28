import React, { useState, useEffect, useRef } from "react";

interface Option {
    id: number;
    label: string;
}

interface SearchableDropdownProps {
    options: Option[];
    value: number | null;
    onChange: (value: number) => void;
    placeholder?: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
}) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <input
                type="text"
                placeholder={placeholder}
                value={options.find((opt) => opt.id === value)?.label || query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                className="border rounded-lg px-2 py-1 w-full text-sm"
            />
            {isOpen && (
                <ul className="absolute z-10 w-full bg-white border rounded-lg shadow-md mt-1 max-h-40 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                            <li
                                key={opt.id}
                                onClick={() => {
                                    onChange(opt.id);
                                    setQuery(opt.label);
                                    setIsOpen(false);
                                }}
                                className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm"
                            >
                                {opt.label}
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-1 text-gray-500 text-sm">No results</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableDropdown;
