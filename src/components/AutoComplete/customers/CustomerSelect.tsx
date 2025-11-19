// src/components/AutoComplete/customers/CustomerSelect.tsx
import React, { useEffect, useMemo, useState } from "react";
import { apiService } from "@/services/ApiService";
import { AutoCompleteTextBox, AutoCompleteItem } from "@/components/Search/AutoCompleteTextBox";
import { STATUSES } from "@/constants/constants";

export type Customer = {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    customerCity: string;
    customerCountry: string;
    customerZip: string;
    customerStatus: (typeof STATUSES)[number];
    customerImage: string;
};

/** Standardized output */
export type SelectOutput<T> = {
    id: string;   // always string
    selected: T;  // full original object
};

/** Props */
type Props = {
    value?: string;                    // text value shown (optional)
    items?: Customer[];                // optional master list; if omitted component will fetch
    placeholder?: string;
    className?: string;
    onSelect: (out: SelectOutput<Customer>) => void;
    onSearchTextChange?: (text: string) => void; // optional callback for parent
};

type ACItem = AutoCompleteItem<string>;

const AC = AutoCompleteTextBox<ACItem>;

export default function CustomerSelect({
    value = "",
    items,
    placeholder = "Search customer...",
    className,
    onSelect,
    onSearchTextChange,
}: Props) {
    const [allCustomers, setAllCustomers] = useState<Customer[]>(items ?? []);
    const [filtered, setFiltered] = useState<Customer[]>(items ?? []);
    const [loading, setLoading] = useState(false);

    // load only if items not provided
    useEffect(() => {
        let mounted = true;
        if (items && items.length) {
            setAllCustomers(items);
            setFiltered(items);
            return;
        }
        (async () => {
            setLoading(true);
            try {
                const res = await apiService.get<Customer[]>("Customers");
                if (!mounted) return;
                if (res?.status?.code === "S") {
                    setAllCustomers(res.result);
                    setFiltered(res.result);
                } else {
                    setAllCustomers([]);
                    setFiltered([]);
                }
            } catch (err) {
                console.error("CustomerSelect: fetch failed", err);
                setAllCustomers([]);
                setFiltered([]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [items]);

    // map to items for AutoCompleteTextBox (id forced to string)
    const acItems: ACItem[] = useMemo(() => {
        return filtered.map((c) => ({
            id: String(c.customerId),
            display: c.customerName,
        }));
    }, [filtered]);

    const handleSearch = (q: string) => {
        // local search (fast)
        if (!q.trim()) {
            setFiltered(allCustomers);
            onSearchTextChange?.(q);
            return;
        }
        const ql = q.toLowerCase();
        const next = allCustomers.filter((c) =>
            (c.customerName || "").toLowerCase().includes(ql) ||
            (c.customerEmail || "").toLowerCase().includes(ql) ||
            (c.customerPhone || "").toLowerCase().includes(ql)
        );
        setFiltered(next);
        onSearchTextChange?.(q);
    };

    const handleSelect = (item: ACItem) => {
        // find the full object by string id
        const sel = allCustomers.find((c) => String(c.customerId) === item.id);
        if (!sel) {
            // if not found (defensive), emit a minimal object
            onSelect({ id: String(item.id), selected: { customerId: item.id, customerName: item.display } as Customer });
            return;
        }
        onSelect({ id: String(sel.customerId), selected: sel });
    };

    return (
        <div className={className}>
            <AC
                value={value}
                items={acItems}
                onSearch={handleSearch}
                onSelect={handleSelect}
                placeholder={placeholder}
            // optionally, you can pass renderItem to show extra metadata later
            />
            {/* simple loading indicator (optional) */}
            {loading && <div className="text-xs text-gray-500 mt-1">Loading customers...</div>}
        </div>
    );
}
