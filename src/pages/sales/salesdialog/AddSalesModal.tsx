/* -------------------------------------------------
   AddSalesModal
   ------------------------------------------------- */

import React, { useEffect, useMemo, useState } from "react";
import { apiService } from "@/services/ApiService";
import { CustomerSelect, SupplierSelect } from "@/components/AutoComplete";
import ProductsTable, { TableItem } from "@/components/Screen/ProductsTable";
import { ORDER_STATUSES, ORDER_TYPES } from "@/constants/constants";

type SaleItem = {
  productId: string | number;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  taxAmount: number;
  total: number;
};

interface AddSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  orderType: (typeof ORDER_TYPES)[number];
}

const EMPTY_TABLE_ROW = (): TableItem => ({
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

const recalcTableItem = (it: TableItem): TableItem => {
  const price = Number(it.price) || 0;
  const qty = Number(it.quantity) || 0;
  const discountPercent = Number(it.discount) || 0;
  const taxPercent = Number(it.taxPercent) || 0;

  const subtotal = price * qty;
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxable = subtotal - discountAmount;
  const taxAmount = (taxable * taxPercent) / 100;
  const total = taxable + taxAmount;

  return {
    ...it,
    taxAmount: Number(taxAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

const AddSalesModal: React.FC<AddSalesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  orderType,
}) => {

  // Header form fields
  const [form, setForm] = useState({
    customerId: "",
    customerName: "",
    customerImage: "",
    date: "",
    supplierId: "",
    supplierName: "",
    orderTax: "0", // percent
    discount: "0", // percent
    shipping: "0", // absolute
    status: ORDER_STATUSES[0] as (typeof ORDER_STATUSES)[number],
  });

  // Table rows controlled by this modal (TableItem shape)
  const [itemsTable, setItemsTable] = useState<TableItem[]>([EMPTY_TABLE_ROW()]);

  // Load master data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const today = new Date().toISOString().split("T")[0];

    // initialize header + items from initialData (edit) or defaults (add)
    if (initialData) {
      setForm({
        customerId: initialData.customerId ?? "",
        customerName: initialData.customerName ?? "",
        customerImage: initialData.customerName ?? "",
        date: initialData.date ?? today,
        supplierId: initialData.supplierId ?? "",
        supplierName: initialData.supplierName ?? "",
        orderTax: String(initialData.orderTax ?? "0"),
        discount: String(initialData.discount ?? "0"),
        shipping: String(initialData.shipping ?? "0"),
        status: (initialData.status as any) ?? ORDER_STATUSES[0],
      });

      const mapped: TableItem[] = (initialData.items || []).map((it: any) =>
        recalcTableItem({
          productId: it.productId ?? "",
          productName: it.productName ?? "",
          sku: it.sku ?? "",
          productImage: undefined,
          quantity: Number(it.quantity ?? 1),
          price: Number(it.unitCost ?? it.purchasePrice ?? it.price ?? 0),
          discount: Number(it.discount ?? 0), // percent
          taxPercent: Number(it.taxPercent ?? it.tax ?? 0),
          taxAmount: Number(it.taxAmount ?? 0),
          total: Number(it.totalCost ?? it.total ?? 0),
        })
      );

      setItemsTable(mapped.length ? mapped : [EMPTY_TABLE_ROW()]);
    } else {
      setForm((p) => ({ ...p, date: today }));
      setItemsTable([EMPTY_TABLE_ROW()]);
    }

    // fetch customers / suppliers / products
    const fetchAll = async () => {
      try {
      } catch (err) {
        console.error("AddSalesModal: failed to load master data", err);
      }
    };

    fetchAll();
  }, [isOpen, initialData]);

  // totals derived from itemsTable (each TableItem already has taxAmount & total from ProductsTable)
  const totals = useMemo(() => {
    const subTotal = itemsTable.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0);

    // order-level percentage values (formData fields are strings to keep input binding simple)
    const orderTaxPercent = Number(form.orderTax) || 0;
    const orderDiscountPercent = Number(form.discount) || 0;
    const shipping = Number(form.shipping) || 0;

    const orderTaxAmt = (subTotal * orderTaxPercent) / 100;
    const orderDiscountAmt = (subTotal * orderDiscountPercent) / 100;

    const grand = subTotal - orderDiscountAmt + orderTaxAmt + shipping;

    return {
      subTotal: Number(subTotal.toFixed(2)),
      orderTaxAmt: Number(orderTaxAmt.toFixed(2)),
      discountAmt: Number(orderDiscountAmt.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      grandTotal: Number(grand.toFixed(2)),
    };
  }, [itemsTable, form.orderTax, form.discount, form.shipping]);

  // wrapper: update itemsTable (called by ProductsTable via onChange)
  const handleItemsTableChange = (next: TableItem[]) => {
    // ensure each row is recalculated & normalized
    const normalized = next.map(recalcTableItem);
    setItemsTable(normalized);
  };

  // Save: map TableItem -> SaleItem and call onSave
  const handleSave = () => {
    // basic validation
    if (!form.customerId) {
      alert("Please select a customer.");
      return;
    }
    if (itemsTable.some((it) => !it.productId)) {
      alert("Please select product for all rows.");
      return;
    }

    const mappedSaleItems: SaleItem[] = itemsTable.map((it) => ({
      productId: it.productId,
      productName: it.productName,
      sku: it.sku || "",
      quantity: Number(it.quantity || 0),
      price: Number(it.price || 0),
      discount: Number(it.discount || 0),
      tax: Number(it.taxPercent || 0),
      taxAmount: Number(it.taxAmount || 0),
      total: Number(it.total || 0),
    }));

    const payload = {
      reference: initialData?.reference ?? `S-${Date.now().toString().slice(-6)}`,
      date: form.date,
      customerId: form.customerId,
      customerName: form.customerName,
      customerImage: form.customerImage,
      supplierId: form.supplierId,
      supplierName: form.supplierName,
      orderType,
      orderTax: Number(form.orderTax),
      discount: Number(form.discount),
      shipping: Number(form.shipping),
      status: form.status,
      items: mappedSaleItems,
      totals: {
        subTotal: totals.subTotal,
        orderTaxAmt: totals.orderTaxAmt,
        discountAmt: totals.discountAmt,
        shipping: totals.shipping,
        grandTotal: totals.grandTotal,
      },
      originalInitialData: initialData ?? null,
    };

    onSave(payload);
    onClose();
  };

  // add one blank row to table
  const addRow = () => {
    setItemsTable((p) => [...p, EMPTY_TABLE_ROW()]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />

      {/* modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-screen flex flex-col" onClick={(e) => e.stopPropagation()}>
          {/* header */}
          <div className="bg-gray-100 border-b border-gray-300 px-6 py-4 flex justify-between items-center rounded-t-lg">
            <h2 className="text-xl font-semibold text-gray-800">
              {initialData ? "Edit " : "Add "}
              {orderType === "POS" ? "POS" : "Online"} Sale
            </h2>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-3xl font-light">×</button>
          </div>

          {/* body */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* top fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                  <CustomerSelect
                    value={form.customerName}
                    onSelect={(out) => {
                      // out.id is string, out.selected is the full Customer object
                      setForm((p) => ({ ...p, customerId: out.id, customerName: out.selected.customerName, customerImage: out.selected.customerImage }));
                    }}
                    placeholder="Search customer..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
                  <SupplierSelect
                    value={form.supplierName}
                    onSelect={(out) => {
                      setForm((p) => ({
                        ...p,
                        supplierId: out.id,
                        supplierName: out.selected.supplierName,
                      }));
                    }}
                  />

                </div>
              </div>

              {/* ProductsTable (replaces inline product rows) */}
              <div className="mt-2">
                <ProductsTable value={itemsTable} onChange={handleItemsTableChange} minRows={1} />

              </div>

              {/* totals area */}
              <div className="flex justify-end">
                <div className="w-80 bg-gray-50 p-4 rounded space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal:</span> <span>₹{totals.subTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Order Tax:</span> <span>₹{totals.orderTaxAmt.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Discount:</span> <span>₹{totals.discountAmt.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Shipping:</span> <span>₹{totals.shipping.toFixed(2)}</span></div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Grand Total:</span> <span>₹{totals.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* bottom fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Tax (%)</label>
                  <input
                    type="number"
                    value={form.orderTax}
                    onChange={(e) => setForm((p) => ({ ...p, orderTax: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={form.discount}
                    onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping (₹)</label>
                  <input
                    type="number"
                    value={form.shipping}
                    onChange={(e) => setForm((p) => ({ ...p, shipping: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="bg-white border-t border-gray-300 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition">
              Cancel
            </button>
            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSalesModal;
