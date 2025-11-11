import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1, Column } from "@/pages/PageBase1";

interface BankAccount {
  id: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  ifsc: string;
  status: boolean;
  isDefault: boolean;
  createdOn: string;
}

export default function BankSettings() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    bankName: "",
    accountNumber: "",
    accountName: "",
    branch: "",
    ifsc: "",
    status: true,
    isDefault: false,
  });
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter & Pagination
  const filteredBanks = useMemo(() => {
    return !search.trim()
      ? banks
      : banks.filter(
          (b) =>
            b.bankName.toLowerCase().includes(search.toLowerCase()) ||
            b.accountName.toLowerCase().includes(search.toLowerCase()) ||
            b.ifsc.toLowerCase().includes(search.toLowerCase())
        );
  }, [search, banks]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredBanks.slice(start, end);
  }, [currentPage, itemsPerPage, filteredBanks]);

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<BankAccount[]>("BankSettings");
      if (response.status.code === "S") {
        setBanks(response.result);
        setError(null);
      } else {
        setError(response.status.description);
      }
    } catch (err) {
      setError("Failed to load bank accounts.");
    } finally {
      setLoading(false);
    }
  };

  // Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleToggleChange = (field: "status" | "isDefault") => {
    setForm((f) => ({ ...f, [field]: !f[field] }));
  };

  // Add Click
  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      bankName: "",
      accountNumber: "",
      accountName: "",
      branch: "",
      ifsc: "",
      status: true,
      isDefault: false,
    });
  };

  // Edit
  const handleEdit = (bank: BankAccount) => {
    setFormMode("edit");
    setForm({ ...bank });
  };

  // Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.bankName.trim() ||
      !form.accountNumber.trim() ||
      !form.accountName.trim() ||
      !form.branch.trim() ||
      !form.ifsc.trim()
    ) {
      alert("All fields are required.");
      return;
    }

    if (!/^\d{9,18}$/.test(form.accountNumber.replace(/\s/g, ""))) {
      alert("Account Number must be 9–18 digits.");
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc)) {
      alert("IFSC must be 11 characters (e.g., HDFC0001234).");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (formMode === "add") {
      const newId = banks.length ? Math.max(...banks.map((b) => b.id)) + 1 : 1;
      setBanks((prev) => [
        ...prev,
        {
          ...form,
          id: newId,
          createdOn: today,
        },
      ]);
      const totalPages = Math.ceil((filteredBanks.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setBanks((prev) =>
        prev.map((b) =>
          b.id === form.id
            ? { ...form, id: form.id!, createdOn: b.createdOn }
            : b
        )
      );
    }

    setFormMode(null);
  };

  // Delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this bank account?")) {
      setBanks((prev) => prev.filter((b) => b.id !== id));
      const totalPages = Math.ceil((filteredBanks.length - 1) / itemsPerPage);
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
    const totalPages = Math.ceil(filteredBanks.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // Mask Account Number
  const maskAccountNumber = (acc: string) => {
    const clean = acc.replace(/\D/g, "");
    if (clean.length <= 4) return `**** **** ${clean}`;
    const last4 = clean.slice(-4);
    return `**** **** ${last4}`;
  };

  // Table Columns
  const columns: Column[] = [
    { key: "bankName", label: "Bank Name" },
    {
      key: "accountNumber",
      label: "Account Number",
      render: (value) => (
        <span className="font-mono">{maskAccountNumber(value)}</span>
      ),
    },
    { key: "accountName", label: "Account Name" },
    { key: "branch", label: "Branch" },
    {
      key: "ifsc",
      label: "IFSC",
      render: (value) => <span className="font-mono uppercase">{value}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={value}
            disabled
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      ),
    },
    {
      key: "isDefault",
      label: "Default",
      render: (value) =>
        value ? (
          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            Default
          </span>
        ) : (
          "-"
        ),
    },
  ];

  // Row Actions
  const rowActions = (row: BankAccount) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.bankName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.bankName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  // Modal Form
  const modalForm = () => (
    <div className="space-y-4">
      {/* Bank Name */}
      <div>
        <label htmlFor="bankName" className="block text-sm font-medium mb-1">
          Bank Name <span className="text-destructive">*</span>
        </label>
        <input
          id="bankName"
          name="bankName"
          type="text"
          value={form.bankName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., HDFC"
          required
        />
      </div>

      {/* Account Number */}
      <div>
        <label
          htmlFor="accountNumber"
          className="block text-sm font-medium mb-1"
        >
          Account Number <span className="text-destructive">*</span>
        </label>
        <input
          id="accountNumber"
          name="accountNumber"
          type="text"
          value={form.accountNumber}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., 123456789012"
          required
        />
      </div>

      {/* Account Name */}
      <div>
        <label htmlFor="accountName" className="block text-sm font-medium mb-1">
          Account Name <span className="text-destructive">*</span>
        </label>
        <input
          id="accountName"
          name="accountName"
          type="text"
          value={form.accountName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., Mathew"
          required
        />
      </div>

      {/* Branch */}
      <div>
        <label htmlFor="branch" className="block text-sm font-medium mb-1">
          Branch <span className="text-destructive">*</span>
        </label>
        <input
          id="branch"
          name="branch"
          type="text"
          value={form.branch}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., Bringham"
          required
        />
      </div>

      {/* IFSC */}
      <div>
        <label htmlFor="ifsc" className="block text-sm font-medium mb-1">
          IFSC <span className="text-destructive">*</span>
        </label>
        <input
          id="ifsc"
          name="ifsc"
          type="text"
          value={form.ifsc}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring uppercase"
          placeholder="e.g., HDFC0001234"
          maxLength={11}
          required
        />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={form.status}
            onChange={() => handleToggleChange("status")}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>

      {/* Make as Default */}
      <div className="flex items-center justify-between">
        <label htmlFor="isDefault" className="text-sm font-medium">
          Make as default
        </label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={() => handleToggleChange("isDefault")}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Bank Settings"
      description="Manage your bank accounts"
      icon="fa fa-university"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredBanks.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Bank Account" : "Edit Bank Account"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      loading={loading}
    />
  );
}
