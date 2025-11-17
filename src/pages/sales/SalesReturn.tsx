/* -------------------------------------------------
   SalesReturn – fully working edit modal, string IDs
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
import { PAYMENT_STATUSES, SORT_OPTIONS } from "@/constants/constants";

/* ---------- Types ---------- */

type ProductOption = {
  id: string;
  display: string;
  extra: { SKU: string; Price: string };
};

type CustomerOption = {
  id: string;
  display: string;
};


const CustomerAutoComplete = AutoCompleteTextBox<CustomerOption>;
const ProductAutoComplete = AutoCompleteTextBox<ProductOption>;

type Customer = { id: string; name: string };

type Product = {
  id: string;
  sku: string;
  productName: string;
  price: number;
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
  discount: number;
  taxPercent: number;
  subtotal: number;
};

type Return = {
  purchaseId?: string;
  reference: string;
  date: string;
  customerId: string;
  customerName: string;
  customerImage?: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  status: string;
  paymentStatus: string;
  total: number;
  paid: number;
  due: number;
  items: ReturnItem[];
  summary: {
    orderTax: number;
    discount: number;
    shipping: number;
    grandTotal: number;
  };
  notes?: string;
};

/* ---------- Component ---------- */
export default function SalesReturn() {
  const [returns, setReturns] = useState<Return[]>([]);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<string | "All">("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string | "All">("All");
  const [selectedSort, setSelectedSort] = useState<(typeof SORT_OPTIONS)[number]>("Recently Added");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<{
    customerId: string;
    customerName: string;
    date: string;
    reference: string;
    orderTax: string;
    discount: string;
    shipping: string;
    status: string;
    paymentStatus: string;
    items: ReturnItem[];
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
    items: [],
    notes: "",
  });

  /* ---------- Load Master Data ---------- */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [custRes, prodRes, retRes] = await Promise.all([
          apiService.get<Customer[]>("Customers"),
          apiService.get<Product[]>("Products"),
          apiService.get<Return[]>("SalesReturn"),
        ]);
        if (custRes.status.code === "S") setAllCustomers(custRes.result);
        if (prodRes.status.code === "S") setAllProducts(prodRes.result);
        if (retRes.status.code === "S") setReturns(retRes.result);
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
    if (selectedCustomer !== "All")
      list = list.filter((r) => r.customerName === selectedCustomer);
    if (selectedStatus !== "All")
      list = list.filter((r) => r.status === selectedStatus);
    if (selectedPaymentStatus !== "All")
      list = list.filter((r) => r.paymentStatus === selectedPaymentStatus);

    // sorting
    if (selectedSort === "Recently Added")
      list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    else if (selectedSort === "Ascending")
      list.sort((a, b) => a.total - b.total);
    else if (selectedSort === "Descending")
      list.sort((a, b) => b.total - a.total);
    else if (selectedSort === "Last 7 Days") {
      const cut = new Date();
      cut.setDate(cut.getDate() - 7);
      list = list.filter((r) => new Date(r.date) >= cut);
    }
    // … other sort cases (omitted for brevity – keep yours)

    return list;
  }, [
    returns,
    search,
    selectedCustomer,
    selectedStatus,
    selectedPaymentStatus,
    selectedSort,
  ]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const customerOptions = useMemo(
    () => ["All", ...Array.from(new Set(returns.map((r) => r.customerName)))],
    [returns]
  );

  /* ---------- Handlers ---------- */
  const handleAddClick = () => {
    setFilteredCustomers([]);
    setFilteredProducts([]);
    setFormMode("add");
    setForm({
      customerId: "",
      customerName: "",
      date: new Date().toISOString().split("T")[0],
      reference: `SR-${Date.now()}`,
      orderTax: "0",
      discount: "0",
      shipping: "0",
      status: "Pending",
      paymentStatus: "UnPaid",
      items: [
        {
          productId: "",
          productName: "",
          sku: "",
          stock: 0,
          quantity: 1,
          netUnitPrice: 0,
          discount: 0,
          taxPercent: 0,
          subtotal: 0,
        },
      ],
      notes: "",
    });
  };

  const handleEdit = (ret: Return) => {
    setFilteredCustomers([]);
    setFilteredProducts([]);
    setFormMode("edit");
    setForm({
      customerId: ret.customerId,
      customerName: ret.customerName,
      date: ret.date,
      reference: ret.reference,
      orderTax: ret.summary.orderTax.toString(),
      discount: ret.summary.discount.toString(),
      shipping: ret.summary.shipping.toString(),
      status: ret.status,
      paymentStatus: ret.paymentStatus,
      items: ret.items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        sku: i.sku,
        productImage: i.productImage,
        stock: i.stock,
        quantity: i.quantity,
        netUnitPrice: i.netUnitPrice,
        discount: i.discount,
        taxPercent: i.taxPercent,
        subtotal: i.subtotal,
      })),
      notes: ret.notes || "",
    });
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

  /* ---------- Customer Search ---------- */
  const handleCustomerSearch = (query: string) => {
    setForm((p) => ({ ...p, customerName: query, customerId: "" }));
    if (!query.trim()) {
      setFilteredCustomers([]);
      return;
    }
    const filtered = allCustomers.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleCustomerSelect = (item: CustomerOption) => {
    setForm((p) => ({
      ...p,
      customerId: item.id,
      customerName: item.display,
    }));
    setFilteredCustomers([]);
  };

  /* ---------- Product Search ---------- */
  const handleProductSearch = (query: string, idx: number) => {
    const items = [...form.items];
    items[idx].productName = query;
    items[idx].productId = "";
    setForm((p) => ({ ...p, items }));

    if (!query.trim()) {
      setFilteredProducts([]);
      return;
    }
    const filtered = allProducts.filter(
      (p) =>
        p.productName.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleProductSelect = (idx: number, item: ProductOption) => {
    const prod = allProducts.find((p) => p.id === item.id);
    if (!prod) return;

    const items = [...form.items];
    const price = Number(prod.price ?? 0);
    const qty = items[idx].quantity || 1;
    const subtotal = price * qty;
    const discountAmt = items[idx].discount || 0;
    const taxable = subtotal - discountAmt;
    const taxAmt = (taxable * (items[idx].taxPercent || 0)) / 100;

    items[idx] = {
      productId: prod.id,
      productName: prod.productName,
      sku: prod.sku,
      productImage: prod.productImage,
      stock: prod.stock ?? 0,
      quantity: qty,
      netUnitPrice: price,
      discount: discountAmt,
      taxPercent: items[idx].taxPercent || 0,
      subtotal: parseFloat((taxable + taxAmt).toFixed(2)),
    };
    setForm((p) => ({ ...p, items }));
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
          stock: 0,
          quantity: 1,
          netUnitPrice: 0,
          discount: 0,
          taxPercent: 0,
          subtotal: 0,
        },
      ],
    }));
  };

  const removeItem = (idx: number) => {
    setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
  };

  const handleItemChange = (
    idx: number,
    field: keyof ReturnItem,
    value: string
  ) => {
    const items = [...form.items];
    const num = Number(value) || 0;
    (items[idx] as any)[field] = num;

    const p = items[idx];
    const subtotal = p.netUnitPrice * p.quantity;
    const taxable = subtotal - p.discount;
    const taxAmt = (taxable * p.taxPercent) / 100;
    items[idx].subtotal = parseFloat((taxable + taxAmt).toFixed(2));

    setForm((prev) => ({ ...prev, items }));
  };

  /* ---------- Totals ---------- */
  const totals = useMemo(() => {
    // Item subtotal already includes per-item tax & item discount
    const subTotal = form.items.reduce((sum, i) => sum + i.subtotal, 0);

    // Global discount only
    const globalDiscount = Number(form.discount) || 0;

    // Global order tax only (do not add per-item tax here)
    const globalOrderTax = Number(form.orderTax) || 0;

    const shipping = Number(form.shipping) || 0;

    const grand = subTotal - globalDiscount + globalOrderTax + shipping;

    return {
      subTotal,
      discountTotal: globalDiscount,
      taxTotal: globalOrderTax,
      grand: parseFloat(grand.toFixed(2)),
    };
  }, [form.items, form.orderTax, form.discount, form.shipping]);

  /* ---------- Submit ---------- */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.customerId ||
      !form.reference.trim() ||
      form.items.some((i) => !i.productId)
    ) {
      alert("Please fill all required fields.");
      return;
    }

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
      items: form.items,
      summary: {
        orderTax: Number(form.orderTax),
        discount: Number(form.discount),
        shipping: Number(form.shipping),
        grandTotal: totals.grand,
      },
      notes: form.notes,
    };

    if (formMode === "add") {
      setReturns((prev) => [newReturn, ...prev]);
    } else {
      setReturns((prev) =>
        prev.map((r) => (r.reference === form.reference ? { ...r, ...newReturn } : r))
      );
    }
    setFormMode(null);
  };

  /* ---------- Table Columns ---------- */
  const columns: Column[] = [
    {
      key: "index",
      label: "#",
      render: (_, __, idx) =>
        (currentPage - 1) * itemsPerPage + (idx ?? 0) + 1,
      align: "center",
      className: "w-12",
    },
    { key: "reference", label: "Reference" },
    {
      key: "date",
      label: "Date",
      render: (v) => <>{formatDate(v, "DD MMM YYYY")}</>,
    },
    { key: "customerName", label: "Customer" },
    {
      key: "status",
      label: "Status",
      render: renderStatusBadge,
      align: "center",
    },
    {
      key: "total",
      label: "Total",
      render: (v) => `₹${Number(v).toFixed(2)}`,
      align: "right",
    },
    {
      key: "paid",
      label: "Paid",
      render: (v) => `₹${Number(v).toFixed(2)}`,
      align: "right",
    },
    {
      key: "due",
      label: "Due",
      render: (v) => `₹${Number(v).toFixed(2)}`,
      align: "right",
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      render: renderStatusBadge,
      align: "center",
    },
  ];

  const rowActions = (row: Return) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.reference}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 me-1"
      >
        <i className="fa fa-edit"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.reference)}
        aria-label={`Delete ${row.reference}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 me-1"
      >
        <i className="fa fa-trash-can"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  /* ---------- Filters ---------- */
  const customFilters = () => (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-3 w-full">
      <div className="w-full md:w-auto md:max-w-md">
        <SearchInput
          value={search}
          placeholder="Search by Reference or Customer..."
          onSearch={handleSearchChange}
          className="w-full"
        />
      </div>
      <div className="flex gap-2 flex-wrap justify-end w-full md:w-auto">
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[100px]"
        >
          {customerOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[100px]"
        >
          <option>All</option>
          {["Pending", "Approved", "Rejected", "Completed"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={selectedPaymentStatus}
          onChange={(e) => setSelectedPaymentStatus(e.target.value as any)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[100px]"
        >
          <option>All</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value as any)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[140px]"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  /* ---------- Modal Form ---------- */
  const modalForm = () => (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium mb-1">
            Customer Name *
          </label>
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
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Date *
          </label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div>
          <label htmlFor="reference" className="block text-sm font-medium mb-1">
            Reference *
          </label>
          <input
            id="reference"
            type="text"
            value={form.reference}
            onChange={(e) => setForm((p) => ({ ...p, reference: e.target.value }))}
            className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
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
              <th className="px-3 py-2 text-center">Stock</th>
              <th className="px-3 py-2 text-center">QTY</th>
              <th className="px-3 py-2 text-right">Net Unit Price(₹)</th>
              <th className="px-3 py-2 text-right">Discount(₹)</th>
              <th className="px-3 py-2 text-right">Tax %</th>
              <th className="px-3 py-2 text-right">Subtotal(₹)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2">
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
                              Price: `₹${Number(p.price).toFixed(2)}`
                            }
                          })),
                          ...allProducts
                            .filter((p) => p.id === item.productId)
                            .map((p) => ({
                              id: p.id,
                              display: p.productName,
                              extra: {
                                SKU: p.sku,
                                Price: `₹${Number(p.price).toFixed(2)}`
                              }
                            })),
                        ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
                        : filteredProducts.map((p) => ({
                          id: p.id,
                          display: p.productName,
                          extra: {
                            SKU: p.sku,
                            Price: `₹${Number(p.price).toFixed(2)}`
                          }
                        }))
                    }
                    placeholder="Search product..."
                    renderItem={(it, highlighted) => (
                      <div className={`px-3 py-2 cursor-pointer ${highlighted ? "bg-blue-100" : "hover:bg-gray-100"}`}>
                        <div className="text-sm truncate font-bold" title={it.display}>{it.display}</div>
                        <div className="text-xs text-gray-500 flex justify-between mt-1">
                          <span>{it.extra?.SKU ?? ""}</span>
                          <span>{it.extra?.Price ?? ""}</span>
                        </div>
                      </div>
                    )}
                  />
                </td>
                <td className="text-center">{item.stock}</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(idx, "quantity", e.target.value)
                    }
                    min="1"
                    className="border rounded px-2 py-1 w-16 text-right"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.netUnitPrice}
                    onChange={(e) =>
                      handleItemChange(idx, "netUnitPrice", e.target.value)
                    }
                    step="0.01"
                    className="border rounded px-2 py-1 w-20 text-right"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) =>
                      handleItemChange(idx, "discount", e.target.value)
                    }
                    step="0.01"
                    className="border rounded px-2 py-1 w-20 text-right"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.taxPercent}
                    onChange={(e) =>
                      handleItemChange(idx, "taxPercent", e.target.value)
                    }
                    step="0.01"
                    className="border rounded px-2 py-1 w-20 text-right"
                  />
                </td>
                <td className="text-right pr-3">{item.subtotal.toFixed(2)}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="fa fa-trash"></i>
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
          <i className="fa fa-plus-circle mr-1"></i> Add Product
        </button>
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-80 bg-gray-50 p-4 rounded space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Order Tax:</span>
            <span>₹{Number(form.orderTax).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>₹{Number(form.discount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>₹{Number(form.shipping).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Grand Total:</span>
            <span>₹{totals.grand.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="orderTax" className="block text-sm font-medium mb-1">
            Order Tax *
          </label>
          <input
            id="orderTax"
            type="number"
            value={form.orderTax}
            onChange={(e) =>
              setForm((p) => ({ ...p, orderTax: e.target.value }))
            }
            step="0.01"
            className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="discount" className="block text-sm font-medium mb-1">
            Discount *
          </label>
          <input
            id="discount"
            type="number"
            value={form.discount}
            onChange={(e) =>
              setForm((p) => ({ ...p, discount: e.target.value }))
            }
            step="0.01"
            className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="shipping" className="block text-sm font-medium mb-1">
            Shipping *
          </label>
          <input
            id="shipping"
            type="number"
            value={form.shipping}
            onChange={(e) =>
              setForm((p) => ({ ...p, shipping: e.target.value }))
            }
            step="0.01"
            className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status *
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
            className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {["Pending", "Approved", "Rejected", "Completed"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          rows={3}
          maxLength={360}
          className="w-full border border-input rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Maximum 60 words"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {form.notes.split(" ").filter(Boolean).length}/60 words
        </p>
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