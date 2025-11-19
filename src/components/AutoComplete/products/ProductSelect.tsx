import React, { useEffect, useMemo, useState } from "react";
import { apiService } from "@/services/ApiService";
import {
    AutoCompleteTextBox,
    AutoCompleteItem,
} from "@/components/Search/AutoCompleteTextBox";

export type Product = {
    id: string;
    productName: string;
    sku?: string;
    productImage?: string;
    quantity: number;
    price: number;        // unit price
    discount: number;     // percent
    taxPercent: number;   // percent
};

export type SelectOutput<T> = {
    id: string;    // always string
    selected: T;   // full object
};

type Props = {
    value?: string;             // text value shown
    items?: Product[];          // optional master list
    placeholder?: string;
    className?: string;
    onSelect: (out: SelectOutput<Product>) => void;
    onSearchTextChange?: (text: string) => void;
};

type ACItem = AutoCompleteItem<string>;

const AC = AutoCompleteTextBox<ACItem>;

export default function ProductSelect({
    value = "",
    items,
    placeholder = "Search product...",
    className,
    onSelect,
    onSearchTextChange,
}: Props) {
    const [allProducts, setAllProducts] = useState<Product[]>(items ?? []);
    const [filtered, setFiltered] = useState<Product[]>(items ?? []);
    const [loading, setLoading] = useState(false);

    /** Load products only if parent did NOT pass them */
    useEffect(() => {
        let mounted = true;
        if (items && items.length) {
            setAllProducts(items);
            setFiltered(items);
            return;
        }

        (async () => {
            setLoading(true);
            try {
                const res = await apiService.get<Product[]>("Products");
                if (!mounted) return;

                if (res?.status?.code === "S") {
                    setAllProducts(res.result);
                    setFiltered(res.result);
                } else {
                    setAllProducts([]);
                    setFiltered([]);
                }
            } catch (err) {
                console.error("ProductSelect: failed to fetch", err);
                setAllProducts([]);
                setFiltered([]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [items]);

    /** Convert to AutoComplete list */
    const acItems: ACItem[] = useMemo(() => {
        return filtered.map((p) => ({
            id: String(p.id),
            display: p.productName,
            extra: {
                sku: p.sku,
                ProductImage: p.productImage,
                quantity: p.quantity,
                Price: p.price !== undefined ? `₹${Number(p.price).toFixed(2)}` : "",
                discount: p.discount,
                taxPercent: p.taxPercent,
            },
        }));
    }, [filtered]);

    /** Search filter */
    const handleSearch = (q: string) => {
        if (!q.trim()) {
            setFiltered(allProducts);
            onSearchTextChange?.(q);
            return;
        }

        const ql = q.toLowerCase();
        const next = allProducts.filter(
            (p) =>
                p.productName.toLowerCase().includes(ql) ||
                (p.sku || "").toLowerCase().includes(ql)
        );

        setFiltered(next);
        onSearchTextChange?.(q);
    };

    /** When user selects a product */
    const handleSelect = (item: ACItem) => {
        const sel = allProducts.find((p) => String(p.id) === item.id);

        if (!sel) {
            onSelect({
                id: String(item.id),
                selected: {
                    id: item.id,
                    productName: item.display,
                    sku: item.extra.sku,
                    productImage: item.extra.productImage,
                    quantity: item.extra.quantity,
                    price: item.extra.price,
                    discount: item.extra.discount,
                    taxPercent: item.extra.taxPercent,
                } as Product,
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
                        className={`p-2 flex items-center gap-3 ${highlighted ? "bg-blue-50" : "hover:bg-gray-100"
                            }`}
                    >
                        {/* thumbnail */}
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                            {it.extra?.ProductImage ? (
                                <img
                                    src={it.extra.ProductImage}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <i className="fa fa-box text-gray-400" />
                            )}
                        </div>

                        {/* name + meta */}
                        <div className="truncate">
                            <div className="font-medium text-sm truncate" title={it.display}>
                                {it.display}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {it.extra?.SKU ? `SKU: ${it.extra.SKU} • ` : ""}
                                {it.extra?.Price}
                            </div>
                        </div>
                    </div>
                )}
            />

            {loading && (
                <p className="text-xs text-gray-500 mt-1">Loading products...</p>
            )}
        </div>
    );
}
