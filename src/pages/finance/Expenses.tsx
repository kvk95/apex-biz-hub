import React, { useState, useEffect, useMemo, useRef } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1, Column } from "@/pages/PageBase1";
import { renderStatusBadge } from "@/utils/tableUtils";
import {
  AutoCompleteTextBox,
  AutoCompleteItem,
} from "@/components/Search/AutoCompleteTextBox";
import { SearchInput } from "@/components/Search/SearchInput";
import { EXPENSE_HEADS, EXPENSE_HEADS_STATUSES } from "@/constants/constants";

// === Types ===
type ExpenseHead = (typeof EXPENSE_HEADS)[number];
type ExpenseStatus = (typeof EXPENSE_HEADS_STATUSES)[number];

type Expense = {
  id: number;
  reference: string;
  expenseName: string;
  category: ExpenseHead;
  description: string;
  date: string;
  amount: number;
  status: ExpenseStatus;
};

// === Description Modal ===
const DescriptionModal: React.FC<{
  isOpen: boolean;
  description: string;
  onClose: () => void;
}> = ({ isOpen, description, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="description-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 id="description-modal-title" className="text-lg font-semibold">
            Expense Description
          </h3>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 text-xl"
            aria-label="Close description modal"
            type="button"
          >
            <i className="fa fa-window-close" aria-hidden="true"></i>
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {description || "No description provided."}
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/80"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Expenses() {
  /* ---------- state ---------- */
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ExpenseHead[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ExpenseHead | "All">(
    "All"
  );
  const [selectedStatus, setSelectedStatus] = useState<ExpenseStatus | "All">(
    "All"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [descriptionModal, setDescriptionModal] = useState<{
    open: boolean;
    desc: string;
  }>({
    open: false,
    desc: "",
  });
  const categorySearchTimeout = useRef<NodeJS.Timeout | null>(null);

  const [form, setForm] = useState({
    id: null as number | null,
    expenseName: "",
    description: "",
    category: "" as ExpenseHead,
    date: new Date().toISOString().split("T")[0],
    amount: "",
    status: "Pending" as ExpenseStatus,
  });

  /* ---------- load data ---------- */
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const res = await apiService.get<Expense[]>("Expenses");
      if (res.status.code === "S") {
        console.log("Expenses loaded:", res.result.length, "records");
        setExpenses(res.result);
      }
    } catch (err) {
      console.error("Expenses load error:", err);
    }
  };

  /* ---------- filtering ---------- */
  const filteredData = useMemo(() => {
    let result = [...expenses];

    if (search.trim()) {
      result = result.filter(
        (e) =>
          e.reference.toLowerCase().includes(search.toLowerCase()) ||
          e.expenseName.toLowerCase().includes(search.toLowerCase()) ||
          e.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((e) => e.category === selectedCategory);
    }

    if (selectedStatus !== "All") {
      result = result.filter((e) => e.status === selectedStatus);
    }

    result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return result;
  }, [expenses, search, selectedCategory, selectedStatus]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  /* ---------- derived ---------- */
  const categoryOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(expenses.map((e) => e.category)))];
  }, [expenses]);

  /* ---------- handlers ---------- */
  const handleAddClick = () => {
    console.log("Expenses: Opening Add modal");
    setFormMode("add");
    setForm({
      id: null,
      expenseName: "",
      description: "",
      category: "" as ExpenseHead,
      date: new Date().toISOString().split("T")[0],
      amount: "",
      status: "Pending",
    });
  };

  const handleEdit = (expense: Expense) => {
    console.log("Expenses: Editing expense ID", expense.id);
    setFormMode("edit");
    setForm({
      id: expense.id,
      expenseName: expense.expenseName,
      description: expense.description,
      category: expense.category,
      date: expense.date,
      amount: expense.amount.toString(),
      status: expense.status,
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this expense?")) {
      console.log("Expenses: Deleting expense ID", id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleClear = () => {
    console.log("Expenses: Clearing filters");
    setSearch("");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setCurrentPage(1);
  };

  const handleReport = () => {
    console.log("Expenses: Generating PDF report");
    alert("PDF Report Generated!");
  };

  const handleImport = () => {
    console.log("Expenses: Import XLS clicked");
    alert("Import Expense (XLS) - Not implemented");
  };

  /* ---------- async autocomplete: CATEGORY ---------- */
  const handleCategorySearch = (query: string) => {
    if (categorySearchTimeout.current)
      clearTimeout(categorySearchTimeout.current);

    setForm((prev) => ({ ...prev, category: query as ExpenseHead }));

    if (!query.trim()) {
      setFilteredCategories([]);
      return;
    }

    categorySearchTimeout.current = setTimeout(() => {
      const filtered = EXPENSE_HEADS.filter((c) =>
        c.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategories(filtered);
      console.log("Expenses: Category search", {
        query,
        results: filtered.length,
      });
    }, 200);
  };

  const handleCategorySelect = (item: AutoCompleteItem) => {
    const selected = EXPENSE_HEADS.find((_, idx) => idx === item.id);
    if (selected) {
      setForm((prev) => ({ ...prev, category: selected }));
      setFilteredCategories([]);
      console.log("Expenses: Category selected", selected);
    }
  };

  /* ---------- description modal ---------- */
  const openDescription = (desc: string) => {
    console.log("Expenses: Opening description modal");
    setDescriptionModal({ open: true, desc });
  };

  const closeDescription = () => {
    console.log("Expenses: Closing description modal");
    setDescriptionModal({ open: false, desc: "" });
  };

  /* ---------- submit ---------- */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.expenseName.trim() ||
      !form.category ||
      !form.date ||
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      alert("Please fill all required fields with valid values.");
      return;
    }

    const amount = parseFloat(form.amount);
    const maxId = expenses.length ? Math.max(...expenses.map((e) => e.id)) : 0;
    const maxRef = expenses.length
      ? Math.max(...expenses.map((e) => parseInt(e.reference.slice(2)) || 0))
      : 0;

    const newExpense: Expense = {
      id: formMode === "add" ? maxId + 1 : form.id!,
      reference: `EX${String(maxRef + 1).padStart(3, "0")}`,
      expenseName: form.expenseName.trim(),
      category: form.category,
      description: form.description,
      date: form.date,
      amount,
      status: form.status,
    };

    console.log("Expenses: Submitting", formMode, newExpense);

    if (formMode === "add") {
      setExpenses((prev) => [newExpense, ...prev]);
    } else {
      setExpenses((prev) =>
        prev.map((e) => (e.id === newExpense.id ? newExpense : e))
      );
    }

    setFormMode(null);
  };

  /* ---------- table columns (NO DESCRIPTION COLUMN) ---------- */
  const columns: Column[] = [
    { key: "reference", label: "Reference", align: "left" },
    { key: "expenseName", label: "Expense Name", align: "left" },
    { key: "category", label: "Category", align: "left" },
    { key: "date", label: "Date", align: "left" },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      render: (v: number) => `₹${v.toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      render: renderStatusBadge,
      align: "center",
    },
  ];

  /* ---------- row actions (EYE IS 1ST) ---------- */
  const rowActions = (row: Expense) => (
    <>
      {/* 1. Eye - View Description */}
      <button
        type="button"
        onClick={() => openDescription(row.description)}
        aria-label={`View description for ${row.expenseName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
        title="View description"
      >
        <i className="fa fa-eye" aria-hidden="true"></i>
        <span className="sr-only">View description</span>
      </button>

      {/* 2. Edit */}
      <button
        type="button"
        onClick={() => handleEdit(row)}
        aria-label={`Edit ${row.expenseName}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-edit" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>

      {/* 3. Delete */}
      <button
        type="button"
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete ${row.expenseName}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash-can-xmark" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  /* ---------- custom filters ---------- */
  const customFilters = () => (
    <div className="grid grid-cols-2 w-full justify-stretch px-3">
      <div className="flex justify-start  gap-2">
        <SearchInput
          className=""
          value={search}
          placeholder="Search by Reference, Name or Description..."
          onSearch={(query) => {
            setSearch(query);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as any)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[120px]"
          aria-label="Filter by Category"
        >
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[120px]"
          aria-label="Filter by Status"
        >
          <option value="All">Status</option>
          {EXPENSE_HEADS_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  /* ---------- modal form ---------- */
  const modalForm = () => (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">
          Expense <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.expenseName}
          onChange={(e) =>
            setForm((p) => ({ ...p, expenseName: e.target.value }))
          }
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Electricity Payment"
          required
          aria-required="true"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          rows={3}
          maxLength={360}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Electricity Bill"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {form.description.split(" ").filter(Boolean).length}/60 words
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <AutoCompleteTextBox
            value={form.category}
            onSearch={handleCategorySearch}
            onSelect={handleCategorySelect}
            items={filteredCategories.map((head, idx) => ({
              id: idx,
              display: head,
            }))}
            placeholder="Search category..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            required
            aria-required="true"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
            <input
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm((p) => ({ ...p, amount: e.target.value }))
              }
              step="0.01"
              min="0"
              className="w-full pl-8 border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="200.00"
              required
              aria-required="true"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                status: e.target.value as ExpenseStatus,
              }))
            }
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {EXPENSE_HEADS_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );

  /* ---------- render ---------- */
  return (
    <>
      <PageBase1
        title="Expenses"
        description="Manage Your Expenses"
        icon="fa-light fa-money-bill-wave"
        onAddClick={handleAddClick}
        onRefresh={handleClear}
        onReport={handleReport}
        search={search}
        onSearchChange={(value) => {
          setSearch( value);
          setCurrentPage(1);
        }}
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
        modalTitle={formMode === "add" ? "Add Expense" : "Edit Expense"}
        modalForm={modalForm}
        onFormSubmit={handleFormSubmit}
        customFilters={customFilters}
        loading={loading}
      >
        <button
          type="button"
          onClick={handleImport}
          className="ml-2 bg-green-700 text-white py-2 px-3 rounded hover:bg-green-600 transition-colors"
          title="Import Expense"
        >
          <i className="fa fa-upload me-2" aria-hidden="true"></i>
          Import XLS
        </button>
      </PageBase1>

      <DescriptionModal
        isOpen={descriptionModal.open}
        description={descriptionModal.desc}
        onClose={closeDescription}
      />
    </>
  );
}
