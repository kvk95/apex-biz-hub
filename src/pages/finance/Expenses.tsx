import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { EXPENSE_HEADS, PAYMENT_TYPES } from "@/constants/constants";

interface ExpenseItem {
  id: number;
  date: string;
  expenseHead: string;
  amount: number;
  paymentType: string;
  note: string;
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: ExpenseItem) => JSX.Element;
  align?: "left" | "center" | "right";
}

export default function Expenses() {
  const [data, setData] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterExpenseHead, setFilterExpenseHead] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<ExpenseItem>({
    id: 0,
    date: "",
    expenseHead: "",
    amount: 0,
    paymentType: "",
    note: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<ExpenseItem[]>("Expenses");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.expenseHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.paymentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.note || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || filterStatus === "Custom Logic"; // Placeholder for status logic
    const matchesExpenseHead =
      !filterExpenseHead || item.expenseHead === filterExpenseHead;
    return matchesSearch && matchesStatus && matchesExpenseHead;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["amount"].includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.date ||
      !form.expenseHead ||
      !form.amount ||
      !form.paymentType ||
      form.amount <= 0
    ) {
      alert("Please fill all required fields with a positive amount.");
      return;
    }
    if (formMode === "add") {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [{ ...form, id: newId }, ...prev]);
    } else if (formMode === "edit" && form.id !== 0) {
      setData((prev) =>
        prev.map((item) => (item.id === form.id ? { ...item, ...form } : item))
      );
    }
    setFormMode(null);
    setForm({
      id: 0,
      date: "",
      expenseHead: "",
      amount: 0,
      paymentType: "",
      note: "",
    });
  };

  const handleEdit = (id: number) => {
    const item = data.find((e) => e.id === id);
    if (item) {
      setForm(item);
      setFormMode("edit");
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setData((prev) => prev.filter((e) => e.id !== id));
      if (
        (currentPage - 1) * itemsPerPage >= filteredData.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setFilterExpenseHead("");
    setForm({
      id: 0,
      date: "",
      expenseHead: "",
      amount: 0,
      paymentType: "",
      note: "",
    });
    setCurrentPage(1);
  };

  const handleReport = () => {
    const total = data.reduce((acc, cur) => acc + cur.amount, 0);
    alert(
      `Report:\nTotal Expenses: ${data.length}\nTotal Amount: ₹${total.toFixed(
        2
      )}`
    );
  };

  const columns: Column[] = [ 
    { key: "date", label: "Date", align: "left" },
    { key: "expenseHead", label: "Expense Head", align: "left" },
    {
      key: "amount",
      label: "Amount",
      align: "left",
      render: (v) => `₹ ${v.toFixed(2)}`,
    },
    { key: "paymentType", label: "Payment Type", align: "left" },
    { key: "note", label: "Note", align: "left" },
  ];

  const rowActions = (row: ExpenseItem) => (
    <>
      <button
        onClick={() => handleEdit(row.id)}
        aria-label={`Edit expense ${row.expenseHead}`}
        className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
        <span className="sr-only">Edit</span>
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete expense ${row.expenseHead}`}
        className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
      >
        <i className="fa fa-trash" aria-hidden="true"></i>
        <span className="sr-only">Delete</span>
      </button>
    </>
  );

  const customFilters = () => (
    <div className="flex items-center gap-4">
  {/* Left: Search input takes full available space */}
  <div className="flex-1">
    <input
      type="text"
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
      className="w-full px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      aria-label="Search"
    />
  </div>

  {/* Right: Filters aligned to the right */}
  <div className="flex items-center gap-2">
    <select
      value={filterStatus}
      onChange={(e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1);
      }}
      className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      aria-label="Status"
    >
      <option value="All">Status</option>
      <option value="Custom Logic">Custom Logic</option>
    </select>

    <select
      value={filterExpenseHead}
      onChange={(e) => {
        setFilterExpenseHead(e.target.value);
        setCurrentPage(1);
      }}
      className="px-3 py-1.5 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      aria-label="Category"
    >
      <option value="">Category</option>
      {EXPENSE_HEADS.map((head) => (
        <option key={head} value={head}>
          {head}
        </option>
      ))}
    </select>
  </div>
</div>

  );

  const modalForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Date <span className="text-destructive">*</span>
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Expense Head <span className="text-destructive">*</span>
        </label>
        <select
          name="expenseHead"
          value={form.expenseHead}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          required
        >
          <option value="">Select Expense Head</option>
          {EXPENSE_HEADS.map((head) => (
            <option key={head} value={head}>
              {head}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Amount <span className="text-destructive">*</span>
        </label>
        <input
          type="number"
          name="amount"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          placeholder="0.00"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Payment Type <span className="text-destructive">*</span>
        </label>
        <select
          name="paymentType"
          value={form.paymentType}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background focus:ring-2 focus:ring-ring"
          required
        >
          <option value="">Select Payment Type</option>
          {PAYMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Note</label>
        <textarea
          name="note"
          rows={1}
          value={form.note}
          onChange={handleInputChange}
          className="w-full border border-input rounded px-3 py-2 bg-background resize-none focus:ring-2 focus:ring-ring"
          placeholder="Optional note"
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Expenses"
      description="Manage expense records."
      icon="fa fa-money-bill-wave"
      onAddClick={() => {
        setForm({
          id: 0,
          date: new Date().toISOString().slice(0, 10), // 2025-10-25
          expenseHead: "",
          amount: 0,
          paymentType: "",
          note: "",
        });
        setFormMode("add");
      }}
      onRefresh={handleClear}
      onReport={handleReport}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={setItemsPerPage}
      tableColumns={columns}
      tableData={paginatedData}
      rowActions={(row) => rowActions(row as ExpenseItem)}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle={formMode === "add" ? "Add Expense" : "Edit Expense"}
      modalForm={modalForm}
      onFormSubmit={handleFormSubmit}
      customFilters={customFilters}
    />
  );
}
