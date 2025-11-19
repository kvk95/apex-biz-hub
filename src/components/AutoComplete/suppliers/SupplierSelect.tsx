// src/components/AutoComplete/suppliers/SupplierSelect.tsx
import React, { useEffect, useMemo, useState } from "react";
import { apiService } from "@/services/ApiService";
import {
    AutoCompleteTextBox,
    AutoCompleteItem,
} from "@/components/Search/AutoCompleteTextBox";

export type Supplier = {
    id: string | number;
    supplierName: string;
    supplierCode?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
};

export type SelectOutput<T> = {
    id: string;   // always string
    selected: T;  // full object
};

type Props = {
    value?: string;               // text shown
    items?: Supplier[];           // optional master list from parent
    placeholder?: string;
    className?: string;
    onSelect: (out: SelectOutput<Supplier>) => void;
    onSearchTextChange?: (text: string) => void;
};

type ACItem = AutoCompleteItem<string>;
const AC = AutoCompleteTextBox<ACItem>;

export default function SupplierSelect({
    value = "",
    items,
    placeholder = "Search supplier...",
    className,
    onSelect,
    onSearchTextChange,
}: Props) {
    const [allSuppliers, setAllSuppliers] = useState<Supplier[]>(items ?? []);
    const [filtered, setFiltered] = useState<Supplier[]>(items ?? []);
    const [loading, setLoading] = useState(false);

    /** Load suppliers if items not passed */
    useEffect(() => {
        let mounted = true;

        if (items && items.length) {
            setAllSuppliers(items);
            setFiltered(items);
            return;
        }

        (async () => {
            setLoading(true);
            try {
                const res = await apiService.get<Supplier[]>("Suppliers");
                if (!mounted) return;

                if (res?.status?.code === "S") {
                    setAllSuppliers(res.result);
                    setFiltered(res.result);
                } else {
                    setAllSuppliers([]);
                    setFiltered([]);
                }
            } catch (err) {
                console.error("SupplierSelect: failed to fetch", err);
                setAllSuppliers([]);
                setFiltered([]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [items]);

    /** Convert to autocomplete items */
    const acItems: ACItem[] = useMemo(() => {
        return filtered.map((s) => ({
            id: String(s.id),
            display: s.supplierName,
            extra: {
                Code: s.supplierCode ?? "",
                Phone: s.phone ?? "",
            },
        }));
    }, [filtered]);

    /** Search filter */
    const handleSearch = (q: string) => {
        if (!q.trim()) {
            setFiltered(allSuppliers);
            onSearchTextChange?.(q);
            return;
        }

        const ql = q.toLowerCase();
        const next = allSuppliers.filter(
            (s) =>
                s.supplierName.toLowerCase().includes(ql) ||
                (s.supplierCode || "").toLowerCase().includes(ql)
        );

        setFiltered(next);
        onSearchTextChange?.(q);
    };

    /** When user selects */
    const handleSelect = (item: ACItem) => {
        const sel = allSuppliers.find((s) => String(s.id) === item.id);

        if (!sel) {
            onSelect({
                id: String(item.id),
                selected: {
                    id: item.id,
                    supplierName: item.display,
                } as Supplier,
            });
            return;
        }

        onSelect({
            id: String(sel.id),
            selected: sel,
        });
    };

    return (
        <div className={className}>
            <AC
                value={value}
                items={acItems}
                onSearch={handleSearch}
                onSelect={handleSelect}
                placeholder={placeholder}
                renderItem={(it, highlighted) => (
                    <div
                        className={`p-2 ${highlighted ? "bg-blue-50" : "hover:bg-gray-100"}`}
                    >
                        <div className="font-medium text-sm truncate">{it.display}</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {it.extra?.Code ? `Code: ${it.extra.Code}` : ""}
                            {it.extra?.Phone ? ` • Ph: ${it.extra.Phone}` : ""}
                        </div>
                    </div>
                )}
            />

            {loading && <p className="text-xs text-gray-500 mt-1">Loading...</p>}
        </div>
    );
}
