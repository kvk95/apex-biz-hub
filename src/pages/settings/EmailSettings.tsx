import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1, Column } from "@/pages/PageBase1";

interface EmailSetting {
  id: number;
  email: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  status: boolean;
  createdOn: string;
}

export default function EmailSettings() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    email: "",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
    status: true,
  });
  const [settings, setSettings] = useState<EmailSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter & Pagination
  const filteredSettings = useMemo(() => {
    return !search.trim()
      ? settings
      : settings.filter(
          (s) =>
            s.email.toLowerCase().includes(search.toLowerCase()) ||
            s.smtpHost.toLowerCase().includes(search.toLowerCase()) ||
            s.smtpUser.toLowerCase().includes(search.toLowerCase())
        );
  }, [search, settings]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredSettings.slice(start, end);
  }, [currentPage, itemsPerPage, filteredSettings]);

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<EmailSetting[]>("EmailSettings");
      if (response.status.code === "S") {
        setSettings(response.result);
        setError(null);
      } else {
        setError(response.status.description);
      }
    } catch (err) {
      setError("Failed to load email settings.");
    } finally {
      setLoading(false);
    }
  };

  // Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleToggleChange = () => {
    setForm((f) => ({ ...f, status: !f.status }));
  };

  // Add Click
  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      email: "",
      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPassword: "",
      status: true,
    });
  };

  // Edit
  const handleEdit = (setting: EmailSetting) => {
    setFormMode("edit");
    setForm({
      id: setting.id,
      email: setting.email,
      smtpHost: setting.smtpHost,
      smtpPort: setting.smtpPort.toString(),
      smtpUser: setting.smtpUser,
      smtpPassword: "", // Do not show password
      status: setting.status,
    });
  };

  // Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.email.trim() ||
      !form.smtpHost.trim() ||
      !form.smtpPort.trim() ||
      !form.smtpUser.trim()
    ) {
      alert("Email, SMTP Host, Port, and User are required.");
      return;
    }

    const port = parseInt(form.smtpPort);
    if (isNaN(port) || port <= 0 || port > 65535) {
      alert("SMTP Port must be a valid number (1–65535).");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (formMode === "add") {
      const newId = settings.length
        ? Math.max(...settings.map((s) => s.id)) + 1
        : 1;
      setSettings((prev) => [
        ...prev,
        {
          id: newId,
          email: form.email.trim(),
          smtpHost: form.smtpHost.trim(),
          smtpPort: port,
          smtpUser: form.smtpUser.trim(),
          smtpPassword: form.smtpPassword || "******", // placeholder
          status: form.status,
          createdOn: today,
        },
      ]);
      const totalPages = Math.ceil(
        (filteredSettings.length + 1) / itemsPerPage
      );
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setSettings((prev) =>
        prev.map((s) =>
          s.id === form.id
            ? {
                ...s,
                email: form.email.trim(),
                smtpHost: form.smtpHost.trim(),
                smtpPort: port,
                smtpUser: form.smtpUser.trim(),
                smtpPassword: form.smtpPassword
                  ? form.smtpPassword
                  : s.smtpPassword,
                status: form.status,
              }
            : s
        )
      );
    }

    setFormMode(null);
  };

  // Delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this email setting?")) {
      setSettings((prev) => prev.filter((s) => s.id !== id));
      const totalPages = Math.ceil(
        (filteredSettings.length - 1) / itemsPerPage
      );
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
    const totalPages = Math.ceil(filteredSettings.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // Table Columns
  const columns: Column[] = [
    {
      key: "index",
      label: "#",
      render: (_, __, idx) => (currentPage - 1) * itemsPerPage + idx + 1,
    },
    { key: "email", label: "Email" },
    { key: "smtpHost", label: "SMTP Host" },
    {
      key: "smtpPort",
      label: "Port",
      render: (value) => <span className="font-mono">{value}</span>,
    },
    { key: "smtpUser", label: "User" },
    {
      key: "smtpPassword",
      label: "Password",
      render: () => <span className="font-mono">••••••••</span>,
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
  ];

  // Row Actions
  const rowActions = (row: EmailSetting) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.email}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.email}`}
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
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email <span className="text-destructive">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., no-reply@company.com"
          required
        />
      </div>

      {/* SMTP Host */}
      <div>
        <label htmlFor="smtpHost" className="block text-sm font-medium mb-1">
          SMTP Host <span className="text-destructive">*</span>
        </label>
        <input
          id="smtpHost"
          name="smtpHost"
          type="text"
          value={form.smtpHost}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., smtp.gmail.com"
          required
        />
      </div>

      {/* SMTP Port */}
      <div>
        <label htmlFor="smtpPort" className="block text-sm font-medium mb-1">
          Port <span className="text-destructive">*</span>
        </label>
        <input
          id="smtpPort"
          name="smtpPort"
          type="number"
          min="1"
          max="65535"
          value={form.smtpPort}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="587"
          required
        />
      </div>

      {/* SMTP User */}
      <div>
        <label htmlFor="smtpUser" className="block text-sm font-medium mb-1">
          User <span className="text-destructive">*</span>
        </label>
        <input
          id="smtpUser"
          name="smtpUser"
          type="text"
          value={form.smtpUser}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., username"
          required
        />
      </div>

      {/* SMTP Password */}
      <div>
        <label
          htmlFor="smtpPassword"
          className="block text-sm font-medium mb-1"
        >
          Password
        </label>
        <input
          id="smtpPassword"
          name="smtpPassword"
          type="password"
          value={form.smtpPassword}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="••••••••"
          autoComplete="new-password"
        />
        {formMode === "edit" && (
          <p className="text-xs text-gray-500 mt-1">
            Leave blank to keep current password
          </p>
        )}
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
            onChange={handleToggleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Email Settings"
      description="Manage SMTP email configurations"
      icon="fa fa-envelope"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredSettings.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={
        formMode === "add" ? "Add Email Setting" : "Edit Email Setting"
      }
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      loading={loading}
    />
  );
}
