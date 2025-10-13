import React, { useMemo, useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const expenseHeads = [
  "Office Rent",
  "Electricity Bill",
  "Internet",
  "Stationery",
  "Travel",
  "Maintenance",
  "Software Subscription",
  "Cleaning",
  "Miscellaneous",
  "Snacks",
  "Printing",
  "Courier",
];

const paymentTypes = ["Cash", "Cheque"];

export default function Expenses() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state
  const [form, setForm] = useState({
    date: "",
    expenseHead: "",
    amount: "",
    paymentType: "",
    note: "",
  });

  // Expenses list state
  const [expenses, setExpenses] = useState([]);

  // Loading and error state for API
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(expenses.length / itemsPerPage);

  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return expenses.slice(start, start + itemsPerPage);
  }, [currentPage, expenses]);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Expenses");
    if (response.status.code === "S") {
      setData(response.result);
      setExpenses(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      date: "",
      expenseHead: "",
      amount: "",
      paymentType: "",
      note: "",
    });
    setEditingId(null);
  };

  const handleSave = () => {
    if (
      !form.date ||
      !form.expenseHead ||
      !form.amount ||
      !form.paymentType
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingId !== null) {
      // Update existing
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                date: form.date,
                expenseHead: form.expenseHead,
                amount: Number(form.amount),
                paymentType: form.paymentType,
                note: form.note,
              }
            : item
        )
      );
    } else {
      // Add new
      const newExpense = {
        id: expenses.length ? expenses[expenses.length - 1].id + 1 : 1,
        date: form.date,
        expenseHead: form.expenseHead,
        amount: Number(form.amount),
        paymentType: form.paymentType,
        note: form.note,
      };
      setExpenses((prev) => [...prev, newExpense]);
      // If adding new item increases total pages, move to last page
      if ((expenses.length + 1) > itemsPerPage * totalPages) {
        setCurrentPage(totalPages + 1);
      }
    }
    resetForm();
  };

  const handleEdit = (id: number) => {
    const expense = expenses.find((e) => e.id === id);
    if (!expense) return;
    setForm({
      date: expense.date,
      expenseHead: expense.expenseHead,
      amount: expense.amount.toString(),
      paymentType: expense.paymentType,
      note: expense.note,
    });
    setEditingId(id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      // Adjust current page if needed
      if (
        (expenses.length - 1) <= (currentPage - 1) * itemsPerPage &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
      if (editingId === id) {
        resetForm();
      }
    }
  };

  const handleRefresh = () => {
    loadData();
    resetForm();
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, just alert total expenses and count
    const total = expenses.reduce((acc, cur) => acc + cur.amount, 0);
    alert(`Report:\nTotal Expenses: ${expenses.length}\nTotal Amount: $${total.toFixed(2)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <title>Expenses - Dreams POS</title>

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">Expenses</h1>

        {/* Form Section */}
        <section className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Expense</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="grid grid-cols-1 md:grid-cols-6 gap-4"
          >
            {/* Date */}
            <div className="flex flex-col">
              <label htmlFor="date" className="mb-1 font-medium text-gray-700">
                Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={form.date}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Expense Head */}
            <div className="flex flex-col">
              <label
                htmlFor="expenseHead"
                className="mb-1 font-medium text-gray-700"
              >
                Expense Head <span className="text-red-600">*</span>
              </label>
              <select
                id="expenseHead"
                name="expenseHead"
                value={form.expenseHead}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Expense Head</option>
                {expenseHeads.map((head) => (
                  <option key={head} value={head}>
                    {head}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="flex flex-col">
              <label htmlFor="amount" className="mb-1 font-medium text-gray-700">
                Amount <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Payment Type */}
            <div className="flex flex-col">
              <label
                htmlFor="paymentType"
                className="mb-1 font-medium text-gray-700"
              >
                Payment Type <span className="text-red-600">*</span>
              </label>
              <select
                id="paymentType"
                name="paymentType"
                value={form.paymentType}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Payment Type</option>
                {paymentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div className="flex flex-col md:col-span-2">
              <label htmlFor="note" className="mb-1 font-medium text-gray-700">
                Note
              </label>
              <textarea
                id="note"
                name="note"
                rows={1}
                value={form.note}
                onChange={handleInputChange}
                placeholder="Optional note"
                className="border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-end space-x-3 md:col-span-6">
              <button
                type="submit"
                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fas fa-save mr-2"></i>
                {editingId !== null ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <i className="fas fa-times mr-2"></i> Cancel
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <i className="fas fa-sync-alt mr-2"></i> Refresh
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <i className="fas fa-file-alt mr-2"></i> Report
              </button>
            </div>
          </form>
        </section>

        {/* Expenses Table Section */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Expenses List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-md">
              <thead className="bg-indigo-600 text-white text-left">
                <tr>
                  <th className="px-4 py-3 border-r border-indigo-500 w-24">#</th>
                  <th className="px-4 py-3 border-r border-indigo-500 w-32">Date</th>
                  <th className="px-4 py-3 border-r border-indigo-500">Expense Head</th>
                  <th className="px-4 py-3 border-r border-indigo-500 w-28 text-right">Amount</th>
                  <th className="px-4 py-3 border-r border-indigo-500 w-32">Payment Type</th>
                  <th className="px-4 py-3 border-r border-indigo-500">Note</th>
                  <th className="px-4 py-3 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No expenses found.
                    </td>
                  </tr>
                )}
                {paginatedExpenses.map((expense, idx) => (
                  <tr
                    key={expense.id}
                    className={
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }
                  >
                    <td className="px-4 py-3 border-b border-gray-200">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{expense.date}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{expense.expenseHead}</td>
                    <td className="px-4 py-3 border-b border-gray-200 text-right">${expense.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{expense.paymentType}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{expense.note}</td>
                    <td className="px-4 py-3 border-b border-gray-200 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(expense.id)}
                        title="Edit"
                        className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        title="Delete"
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <nav
            className="mt-4 flex justify-between items-center"
            aria-label="Table navigation"
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Previous page"
            >
              <i className="fas fa-chevron-left mr-2"></i> Prev
            </button>

            <ul className="inline-flex -space-x-px text-sm font-medium">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => setCurrentPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`px-3 py-1 border border-gray-300 ${
                      page === currentPage
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    } focus:outline-none`}
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Next page"
            >
              Next <i className="fas fa-chevron-right ml-2"></i>
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
}