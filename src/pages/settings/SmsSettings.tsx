import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1, Column } from "@/pages/PageBase1";

interface SmsGateway {
  id: number;
  gatewayName: string;
  username: string;
  password: string;
  apiKey: string;
  apiSecretKey: string;
  senderId: string;
  status: boolean;
  createdOn: string;
}

export default function SmsSettings() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    gatewayName: "",
    username: "",
    password: "",
    apiKey: "",
    apiSecretKey: "",
    senderId: "",
    status: true,
  });
  const [gateways, setGateways] = useState<SmsGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter & Pagination
  const filteredGateways = useMemo(() => {
    return !search.trim()
      ? gateways
      : gateways.filter(
          (g) =>
            g.gatewayName.toLowerCase().includes(search.toLowerCase()) ||
            g.senderId.toLowerCase().includes(search.toLowerCase()) ||
            g.username.toLowerCase().includes(search.toLowerCase())
        );
  }, [search, gateways]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredGateways.slice(start, end);
  }, [currentPage, itemsPerPage, filteredGateways]);

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<SmsGateway[]>("SmsSettings");
      if (response.status.code === "S") {
        setGateways(response.result);
        setError(null);
      } else {
        setError(response.status.description);
      }
    } catch (err) {
      setError("Failed to load SMS gateways.");
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
      gatewayName: "",
      username: "",
      password: "",
      apiKey: "",
      apiSecretKey: "",
      senderId: "",
      status: true,
    });
  };

  // Edit
  const handleEdit = (gateway: SmsGateway) => {
    setFormMode("edit");
    setForm({ ...gateway });
  };

  // Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.gatewayName.trim() ||
      !form.username.trim() ||
      !form.password.trim() ||
      !form.senderId.trim()
    ) {
      alert("Gateway Name, Username, Password, and Sender ID are required.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (formMode === "add") {
      const newId = gateways.length
        ? Math.max(...gateways.map((g) => g.id)) + 1
        : 1;
      setGateways((prev) => [
        ...prev,
        {
          ...form,
          id: newId,
          createdOn: today,
        },
      ]);
      const totalPages = Math.ceil(
        (filteredGateways.length + 1) / itemsPerPage
      );
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setGateways((prev) =>
        prev.map((g) =>
          g.id === form.id
            ? { ...form, id: form.id!, createdOn: g.createdOn }
            : g
        )
      );
    }

    setFormMode(null);
  };

  // Delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this SMS gateway?")) {
      setGateways((prev) => prev.filter((g) => g.id !== id));
      const totalPages = Math.ceil(
        (filteredGateways.length - 1) / itemsPerPage
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
    const totalPages = Math.ceil(filteredGateways.length / itemsPerPage);
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
    { key: "gatewayName", label: "SMS Gateway" },
    { key: "username", label: "Username" },
    {
      key: "password",
      label: "Password",
      render: () => <span className="font-mono">••••••••</span>,
    },
    {
      key: "apiKey",
      label: "API Key",
      render: (value) => (
        <span className="font-mono text-xs">
          {value ? `${value.slice(0, 8)}...${value.slice(-4)}` : "-"}
        </span>
      ),
    },
    {
      key: "apiSecretKey",
      label: "API Secret Key",
      render: (value) => (
        <span className="font-mono text-xs">
          {value ? `${value.slice(0, 4)}...${value.slice(-4)}` : "-"}
        </span>
      ),
    },
    { key: "senderId", label: "Sender ID" },
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
  const rowActions = (row: SmsGateway) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.gatewayName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.gatewayName}`}
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
      {/* SMS Gateway */}
      <div>
        <label htmlFor="gatewayName" className="block text-sm font-medium mb-1">
          SMS Gateway <span className="text-destructive">*</span>
        </label>
        <input
          id="gatewayName"
          name="gatewayName"
          type="text"
          value={form.gatewayName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., Twilio, MSG91"
          required
        />
      </div>

      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Username <span className="text-destructive">*</span>
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., admin"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password <span className="text-destructive">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="••••••••"
          required
        />
      </div>

      {/* API Key */}
      <div>
        <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
          API Key
        </label>
        <input
          id="apiKey"
          name="apiKey"
          type="text"
          value={form.apiKey}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        />
      </div>

      {/* API Secret Key */}
      <div>
        <label
          htmlFor="apiSecretKey"
          className="block text-sm font-medium mb-1"
        >
          API Secret Key
        </label>
        <input
          id="apiSecretKey"
          name="apiSecretKey"
          type="text"
          value={form.apiSecretKey}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., your-secret-key"
        />
      </div>

      {/* Sender ID */}
      <div>
        <label htmlFor="senderId" className="block text-sm font-medium mb-1">
          Sender ID <span className="text-destructive">*</span>
        </label>
        <input
          id="senderId"
          name="senderId"
          type="text"
          value={form.senderId}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., MYBRAND"
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
      title="SMS Settings"
      description="Manage SMS gateway configurations"
      
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredGateways.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add SMS Gateway" : "Edit SMS Gateway"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      loading={loading}
    />
  );
}
