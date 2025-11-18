/* -------------------------------------------------
   Quotation
   ------------------------------------------------- */
import React, { useEffect, useMemo, useState } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import ProductsTable, { TableItem } from "@/components/Screen/ProductsTable";
import {
  AutoCompleteTextBox,
  AutoCompleteItem,
} from "@/components/Search/AutoCompleteTextBox";
import { SearchInput } from "@/components/Search/SearchInput";
import { QUOTATION_STATUSES } from "@/constants/constants";
import { useLocalization } from "@/utils/formatters";

/* ---------- Type-Safe AutoComplete ---------- */
type CustomerOption = AutoCompleteItem<string>;
const CustomerAutoComplete = AutoCompleteTextBox<CustomerOption>;

/* ---------- Types ---------- */
type Customer = { id: string; name: string };
type Product = {
  id: string;
  productName: string;
  sku: string;
  price: number;
  productImage?: string;
};

type QuotationItem = {
  productId: string;
  productName: string;
  sku: string;
  productImage?: string;
  quantity: number;
  purchasePrice: number;
  discount: number; // percent
  taxPercent: number;
  taxAmount?: number;
  totalCost: number;
};

type Quotation = {
  reference: string;
  date: string;
  customerId: string;
  customerName: string;
  status: typeof QUOTATION_STATUSES[number];
  total: number;
  items: QuotationItem[];
  summary: {
    orderTax: number;
    discount: number;
    shipping: number;
    grandTotal: number;
  };
  description?: string;
};

/* ---------- Helper: item recalculation (Model B) ---------- */
/**
 * Model B (AddSalesModal style):
 * subtotal = price * qty
 * discountAmt = subtotal * discount%/100
 * taxable = subtotal - discountAmt
 * taxAmt = taxable * tax%/100
 * total = taxable + taxAmt
 */
const recalcTableItem = (it: TableItem): TableItem => {
  const price = Number(it.price) || 0;
  const qty = Number(it.quantity) || 0;
  const discount = Number(it.discount) || 0; // percent
  const taxPercent = Number((it as any).taxPercent ?? it.taxPercent) || 0; // some TableItem names may differ

  const subtotal = price * qty;
  const discountAmt = (subtotal * discount) / 100;
  const taxable = subtotal - discountAmt;
  const taxAmount = (taxable * taxPercent) / 100;
  const total = taxable + taxAmount;

  return {
    ...it,
    taxAmount: Number(taxAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

export default function Quotation() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<string | "All">("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | "view" | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatDate, formatCurrency } = useLocalization();

  /* Form */
  const [form, setForm] = useState<{
    reference: string;
    date: string;
    customerId: string;
    customerName: string;
    items: QuotationItem[]; // kept for final mapping, but the UI uses `itemsTable`
    orderTax: string; // percent
    discount: string; // percent
    shipping: string; // absolute
    status: typeof QUOTATION_STATUSES[number];
    description: string;
  }>({
    reference: "",
    date: new Date().toISOString().split("T")[0],
    customerId: "",
    customerName: "",
    items: [],
    orderTax: "0",
    discount: "0",
    shipping: "0",
    status: "Pending",
    description: "",
  });

  /* UI table items (ProductsTable) - shape confirmed by you */
  const [itemsTable, setItemsTable] = useState<TableItem[]>([
    {
      productId: "",
      productName: "",
      sku: "",
      quantity: 1,
      price: 0,
      discount: 0,
      taxPercent: 0,
      taxAmount: 0,
      total: 0,
    },
  ]);

  /* Load Data */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [custRes, quotRes] = await Promise.all([
          apiService.get<Customer[]>("Customers"),
          apiService.get<Quotation[]>("Quotation"),
        ]);
        if (custRes?.status?.code === "S") setAllCustomers(custRes.result);
        if (quotRes?.status?.code === "S") setQuotations(quotRes.result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* Filtering & Pagination */
  const filteredData = useMemo(() => {
    let list = [...quotations];
    if (search)
      list = list.filter(
        (q) =>
          q.reference.includes(search) ||
          q.customerName.toLowerCase().includes(search.toLowerCase())
      );
    if (selectedCustomer !== "All") list = list.filter((q) => q.customerName === selectedCustomer);
    if (selectedStatus !== "All") list = list.filter((q) => q.status === selectedStatus);
    return list.sort((a, b) => b.reference.localeCompare(a.reference));
  }, [quotations, search, selectedCustomer, selectedStatus]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const customerOptions = useMemo(
    () => ["All", ...new Set(quotations.map((q) => q.customerName))],
    [quotations]
  );

  /* Helpers */
  const generateRef = () => `QTN-${Date.now().toString().slice(-6)}`;

  /* Open add modal */
  const handleAddClick = () => {
    const newRef = generateRef();
    setForm({
      reference: newRef,
      date: new Date().toISOString().split("T")[0],
      customerId: "",
      customerName: "",
      items: [],
      orderTax: "0",
      discount: "0",
      shipping: "0",
      status: "Pending",
      description: "",
    });
    // reset table to one blank row
    setItemsTable([
      {
        productId: "",
        productName: "",
        sku: "",
        quantity: 1,
        price: 0,
        discount: 0,
        taxPercent: 0,
        taxAmount: 0,
        total: 0,
      },
    ]);

    setFormMode("add");
  };

  /* Edit existing */
  const handleEdit = (q: Quotation) => {
    setFormMode("edit");
    setForm({
      reference: q.reference,
      date: q.date,
      customerId: q.customerId,
      customerName: q.customerName,
      items: q.items.map((it) => ({ ...it })), // keep original for reference
      orderTax: q.summary.orderTax.toString(),
      discount: q.summary.discount.toString(),
      shipping: q.summary.shipping.toString(),
      status: q.status,
      description: q.description || "",
    });

    // map QuotationItem -> TableItem
    const mapped: TableItem[] = q.items.map((it) => {
      const price = Number(it.purchasePrice || 0);
      const qty = Number(it.quantity || 0);
      const discount = Number(it.discount || 0);
      const taxPercent = Number(it.taxPercent || 0);
      const subtotal = price * qty;
      const discountAmt = (subtotal * discount) / 100;
      const taxable = subtotal - discountAmt;
      const taxAmount = (taxable * taxPercent) / 100;
      const total = taxable + taxAmount;
      return recalcTableItem({
        productId: it.productId,
        productName: it.productName,
        sku: it.sku,
        quantity: qty,
        price,
        discount,
        taxPercent,
        taxAmount,
        total,
      });
    });
    setItemsTable(mapped.length ? mapped : [
      {
        productId: "",
        productName: "",
        sku: "",
        quantity: 1,
        price: 0,
        discount: 0,
        taxPercent: 0,
        taxAmount: 0,
        total: 0,
      },
    ]);
  };

  /* View/Print */
  const handleView = (q: Quotation) => {
    setFormMode("view");
    setForm({
      reference: q.reference,
      date: q.date,
      customerId: q.customerId,
      customerName: q.customerName,
      items: q.items.map((it) => ({ ...it })),
      orderTax: q.summary.orderTax.toString(),
      discount: q.summary.discount.toString(),
      shipping: q.summary.shipping.toString(),
      status: q.status,
      description: q.description || "",
    });

    const mapped: TableItem[] = q.items.map((it) => {
      const price = Number(it.purchasePrice || 0);
      const qty = Number(it.quantity || 0);
      const discount = Number(it.discount || 0);
      const taxPercent = Number(it.taxPercent || 0);
      const subtotal = price * qty;
      const discountAmt = (subtotal * discount) / 100;
      const taxable = subtotal - discountAmt;
      const taxAmount = (taxable * taxPercent) / 100;
      const total = taxable + taxAmount;
      return recalcTableItem({
        productId: it.productId,
        productName: it.productName,
        sku: it.sku,
        quantity: qty,
        price,
        discount,
        taxPercent,
        taxAmount,
        total,
      });
    });
    setItemsTable(mapped);
  };

  const handleDelete = (ref: string) => {
    if (confirm("Delete quotation?")) {
      setQuotations((prev) => prev.filter((q) => q.reference !== ref));
    }
  };

  /* Customer search/select for header */
  const handleCustomerSearch = (query: string) => {
    setForm((p) => ({ ...p, customerName: query, customerId: "" }));
    if (!query.trim()) return setFilteredCustomers([]);
    setFilteredCustomers(
      allCustomers.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleCustomerSelect = (item: CustomerOption) => {
    setForm((p) => ({ ...p, customerId: item.id, customerName: item.display }));
    setFilteredCustomers([]);
  };

  /* Totals (follows AddSalesModal totals style) */
  const totals = useMemo(() => {
    // subTotal is sum(price * qty) — before per-line discounts and taxes
    const subTotal = itemsTable.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0);

    const orderDiscountPercent = Number(form.discount) || 0;
    const orderDiscountAmount = (subTotal * orderDiscountPercent) / 100;

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

  /* Submit */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If view mode — close modal (PageBase1 handles footer)
    if (formMode === "view") {
      setFormMode(null);
      return;
    }

    if (!form.customerId || itemsTable.some((it) => !it.productId)) {
      alert("Please fill all required fields.");
      return;
    }

    // Map TableItem -> QuotationItem
    const mappedItems: QuotationItem[] = itemsTable.map((it) => {
      const price = Number(it.price) || 0;
      const qty = Number(it.quantity) || 0;
      const discount = Number(it.discount) || 0;
      const taxPercent = Number(it.taxPercent || 0);
      const subtotal = price * qty;
      const discountAmt = (subtotal * discount) / 100;
      const taxable = subtotal - discountAmt;
      const taxAmount = (taxable * taxPercent) / 100;
      const total = taxable + taxAmount;
      return {
        productId: String(it.productId || ""),
        productName: it.productName,
        sku: it.sku,
        productImage: undefined,
        quantity: qty,
        purchasePrice: price,
        discount,
        taxPercent,
        taxAmount: Number(taxAmount.toFixed(2)),
        totalCost: Number(total.toFixed(2)),
      };
    });

    // update form.items for storage
    const newForm = {
      ...form,
      items: mappedItems,
    };
    setForm(newForm);

    const newQuotation: Quotation = {
      reference: form.reference || generateRef(),
      date: form.date,
      customerId: form.customerId,
      customerName: form.customerName,
      status: form.status,
      total: totals.grand,
      items: mappedItems,
      summary: {
        orderTax: Number(form.orderTax),
        discount: Number(form.discount),
        shipping: Number(form.shipping),
        grandTotal: totals.grand,
      },
      description: form.description,
    };

    if (formMode === "add") {
      setQuotations((p) => [newQuotation, ...p]);
    } else {
      setQuotations((p) => p.map((q) => (q.reference === newQuotation.reference ? newQuotation : q)));
    }

    setFormMode(null);
  };

  /* Table columns for PageBase1 list */
  const columns: Column[] = [
    { key: "index", label: "#", render: (_, __, i) => (currentPage - 1) * itemsPerPage + (i ?? 0) + 1, align: "center" },
    { key: "reference", label: "Reference" },
    { key: "date", label: "Date", render: (v) => formatDate(v) },
    { key: "customerName", label: "Customer" },
    { key: "status", label: "Status", render: renderStatusBadge, align: "center" },
    { key: "total", label: "Total", render: formatCurrency, align: "right" },
  ];

  const rowActions = (row: Quotation) => (
    <>
      <button
        type="button"
        onClick={() => handleView(row)}
        aria-label={`View ${row.reference}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white rounded-lg text-xs p-2 me-1 transition-all"
        title="View / Print"
      >
        <i className="fa fa-eye" />
      </button>

      <button
        type="button"
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.reference}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white rounded-lg text-xs p-2 me-1 transition-all"
        title="Edit"
      >
        <i className="fa fa-edit" />
      </button>

      <button
        type="button"
        onClick={() => handleDelete(row.reference)}
        aria-label={`Delete ${row.reference}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white rounded-lg text-xs p-2 transition-all"
        title="Delete"
      >
        <i className="fa fa-trash-can" />
      </button>
    </>
  );

  const customFilters = () => (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <SearchInput value={search} onSearch={setSearch} placeholder="Search reference or customer..." />
      <div className="flex gap-2">
        <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="border rounded px-3 py-2">
          {customerOptions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as any)} className="border rounded px-3 py-2">
          <option>All</option>
          {QUOTATION_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );

  /* Modal form: view mode uses read-only printable layout; add/edit uses editable form */
  const modalForm = () => {
    // view mode: read-only printable
    if (formMode === "view") {
      return (
        <div className="space-y-4 overflow-y-auto max-h-[65vh] p-2">
          {/* Header (Type B) */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Quotation</h2>
              <div className="mt-2 text-sm text-gray-700">
                <div><strong>Ref No:</strong> {form.reference}</div>
                <div><strong>Date:</strong> {formatDate(form.date)}</div>
              </div>
            </div>

            <div className="text-sm text-right">
              <div><strong>Status:</strong> <span className="inline-block px-2 py-0.5 rounded bg-gray-100">{form.status}</span></div>
              <div className="mt-3">
                <strong>Customer Details:</strong>
                <div className="mt-1">{form.customerName || "-"}</div>
              </div>
            </div>
          </div>

          {/* Items table (read-only) */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Product</th>
                  <th className="px-3 py-2 text-center w-20">Qty</th>
                  <th className="px-3 py-2 text-right w-28">Price(₹)</th>
                  <th className="px-3 py-2 text-right w-20">Discount(%)</th>
                  <th className="px-3 py-2 text-right w-20">Tax(%)</th>
                  <th className="px-3 py-2 text-right w-28">Tax Amt(₹)</th>
                  <th className="px-3 py-2 text-right w-36">Total(₹)</th>
                </tr>
              </thead>
              <tbody>
                {itemsTable.map((it, i) => {
                  // Ensure recalc used for display
                  const rec = recalcTableItem(it);
                  const price = Number(it.price || 0);
                  const qty = Number(it.quantity || 0);
                  const discountPercent = Number(it.discount || 0);
                  const taxPercent = Number(it.taxPercent || 0);
                  return (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{it.productName}</td>
                      <td className="px-3 py-2 text-center">{qty}</td>
                      <td className="px-3 py-2 text-right">₹{price.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right">{discountPercent}%</td>
                      <td className="px-3 py-2 text-right">{taxPercent}%</td>
                      <td className="px-3 py-2 text-right">₹{rec.taxAmount.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-semibold">₹{rec.total.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals and description */}
          <div className="flex gap-6 justify-end items-start">
            <div className="w-96 bg-gray-50 p-6 rounded-lg text-sm">
              <div className="flex justify-between"><span>Subtotal:</span> <span>₹{totals.subTotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Discount:</span> <span>-₹{totals.discountAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax:</span> <span>₹{totals.taxAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping:</span> <span>₹{totals.shipping.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg border-t-2 border-gray-300 pt-3 mt-3">
                <span>Grand Total:</span> <span className="text-blue-600">₹{totals.grand.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-sm text-gray-700 mt-2">{form.description || "-"}</p>
          </div>

          {/* Print button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              <i className="fa fa-print" /> Print
            </button>
          </div>
        </div>
      );
    }

    /* editable add/edit form */
    return (
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label>Customer *</label>
            <CustomerAutoComplete
              value={form.customerName}
              onSearch={handleCustomerSearch}
              onSelect={handleCustomerSelect}
              items={
                form.customerId
                  ? [
                    ...filteredCustomers.map((c) => ({ id: c.id, display: c.name })),
                    ...allCustomers.filter((c) => c.id === form.customerId).map((c) => ({ id: c.id, display: c.name })),
                  ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
                  : filteredCustomers.map((c) => ({ id: c.id, display: c.name }))
              }
              placeholder="Search customer..."
            />
          </div>
          <div>
            <label>Date *</label>
            <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label>Reference</label>
            <input type="text" value={form.reference} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
          </div>
        </div>

        {/* ProductsTable (editable) */}
        <div className="mt-6 overflow-x-auto">
          <ProductsTable
            value={Array.isArray(itemsTable) ? itemsTable : []}
            onChange={(v) => setItemsTable(v.map(recalcTableItem))}
            minRows={1}
          />
        </div>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-96 bg-gray-50 p-6 rounded-lg space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal:</span> <span>₹{totals.subTotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Discount:</span> <span>-₹{totals.discountAmount.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax:</span> <span>₹{totals.taxAmount.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping:</span> <span>₹{totals.shipping.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-xl border-t-2 border-gray-300 pt-3">
              <span>Grand Total:</span> <span className="text-blue-600">₹{totals.grand.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Bottom Fields */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label>Order Tax (%)</label>
            <input type="number" value={form.orderTax} onChange={(e) => setForm((p) => ({ ...p, orderTax: e.target.value }))} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label>Discount (%)</label>
            <input type="number" value={form.discount} onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label>Shipping (₹)</label>
            <input type="number" value={form.shipping} onChange={(e) => setForm((p) => ({ ...p, shipping: e.target.value }))} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))} className="w-full border rounded px-3 py-2">
              {QUOTATION_STATUSES.map((s) => (<option key={s}>{s}</option>))}
            </select>
          </div>
        </div>

        <div>
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} className="w-full border rounded px-3 py-2" placeholder="Enter description..." />
        </div>
      </form>
    );
  };

  return (
    <PageBase1
      title="Quotation"
      description="Manage quotations"
      pageIcon="fa-light fa-file-invoice-dollar"
      search={search}
      onSearchChange={setSearch}
      onAddClick={handleAddClick}
      onRefresh={() => window.location.reload()}
      onReport={() => alert("Report generated!")}
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
      modalTitle={formMode === "add" ? "Add Quotation" : formMode === "edit" ? "Edit Quotation" : "View Quotation"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}
