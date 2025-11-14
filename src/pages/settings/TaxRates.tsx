import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1, Column } from "@/pages/PageBase1";

interface TaxRate {
  id: number;
  taxName: string;
  taxRate: number; // stored as number (e.g., 10 for 10%)
  createdOn: string; // YYYY-MM-DD
}

export default function TaxRates() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    taxName: "",
    taxRate: "",
  });
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter & Pagination
  const filteredTaxRates = useMemo(() => {
    return !search.trim()
      ? taxRates
      : taxRates.filter((t) =>
          t.taxName.toLowerCase().includes(search.toLowerCase())
        );
  }, [search, taxRates]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredTaxRates.slice(start, end);
  }, [currentPage, itemsPerPage, filteredTaxRates]);

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<TaxRate[]>("TaxRates");
      if (response.status.code === "S") {
        setTaxRates(response.result);
        setError(null);
      } else {
        setError(response.status.description);
      }
    } catch (err) {
      setError("Failed to load tax rates.");
    } finally {
      setLoading(false);
    }
  };

  // Input Change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Add Click
  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      taxName: "",
      taxRate: "",
    });
  };

  // Edit
  const handleEdit = (tax: TaxRate) => {
    setFormMode("edit");
    setForm({
      id: tax.id,
      taxName: tax.taxName,
      taxRate: tax.taxRate.toString(),
    });
  };

  // Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.taxName.trim()) {
      alert("Tax Name is required.");
      return;
    }

    const rate = parseFloat(form.taxRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      alert("Tax Rate must be a number between 0 and 100.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (formMode === "add") {
      const newId = taxRates.length ? Math.max(...taxRates.map((t) => t.id)) + 1 : 1;
      setTaxRates((prev) => [
        ...prev,
        {
          id: newId,
          taxName: form.taxName.trim(),
          taxRate: rate,
          createdOn: today,
        },
      ]);
      const totalPages = Math.ceil((filteredTaxRates.length + 1) / itemsPerPage);
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setTaxRates((prev) =>
        prev.map((t) =>
          t.id === form.id
            ? {
                ...t,
                taxName: form.taxName.trim(),
                taxRate: rate,
              }
            : t
        )
      );
    }

    setFormMode(null);
  };

  // Delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this tax rate?")) {
      setTaxRates((prev) => prev.filter((t) => t.id !== id));
      const totalPages = Math.ceil((filteredTaxRates.length - 1) / itemsPerPage);
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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Pagination
  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredTaxRates.length / itemsPerPage);
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
    {
      key: "taxName",
      label: "Tax Name",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "taxRate",
      label: "Tax Rates",
      render: (value) => `${value}%`,
    },
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
        return date.toLocaleDateString("en-GB", options); // e.g., 12 Jan 2025
      },
    },
  ];

  // Row Actions
  const rowActions = (row: TaxRate) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.taxName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.taxName}`}
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
      <div>
        <label htmlFor="taxName" className="block text-sm font-medium mb-1">
          Tax Name <span className="text-destructive">*</span>
        </label>
        <input
          id="taxName"
          name="taxName"
          type="text"
          value={form.taxName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., VAT"
          required
        />
      </div>
      <div>
        <label htmlFor="taxRate" className="block text-sm font-medium mb-1">
          Tax Rate (%) <span className="text-destructive">*</span>
        </label>
        <input
          id="taxRate"
          name="taxRate"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={form.taxRate}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., 10"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Enter rate as percentage (0–100)</p>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Tax Rates"
      description="Manage tax rates for your business"
      
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredTaxRates.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Tax Rate" : "Edit Tax Rate"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      loading={loading}
    />
  );
}