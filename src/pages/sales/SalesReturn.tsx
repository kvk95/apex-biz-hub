/* -------------------------------------------------
   SalesReturn
   ------------------------------------------------- */
import React, { useEffect, useMemo, useState } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { CustomerSelect } from "@/components/AutoComplete";
import { SearchInput } from "@/components/Search/SearchInput";
import { PAYMENT_STATUSES, SORT_OPTIONS } from "@/constants/constants";
import { useLocalization } from "@/utils/formatters";
import { useEnhancedToast } from "@/components/ui/enhanced-toast";

import ProductsTable, { TableItem } from "@/components/Screen/ProductsTable";

type Product = {
  id: string;
  sku?: string;
  productName: string;
  price?: number;
  productImage?: string;
  stock?: number;
};

type ReturnItem = {
  productId: string;
  productName: string;
  sku: string;
  productImage?: string;
  stock: number;
  quantity: number;
  netUnitPrice: number;
  discount: number; // percent
  taxPercent: number;
  subtotal: number; // total after item discount & tax
};

type Return = {
  purchaseId?: string;
  reference: string;
  date: string;
  customerId: string;
  customerName: string;
  customerImage?: string;
  status: string;
  paymentStatus: string;
  total: number;
  paid: number;
  due: number;
  items: ReturnItem[];
  summary: {
    orderTax: number; // percent
    discount: number; // percent
    shipping: number; // absolute
    grandTotal: number;
  };
  notes?: string;
};

/* ---------- Component ---------- */

export default function SalesReturn() {
  const [returns, setReturns] = useState<Return[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<string | "All">("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string | "All">("All");
  const [selectedSort, setSelectedSort] = useState<(typeof SORT_OPTIONS)[number]>("Recently Added");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatDate, formatCurrency } = useLocalization();
  const { showSuccess, showError } = useEnhancedToast();

  // Form header & global fields
  const [form, setForm] = useState<{
    customerId: string;
    customerName: string;
    date: string;
    reference: string;
    orderTax: string; // percent
    discount: string; // percent
    shipping: string; // absolute
    status: string;
    paymentStatus: string;
    notes: string;
  }>({
    customerId: "",
    customerName: "",
    date: new Date().toISOString().split("T")[0],
    reference: "",
    orderTax: "0",
    discount: "0",
    shipping: "0",
    status: "Pending",
    paymentStatus: "UnPaid",
    notes: "",
  });

  // UI table items (controlled by ProductsTable)
  const [itemsTable, setItemsTable] = useState<TableItem[]>([
    {
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
    },
  ]);

  /* ---------- Load Master Data ---------- */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [prodRes, retRes] = await Promise.all([
          apiService.get<Product[]>("Products"),
          apiService.get<Return[]>("SalesReturn"),
        ]);
        if (prodRes?.status?.code === "S") {
          setAllProducts(prodRes.result);
        }
        if (retRes?.status?.code === "S") setReturns(retRes.result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ---------- Filtering & Pagination ---------- */
  const filteredData = useMemo(() => {
    let list = [...returns];

    if (search.trim()) {
      list = list.filter(
        (r) =>
          r.reference.toLowerCase().includes(search.toLowerCase()) ||
          r.customerName.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCustomer !== "All") list = list.filter((r) => r.customerName === selectedCustomer);
    if (selectedStatus !== "All") list = list.filter((r) => r.status === selectedStatus);
    if (selectedPaymentStatus !== "All") list = list.filter((r) => r.paymentStatus === selectedPaymentStatus);

    // sorting
    if (selectedSort === "Recently Added") list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    else if (selectedSort === "Ascending") list.sort((a, b) => a.total - b.total);
    else if (selectedSort === "Descending") list.sort((a, b) => b.total - a.total);
    else if (selectedSort === "Last 7 Days") {
      const cut = new Date();
      cut.setDate(cut.getDate() - 7);
      list = list.filter((r) => new Date(r.date) >= cut);
    }

    return list;
  }, [returns, search, selectedCustomer, selectedStatus, selectedPaymentStatus, selectedSort]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const customerOptions = useMemo(() => ["All", ...Array.from(new Set(returns.map((r) => r.customerName)))], [returns]);

  /* ---------- Handlers (preserve your existing ones) ---------- */
  const generateRef = () => `SR-${Date.now().toString().slice(-6)}`;

  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      customerId: "",
      customerName: "",
      date: new Date().toISOString().split("T")[0],
      reference: generateRef(),
      orderTax: "0",
      discount: "0",
      shipping: "0",
      status: "Pending",
      paymentStatus: "UnPaid",
      notes: "",
    });
    setItemsTable([
      {
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
      },
    ]);
  };

  const handleEdit = (ret: Return) => {
    setFormMode("edit");
    setForm({
      customerId: ret.customerId,
      customerName: ret.customerName,
      date: ret.date,
      reference: ret.reference,
      orderTax: String(ret.summary.orderTax ?? 0),
      discount: String(ret.summary.discount ?? 0),
      shipping: String(ret.summary.shipping ?? 0),
      status: ret.status,
      paymentStatus: ret.paymentStatus,
      notes: ret.notes || "",
    });

    // Map ReturnItem -> TableItem
    const mapped: TableItem[] = (ret.items || []).map((it) => {
      // item-level mapping follows Model B (discount percent)
      const price = Number(it.netUnitPrice || 0);
      const qty = Number(it.quantity || 0);
      const discount = Number(it.discount || 0);
      const taxPercent = Number(it.taxPercent || 0);
      const subtotal = price * qty;
      const discountAmt = (subtotal * discount) / 100;
      const taxable = subtotal - discountAmt;
      const taxAmount = (taxable * taxPercent) / 100;
      const total = taxable + taxAmount;
      return {
        productId: it.productId,
        productName: it.productName,
        sku: it.sku,
        productImage: it.productImage,
        quantity: qty,
        price,
        discount,
        taxPercent,
        taxAmount: Number(taxAmount.toFixed(2)),
        total: Number(total.toFixed(2)),
      } as TableItem;
    });

    setItemsTable(mapped.length ? mapped : [
      {
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
      },
    ]);
  };

  const handleDelete = (ref: string) => {
    if (window.confirm("Delete this return?")) {
      setReturns((prev) => prev.filter((r) => r.reference !== ref));
    }
  };

  const handleClear = () => {
    setSearch("");
    setSelectedCustomer("All");
    setSelectedStatus("All");
    setSelectedPaymentStatus("All");
    setSelectedSort("Recently Added");
    setCurrentPage(1);
  };

  const handleReport = () => alert("PDF Report Generated!");

  const handleSearchChange = (q: string) => {
    setSearch(q);
    setCurrentPage(1);
  };

  /* ---------- Totals (Model B; same as Quotation) ---------- */
  const totals = useMemo(() => {
    // subtotal is sum(price * qty) — BEFORE per-line discounts and per-line taxes
    const subTotal = itemsTable.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0);

    // global discount percent applied on subTotal
    const orderDiscountPercent = Number(form.discount) || 0;
    const orderDiscountAmount = (subTotal * orderDiscountPercent) / 100;

    // global order tax percent applied on subTotal
    const orderTaxPercent = Number(form.orderTax) || 0;
    const orderTaxAmount = (subTotal * orderTaxPercent) / 100;

    const shipping = Number(form.shipping) || 0;

    const grandTotal = subTotal - orderDiscountAmount + orderTaxAmount + shipping;

    return {
      subTotal: Number(subTotal.toFixed(2)),
      discountAmount: Number(orderDiscountAmount.toFixed(2)),
      taxAmount: Number(orderTaxAmount.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      grand: Number(grandTotal.toFixed(2)),
    };
  }, [itemsTable, form.orderTax, form.discount, form.shipping]);

  /* ---------- Submit (map TableItem -> ReturnItem) ---------- */
  const handleFormSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();

      // Validate header + table rows
      if (!form.customerId) {
        alert("Please select a customer.");
        return;
      }
      if (!form.reference.trim()) {
        alert("Reference required.");
        return;
      }
      if (itemsTable.some((it) => !it.productId)) {
        alert("Please select products for all rows.");
        return;
      }

      // Map TableItem -> ReturnItem (Model B mapping)
      const mappedItems: ReturnItem[] = itemsTable.map((it) => {
        const price = Number(it.price || 0);
        const qty = Number(it.quantity || 0);
        const discount = Number(it.discount || 0); // percent
        const taxPercent = Number(it.taxPercent || 0);

        const subtotalRaw = price * qty;
        const discountAmt = (subtotalRaw * discount) / 100;
        const taxable = subtotalRaw - discountAmt;
        const taxAmt = (taxable * taxPercent) / 100;
        const total = taxable + taxAmt;

        return {
          productId: String(it.productId || ""),
          productName: it.productName || "",
          sku: it.sku || "",
          productImage: it.productImage,
          stock: 0,
          quantity: qty,
          netUnitPrice: price,
          discount, // percent
          taxPercent,
          subtotal: Number(total.toFixed(2)),
        };
      });

      const newReturn: Return = {
        reference: form.reference.trim(),
        date: form.date,
        customerId: form.customerId,
        customerName: form.customerName,
        status: form.status,
        paymentStatus: formMode === "add" ? "UnPaid" : form.paymentStatus || "UnPaid",
        total: totals.grand,
        paid: 0,
        due: totals.grand,
        items: mappedItems,
        summary: {
          orderTax: Number(form.orderTax) || 0,
          discount: Number(form.discount) || 0,
          shipping: Number(form.shipping) || 0,
          grandTotal: totals.grand,
        },
        notes: form.notes,
      };

      if (formMode === "add") {
        setReturns((prev) => [newReturn, ...prev]);
      } else {
        setReturns((prev) => prev.map((r) => (r.reference === form.reference ? { ...r, ...newReturn } : r)));
      }
      showSuccess("Localization settings saved!");

      setFormMode(null);
    } catch (err: any) {
      showError(err.message || "Failed to save");
    }
  };

  /* ---------- Table columns & actions ---------- */
  const columns: Column[] = [
    {
      key: "index",
      label: "#",
      render: (_, __, idx) => (currentPage - 1) * itemsPerPage + (idx ?? 0) + 1,
      align: "center",
      className: "w-12",
    },
    { key: "reference", label: "Reference" },
    { key: "date", label: "Date", render: (v) => <>{formatDate(v)}</> },
    { key: "customerName", label: "Customer" },
    { key: "status", label: "Status", render: renderStatusBadge, align: "center" },
    { key: "total", label: "Total", render: formatCurrency, align: "right" },
    { key: "paid", label: "Paid", render: formatCurrency, align: "right" },
    { key: "due", label: "Due", render: formatCurrency, align: "right" },
    { key: "paymentStatus", label: "Payment Status", render: renderStatusBadge, align: "center" },
  ];

  const rowActions = (row: Return) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.reference}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 me-1"
      >
        <i className="fa fa-edit" />
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.reference)}
        aria-label={`Delete ${row.reference}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 me-1"
      >
        <i className="fa fa-trash-can" />
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-3 w-full">
      <div className="w-full md:w-auto md:max-w-md">
        <SearchInput value={search} placeholder="Search by Reference or Customer..." onSearch={handleSearchChange} className="w-full" />
      </div>
      <div className="flex gap-2 flex-wrap justify-end w-full md:w-auto">
        <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[100px]">
          {customerOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as any)} className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[100px]">
          <option>All</option>
          {["Pending", "Approved", "Rejected", "Completed"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={selectedPaymentStatus} onChange={(e) => setSelectedPaymentStatus(e.target.value as any)} className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[100px]">
          <option>All</option>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value as any)} className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[140px]">
          {SORT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );

  /* ---------- Modal Form (only modal area adjusted to use ProductsTable) ---------- */
  const modalForm = () => (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium mb-1">Customer Name *</label>
          <CustomerSelect
            value={form.customerName}
            onSelect={(out) => {
              // out.id is string, out.selected is the full Customer object
              setForm((p) => ({ ...p, customerId: out.id, customerName: out.selected.customerName }));
            }}
            placeholder="Search customer..."
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">Date *</label>
          <input id="date" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring" required />
        </div>

        <div>
          <label htmlFor="reference" className="block text-sm font-medium mb-1">Reference *</label>
          <input id="reference" type="text" value={form.reference} onChange={(e) => setForm((p) => ({ ...p, reference: e.target.value }))} className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring" required />
        </div>
      </div>

      {/* ProductsTable - reusable component */}
      <div className="mt-6 overflow-x-auto">
        <ProductsTable
          value={itemsTable}
          onChange={(v) => setItemsTable(v)} // receive updated rows from ProductsTable
          minRows={1}
        />
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-80 bg-gray-50 p-4 rounded space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal:</span><span>₹{totals.subTotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Discount:</span><span>-₹{totals.discountAmount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax:</span><span>₹{totals.taxAmount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping:</span><span>₹{totals.shipping.toFixed(2)}</span></div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t"><span>Grand Total:</span><span>₹{totals.grand.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="orderTax" className="block text-sm font-medium mb-1">Order Tax (%)</label>
          <input id="orderTax" type="number" value={form.orderTax} onChange={(e) => setForm((p) => ({ ...p, orderTax: e.target.value }))} className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label htmlFor="discount" className="block text-sm font-medium mb-1">Discount (%)</label>
          <input id="discount" type="number" value={form.discount} onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))} className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label htmlFor="shipping" className="block text-sm font-medium mb-1">Shipping (₹)</label>
          <input id="shipping" type="number" value={form.shipping} onChange={(e) => setForm((p) => ({ ...p, shipping: e.target.value }))} className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
          <select id="status" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring">
            {["Pending", "Approved", "Rejected", "Completed"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes</label>
        <textarea id="notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={3} maxLength={360} className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Maximum 60 words" />
        <p className="text-xs text-muted-foreground mt-1">{form.notes.split(" ").filter(Boolean).length}/60 words</p>
      </div>
    </form>
  );

  /* ---------- Render ---------- */
  return (
    <PageBase1
      title="Sales Return"
      description="Manage sales returns"
      pageIcon="fa-light fa-undo"
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
      modalTitle={formMode === "add" ? "Add Sales Return" : "Edit Sales Return"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}
