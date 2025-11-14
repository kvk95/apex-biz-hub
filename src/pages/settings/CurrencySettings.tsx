import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { PageBase1, Column } from "@/pages/PageBase1";

interface Currency {
  id: number;
  currencyName: string;
  code: string;
  symbol: string;
  exchangeRate: string; // "Default" or number
  createdOn: string; // YYYY-MM-DD
}

export default function CurrencySettings() {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({
    id: null as number | null,
    currencyName: "",
    code: "",
    symbol: "",
    exchangeRate: "",
  });
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter & Pagination
  const filteredCurrencies = useMemo(() => {
    return !search.trim()
      ? currencies
      : currencies.filter(
          (c) =>
            c.currencyName.toLowerCase().includes(search.toLowerCase()) ||
            c.code.toLowerCase().includes(search.toLowerCase()) ||
            c.symbol.includes(search)
        );
  }, [search, currencies]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredCurrencies.slice(start, end);
  }, [currentPage, itemsPerPage, filteredCurrencies]);

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<Currency[]>("CurrencySettings");
      if (response.status.code === "S") {
        setCurrencies(response.result);
        setError(null);
      } else {
        setError(response.status.description);
      }
    } catch (err) {
      setError("Failed to load currencies.");
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

  // Add Click
  const handleAddClick = () => {
    setFormMode("add");
    setForm({
      id: null,
      currencyName: "",
      code: "",
      symbol: "",
      exchangeRate: "",
    });
  };

  // Edit
  const handleEdit = (currency: Currency) => {
    setFormMode("edit");
    setForm({ ...currency });
  };

  // Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.currencyName.trim() || !form.code.trim() || !form.symbol.trim()) {
      alert("Currency Name, Code, and Symbol are required.");
      return;
    }

    if (form.code.length !== 3) {
      alert("Currency Code must be exactly 3 characters (e.g., USD).");
      return;
    }

    const isDefault = form.exchangeRate.toLowerCase() === "default";
    if (
      !isDefault &&
      (isNaN(Number(form.exchangeRate)) || Number(form.exchangeRate) <= 0)
    ) {
      alert("Exchange Rate must be 'Default' or a positive number.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (formMode === "add") {
      const newId = currencies.length
        ? Math.max(...currencies.map((c) => c.id)) + 1
        : 1;
      setCurrencies((prev) => [
        ...prev,
        {
          ...form,
          id: newId,
          exchangeRate: isDefault ? "Default" : form.exchangeRate,
          createdOn: today,
        },
      ]);
      const totalPages = Math.ceil(
        (filteredCurrencies.length + 1) / itemsPerPage
      );
      setCurrentPage(totalPages);
    } else if (formMode === "edit" && form.id !== null) {
      setCurrencies((prev) =>
        prev.map((c) =>
          c.id === form.id
            ? {
                ...form,
                id: form.id!,
                exchangeRate: isDefault ? "Default" : form.exchangeRate,
                createdOn: c.createdOn,
              }
            : c
        )
      );
    }

    setFormMode(null);
  };

  // Delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this currency?")) {
      setCurrencies((prev) => prev.filter((c) => c.id !== id));
      const totalPages = Math.ceil(
        (filteredCurrencies.length - 1) / itemsPerPage
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
    const totalPages = Math.ceil(filteredCurrencies.length / itemsPerPage);
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
    { key: "currencyName", label: "Currency Name" },
    {
      key: "code",
      label: "Code",
      render: (value) => (
        <span className="font-mono font-semibold">{value}</span>
      ),
    },
    {
      key: "symbol",
      label: "Symbol",
      render: (value) => <span className="text-lg">{value}</span>,
    },
    {
      key: "exchangeRate",
      label: "Exchange Rate",
      render: (value) =>
        value === "Default" ? (
          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            Default
          </span>
        ) : (
          value
        ),
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
        return date.toLocaleDateString("en-GB", options); // e.g., 12 Jul 2025
      },
    },
  ];

  // Row Actions
  const rowActions = (row: Currency) => (
    <>
      <button
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.currencyName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.currencyName}`}
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
        <label
          htmlFor="currencyName"
          className="block text-sm font-medium mb-1"
        >
          Currency Name <span className="text-destructive">*</span>
        </label>
        <input
          id="currencyName"
          name="currencyName"
          type="text"
          value={form.currencyName}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., US Dollar"
          required
        />
      </div>
      <div>
        <label htmlFor="code" className="block text-sm font-medium mb-1">
          Code <span className="text-destructive">*</span>
        </label>
        <input
          id="code"
          name="code"
          type="text"
          value={form.code}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring uppercase"
          placeholder="e.g., USD"
          maxLength={3}
          required
        />
        <p className="text-xs text-gray-500 mt-1">3-letter ISO code</p>
      </div>
      <div>
        <label htmlFor="symbol" className="block text-sm font-medium mb-1">
          Symbol <span className="text-destructive">*</span>
        </label>
        <input
          id="symbol"
          name="symbol"
          type="text"
          value={form.symbol}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., $"
          maxLength={5}
          required
        />
      </div>
      <div>
        <label
          htmlFor="exchangeRate"
          className="block text-sm font-medium mb-1"
        >
          Exchange Rate
        </label>
        <input
          id="exchangeRate"
          name="exchangeRate"
          type="text"
          value={form.exchangeRate}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g., 76.154 or 'Default'"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use "Default" for base currency, otherwise enter rate vs base
        </p>
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Currency Settings"
      description="Manage currencies and exchange rates"
      
      onAddClick={handleAddClick}
      onRefresh={handleClear}
      search={search}
      onSearchChange={handleSearchChange}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredCurrencies.length}
      onPageChange={handlePageChange}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={rowActions}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Currency" : "Edit Currency"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      loading={loading}
    />
  );
}
