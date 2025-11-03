/* -------------------------------------------------
   Invoices
   ------------------------------------------------- */
import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import { AutoCompleteTextBox, AutoCompleteItem } from "@/components/Search/AutoCompleteTextBox";
import { SearchInput } from "@/components/Search/SearchInput";
import {
  PAYMENT_STATUSES,
  SORT_OPTIONS,
} from "@/constants/constants";

type CustomerOption = {
  id: number;
  display: string;
};

type CustomerForAuto = AutoCompleteItem;

type Customer = {
  id: number;
  name: string;
};

type Invoice = {
  id: number;
  invoiceNo: string;
  customer: string;
  customerId: number;
  date: string;
  dueDate: string;
  amount: number;
  status: (typeof PAYMENT_STATUSES)[number];
};

export default function Invoices() {
  /* ---------- state ---------- */
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<(typeof PAYMENT_STATUSES)[number] | "All">("All");
  const [selectedSort, setSelectedSort] = useState<(typeof SORT_OPTIONS)[number]>("Recently Added");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    id: null as number | null,
    invoiceNo: "",
    customerId: "",
    customer: "",
    date: "",
    dueDate: "",
    amount: "",
    status: "Pending" as (typeof PAYMENT_STATUSES)[number],
  });

  /* ---------- load data ---------- */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invRes, custRes] = await Promise.all([
        apiService.get<Invoice[]>("Invoices"),
        apiService.get<Customer[]>("Customers"),
      ]);

      if (invRes.status.code === "S") {
        setInvoices(invRes.result);
        console.log("Invoices loadData invoices:", invRes.result);
      }
      if (custRes.status.code === "S") {
        setCustomers(custRes.result);
        setFilteredCustomers(custRes.result);
        console.log("Invoices loadData customers:", custRes.result);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load data.");
      console.error("Invoices loadData error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- filtering ---------- */
  const filteredData = useMemo(() => {
    let result = [...invoices];

    if (search.trim()) {
      result = result.filter(
        (i) =>
          i.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
          i.customer.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCustomer !== "All") {
      result = result.filter((i) => i.customer === selectedCustomer);
    }

    if (selectedStatus !== "All") {
      result = result.filter((i) => i.status === selectedStatus);
    }

    if (selectedSort === "Recently Added") {
      result.sort((a, b) => b.id - a.id);
    } else if (selectedSort === "Ascending") {
      result.sort((a, b) => a.amount - b.amount);
    } else if (selectedSort === "Descending") {
      result.sort((a, b) => b.amount - a.amount);
    } else if (selectedSort === "Last 7 Days") {
      const last7 = new Date();
      last7.setDate(last7.getDate() - 7);
      result = result.filter((i) => new Date(i.date) >= last7);
    } else if (selectedSort === "Last Month") {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      result = result.filter((i) => {
        const date = new Date(i.date);
        return date >= start && date <= end;
      });
    }

    console.log("Invoices filteredData:", result, {
      search,
      selectedCustomer,
      selectedStatus,
      selectedSort,
    });
    return result;
  }, [invoices, search, selectedCustomer, selectedStatus, selectedSort]);

  /* ---------- pagination ---------- */
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredData.slice(start, end);
    console.log("Invoices paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredData.length,
    });
    return result;
  }, [filteredData, currentPage, itemsPerPage]);

  /* ---------- derived options ---------- */
  const customerOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(invoices.map((i) => i.customer)))];
  }, [invoices]);

  /* ---------- handlers ---------- */
  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      invoiceNo: `INV-${Date.now()}`,
      customerId: "",
      customer: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: "",
      amount: "",
      status: "Pending" as (typeof PAYMENT_STATUSES)[number],
    });
    console.log("Invoices handleAddClick");
  };

  const handleEdit = (invoice: Invoice) => {
    setFormMode("edit");
    setForm({
      id: invoice.id,
      invoiceNo: invoice.invoiceNo,
      customerId: invoice.customerId.toString(),
      customer: invoice.customer,
      date: invoice.date,
      dueDate: invoice.dueDate,
      amount: invoice.amount.toString(),
      status: invoice.status,
    });
    console.log("Invoices handleEdit:", { invoice });
  };

  /* handlers */
  const handleCustomerSearch = (query: string) => {
    const filtered = customers.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setForm((prev) => ({ ...prev, customer: query, customerId: "" }));
  };

  const handleCustomerSelect = (cust: CustomerForAuto) => {
    setForm((prev) => ({
      ...prev,
      customerId: cust.id.toString(),
      customer: cust.display,
    }));
    setFilteredCustomers(customers);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    console.log("Invoices handleFormChange:", { name, value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.invoiceNo.trim() ||
      !form.customerId ||
      !form.date ||
      !form.dueDate ||
      !form.amount ||
      !form.status
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newInvoice: Invoice = {
      id: formMode === "add" ? (invoices.length ? Math.max(...invoices.map((i) => i.id)) + 1 : 1) : form.id!,
      invoiceNo: form.invoiceNo.trim(),
      customer: form.customer.trim(),
      customerId: Number(form.customerId),
      date: form.date,
      dueDate: form.dueDate,
      amount,
      status: form.status,
    };

    if (formMode === "add") {
      setInvoices((prev) => [newInvoice, ...prev]);
      const totalPages = Math.ceil((filteredData.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit") {
      setInvoices((prev) => prev.map((i) => (i.id === newInvoice.id ? newInvoice : i)));
    }

    setFormMode(null);
    console.log("Invoices handleFormSubmit:", { newInvoice, formMode });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      setInvoices((prev) => prev.filter((i) => i.id !== id));
      const totalItemsAfterDelete = filteredData.length - 1;
      const totalPages = Math.ceil(totalItemsAfterDelete / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else if (totalPages === 0) {
        setCurrentPage(1);
      }
      console.log("Invoices handleDelete:", { id, totalPages });
    }
  };

  const handleClear = () => {
    loadData();
    setSearch("");
    setSelectedCustomer("All");
    setSelectedStatus("All");
    setSelectedSort("Recently Added");
    setCurrentPage(1);
    console.log("Invoices handleClear");
  };

  const handleReport = () => {
    alert("Invoices Report:\n\n" + JSON.stringify(invoices, null, 2));
    console.log("Invoices handleReport");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("Invoices handleSearchChange:", { search: e.target.value });
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("Invoices handlePageChange:", { page, totalPages });
    } else {
      console.warn("Invalid page", { page, totalPages, currentPage });
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
    { key: "invoiceNo", label: "Invoice No" },
    { key: "customer", label: "Customer" },
    { key: "date", label: "Date" },
    { key: "dueDate", label: "Due Date" },
    {
      key: "amount",
      label: "Amount",
      render: (value) => `$${Number(value).toFixed(2)}`,
      align: "right",
    },
    {
      key: "status",
      label: "Status",
      render: renderStatusBadge,
      align: "center",
    },
  ];

  /* ---------- row actions ---------- */
  const rowActions = (row: Invoice) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit invoice ${row.invoiceNo}`}
        className="text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded p-1 transition-colors"
        title="Edit"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit invoice</span>
      </button>

      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete invoice ${row.invoiceNo}`}
        className="text-gray-700 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1 transition-colors"
        title="Delete"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete invoice</span>
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
          placeholder="Search by Invoice No or Customer..."
          onSearch={(query) => {
            setSearch(query);
            setCurrentPage(1);
          }}
          className="w-full"
        />
      </div>

      {/* Right: Filter Dropdowns */}
      <div className="flex gap-2 flex-wrap justify-end w-full md:w-auto">
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="border border-input rounded-md px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[130px]"
        >
          {customerOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="border border-input rounded-md px-3 py-2 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[100px]"
        >
          <option>All</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value as any)}
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
      <div>
        <label className="block text-sm font-medium mb-1">Invoice No *</label>
        <input
          type="text"
          name="invoiceNo"
          value={form.invoiceNo}
          onChange={handleFormChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
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
          placeholder="Search customer..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date *</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleFormChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Due Date *</label>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleFormChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Amount *</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleFormChange}
          min="0"
          step="0.01"
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status *</label>
        <select
          name="status"
          value={form.status}
          onChange={handleFormChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  /* ---------- render ---------- */
  return (
    <PageBase1
      title="Invoices"
      description="Manage your invoices"
      icon="fa-solid fa-file-invoice-dollar"
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
      modalTitle={formMode === "add" ? "Add Invoice" : "Edit Invoice"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}