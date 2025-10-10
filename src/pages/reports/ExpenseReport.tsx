import React, { useState, useMemo } from "react";

type Expense = {
  id: number;
  date: string;
  expenseHead: string;
  paymentType: string;
  amount: number;
  description: string;
};

const expenseHeads = [
  "Office Rent",
  "Electricity Bill",
  "Internet Bill",
  "Travel Expenses",
  "Stationery",
  "Miscellaneous",
];

const paymentTypes = ["Cash", "Cheque", "Card", "Online"];

const initialExpenses: Expense[] = [
  {
    id: 1,
    date: "2023-08-01",
    expenseHead: "Office Rent",
    paymentType: "Cheque",
    amount: 1200,
    description: "Monthly office rent payment",
  },
  {
    id: 2,
    date: "2023-08-03",
    expenseHead: "Electricity Bill",
    paymentType: "Online",
    amount: 300,
    description: "Electricity bill for July",
  },
  {
    id: 3,
    date: "2023-08-05",
    expenseHead: "Internet Bill",
    paymentType: "Card",
    amount: 150,
    description: "Monthly internet subscription",
  },
  {
    id: 4,
    date: "2023-08-10",
    expenseHead: "Travel Expenses",
    paymentType: "Cash",
    amount: 75,
    description: "Taxi fare for client meeting",
  },
  {
    id: 5,
    date: "2023-08-12",
    expenseHead: "Stationery",
    paymentType: "Cash",
    amount: 45,
    description: "Office stationery purchase",
  },
  {
    id: 6,
    date: "2023-08-15",
    expenseHead: "Miscellaneous",
    paymentType: "Cheque",
    amount: 100,
    description: "Miscellaneous office expenses",
  },
  {
    id: 7,
    date: "2023-08-18",
    expenseHead: "Office Rent",
    paymentType: "Cheque",
    amount: 1200,
    description: "Monthly office rent payment",
  },
  {
    id: 8,
    date: "2023-08-20",
    expenseHead: "Electricity Bill",
    paymentType: "Online",
    amount: 310,
    description: "Electricity bill for August",
  },
  {
    id: 9,
    date: "2023-08-22",
    expenseHead: "Internet Bill",
    paymentType: "Card",
    amount: 160,
    description: "Monthly internet subscription",
  },
  {
    id: 10,
    date: "2023-08-25",
    expenseHead: "Travel Expenses",
    paymentType: "Cash",
    amount: 90,
    description: "Taxi fare for office supplies",
  },
  {
    id: 11,
    date: "2023-08-28",
    expenseHead: "Stationery",
    paymentType: "Cash",
    amount: 60,
    description: "Office stationery purchase",
  },
  {
    id: 12,
    date: "2023-08-30",
    expenseHead: "Miscellaneous",
    paymentType: "Cheque",
    amount: 120,
    description: "Miscellaneous office expenses",
  },
];

const PAGE_SIZE = 5;

export default function ExpenseReport() {
  // Title as per reference page
  React.useEffect(() => {
    document.title = "Expense Report";
  }, []);

  // State for form inputs
  const [date, setDate] = useState("");
  const [expenseHead, setExpenseHead] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Expenses state
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);

  // Filtered and paginated expenses for current page
  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return expenses.slice(start, start + PAGE_SIZE);
  }, [expenses, currentPage]);

  const totalPages = Math.ceil(expenses.length / PAGE_SIZE);

  // Handlers
  const resetForm = () => {
    setDate("");
    setExpenseHead("");
    setPaymentType("");
    setAmount("");
    setDescription("");
    setEditingId(null);
  };

  const handleAddOrUpdate = () => {
    if (!date || !expenseHead || !paymentType || !amount) {
      alert("Please fill in all required fields.");
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    if (editingId !== null) {
      // Update existing
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === editingId
            ? {
                ...exp,
                date,
                expenseHead,
                paymentType,
                amount: amt,
                description,
              }
            : exp
        )
      );
      alert("Expense updated successfully.");
    } else {
      // Add new
      const newExpense: Expense = {
        id: expenses.length ? expenses[expenses.length - 1].id + 1 : 1,
        date,
        expenseHead,
        paymentType,
        amount: amt,
        description,
      };
      setExpenses((prev) => [...prev, newExpense]);
      alert("Expense added successfully.");
      // If new page needed, go to last page
      const newTotalPages = Math.ceil((expenses.length + 1) / PAGE_SIZE);
      if (newTotalPages > totalPages) setCurrentPage(newTotalPages);
    }
    resetForm();
  };

  const handleEdit = (id: number) => {
    const exp = expenses.find((e) => e.id === id);
    if (!exp) return;
    setDate(exp.date);
    setExpenseHead(exp.expenseHead);
    setPaymentType(exp.paymentType);
    setAmount(exp.amount.toString());
    setDescription(exp.description);
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      // Adjust page if last item on last page deleted
      const newTotalPages = Math.ceil((expenses.length - 1) / PAGE_SIZE);
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages || 1);
    }
  };

  const handleRefresh = () => {
    if (window.confirm("Are you sure you want to refresh and reset all data?")) {
      setExpenses(initialExpenses);
      resetForm();
      setCurrentPage(1);
    }
  };

  // Calculate total amount for current page
  const totalAmount = paginatedExpenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Expense Report</h1>

      {/* Form Section */}
      <section className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add / Edit Expense</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddOrUpdate();
          }}
          className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end"
          noValidate
        >
          {/* Date */}
          <div className="flex flex-col">
            <label htmlFor="date" className="mb-1 font-medium text-gray-700">
              Date <span className="text-red-600">*</span>
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Expense Head */}
          <div className="flex flex-col">
            <label htmlFor="expenseHead" className="mb-1 font-medium text-gray-700">
              Expense Head <span className="text-red-600">*</span>
            </label>
            <select
              id="expenseHead"
              value={expenseHead}
              onChange={(e) => setExpenseHead(e.target.value)}
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

          {/* Payment Type */}
          <div className="flex flex-col">
            <label htmlFor="paymentType" className="mb-1 font-medium text-gray-700">
              Payment Type <span className="text-red-600">*</span>
            </label>
            <select
              id="paymentType"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
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

          {/* Amount */}
          <div className="flex flex-col">
            <label htmlFor="amount" className="mb-1 font-medium text-gray-700">
              Amount <span className="text-red-600">*</span>
            </label>
            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="description" className="mb-1 font-medium text-gray-700">
              Description
            </label>
            <input
              id="description"
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 md:col-span-6 justify-start mt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {editingId !== null ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-red-500"
              title="Refresh and reset data"
            >
              Refresh
            </button>
          </div>
        </form>
      </section>

      {/* Expense Table Section */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Expense List</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Expense Head
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Payment Type
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Amount
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                  Description
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No expenses found.
                  </td>
                </tr>
              )}
              {paginatedExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                    {exp.date}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                    {exp.expenseHead}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                    {exp.paymentType}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700 text-right">
                    ${exp.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border-r border-gray-300 text-sm text-gray-700">
                    {exp.description}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(exp.id)}
                      className="text-indigo-600 hover:text-indigo-900 font-semibold focus:outline-none"
                      aria-label={`Edit expense ${exp.id}`}
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="text-red-600 hover:text-red-900 font-semibold focus:outline-none"
                      aria-label={`Delete expense ${exp.id}`}
                      title="Delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold text-gray-800">
                <td colSpan={3} className="px-4 py-2 text-right">
                  Total:
                </td>
                <td className="px-4 py-2 text-right">${totalAmount.toFixed(2)}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <nav
          className="mt-4 flex justify-center items-center space-x-2"
          aria-label="Pagination Navigation"
        >
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Go to first page"
          >
            {"<<"}
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Go to previous page"
          >
            {"<"}
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border border-gray-300 ${
                page === currentPage
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Go to next page"
          >
            {">"}
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border border-gray-300 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Go to last page"
          >
            {">>"}
          </button>
        </nav>
      </section>
    </div>
  );
}