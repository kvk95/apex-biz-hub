import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1, Column } from "@/pages/PageBase1";
import { DEFAULT_PAGE_SIZE } from "@/constants/constants";

interface Integration {
  id: number;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  integrationUrl?: string;
}

const defaultIntegrations: Integration[] = [
  {
    id: 1,
    name: "Google Captcha",
    icon: "fa-shield-alt",
    description: "Captcha helps protect you from spam and password decryption.",
    enabled: true,
    integrationUrl: "https://www.google.com/recaptcha/admin",
  },
  {
    id: 2,
    name: "Google Analytics",
    icon: "fa-chart-bar",
    description:
      "Provides statistics and basic analytical tools for SEO and marketing purposes.",
    enabled: true,
    integrationUrl: "https://analytics.google.com",
  },
  {
    id: 3,
    name: "Google Adsense Code",
    icon: "fa-dollar-sign",
    description:
      "Provides a way for publishers to earn money from their online content.",
    enabled: true,
    integrationUrl: "https://www.google.com/adsense",
  },
  {
    id: 4,
    name: "Google Map",
    icon: "fa-map-marked-alt",
    description:
      "Provides detailed information about geographical regions and sites worldwide.",
    enabled: true,
    integrationUrl: "https://console.cloud.google.com/google/maps-apis",
  },
];

export default function SystemSettings() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    name: "",
    icon: "",
    description: "",
    enabled: true,
    integrationUrl: "",
  });
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PAGE_SIZE);

  // Filter & Pagination
  const filteredData = useMemo(() => {
    return !search.trim()
      ? integrations
      : integrations.filter(
          (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase())
        );
  }, [search, integrations]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.slice(start, end);
  }, [currentPage, itemsPerPage, filteredData]);

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<Integration[]>("SystemSettings");
      if (response.status.code === "S") {
        setIntegrations(response.result);
      } else {
        setIntegrations(defaultIntegrations);
      }
    } catch {
      setIntegrations(defaultIntegrations);
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

  const handleToggleChange = () => {
    setForm((f) => ({ ...f, enabled: !f.enabled }));
  };

  // Add Click
  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      name: "",
      icon: "",
      description: "",
      enabled: true,
      integrationUrl: "",
    });
  };

  // Edit
  const handleEdit = (item: Integration) => {
    setFormMode("edit");
    setForm({
      id: item.id,
      name: item.name,
      icon: item.icon,
      description: item.description,
      enabled: item.enabled,
      integrationUrl: item.integrationUrl || "",
    });
  };

  // Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Name is required.");
      return;
    }

    if (formMode === "add") {
      const newId = integrations.length
        ? Math.max(...integrations.map((i) => i.id)) + 1
        : 1;
      setIntegrations((prev) => [
        ...prev,
        {
          id: newId,
          name: form.name.trim(),
          icon: form.icon.trim() || "fa-circle",
          description: form.description.trim(),
          enabled: form.enabled,
          integrationUrl: form.integrationUrl.trim(),
        },
      ]);
      const totalPages = Math.ceil((filteredData.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === form.id
            ? {
                ...i,
                name: form.name.trim(),
                icon: form.icon.trim(),
                description: form.description.trim(),
                enabled: form.enabled,
                integrationUrl: form.integrationUrl.trim(),
              }
            : i
        )
      );
    }

    setFormMode(null);
  };

  // Delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this integration?")) {
      setIntegrations((prev) => prev.filter((i) => i.id !== id));
      const totalPages = Math.ceil((filteredData.length - 1) / itemsPerPage);
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

  // Table Columns
  const columns: Column[] = [
    { key: "name", label: "Name" },
    {
      key: "icon",
      label: "Icon",
      render: (value) => (
        <i className={`fa ${value || "fa-circle"} text-2xl text-primary`}></i>
      ),
    },
    { key: "description", label: "Description" },
    {
      key: "enabled",
      label: "Enabled",
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
      key: "integrationUrl",
      label: "Integration URL",
      render: (value) =>
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Open
          </a>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
    },
  ];

  // Row Actions
  const rowActions = (row: Integration) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.name}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.name}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center"
      >
        <i className="fa fa-trash" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  // Modal Form
  const modalForm = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., Google Analytics"
          required
        />
      </div>

      <div>
        <label htmlFor="icon" className="block text-sm font-medium mb-1">
          Icon Class
        </label>
        <input
          id="icon"
          name="icon"
          type="text"
          value={form.icon}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., fa-google"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="Brief description of the integration"
        />
      </div>

      <div>
        <label
          htmlFor="integrationUrl"
          className="block text-sm font-medium mb-1"
        >
          Integration URL
        </label>
        <input
          id="integrationUrl"
          name="integrationUrl"
          type="url"
          value={form.integrationUrl}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="https://console.developers.google.com"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Enabled</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={form.enabled}
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
      title="System Settings"
      description="Manage system integrations and services"
      icon="fa fa-cogs"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
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
      modalTitle={formMode === "add" ? "Add Integration" : "Edit Integration"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      loading={loading}
    />
  );
}
