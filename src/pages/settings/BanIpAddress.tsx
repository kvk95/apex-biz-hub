import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1, Column } from "@/pages/PageBase1";

interface BannedIP {
  id: number;
  ipAddress: string;
  reason: string;
  createdOn: string; // ISO date string
}

export default function BanIpAddress() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    ipAddress: "",
    reason: "",
  });
  const [bannedIPs, setBannedIPs] = useState<BannedIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter & Pagination
  const filteredIPs = useMemo(() => {
    return !search.trim()
      ? bannedIPs
      : bannedIPs.filter(
          (ip) =>
            ip.ipAddress.includes(search) ||
            ip.reason.toLowerCase().includes(search.toLowerCase())
        );
  }, [search, bannedIPs]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredIPs.slice(start, end);
  }, [currentPage, itemsPerPage, filteredIPs]);

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<BannedIP[]>("BanIpAddress");
      if (response.status.code === "S") {
        setBannedIPs(response.result);
        setError(null);
      } else {
        setError(response.status.description);
      }
    } catch (err) {
      setError("Failed to load banned IPs.");
    } finally {
      setLoading(false);
    }
  };

  // Input Change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Add Click
  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      ipAddress: "",
      reason: "",
    });
  };

  // Edit
  const handleEdit = (ip: BannedIP) => {
    setFormMode("edit");
    setForm({ ...ip });
  };

  // Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(form.ipAddress)) {
      alert("Please enter a valid IP address (e.g., 192.168.1.1)");
      return;
    }
    if (!form.reason.trim()) {
      alert("Reason is required.");
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    if (formMode === "add") {
      const newId = bannedIPs.length
        ? Math.max(...bannedIPs.map((c) => c.id)) + 1
        : 1;
      setBannedIPs((prev) => [
        ...prev,
        { ...form, id: newId, createdOn: today },
      ]);
      const totalPages = Math.ceil((filteredIPs.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setBannedIPs((prev) =>
        prev.map((c) =>
          c.id === form.id
            ? { ...form, id: form.id!, createdOn: c.createdOn }
            : c
        )
      );
    }

    setFormMode(null);
  };

  // Delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to unban this IP?")) {
      setBannedIPs((prev) => prev.filter((c) => c.id !== id));
      const totalPages = Math.ceil((filteredIPs.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else if (totalPages === 0) {
        setCurrentPage(1);
      }
    }
  };

  // Clear / Refresh
  const handleClear = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
  };

  // Search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Pagination
  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredIPs.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // Table Columns
  const columns: Column[] = [ 
    {
      key: "ipAddress",
      label: "IP Address",
      render: (value) => (
        <span className="font-mono font-semibold">{value}</span>
      ),
    },
    { key: "reason", label: "Reason" },
    {
      key: "createdOn",
      label: "Created On",
      render: (value) => {
        const date = new Date(value);
        const options: Intl.DateTimeFormatOptions = {
          day: "2-digit",
          month: "short",
          year: "numeric",
        };
        return date.toLocaleDateString("en-GB", options); // e.g., 25 Apr 2025
      },
    },
  ];

  // Row Actions
  const rowActions = (row: BannedIP) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit IP ${row.ipAddress}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete IP ${row.ipAddress}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  // Modal Form
  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-1">
        <label htmlFor="ipAddress" className="block text-sm font-medium mb-1">
          IP Address <span className="text-destructive">*</span>
        </label>
        <input
          id="ipAddress"
          name="ipAddress"
          type="text"
          value={form.ipAddress}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., 192.168.1.1"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Enter a valid IPv4 address</p>
      </div>
      <div className="md:col-span-1">
        <label htmlFor="reason" className="block text-sm font-medium mb-1">
          Reason <span className="text-destructive">*</span>
        </label>
        <textarea
          id="reason"
          name="reason"
          value={form.reason}
          onChange={handleInputChange}
          rows={3}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="Enter reason for banning"
          required
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Ban IP Address"
      description="Block suspicious or malicious IP addresses"
      icon="fa fa-ban"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredIPs.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Ban New IP" : "Edit Banned IP"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      loading={loading}
    />
  );
}
