import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";

interface Invoice {
  id: number;
  invoiceNo: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any, idx?: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function Invoices() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    invoiceNo: "",
    customer: "",
    date: "",
    dueDate: "",
    amount: "",
    status: "Pending" as "Paid" | "Pending" | "Overdue",
  });

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Recently Added");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await apiService.get<Invoice[]>("Invoices");
      if (response.status.code === "S") {
        setInvoices(response.result);
        console.log("Invoices loadData:", { data: response.result });
      }
    } catch (error) {
      console.error("Failed to load invoices:", error);
    }
  };

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

    // Sorting
    if (selectedSort === "Recently Added") {
      result.sort((a, b) => b.id - a.id);
    } else if (selectedSort === "Ascending") {
      result.sort((a, b) => a.amount - b.amount);
    } else if (selectedSort === "Descending") {
      result.sort((a, b) => b.amount - a.amount);
    } else if (selectedSort === "Last 7 Days") {
      const now = new Date();
      const last7 = new Date();
      last7.setDate(now.getDate() - 7);
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

  const customerOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(invoices.map((i) => i.customer)))];
  }, [invoices]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      invoiceNo: `INV-${Date.now()}`,
      customer: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: "",
      amount: "",
      status: "Pending",
    });
    console.log("Invoices handleAddClick: Modal opened for add");
  };

  const handleEdit = (invoice: Invoice) => {
    setFormMode("edit");
    setForm({
      id: invoice.id,
      invoiceNo: invoice.invoiceNo,
      customer: invoice.customer,
      date: invoice.date,
      dueDate: invoice.dueDate,
      amount: invoice.amount.toString(),
      status: invoice.status,
    });
    console.log("Invoices handleEdit: Modal opened for edit", { invoice });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.invoiceNo.trim() ||
      !form.customer.trim() ||
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
    console.log("Invoices handleFormSubmit:", { form, formMode });
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
      console.log("Invoices handleDelete:", { id, totalPages, currentPage });
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
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("Invoices handleSearchChange:", { search: e.target.value, currentPage: 1 });
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("Invoices handlePageChange:", { page, totalPages, currentPage });
    } else {
      console.warn("Invoices handlePageChange: Invalid page", { page, totalPages, currentPage });
    }
  };

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
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${value === "Paid"
              ? "bg-green-100 text-green-800"
              : value === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
        >
          {value}
        </span>
      ),
      align: "center",
    },
  ];

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

  const customFilters = () => (
    <>
      <input
        type="text"
        placeholder="Search by Invoice No or Customer..."
        value={search}
        onChange={handleSearchChange}
        className="border border-input rounded px-3 py-2 w-full md:w-64 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Search"
      />
      <select
        value={selectedCustomer}
        onChange={(e) => setSelectedCustomer(e.target.value)}
        className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {customerOptions.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option>All</option>
        <option>Paid</option>
        <option>Pending</option>
        <option>Overdue</option>
      </select>
      <select
        value={selectedSort}
        onChange={(e) => setSelectedSort(e.target.value)}
        className="border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
      <div>
        <label className="block text-sm font-medium mb-1">Invoice No *</label>
        <input
          type="text"
          name="invoiceNo"
          value={form.invoiceNo}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
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
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option>Pending</option>
          <option>Paid</option>
          <option>Overdue</option>
        </select>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Invoices"
      description="Manage your invoices"
      icon="fa-light fa-file-invoice-dollar"
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