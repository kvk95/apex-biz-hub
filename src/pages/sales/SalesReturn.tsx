import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";

interface Product {
  productId: number;
  productName: string;
  sku: string;
  price: number;
}

interface SalesReturn {
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
  status: string;
}

export default function SalesReturn() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
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
    status: "Pending",
  });

  const [returns, setReturns] = useState<SalesReturn[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Recently Added");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load Sales Returns + Products from OnlinePosOrders
  useEffect(() => {
    loadSalesReturns();
    loadProductsFromPosOrders();
  }, []);

  const loadSalesReturns = async () => {
    try {
      const response = await apiService.get<SalesReturn[]>("SalesReturn");
      if (response.status.code === "S") {
        setReturns(response.result);
        console.log("SalesReturn loadSalesReturns:", response.result);
      }
    } catch (error) {
      console.error("Failed to load sales returns:", error);
    }
  };

  const loadProductsFromPosOrders = async () => {
    try {
      const response = await apiService.get<any>("OnlinePosOrders"); // keep any – we’ll cast below
      if (response.status.code === "S") {
        // Flatten all items from every order
        const allItems: {
          productId: number;
          productName: string;
          sku: string;
          price: number;
        }[] = response.result.flatMap((order: any) =>
          (order.items || []).map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            sku: item.sku,
            price: item.price,
          }))
        );

        // Remove duplicates by productId
        const uniqueProducts: Product[] = Array.from(
          new Map(allItems.map((item) => [item.productId, item])).values()
        );

        setProducts(uniqueProducts);
        console.log("SalesReturn loadProductsFromPosOrders:", uniqueProducts);
      }
    } catch (error) {
      console.error("Failed to load products from POS orders:", error);
    }
  };

  const filteredData = useMemo(() => {
    let result = [...returns];

    if (search.trim()) {
      result = result.filter(
        (r) =>
          r.productName.toLowerCase().includes(search.toLowerCase()) ||
          r.sku.toLowerCase().includes(search.toLowerCase()) ||
          r.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
          r.customer.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCustomer !== "All") result = result.filter((r) => r.customer === selectedCustomer);
    if (selectedStatus !== "All") result = result.filter((r) => r.status === selectedStatus);

    if (selectedPaymentStatus !== "All") {
      result = result.filter((r) => {
        if (selectedPaymentStatus === "Paid") return r.paidAmount === r.totalAmount;
        if (selectedPaymentStatus === "Partial") return r.paidAmount > 0 && r.paidAmount < r.totalAmount;
        if (selectedPaymentStatus === "Unpaid") return r.paidAmount === 0;
        return true;
      });
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

    console.log("SalesReturn filteredData:", result);
    return result;
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
    const end = start + itemsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, itemsPerPage]);

  const customerOptions = useMemo(() => ["All", ...Array.from(new Set(returns.map((r) => r.customer)))], [returns]);
  const statusOptions = useMemo(() => ["All", ...Array.from(new Set(returns.map((r) => r.status)))], [returns]);

  const handleProductSelect = (product: Product) => {
    setForm((prev) => ({
      ...prev,
      productId: product.productId,
      productName: product.productName,
      sku: product.sku,
      price: product.price,
      totalAmount: product.price.toString(),
      dueAmount: (product.price - parseFloat(prev.paidAmount || "0")).toString(),
    }));
    console.log("SalesReturn handleProductSelect:", product);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-update due when total or paid changes
      if (name === "totalAmount" || name === "paidAmount") {
        const total = parseFloat(updated.totalAmount) || 0;
        const paid = parseFloat(updated.paidAmount) || 0;
        updated.dueAmount = (total - paid).toFixed(2);
      }

      return updated;
    });
  };

  const handleAddClick = () => {
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
    console.log("SalesReturn handleAddClick");
  };

  const handleEdit = (ret: SalesReturn) => {
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
    console.log("SalesReturn handleEdit:", ret);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const total = parseFloat(form.totalAmount);
    const paid = parseFloat(form.paidAmount);
    const due = total - paid;

    if (
      !form.productName ||
      !form.invoiceNo.trim() ||
      !form.customer.trim() ||
      !form.date ||
      isNaN(total) ||
      total <= 0
    ) {
      alert("Please fill all required fields with valid values.");
      return;
    }

    const newReturn: SalesReturn = {
      id: formMode === "add" ? (returns.length ? Math.max(...returns.map((r) => r.id)) + 1 : 1) : form.id!,
      productId: form.productId,
      productName: form.productName,
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
      setReturns((prev) => [newReturn, ...prev]);
      setCurrentPage(Math.ceil((filteredData.length + 1) / itemsPerPage));
    } else {
      setReturns((prev) => prev.map((r) => (r.id === newReturn.id ? newReturn : r)));
    }

    setFormMode(null);
    console.log("SalesReturn handleFormSubmit:", newReturn);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this return?")) {
      setReturns((prev) => prev.filter((r) => r.id !== id));
      const totalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
      else if (totalPages === 0) setCurrentPage(1);
    }
  };

  const handleClear = () => {
    loadSalesReturns();
    setSearch("");
    setSelectedCustomer("All");
    setSelectedStatus("All");
    setSelectedPaymentStatus("All");
    setSelectedSort("Recently Added");
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Sales Returns Report:\n\n" + JSON.stringify(returns, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const columns: Column[] = [
    {
      key: "index",
      label: "#",
      render: (_, __, idx) => (currentPage - 1) * itemsPerPage + (idx ?? 0) + 1,
      align: "center",
      className: "w-12",
    },
    { key: "productName", label: "Product" },
    { key: "date", label: "Date" },
    { key: "customer", label: "Customer" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${value === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {value}
        </span>
      ),
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
      label: "Payment Status",
      render: (_, row) =>
        row.paidAmount === row.totalAmount
          ? "Paid"
          : row.paidAmount > 0
            ? "Partial"
            : "Unpaid",
    },
  ];

  const rowActions = (row: SalesReturn) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        className="text-gray-700 hover:text-primary p-1"
        title="Edit"
      >
        <i className="fa fa-edit"></i>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        className="text-gray-700 hover:text-red-600 p-1"
        title="Delete"
      >
        <i className="fa fa-trash-can-xmark"></i>
      </button>
    </>
  );

  const customFilters = () => (
    <>
      <input
        type="text"
        placeholder="Search by Product, SKU, Invoice, Customer..."
        value={search}
        onChange={handleSearchChange}
        className="border rounded px-3 py-2 w-full md:w-64 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <select
        value={selectedCustomer}
        onChange={(e) => setSelectedCustomer(e.target.value)}
        className="border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {customerOptions.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        value={selectedPaymentStatus}
        onChange={(e) => setSelectedPaymentStatus(e.target.value)}
        className="border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option>All</option>
        <option>Paid</option>
        <option>Partial</option>
        <option>Unpaid</option>
      </select>
      <select
        value={selectedSort}
        onChange={(e) => setSelectedSort(e.target.value)}
        className="border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option>Recently Added</option>
        <option>Ascending</option>
        <option>Descending</option>
        <option>Last 7 Days</option>
        <option>Last Month</option>
      </select>
    </>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Product Autocomplete */}
      <div className="md:col-span-3">
        <label className="block text-sm font-medium mb-1">Product *</label>
        <div className="relative">
          <input
            type="text"
            value={form.productName}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, productName: e.target.value }));
            }}
            placeholder="Type to search product..."
            className="w-full border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {form.productName && products.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
              {products
                .filter((p) =>
                  p.productName.toLowerCase().includes(form.productName.toLowerCase()) ||
                  p.sku.toLowerCase().includes(form.productName.toLowerCase())
                )
                .slice(0, 10)
                .map((p) => (
                  <div
                    key={p.productId}
                    onClick={() => handleProductSelect(p)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                  >
                    <span>{p.productName}</span>
                    <span className="text-sm text-gray-500">{p.sku} | ${p.price}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Invoice No *</label>
        <input
          type="text"
          name="invoiceNo"
          value={form.invoiceNo}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Customer *</label>
        <input
          type="text"
          name="customer"
          value={form.customer}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date *</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Total Amount *</label>
        <input
          type="number"
          name="totalAmount"
          value={form.totalAmount}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          className="w-full border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Paid Amount</label>
        <input
          type="number"
          name="paidAmount"
          value={form.paidAmount}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          className="w-full border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Due Amount</label>
        <input
          type="text"
          value={form.dueAmount}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-600"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option>Pending</option>
          <option>Paid</option>
        </select>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Sales Returns"
      description="Manage Your Sales Returns"
      icon="fa-light fa-arrow-rotate-left"
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