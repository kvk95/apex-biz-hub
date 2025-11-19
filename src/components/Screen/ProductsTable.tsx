import React, { useEffect, useMemo, useState } from "react";
import { apiService } from "@/services/ApiService";
import { ProductSelect } from "@/components/AutoComplete";

/**
 * Reusable ProductsTable
 * - Calculation model B (subtotal -> discount% -> taxable -> tax% -> total)
 * - No SKU column visible (product column shows product name, SKU & price in the dropdown)
 * - Validation messages under each input
 */

export type TableItem = {
  productId: string;
  productName: string;
  sku?: string;
  productImage?: string;
  quantity: number;
  price: number;        // unit price
  discount: number;     // percent
  taxPercent: number;   // percent
  taxAmount: number;    // computed
  total: number;        // computed
};

type Product = {
  id: string;
  productName: string;
  sku?: string;
  price?: number;
  productImage?: string;
  // any other properties returned by your API
};

type Props = {
  value: TableItem[]; // controlled list
  onChange: (items: TableItem[]) => void;
  // optional: minRows etc in future
  minRows?: number;
};

const EMPTY_ROW = (): TableItem => ({
  productId: "",
  productName: "",
  sku: "",
  productImage: undefined,
  quantity: 1,
  price: 0,
  discount: 0,
  taxPercent: 0,
  taxAmount: 0,
  total: 0,
});

function recalcItem(item: TableItem): TableItem {
  // B) subtotal = price * qty
  const price = Number(item.price) || 0;
  const qty = Number(item.quantity) || 0;
  const discountPercent = Number(item.discount) || 0;
  const taxPercent = Number(item.taxPercent) || 0;

  const subtotal = price * qty;
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxable = subtotal - discountAmount;
  const taxAmount = (taxable * taxPercent) / 100;
  const total = taxable + taxAmount;

  return {
    ...item,
    taxAmount: Number(taxAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}

export default function ProductsTable({ value, onChange, minRows = 1 }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [localItems, setLocalItems] = useState<TableItem[]>(() => {
    // ensure at least minRows rows
    const init = (value && value.length) ? value.map(recalcItem) : [];
    while (init.length < minRows) init.push(EMPTY_ROW());
    return init;
  });

  // keep localItems synced with parent value (controlled)
  useEffect(() => {
    if (Array.isArray(value)) {
      const next = value.length ? value.map(recalcItem) : [];
      while (next.length < minRows) next.push(EMPTY_ROW());
      setLocalItems(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, minRows]);

  // load products once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiService.get<Product[]>("Products");
        if (!mounted) return;
        if (res?.status?.code === "S") {
          setProducts(res.result);
          setFilteredProducts(res.result);
        } else {
          // fallback empty
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (err) {
        console.error("ProductsTable: failed to load products", err);
        setProducts([]);
        setFilteredProducts([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // internal helper: propagate to parent
  const emit = (items: TableItem[]) => {
    onChange(items.map(recalcItem));
  };

  // Add / Remove row
  const addRow = (atIndex?: number) => {
    setLocalItems(prev => {
      const next = [...prev];
      const newRow = EMPTY_ROW();
      if (typeof atIndex === "number") next.splice(atIndex + 1, 0, newRow);
      else next.push(newRow);
      emit(next);
      return next;
    });
  };

  const removeRow = (idx: number) => {
    setLocalItems(prev => {
      const next = prev.filter((_, i) => i !== idx);
      // ensure at least minRows
      while (next.length < minRows) next.push(EMPTY_ROW());
      emit(next);
      return next;
    });
  };

  // update single cell and recalc that row
  const updateRow = (idx: number, patch: Partial<TableItem>) => {
    setLocalItems(prev => {
      const next = [...prev];
      next[idx] = recalcItem({ ...next[idx], ...patch });
      emit(next);
      return next;
    });
  };

  // small memoized validation map per row
  const validations = useMemo(() => {
    return localItems.map((it) => {
      const errs: string[] = [];
      if (!it.productName || !it.productId) errs.push("Select a product");
      if ((Number(it.quantity) || 0) <= 0) errs.push("Quantity must be >= 1");
      if ((Number(it.price) || 0) < 0) errs.push("Price cannot be negative");
      if ((Number(it.discount) || 0) < 0) errs.push("Discount cannot be negative");
      if ((Number(it.taxPercent) || 0) < 0) errs.push("Tax cannot be negative");
      return errs;
    });
  }, [localItems]);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left w-96">Product</th>
              <th className="px-3 py-2 text-center w-20">Qty</th>
              <th className="px-3 py-2 text-right w-28">Price (₹)</th>
              <th className="px-3 py-2 text-right w-24">Discount (%)</th>
              <th className="px-3 py-2 text-right w-20">Tax (%)</th>
              <th className="px-3 py-2 text-right w-28">Tax Amt (₹)</th>
              <th className="px-3 py-2 text-right w-32">Total (₹)</th>
              <th className="w-10"></th>
            </tr>
          </thead>

          <tbody>
            {localItems.map((row, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-2 py-2 align-top">
                  <ProductSelect
                    value={row.productName}
                    onSelect={(out) => {
                      updateRow(idx, out.selected);
                    }}
                  />

                  {/* small meta line */}
                  <div className="text-xs text-gray-500 mt-1">
                    {row.sku ? `SKU: ${row.sku}` : ""}
                  </div>

                  {/* validation under product */}
                  {validations[idx] && validations[idx].length > 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      {validations[idx].slice(0, 2).join(" • ")}
                    </p>
                  )}
                </td>

                {/* Quantity */}
                <td className="px-2 py-2 text-center align-top">
                  <input
                    type="number"
                    min={1}
                    value={row.quantity}
                    onChange={(e) => updateRow(idx, { quantity: Number(e.target.value) || 1 })}
                    className="w-16 border rounded px-2 py-1 text-center"
                  />
                  {validations[idx] && validations[idx].some(v => v.includes("Quantity")) && (
                    <p className="text-xs text-red-600 mt-1">Quantity ≥ 1</p>
                  )}
                </td>

                {/* Price */}
                <td className="px-2 py-2 text-right align-top">
                  <input
                    type="number"
                    step="0.01"
                    value={row.price}
                    onChange={(e) => updateRow(idx, { price: Number(e.target.value) || 0 })}
                    className="w-28 border rounded px-2 py-1 text-right"
                  />
                  {validations[idx] && validations[idx].some(v => v.includes("Price")) && (
                    <p className="text-xs text-red-600 mt-1">Invalid price</p>
                  )}
                </td>

                {/* Discount % */}
                <td className="px-2 py-2 text-right align-top">
                  <input
                    type="number"
                    step="0.01"
                    value={row.discount}
                    onChange={(e) => updateRow(idx, { discount: Number(e.target.value) || 0 })}
                    className="w-20 border rounded px-2 py-1 text-right text-red-600"
                  />
                  {validations[idx] && validations[idx].some(v => v.includes("Discount")) && (
                    <p className="text-xs text-red-600 mt-1">Invalid discount</p>
                  )}
                </td>

                {/* Tax % */}
                <td className="px-2 py-2 text-right align-top">
                  <input
                    type="number"
                    step="0.01"
                    value={row.taxPercent}
                    onChange={(e) => updateRow(idx, { taxPercent: Number(e.target.value) || 0 })}
                    className="w-20 border rounded px-2 py-1 text-right"
                  />
                  {validations[idx] && validations[idx].some(v => v.includes("Tax")) && (
                    <p className="text-xs text-red-600 mt-1">Invalid tax</p>
                  )}
                </td>

                {/* Tax Amount (computed) */}
                <td className="px-3 py-2 text-right align-top text-gray-700">
                  ₹{(row.taxAmount || 0).toFixed(2)}
                </td>

                {/* Total (computed) */}
                <td className="px-3 py-2 text-right align-top font-semibold text-blue-600">
                  ₹{(row.total || 0).toFixed(2)}
                </td>

                {/* Actions */}
                <td className="px-3 py-2 text-center align-top">
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    className="text-gray-700 hover:text-red-600"
                    aria-label={`Remove row ${idx + 1}`}
                    title="Remove product"
                  >
                    <i className="fa fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add product inside table area */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => addRow()}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <i className="fa fa-plus-circle" /> Add Product
        </button>
      </div>
    </div>
  );
}
