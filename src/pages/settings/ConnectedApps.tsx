import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1, Column } from "@/pages/PageBase1";
import { DEFAULT_PAGE_SIZE } from "@/constants/constants";

interface ConnectedApp {
  id: number;
  appName: string;
  appIcon: string;
  connectedOn: string;
  status: boolean;
  description: string;
}

export default function ConnectedApps() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    appName: "",
    appIcon: "",
    connectedOn: "",
    status: true,
    description: "",
  });
  const [apps, setApps] = useState<ConnectedApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PAGE_SIZE);

  // Filter & Pagination
  const filteredApps = useMemo(() => {
    return !search.trim()
      ? apps
      : apps.filter(
          (app) =>
            app.appName.toLowerCase().includes(search.toLowerCase()) ||
            app.description.toLowerCase().includes(search.toLowerCase())
        );
  }, [search, apps]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredApps.slice(start, end);
  }, [currentPage, itemsPerPage, filteredApps]);

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<ConnectedApp[]>("ConnectedApps");
      if (response.status.code === "S") {
        setApps(response.result);
        setError(null);
      } else {
        setError(response.status.description);
      }
    } catch {
      setError("Failed to load connected apps.");
    } finally {
      setLoading(false);
    }
  };

  // Input Change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      appName: "",
      appIcon: "",
      connectedOn: new Date().toISOString().split("T")[0],
      status: true,
      description: "",
    });
  };

  // Edit
  const handleEdit = (app: ConnectedApp) => {
    setFormMode("edit");
    setForm({
      id: app.id,
      appName: app.appName,
      appIcon: app.appIcon,
      connectedOn: app.connectedOn,
      status: app.status,
      description: app.description,
    });
  };

  // Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.appName.trim()) {
      alert("App Name is required.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (formMode === "add") {
      const newId = apps.length ? Math.max(...apps.map((a) => a.id)) + 1 : 1;
      setApps((prev) => [
        ...prev,
        {
          id: newId,
          appName: form.appName.trim(),
          appIcon: form.appIcon.trim() || "fa-circle",
          connectedOn: form.connectedOn || today,
          status: form.status,
          description: form.description.trim(),
        },
      ]);
      const totalPages = Math.ceil((filteredApps.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setApps((prev) =>
        prev.map((a) =>
          a.id === form.id
            ? {
                ...a,
                appName: form.appName.trim(),
                appIcon: form.appIcon.trim(),
                connectedOn: form.connectedOn,
                status: form.status,
                description: form.description.trim(),
              }
            : a
        )
      );
    }

    setFormMode(null);
  };

  // Delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this app?")) {
      setApps((prev) => prev.filter((a) => a.id !== id));
      const totalPages = Math.ceil((filteredApps.length - 1) / itemsPerPage);
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
    const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // Table Columns
  const columns: Column[] = [ 
    { key: "appName", label: "App Name" },
    {
      key: "appIcon",
      label: "Icon",
      render: (value) => (
        <i className={`fab ${value || "fa-circle"} text-2xl text-blue-600`}></i>
      ),
    },
    {
      key: "connectedOn",
      label: "Connected On",
      render: (value) => {
        const d = new Date(value);
        return d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
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
    { key: "description", label: "Description" },
  ];

  // Row Actions
  const rowActions = (row: ConnectedApp) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.appName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.appName}`}
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
      {/* App Name */}
      <div>
        <label htmlFor="appName" className="block text-sm font-medium mb-1">
          App Name <span className="text-destructive">*</span>
        </label>
        <input
          id="appName"
          name="appName"
          type="text"
          value={form.appName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., Google Drive"
          required
        />
      </div>

      {/* App Icon */}
      <div>
        <label htmlFor="appIcon" className="block text-sm font-medium mb-1">
          Icon Class
        </label>
        <input
          id="appIcon"
          name="appIcon"
          type="text"
          value={form.appIcon}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., fa-google-drive"
        />
      </div>

      {/* Connected On */}
      <div>
        <label htmlFor="connectedOn" className="block text-sm font-medium mb-1">
          Connected On
        </label>
        <input
          id="connectedOn"
          name="connectedOn"
          type="date"
          value={form.connectedOn}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <input
          id="description"
          name="description"
          type="text"
          value={form.description}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., Cloud storage integration"
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
      title="Connected Apps"
      description="Manage third-party app integrations"
      icon="fa fa-plug"
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredApps.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={
        formMode === "add" ? "Add Connected App" : "Edit Connected App"
      }
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      loading={loading}
    />
  );
}
