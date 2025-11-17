/* -------------------------------------------------
   Quotation – Final Production Version (₹ India Ready)
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge, formatDate } from "@/utils/tableUtils";
import {
  AutoCompleteTextBox,
  AutoCompleteItem,
} from "@/components/Search/AutoCompleteTextBox";
import { SearchInput } from "@/components/Search/SearchInput";
import { QUOTATION_STATUSES } from "@/constants/constants";

/* ---------- Type-Safe AutoComplete ---------- */
type CustomerOption = AutoCompleteItem<string>;
type ProductOption = AutoCompleteItem<string> & {
  extra: { SKU: string; purchasePrice: string; ProductImage?: string };
};

const CustomerAutoComplete = AutoCompleteTextBox<CustomerOption>;
const ProductAutoComplete = AutoCompleteTextBox<ProductOption>;

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
  discount: number;
  taxPercent: number;
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

/* ---------- Main Component ---------- */
export default function Quotation() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<string | "All">("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<{
    reference: string;
    date: string;
    customerId: string;
    customerName: string;
    items: QuotationItem[];
    orderTax: string;
    discount: string;
    shipping: string;
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

  /* Load Data */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [custRes, prodRes, quotRes] = await Promise.all([
          apiService.get<Customer[]>("Customers"),
          apiService.get<Product[]>("Products"),
          apiService.get<Quotation[]>("Quotation"),
        ]);
        if (custRes.status.code === "S") setAllCustomers(custRes.result);
        if (prodRes.status.code === "S") setAllProducts(prodRes.result);
        if (quotRes.status.code === "S") setQuotations(quotRes.result);
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

  /* Handlers */
  const generateRef = () => `QTN-${Date.now().toString().slice(-6)}`;

  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      reference: generateRef(),
      date: new Date().toISOString().split("T")[0],
      customerId: "",
      customerName: "",
      items: [
        {
          productId: "",
          productName: "",
          sku: "",
          quantity: 1,
          purchasePrice: 0,
          discount: 0,
          taxPercent: 0,
          totalCost: 0,
        },
      ],
      orderTax: "0",
      discount: "0",
      shipping: "0",
      status: "Pending",
      description: "",
    });
  };

  const recalculateItem = (item: QuotationItem): QuotationItem => {
    const price = Number(item.purchasePrice) || 0;
    const qty = Number(item.quantity) || 0;
    const discountPercent = Number(item.discount) || 0;
    const taxPercent = Number(item.taxPercent) || 0;

    // 1. Discount amount (percentage)
    const discountAmount = price * (discountPercent / 100);

    // 2. Price after discount per unit
    const priceAfterDiscount = price - discountAmount;

    // 3. Taxable amount
    const taxable = priceAfterDiscount * qty;

    // 4. Tax amount
    const tax = taxable * (taxPercent / 100);

    // 5. Final total
    const totalCost = taxable + tax;

    return {
      ...item,
      totalCost: Number(totalCost.toFixed(2)),
    };
  }

  const handleEdit = (q: Quotation) => {
    setFormMode("edit");
    setForm({
      reference: q.reference,
      date: q.date,
      customerId: q.customerId,
      customerName: q.customerName,
      items: q.items.map(recalculateItem),
      orderTax: q.summary.orderTax.toString(),
      discount: q.summary.discount.toString(),
      shipping: q.summary.shipping.toString(),
      status: q.status,
      description: q.description || "",
    });
  };

  const handleDelete = (ref: string) => {
    if (confirm("Delete quotation?")) {
      setQuotations((prev) => prev.filter((q) => q.reference !== ref));
    }
  };

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

  const handleProductSearch = (query: string, idx: number) => {
    const items = [...form.items];
    items[idx].productName = query;
    items[idx].productId = "";
    setForm((p) => ({ ...p, items }));
    if (!query.trim()) return setFilteredProducts([]);
    setFilteredProducts(
      allProducts.filter(
        (p) =>
          p.productName.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleProductSelect = (idx: number, item: ProductOption) => {
    const prod = allProducts.find((p) => p.id === item.id);
    if (!prod) return;

    const quantity = form.items[idx]?.quantity || 1;
    setForm((prev) => {
      const items = [...prev.items];
      items[idx] = {
        productId: prod.id,
        productName: prod.productName,
        sku: prod.sku,
        productImage: prod.productImage,
        quantity,
        purchasePrice: prod.price,
        discount: 0,
        taxPercent: 0,
        totalCost: prod.price * quantity,
      };
      return { ...prev, items };
    });
    setFilteredProducts([]);
  };

  const addItem = () => {
    setForm((p) => ({
      ...p,
      items: [
        ...p.items,
        {
          productId: "",
          productName: "",
          sku: "",
          quantity: 1,
          purchasePrice: 0,
          discount: 0,
          taxPercent: 0,
          totalCost: 0,
        },
      ],
    }));
  };

  const removeItem = (idx: number) => {
    setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
  };

  const updateItem = (
    idx: number,
    field: "quantity" | "purchasePrice" | "discount" | "taxPercent",
    value: number
  ) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[idx] = { ...items[idx], [field]: value };
      items[idx] = recalculateItem(items[idx]);
      return { ...prev, items };
    });
  };

  const totals = useMemo(() => {
    // Sum latest item totals (already discount- and tax-adjusted)
    const subTotal = form.items.reduce((sum, item) => {
      const recalculated = recalculateItem(item);
      return sum + recalculated.totalCost;
    }, 0);

    // Discount is percentage (%)
    const discountPercent = Number(form.discount) || 0;
    const discountAmount = subTotal * (discountPercent / 100);

    // Order tax is percentage (%)
    const taxPercent = Number(form.orderTax) || 0;
    const taxAmount = subTotal * (taxPercent / 100);

    const shipping = Number(form.shipping) || 0;

    const grand = subTotal - discountAmount + taxAmount + shipping;

    return {
      subTotal: Number(subTotal.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      shipping,
      grand: Number(grand.toFixed(2)),
    };
  }, [form.items, form.orderTax, form.discount, form.shipping]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerId || form.items.some((i) => !i.productId)) {
      alert("Please fill all required fields.");
      return;
    }

    const newQuotation: Quotation = {
      reference: form.reference,
      date: form.date,
      customerId: form.customerId,
      customerName: form.customerName,
      status: form.status,
      total: totals.grand,
      items: form.items,
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
      setQuotations((p) =>
        p.map((q) => (q.reference === form.reference ? newQuotation : q))
      );
    }
    setFormMode(null);
  };

  /* Table Columns */
  const columns: Column[] = [
    { key: "index", label: "#", render: (_, __, i) => (currentPage - 1) * itemsPerPage + (i ?? 0) + 1, align: "center" },
    { key: "reference", label: "Reference" },
    { key: "date", label: "Date", render: (v) => formatDate(v, "DD MMM YYYY") },
    { key: "customerName", label: "Customer" },
    { key: "status", label: "Status", render: renderStatusBadge, align: "center" },
    { key: "total", label: "Total", render: (v) => `₹${Number(v).toFixed(2)}`, align: "right" },
  ];

  const rowActions = (row: Quotation) => (
    <>
      <button type="button" onClick={() => handleEdit(row)} className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white rounded-lg text-xs p-2 me-1 transition-all">
        <i className="fa fa-edit"></i>
      </button>
      <button type="button" onClick={() => handleDelete(row.reference)} className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white rounded-lg text-xs p-2 transition-all">
        <i className="fa fa-trash-can"></i>
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

  const modalForm = () => (
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
              formMode === "edit" && form.customerId
                ? [
                  ...filteredCustomers.map((c) => ({
                    id: c.id,
                    display: c.name,
                  })),
                  ...allCustomers
                    .filter((c) => c.id === form.customerId)
                    .map((c) => ({
                      id: c.id,
                      display: c.name,
                    })),
                ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
                : filteredCustomers.map((c) => ({
                  id: c.id,
                  display: c.name,
                }))
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

      {/* Products Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left w-80">Product</th>
              <th className="px-3 py-2 text-center w-16">Qty</th>
              <th className="px-3 py-2 text-right w-24">Price(₹)</th>
              <th className="px-3 py-2 text-right w-24">Discount(%)</th>
              <th className="px-3 py-2 text-right w-20">Tax(%)</th>
              <th className="px-3 py-2 text-right w-24">Tax Amt(₹)</th>
              <th className="px-3 py-2 text-right w-28">Total(₹)</th>
              <th className="w-10"></th>
            </tr>
          </thead>

          <tbody>
            {form.items.map((item, idx) => {
              const qty = item.quantity || 0;
              const price = item.purchasePrice || 0;
              const discount = item.discount || 0;
              const taxPercent = item.taxPercent || 0;

              const discountAmount = price * (discount / 100);
              const priceAfterDiscount = price - discountAmount;

              const taxableAmount = priceAfterDiscount * qty;
              const taxAmount = taxableAmount * (taxPercent / 100);

              const totalCost = taxableAmount + taxAmount;
              const unitCost = priceAfterDiscount + (taxAmount / (qty || 1));

              return (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-2 py-1">
                    <ProductAutoComplete
                      value={item.productName}
                      onSearch={(q) => handleProductSearch(q, idx)}
                      onSelect={(sel) => handleProductSelect(idx, sel)}
                      items={
                        formMode === "edit" && item.productId
                          ? [
                            ...filteredProducts.map((p) => ({
                              id: p.id,
                              display: p.productName,
                              extra: {
                                SKU: p.sku,
                                purchasePrice: `₹${Number(p.price).toFixed(2)}`
                              }
                            })),
                            ...allProducts
                              .filter((p) => p.id === item.productId)
                              .map((p) => ({
                                id: p.id,
                                display: p.productName,
                                extra: {
                                  SKU: p.sku,
                                  purchasePrice: `₹${Number(p.price).toFixed(2)}`
                                }
                              })),
                          ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
                          : filteredProducts.map((p) => ({
                            id: p.id,
                            display: p.productName,
                            extra: {
                              SKU: p.sku,
                              purchasePrice: `₹${Number(p.price).toFixed(2)}`
                            }
                          }))
                      }
                      placeholder="Search product..."
                      className="w-60"
                    />
                  </td>

                  <td className="text-center px-2 py-1">
                    <input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => updateItem(idx, "quantity", Number(e.target.value) || 1)}
                      className="border rounded px-1.5 py-1 w-14 text-center"
                    />
                  </td>

                  <td className="text-center px-2 py-1">
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => updateItem(idx, "purchasePrice", Number(e.target.value))}
                      className="border rounded px-1.5 py-1 w-16 text-right"
                    />
                  </td>

                  <td className="text-center px-2 py-1">
                    <input
                      type="number"
                      step="0.01"
                      value={discount}
                      onChange={(e) => updateItem(idx, "discount", Number(e.target.value))}
                      className="border rounded px-1.5 py-1 w-16 text-right text-red-600"
                    />
                  </td>

                  <td className="text-right px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={taxPercent}
                      onChange={(e) =>
                        updateItem(idx, "taxPercent", Number(e.target.value))
                      }
                      className="border rounded px-2 py-1 w-16 text-right"
                    />
                  </td>

                  <td className="text-right px-3 py-2 text-gray-700">
                    ₹{taxAmount.toFixed(2)}
                  </td>

                  <td className="text-right px-3 py-2 font-semibold text-blue-600">
                    ₹{totalCost.toFixed(2)}
                  </td>

                  <td className="text-center px-3 py-2">
                    {form.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="text-gray-700 hover:text-red-600"
                      >
                        <i className="fa fa-trash-can text-sm"></i>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button type="button" onClick={addItem} className="mt-4 text-blue-600 font-medium flex items-center gap-2">
          <i className="fa fa-plus-circle"></i> Add Another Product
        </button>
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
        <div><label>Order Tax</label><input type="number" value={form.orderTax} onChange={(e) => setForm((p) => ({ ...p, orderTax: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
        <div><label>Discount</label><input type="number" value={form.discount} onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
        <div><label>Shipping</label><input type="number" value={form.shipping} onChange={(e) => setForm((p) => ({ ...p, shipping: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
        <div>
          <label>Status</label>
          <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))} className="w-full border rounded px-3 py-2">
            {QUOTATION_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={4}
          className="w-full border rounded px-3 py-2"
          placeholder="Enter description..."
        />
      </div>
    </form>
  );

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
      modalTitle={formMode === "add" ? "Add Quotation" : "Edit Quotation"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
      loading={loading}
    />
  );
}