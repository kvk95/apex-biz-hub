/* -------------------------------------------------
   Sales Returns – matches Invoices/Billers exactly
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { AutoCompleteTextBox, AutoCompleteItem } from "@/components/Search/AutoCompleteTextBox";
import { SearchInput } from "@/components/Search/SearchInput";
import {
  RETURN_STATUSES,
  SORT_OPTIONS,
  PAYMENT_STATUSES,
} from "@/constants/constants";

type Product = {
  productId: number;
  productName: string;
  sku: string;
  price: number;
};

type Customer = {
  id: number;
  name: string;
};

type OrderItem = {
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
};

type Totals = {
  subTotal: number;
  tax: number;
  discount: number;
  shipping: number;
  grandTotal: number;
  paid?: number;
  due?: number;
};

type Order = {
  id: number;
  orderId: string;
  date: string;
  customerId: number;
  customerName: string;
  paymentStatus: (typeof PAYMENT_STATUSES)[number];
  items: OrderItem[];
  totals: Totals;
};

type SalesReturn = {
  id: number;
  productName: string;
  productId: number;
  sku: string;
  invoiceNo: string;
  date: string;
  customer: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: (typeof RETURN_STATUSES)[number];
};

export default function SalesReturn() {
  /* ---------- state ---------- */
  const [salesReturns, setSalesReturns] = useState<SalesReturn[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<(typeof RETURN_STATUSES)[number] | "All">("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<(typeof PAYMENT_STATUSES)[number] | "All">("All");
  const [selectedSort, setSelectedSort] = useState<(typeof SORT_OPTIONS)[number]>("Recently Added");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    id: null as number | null,
    productId: 0,
    productName: "",
    sku: "",
    price: 0,
    invoiceNo: "",
    date: "",
    customer: "",
    totalAmount: "",
    paidAmount: "",
    dueAmount: "",
    status: "Pending" as (typeof RETURN_STATUSES)[number],
  });

  /* ---------- load data ---------- */
  useEffect(() => {
    console.log("[SalesReturn] Initial loadData triggered");
    loadData();
  }, []);

  const loadData = async () => {
    console.log("[SalesReturn] loadData started");
    setLoading(true);
    try {
      const [returnRes, posRes] = await Promise.all([
        apiService.get<SalesReturn[]>("SalesReturn"),
        apiService.get<Order[]>("OnlineOrders"),
      ]);

      if (returnRes.status.code === "S") {
        setSalesReturns(returnRes.result);
        console.log("[SalesReturn] Loaded returns:", returnRes.result.length);
      }

      if (posRes.status.code === "S") {
        const loadedOrders: Order[] = posRes.result;
        setOrders(loadedOrders);

        const allItems: Product[] = loadedOrders.flatMap((order) =>
          order.items.map((item): Product => ({
            productId: item.productId,
            productName: item.productName,
            sku: item.sku,
            price: item.price,
          }))
        );

        const uniqueProducts: Product[] = Array.from(
          new Map(allItems.map((item) => [item.productId, item])).values()
        );

        setProducts(uniqueProducts);
        setFilteredProducts(uniqueProducts);
        console.log("[SalesReturn] Loaded products:", uniqueProducts.length);

        const uniqueCustomers: Customer[] = Array.from(
          new Map(loadedOrders.map((o) => [o.customerId, { id: o.customerId, name: o.customerName }])).values()
        );
        setFilteredCustomers(uniqueCustomers);
        console.log("[SalesReturn] Loaded customers:", uniqueCustomers.length);
      }

      setError(null);
      console.log("[SalesReturn] loadData completed");
    } catch (err) {
      setError("Failed to load data.");
      console.error("[SalesReturn] loadData error:", err);
    } finally {
      setLoading(false);
      console.log("[SalesReturn] loadData finished");
    }
  };

  /* ---------- customers for selected product ---------- */
  const customersForSelectedProduct = useMemo((): Customer[] => {
    if (!form.productId || orders.length === 0) return [];
    const matching = orders.filter((o) => o.items.some((i) => i.productId === form.productId));
    const customers = Array.from(new Map(matching.map((o) => [o.customerId, { id: o.customerId, name: o.customerName }])).values());
    console.log("[SalesReturn] customersForSelectedProduct:", { productId: form.productId, count: customers.length });
    return customers;
  }, [form.productId, orders]);

  useEffect(() => {
    if (!form.productId) {
      setForm((prev) => ({ ...prev, customer: "" }));
      setFilteredCustomers([]);
    } else {
      setFilteredCustomers(customersForSelectedProduct);
    }
  }, [form.productId, customersForSelectedProduct]);

  /* ---------- filtering ---------- */
  const filteredData = useMemo(() => {
    console.log("[SalesReturn] filteredData recompute", { search, selectedCustomer, selectedStatus, selectedPaymentStatus, selectedSort });

    let result = [...salesReturns];

    if (search.trim()) {
      result = result.filter(
        (r) =>
          r.productName.toLowerCase().includes(search.toLowerCase()) ||
          r.sku.toLowerCase().includes(search.toLowerCase()) ||
          r.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
          r.customer.toLowerCase().includes(search.toLowerCase())
      );
      console.log("[SalesReturn] After search:", result.length);
    }

    if (selectedCustomer !== "All") {
      result = result.filter((r) => r.customer === selectedCustomer);
      console.log("[SalesReturn] After customer filter:", result.length);
    }

    if (selectedStatus !== "All") {
      result = result.filter((r) => r.status === selectedStatus);
      console.log("[SalesReturn] After status filter:", result.length);
    }

    if (selectedPaymentStatus !== "All") {
      result = result.filter((r) => {
        if (selectedPaymentStatus === "Paid") return r.paidAmount === r.totalAmount;
        if (selectedPaymentStatus === "Partial") return r.paidAmount > 0 && r.paidAmount < r.totalAmount;
        if (selectedPaymentStatus === "UnPaid") return r.paidAmount === 0;
        return true;
      });
      console.log("[SalesReturn] After payment filter:", result.length);
    }

    if (selectedSort === "Recently Added") {
      result.sort((a, b) => b.id - a.id);
    } else if (selectedSort === "Ascending") {
      result.sort((a, b) => a.totalAmount - b.totalAmount);
    } else if (selectedSort === "Descending") {
      result.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (selectedSort === "Last 7 Days") {
      const last7 = new Date();
      last7.setDate(last7.getDate() - 7);
      result = result.filter((r) => new Date(r.date) >= last7);
    } else if (selectedSort === "Last Month") {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      result = result.filter((r) => {
        const d = new Date(r.date);
        return d >= start && d <= end;
      });
    }

    console.log("[SalesReturn] Final filtered data:", result.length);
    return result;
  }, [salesReturns, search, selectedCustomer, selectedStatus, selectedPaymentStatus, selectedSort]);

  /* ---------- pagination ---------- */
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("[SalesReturn] paginatedData:", { currentPage, start, end, total: filteredData.length, result: result.length });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  const customerOptions = useMemo(() => {
    const opts = ["All", ...Array.from(new Set(salesReturns.map((r) => r.customer)))];
    console.log("[SalesReturn] customerOptions:", opts);
    return opts;
  }, [salesReturns]);

  /* ---------- handlers ---------- */
  const handleAddClick = () => {
    console.log("[SalesReturn] handleAddClick");
    setFormMode("add");
    setForm({
      id: null,
      productId: 0,
      productName: "",
      sku: "",
      price: 0,
      invoiceNo: `RET-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      customer: "",
      totalAmount: "",
      paidAmount: "",
      dueAmount: "",
      status: "Pending",
    });
  };

  const handleEdit = (ret: SalesReturn) => {
    console.log("[SalesReturn] handleEdit:", ret);
    setFormMode("edit");
    setForm({
      id: ret.id,
      productId: ret.productId,
      productName: ret.productName,
      sku: ret.sku,
      price: ret.totalAmount,
      invoiceNo: ret.invoiceNo,
      date: ret.date,
      customer: ret.customer,
      totalAmount: ret.totalAmount.toString(),
      paidAmount: ret.paidAmount.toString(),
      dueAmount: ret.dueAmount.toString(),
      status: ret.status,
    });
  };

  const handleProductSearch = (query: string) => {
    const filtered = products.filter(
      (p) =>
        p.productName.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
    setForm((prev) => ({ ...prev, productName: query }));
    console.log("[SalesReturn] Product search:", { query, results: filtered.length });
  };

  const handleProductSelect = (item: AutoCompleteItem & { sku: string; price: number }) => {
    const product = products.find((p) => p.productId === item.id)!;
    setForm((prev) => {
      const total = product.price;
      const paid = parseFloat(prev.paidAmount || "0");
      const due = total - paid;
      return {
        ...prev,
        productId: product.productId,
        productName: product.productName,
        sku: product.sku,
        price: product.price,
        totalAmount: total.toFixed(2),
        dueAmount: due >= 0 ? due.toFixed(2) : "0.00",
        customer: "",
      };
    });
    setFilteredProducts(products);
    console.log("[SalesReturn] Product selected:", product);
  };

  const handleCustomerSearch = (query: string) => {
    const filtered = customersForSelectedProduct.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setForm((prev) => ({ ...prev, customer: query }));
    console.log("[SalesReturn] Customer search:", { query, results: filtered.length });
  };

  const handleCustomerSelect = (item: AutoCompleteItem) => {
    setForm((prev) => ({ ...prev, customer: item.display }));
    setFilteredCustomers(customersForSelectedProduct);
    console.log("[SalesReturn] Customer selected:", item);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "totalAmount" || name === "paidAmount") {
        const total = parseFloat(updated.totalAmount) || 0;
        const paid = parseFloat(updated.paidAmount) || 0;
        updated.dueAmount = (total - paid).toFixed(2);
      }
      return updated;
    });
    console.log("[SalesReturn] Form change:", { name, value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[SalesReturn] handleFormSubmit", { formMode, form });

    if (
      !form.productName ||
      !form.invoiceNo.trim() ||
      !form.customer.trim() ||
      !form.date ||
      !form.totalAmount ||
      parseFloat(form.totalAmount) <= 0
    ) {
      alert("Please fill all required fields with valid values.");
      console.warn("[SalesReturn] Validation failed");
      return;
    }

    const total = parseFloat(form.totalAmount);
    const paid = parseFloat(form.paidAmount || "0");
    const due = total - paid;

    const newReturn: SalesReturn = {
      id: formMode === "add"
        ? (salesReturns.length ? Math.max(...salesReturns.map((r) => r.id)) + 1 : 1)
        : form.id!,
      productId: form.productId,
      productName: form.productName.trim(),
      sku: form.sku,
      invoiceNo: form.invoiceNo.trim(),
      date: form.date,
      customer: form.customer.trim(),
      totalAmount: total,
      paidAmount: paid >= 0 ? paid : 0,
      dueAmount: due >= 0 ? due : 0,
      status: form.status,
    };

    if (formMode === "add") {
      setSalesReturns((prev) => [newReturn, ...prev]);
      const totalPages = Math.ceil((filteredData.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
      console.log("[SalesReturn] Added return:", newReturn);
    } else if (formMode === "edit") {
      setSalesReturns((prev) => prev.map((r) => (r.id === newReturn.id ? newReturn : r)));
      console.log("[SalesReturn] Updated return ID:", newReturn.id);
    }

    setFormMode(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this return?")) {
      setSalesReturns((prev) => prev.filter((r) => r.id !== id));
      const totalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
      else if (totalPages === 0) setCurrentPage(1);
      console.log("[SalesReturn] Deleted return ID:", id);
    }
  };

  const handleClear = () => {
    console.log("[SalesReturn] handleClear - resetting");
    loadData();
    setSearch("");
    setSelectedCustomer("All");
    setSelectedStatus("All");
    setSelectedPaymentStatus("All");
    setSelectedSort("Recently Added");
    setCurrentPage(1);
  };

  const handleReport = () => {
    console.log("[SalesReturn] handleReport");
    alert("Sales Returns Report:\n\n" + JSON.stringify(salesReturns, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("SalesReturn handleSearchChange:", { search: e.target.value });
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("[SalesReturn] Page changed:", { from: currentPage, to: page });
    }
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
    { key: "productName", label: "Product" },
    { key: "sku", label: "SKU" },
    { key: "invoiceNo", label: "Invoice No" },
    { key: "date", label: "Date" },
    { key: "customer", label: "Customer" },
    {
      key: "status",
      label: "Status",
      render: renderStatusBadge,
      align: "center",
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (value) => `$${Number(value).toFixed(2)}`,
      align: "right",
    },
    {
      key: "paidAmount",
      label: "Paid",
      render: (value) => `$${Number(value).toFixed(2)}`,
      align: "right",
    },
    {
      key: "dueAmount",
      label: "Due",
      render: (value) => `$${Number(value).toFixed(2)}`,
      align: "right",
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (_, row) =>
        row.paidAmount === row.totalAmount
          ? "Paid"
          : row.paidAmount > 0
            ? "Partial"
            : "Unpaid",
      align: "center",
    },
  ];

  /* ---------- row actions ---------- */
  const rowActions = (row: SalesReturn) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit return ${row.invoiceNo}`}
        className="text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded p-1 transition-colors"
        title="Edit"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit return</span>
      </button>

      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete return ${row.invoiceNo}`}
        className="text-gray-700 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1 transition-colors"
        title="Delete"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete return</span>
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
          placeholder="Search by Product, SKU, Invoice, Customer..."
          onSearch={(query) => {
            setSearch(query);
            setCurrentPage(1);
            console.log("[SalesReturn] Search updated:", query);
          }}
          className="w-full"
        />
      </div>

      {/* Right: Filters */}
      <div className="flex gap-2 flex-wrap justify-end w-full md:w-auto">
        <select
          value={selectedCustomer}
          onChange={(e) => {
            setSelectedCustomer(e.target.value);
            console.log("[SalesReturn] Customer filter:", e.target.value);
          }}
          className="border border-input rounded-md px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[130px]"
        >
          {customerOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value as any);
            console.log("[SalesReturn] Status filter:", e.target.value);
          }}
          className="border border-input rounded-md px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[100px]"
        >
          <option>All</option>
          {RETURN_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={selectedPaymentStatus}
          onChange={(e) => {
            setSelectedPaymentStatus(e.target.value as any);
            console.log("[SalesReturn] Payment filter:", e.target.value);
          }}
          className="border border-input rounded-md px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[100px]"
        >
          <option>All</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={selectedSort}
          onChange={(e) => {
            setSelectedSort(e.target.value as any);
            console.log("[SalesReturn] Sort changed:", e.target.value);
          }}
          className="border border-input rounded-md px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[140px]"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );

  /* ---------- modal form ---------- */
  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-3">
        <label className="block text-sm font-medium mb-1">Product *</label>
        <AutoCompleteTextBox
          value={form.productName}
          onSearch={handleProductSearch}
          onSelect={handleProductSelect}
          items={filteredProducts.map((p) => ({
            id: p.productId,
            display: p.productName,
            sku: p.sku,
            price: p.price,
          }))}
          placeholder="Search product by name or SKU..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Customer *</label>
        <AutoCompleteTextBox
          value={form.customer}
          onSearch={handleCustomerSearch}
          onSelect={handleCustomerSelect}
          items={filteredCustomers.map((c) => ({
            id: c.id,
            display: c.name,
          }))}
          placeholder={form.productId ? "Search customer..." : "Select product first"}
          disabled={!form.productId}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Invoice No *</label>
        <input
          type="text"
          name="invoiceNo"
          value={form.invoiceNo}
          onChange={handleFormChange}
          className="w-full border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date *</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleFormChange}
          className="w-full border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Total Amount *</label>
        <input
          type="number"
          name="totalAmount"
          value={form.totalAmount}
          onChange={handleFormChange}
          min="0"
          step="0.01"
          className="w-full border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Paid Amount</label>
        <input
          type="number"
          name="paidAmount"
          value={form.paidAmount}
          onChange={handleFormChange}
          min="0"
          step="0.01"
          className="w-full border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Due Amount</label>
        <input
          type="text"
          value={form.dueAmount}
          readOnly
          className="w-full border border-input rounded-md px-3 py-2 bg-gray-50 text-gray-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleFormChange}
          className="w-full border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {RETURN_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );

  /* ---------- render ---------- */
  if (loading) {
    console.log("[SalesReturn] Rendering loading");
    return <div className="flex items-center justify-center min-h-screen"><i className="fa fa-spinner fa-spin text-3xl text-primary" /></div>;
  }
  if (error) {
    console.error("[SalesReturn] Rendering error:", error);
    return <div className="flex flex-col items-center justify-center min-h-screen text-red-600"><p>{error}</p><button onClick={loadData} className="mt-4 px-4 py-2 bg-primary text-white rounded">Retry</button></div>;
  }

  return (
    <PageBase1
      title="Sales Returns"
      description="Manage sales returns from POS orders"
      icon="fa-solid fa-arrow-rotate-left"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      onReport={handleReport}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={handlePageChange}
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
    />
  );
}