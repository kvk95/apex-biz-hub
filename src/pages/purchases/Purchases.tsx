/* -------------------------------------------------
   Purchases - 100% standardized with PageBase1 + async autocomplete
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge, formatDate } from "@/utils/tableUtils";
import { AutoCompleteTextBox, AutoCompleteItem } from "@/components/Search/AutoCompleteTextBox";
import { SearchInput } from "@/components/Search/SearchInput";

import {
  PURCHASE_STATUSES,
  PAYMENT_STATUSES,
  SORT_OPTIONS,
} from "@/constants/constants";

// === Type-safe status constants ===
type PurchaseStatus = typeof PURCHASE_STATUSES[number];
type PaymentStatus = typeof PAYMENT_STATUSES[number];

const STATUS_PENDING: PurchaseStatus = "Pending";
const STATUS_UNPAID: PaymentStatus = "UnPaid";

type Supplier = {
  id: number;
  supplierName: string;
};

type Product = {
  id: number;
  productName: string;
  sku: string;
  price?: number;
  tax?: number;
};

type PurchaseItem = {
  productId: number;
  productName: string;
  quantity: number;
  purchasePrice: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  unitCost: number;
  totalCostPercent: number;
};

type Purchase = {
  id: number;
  supplierName: string;
  supplierId: number;
  date: string;
  reference: string;
  products: PurchaseItem[];
  orderTax: number;
  discount: number;
  shipping: number;
  status: PurchaseStatus;
  paymentStatus: PaymentStatus;
  description: string;
  total: number;
  paid: number;
  due: number;
};

export default function Purchases() {
  /* ---------- state ---------- */
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [tempSelectedProduct, setTempSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<PurchaseStatus | "All">("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus | "All">("All");
  const [selectedSort, setSelectedSort] = useState<(typeof SORT_OPTIONS)[number]>("Recently Added");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [loading, setLoading] = useState(true);

  // Autocomplete loading states
  const [supplierSearchLoading, setSupplierSearchLoading] = useState(false);
  const [productSearchLoading, setProductSearchLoading] = useState(false);

  // Search timeouts
  let supplierSearchTimeout: NodeJS.Timeout;
  let productSearchTimeout: NodeJS.Timeout;

  const [form, setForm] = useState({
    id: null as number | null,
    supplierId: "",
    supplierName: "",
    date: new Date().toISOString().split("T")[0],
    reference: "",
    description: "",
    orderTax: "0",
    discount: "0",
    shipping: "0",
    status: STATUS_PENDING,
    paymentStatus: STATUS_UNPAID,
    items: [] as PurchaseItem[],
  });

  /* ---------- load data ---------- */
  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const res = await apiService.get<Purchase[]>("Purchases");
      if (res.status.code === "S") setPurchases(res.result);
    } catch (err) {
      console.error("Purchases load error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- filtering ---------- */
  const filteredData = useMemo(() => {
    let result = [...purchases];

    if (search.trim()) {
      result = result.filter(
        (p) =>
          p.reference.toLowerCase().includes(search.toLowerCase()) ||
          p.supplierName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedSupplier !== "All") {
      result = result.filter((p) => p.supplierName === selectedSupplier);
    }

    if (selectedStatus !== "All") {
      result = result.filter((p) => p.status === selectedStatus);
    }

    if (selectedPaymentStatus !== "All") {
      result = result.filter((p) => p.paymentStatus === selectedPaymentStatus);
    }

    if (selectedSort === "Recently Added") {
      result.sort((a, b) => b.id - a.id);
    } else if (selectedSort === "Ascending") {
      result.sort((a, b) => a.total - b.total);
    } else if (selectedSort === "Descending") {
      result.sort((a, b) => b.total - a.total);
    } else if (selectedSort === "Last 7 Days") {
      const last7 = new Date();
      last7.setDate(last7.getDate() - 7);
      result = result.filter((p) => new Date(p.date) >= last7);
    } else if (selectedSort === "Last Month") {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      result = result.filter((p) => {
        const d = new Date(p.date);
        return d >= start && d <= end;
      });
    }

    return result;
  }, [purchases, search, selectedSupplier, selectedStatus, selectedPaymentStatus, selectedSort]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  /* ---------- derived ---------- */
  const supplierOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(purchases.map((p) => p.supplierName)))];
  }, [purchases]);

  /* ---------- handlers ---------- */
  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      supplierId: "",
      supplierName: "",
      date: new Date().toISOString().split("T")[0],
      reference: `P-${Date.now()}`,
      description: "",
      orderTax: "0",
      discount: "0",
      shipping: "0",
      status: STATUS_PENDING,
      paymentStatus: STATUS_UNPAID,
      items: [
        {
          productId: 0,
          productName: "",
          quantity: 1,
          purchasePrice: 0,
          discountAmount: 0,
          taxPercent: 0,
          taxAmount: 0,
          unitCost: 0,
          totalCostPercent: 0,
        },
      ],
    });
  };

  const handleEdit = (purchase: Purchase) => {
    setFormMode("edit");
    setForm({
      id: purchase.id,
      supplierId: purchase.supplierId.toString(),
      supplierName: purchase.supplierName,
      date: purchase.date,
      reference: purchase.reference,
      description: purchase.description,
      orderTax: purchase.orderTax.toString(),
      discount: purchase.discount.toString(),
      shipping: purchase.shipping.toString(),
      status: purchase.status,
      paymentStatus: purchase.paymentStatus,
      items: purchase.products.map((p) => ({
        ...p,
        totalCostPercent: p.totalCostPercent || 100,
      })),
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this purchase?")) {
      setPurchases((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleClear = () => {
    setSearch("");
    setSelectedSupplier("All");
    setSelectedStatus("All");
    setSelectedPaymentStatus("All");
    setSelectedSort("Recently Added");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("PDF Report Generated!");
  };

  const handleImport = () => {
    alert("Import Purchase (XLS) - Not implemented");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  /* ---------- async autocomplete: SUPPLIER ---------- */
  const handleSupplierSearch = async (query: string) => {
    if (supplierSearchTimeout) clearTimeout(supplierSearchTimeout);

    setForm((prev) => ({ ...prev, supplierName: query, supplierId: "" }));

    if (!query.trim()) {
      setFilteredSuppliers([]);
      return;
    }

    supplierSearchTimeout = setTimeout(async () => {
      setSupplierSearchLoading(true);
      try {
        const res = await apiService.get<Supplier[]>("Suppliers");
        if (res.status.code === "S") {
          const filtered = res.result.filter((s) =>
            s.supplierName.toLowerCase().includes(query.toLowerCase())
          );
          setFilteredSuppliers(filtered);
        }
      } catch (err) {
        console.error("Supplier search error:", err);
        setFilteredSuppliers([]);
      } finally {
        setSupplierSearchLoading(false);
      }
    }, 300);
  };

  const handleSupplierSelect = (item: AutoCompleteItem) => {
    setForm((prev) => ({
      ...prev,
      supplierId: item.id.toString(),
      supplierName: item.display,
    }));
    setFilteredSuppliers([]);
  };

  /* ---------- async autocomplete: PRODUCT ---------- */
  const handleProductSearch = async (query: string, idx: number) => {
    if (productSearchTimeout) clearTimeout(productSearchTimeout);

    const items = [...form.items];
    items[idx].productName = query;
    items[idx].productId = 0;
    setForm((prev) => ({ ...prev, items }));

    if (!query.trim()) {
      setFilteredProducts([]);
      return;
    }

    productSearchTimeout = setTimeout(async () => {
      setProductSearchLoading(true);
      try {
        const res = await apiService.get<Product[]>("Products");
        if (res.status.code === "S") {
          const filtered = res.result.filter(
            (p) =>
              p.productName.toLowerCase().includes(query.toLowerCase()) ||
              p.sku.toLowerCase().includes(query.toLowerCase())
          );
          setFilteredProducts(filtered);
        }
      } catch (err) {
        console.error("Product search error:", err);
        setFilteredProducts([]);
      } finally {
        setProductSearchLoading(false);
      }
    }, 300);
  };

  const handleProductSelect = (idx: number, item: AutoCompleteItem) => {
    const prod = filteredProducts.find((p) => p.id === item.id) || tempSelectedProduct;
    if (!prod) return;

    const items = [...form.items];
    const price = Number(prod.price ?? 0);
    const qty = items[idx].quantity || 1;
    const subtotal = price * qty;
    const discountAmt = items[idx].discountAmount || 0;
    const taxable = subtotal - discountAmt;
    const taxRate = Number(prod.tax ?? 0);
    const taxAmt = (taxable * taxRate) / 100;
    const total = taxable + taxAmt;

    items[idx] = {
      productId: prod.id,
      productName: prod.productName,
      quantity: qty,
      purchasePrice: price,
      discountAmount: discountAmt,
      taxPercent: taxRate,
      taxAmount: parseFloat(taxAmt.toFixed(2)),
      unitCost: qty > 0 ? parseFloat((total / qty).toFixed(2)) : 0,
      totalCostPercent: 100,
    };

    setForm((prev) => ({ ...prev, items }));
    setFilteredProducts([]);
    setTempSelectedProduct(null);
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: 0,
          productName: "",
          quantity: 1,
          purchasePrice: 0,
          discountAmount: 0,
          taxPercent: 0,
          taxAmount: 0,
          unitCost: 0,
          totalCostPercent: 0,
        },
      ],
    }));
  };

  const removeItem = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const handleItemChange = (idx: number, field: keyof PurchaseItem, value: string) => {
    const items = [...form.items];
    const num = Number(value) || 0;
    items[idx][field] = num as never;

    const p = items[idx];
    const subtotal = p.purchasePrice * p.quantity;
    const taxable = subtotal - p.discountAmount;
    const taxAmt = (taxable * p.taxPercent) / 100;
    const total = taxable + taxAmt;

    items[idx].taxAmount = parseFloat(taxAmt.toFixed(2));
    items[idx].unitCost = p.quantity > 0 ? parseFloat((total / p.quantity).toFixed(2)) : 0;

    setForm((prev) => ({ ...prev, items }));
  };

  /* ---------- totals ---------- */
  const totals = useMemo(() => {
    const subTotal = form.items.reduce((s, i) => s + i.purchasePrice * i.quantity, 0);
    const discountTotal = form.items.reduce((s, i) => s + i.discountAmount, 0) + Number(form.discount);
    const taxTotal = form.items.reduce((s, i) => s + i.taxAmount, 0) + Number(form.orderTax);
    const grand = subTotal - discountTotal + taxTotal + Number(form.shipping);
    return { subTotal, discountTotal, taxTotal, grand: parseFloat(grand.toFixed(2)) };
  }, [form.items, form.orderTax, form.discount, form.shipping]);

  /* ---------- submit ---------- */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.supplierId || !form.reference.trim() || form.items.some((i) => !i.productId)) {
      alert("Please fill all required fields.");
      return;
    }

    const newPurchase: Purchase = {
      id: formMode === "add" ? (purchases.length ? Math.max(...purchases.map((p) => p.id)) + 1 : 1) : form.id!,
      supplierId: Number(form.supplierId),
      supplierName: form.supplierName,
      date: form.date,
      reference: form.reference.trim(),
      description: form.description,
      orderTax: Number(form.orderTax),
      discount: Number(form.discount),
      shipping: Number(form.shipping),
      status: form.status,
      paymentStatus: form.paymentStatus,
      total: totals.grand,
      paid: 0,
      due: totals.grand,
      products: form.items,
    };

    if (formMode === "add") {
      setPurchases((prev) => [newPurchase, ...prev]);
    } else {
      setPurchases((prev) => prev.map((p) => (p.id === newPurchase.id ? newPurchase : p)));
    }

    setFormMode(null);
  };

  /* ---------- table columns ---------- */
  const columns: Column[] = [
    {
      key: "index",
      label: "#",
      render: (_, __, idx) => (currentPage - 1) * itemsPerPage + (idx ?? 0) + 1,
      align: "center",
      className: "w-12",
    },
    { key: "supplierName", label: "Supplier Name" },
    { key: "reference", label: "Reference" },
    { key: "date", label: "Date", render: v => <>{formatDate(v, "DD MMM YYYY")}</> },
    {
      key: "status",
      label: "Status",
      render: renderStatusBadge,
      align: "center",
    },
    {
      key: "total",
      label: "Total",
      render: (v) => `$${Number(v).toFixed(2)}`,
      align: "right",
    },
    {
      key: "paid",
      label: "Paid",
      render: (v) => `$${Number(v).toFixed(2)}`,
      align: "right",
    },
    {
      key: "due",
      label: "Due",
      render: (v) => `$${Number(v).toFixed(2)}`,
      align: "right",
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      render: renderStatusBadge,
      align: "center",
    },
  ];

  /* ---------- GRID ACTION BUTTONS - EXACT MOCKUP STANDARD ---------- */
  const rowActions = (row: Purchase) => (
    <>
      <button
        type="button"
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.reference}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        type="button"
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.reference}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  /* ---------- custom filters ---------- */
  const customFilters = () => (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-3 w-full">
      {/* Left: Search Input */}
      <div className="w-full md:w-auto md:max-w-md">
        <SearchInput
          value={search}
          placeholder="Search by Reference or Supplier..."
          onSearch={(query) => {
            setSearch(query);
            setCurrentPage(1);
          }}
          className="w-full"
        />
      </div>

      {/* Right: Filter Dropdowns - Right Aligned */}
      <div className="flex gap-2 flex-wrap justify-end w-full md:w-auto">
        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[100px]"
        >
          {supplierOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[100px]"
        >
          <option>All</option>
          {PURCHASE_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={selectedPaymentStatus}
          onChange={(e) => setSelectedPaymentStatus(e.target.value as any)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[100px]"
        >
          <option>All</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value as any)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[140px]"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );

  /* ---------- modal form (NO BUTTONS) ---------- */
  const modalForm = () => (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Supplier Name *</label>
          <AutoCompleteTextBox
            value={form.supplierName}
            onSearch={handleSupplierSearch}
            onSelect={handleSupplierSelect}
            items={filteredSuppliers.map((s) => ({
              id: s.id,
              display: s.supplierName,
            }))}
            placeholder="Search supplier..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Reference *</label>
          <input
            type="text"
            value={form.reference}
            onChange={(e) => setForm((p) => ({ ...p, reference: e.target.value }))}
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
      </div>

      {/* Product Table */}
      <div>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Product</th>
              <th className="px-3 py-2 text-center">Qty</th>
              <th>Purchase Price($)</th>
              <th>Discount($)</th>
              <th>Tax(%)</th>
              <th>Tax Amt($)</th>
              <th>Unit Cost($)</th>
              <th>Total Cost(%)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2">
                  <AutoCompleteTextBox
                    value={item.productName}
                    onSearch={(q) => handleProductSearch(q, idx)}
                    onSelect={(sel) => {
                      const prod = filteredProducts.find(p => p.id === sel.id);
                      if (prod) setTempSelectedProduct(prod);
                      handleProductSelect(idx, sel);
                    }}
                    items={filteredProducts.map((p) => ({
                      id: p.id,
                      display: p.productName,
                      extra: { SKU: p.sku, Price: `$${Number(p.price ?? 0).toFixed(2)}` },
                    }))}
                    placeholder="Search product..."
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                    min="1"
                    className="border rounded px-2 py-1 w-16 text-right"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.purchasePrice}
                    onChange={(e) => handleItemChange(idx, "purchasePrice", e.target.value)}
                    step="0.01"
                    className="border rounded px-2 py-1 w-20 text-right"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.discountAmount}
                    onChange={(e) => handleItemChange(idx, "discountAmount", e.target.value)}
                    step="0.01"
                    className="border rounded px-2 py-1 w-20 text-right"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.taxPercent}
                    onChange={(e) => handleItemChange(idx, "taxPercent", e.target.value)}
                    step="0.01"
                    className="border rounded px-2 py-1 w-20 text-right"
                  />
                </td>
                <td className="text-right pr-3">{item.taxAmount.toFixed(2)}</td>
                <td className="text-right pr-3">{item.unitCost.toFixed(2)}</td>
                <td className="text-right pr-3">{item.totalCostPercent}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addItem}
          className="mt-2 flex items-center text-blue-600 hover:text-blue-800 text-sm"
        >
          <i className="fa fa-plus-circle mr-1" aria-hidden="true"></i> Add Product
        </button>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Order Tax *</label>
          <input
            type="number"
            value={form.orderTax}
            onChange={(e) => setForm((p) => ({ ...p, orderTax: e.target.value }))}
            step="0.01"
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount *</label>
          <input
            type="number"
            value={form.discount}
            onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))}
            step="0.01"
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Shipping *</label>
          <input
            type="number"
            value={form.shipping}
            onChange={(e) => setForm((p) => ({ ...p, shipping: e.target.value }))}
            step="0.01"
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status *</label>
          <select
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as PurchaseStatus }))}
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {PURCHASE_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={3}
          maxLength={360}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Maximum 60 words"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {form.description.split(" ").filter(Boolean).length}/60 words
        </p>
      </div>
    </form>
  );

  /* ---------- render ---------- */
  return (
    <PageBase1
      title="Purchase"
      description="Manage your purchases"
      icon="fa-light fa-shopping-cart"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      onReport={handleReport}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Purchase" : "Edit Purchase"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters} loading={loading}
    >
      <button
        type="button"
        onClick={handleImport}
        className="ml-2 bg-blue-900 text-white py-2 px-3 rounded hover:bg-blue-800 transition-colors"
        title="Import Purchase"
      >
        <i className="fa fa-upload me-2" aria-hidden="true"></i>
        Import Purchase
      </button>
    </PageBase1>
  );
}