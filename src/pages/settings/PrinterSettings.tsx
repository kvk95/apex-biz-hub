import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1, Column } from "@/pages/PageBase1";
import { STATUSES } from "@/constants/constants";
import { renderStatusBadge } from "@/utils/tableUtils";

const CONNECTION_TYPES = ["USB", "Network", "Bluetooth", "WiFi"] as const;
type ConnectionType = typeof CONNECTION_TYPES[number];

interface Printer {
  id: number;
  printerName: string;
  connectionType: ConnectionType;
  ipAddress: string;
  port: string;
  status: (typeof STATUSES)[number];
}

export default function PrinterSettings() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    printerName: "",
    connectionType: CONNECTION_TYPES[0],
    ipAddress: "",
    port: "",
    status: STATUSES[0],
  });

  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredPrinters = useMemo(() => {
    const result = !search.trim()
      ? printers
      : printers.filter((p) =>
          p.printerName.toLowerCase().includes(search.toLowerCase())
        );
    console.log("Printers filteredPrinters:", result, { search });
    return result;
  }, [search, printers]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const result = filteredPrinters.slice(start, end);
    console.log("Printers paginatedData:", result, {
      currentPage,
      start,
      end,
      itemsPerPage,
      totalItems: filteredPrinters.length,
    });
    return result;
  }, [currentPage, itemsPerPage, filteredPrinters]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Printer[]>("PrinterSettings");
    if (response.status.code === "S") {
      setPrinters(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
    console.log("Printers loadData:", { data: response.result });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      printerName: "",
      connectionType: CONNECTION_TYPES[0],
      ipAddress: "",
      port: "",
      status: STATUSES[0],
    });
    console.log("Printers handleAddClick: Modal opened for add");
  };

  const handleEdit = (printer: Printer) => {
    setFormMode("edit");
    setForm({ ...printer });
    console.log("Printers handleEdit: Modal opened for edit", { printer });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.printerName.trim() ||
      !form.connectionType.trim() ||
      !form.ipAddress.trim() ||
      !form.port.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }
    const portNum = Number(form.port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      alert("Port must be a valid number between 1 and 65535.");
      return;
    }
    if (formMode === "add") {
      const newId = printers.length
        ? Math.max(...printers.map((p) => p.id)) + 1
        : 1;
      setPrinters((prev) => [...prev, { ...form, id: newId }]);
      const totalPages = Math.ceil((filteredPrinters.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setPrinters((prev) =>
        prev.map((p) => (p.id === form.id ? { ...form, id: form.id } : p))
      );
    }
    setFormMode(null);
    console.log("Printers handleFormSubmit:", { form, formMode });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this printer?")) {
      setPrinters((prev) => prev.filter((p) => p.id !== id));
      const totalPages = Math.ceil((filteredPrinters.length - 1) / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
        console.log("Printers handleDelete: Adjusted to last page", {
          id,
          currentPage,
          totalPages,
        });
      } else if (totalPages === 0) {
        setCurrentPage(1);
        console.log("Printers handleDelete: Reset to page 1 (no data)", {
          id,
          currentPage,
          totalPages,
        });
      }
      console.log("Printers handleDelete:", { id, totalPages });
    }
  };

  const handleClear = () => {
    loadData();
    setFormMode(null);
    setSearch("");
    setCurrentPage(1);
    console.log("Printers handleClear");
  };

  const handleReport = () => {
    alert("Printer Report:\n\n" + JSON.stringify(printers, null, 2));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    console.log("Printers handleSearchChange:", {
      search: e.target.value,
      currentPage: 1,
    });
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredPrinters.length / itemsPerPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      console.log("Printers handlePageChange:", {
        page,
        totalPages,
        currentPage,
      });
    } else {
      console.warn("Printers handlePageChange: Invalid page or same page", {
        page,
        totalPages,
        currentPage,
      });
    }
  };

  const columns: Column[] = [
    {
      key: "index",
      label: "#",
      render: (_, row, idx) => (currentPage - 1) * itemsPerPage + idx + 1,
    },
    {
      key: "printerName",
      label: "Printer Name",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: "connectionType",
      label: "Connection Type",
    },
    {
      key: "ipAddress",
      label: "IP Address",
    },
    {
      key: "port",
      label: "Port",
    },
    { key: "status", label: "Status", render: renderStatusBadge },
  ];

  const rowActions = (row: Printer) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit printer ${row.printerName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit printer</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete printer ${row.printerName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete printer</span>
      </button>
    </>
  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="printerName" className="block text-sm font-medium mb-1">
          Printer Name <span className="text-destructive">*</span>
        </label>
        <input
          id="printerName"
          name="printerName"
          type="text"
          value={form.printerName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter printer name"
          required
        />
      </div>
      <div>
        <label htmlFor="connectionType" className="block text-sm font-medium mb-1">
          Connection Type <span className="text-destructive">*</span>
        </label>
        <select
          id="connectionType"
          name="connectionType"
          value={form.connectionType}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
        >
          {CONNECTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
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
          placeholder="Enter IP address (e.g., 192.168.1.100)"
          required
        />
      </div>
      <div>
        <label htmlFor="port" className="block text-sm font-medium mb-1">
          Port <span className="text-destructive">*</span>
        </label>
        <input
          id="port"
          name="port"
          type="number"
          min={1}
          max={65535}
          value={form.port}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter port (e.g., 9100)"
          required
        />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Printer Settings"
      description="Manage printer settings for your application."
      icon="fa fa-print"
      onAddClick={handleAddClick}
      onRefresh={handleClear} 
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredPrinters.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Printer" : "Edit Printer"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
    />
  );
}