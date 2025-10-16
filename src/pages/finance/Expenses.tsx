import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

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
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    date: "",
    expenseHead: "",
    amount: "",
    paymentType: "",
    note: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

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

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section (Add new expense)
  const handleSave = () => {
    if (!form.date || !form.expenseHead || !form.amount || !form.paymentType) {
      alert("Please fill all required fields.");
      return;
    }
    const newId = expenses.length ? Math.max(...expenses.map((e) => e.id)) + 1 : 1;
    setExpenses((prev) => [
      ...prev,
      {
        id: newId,
        date: form.date,
        expenseHead: form.expenseHead,
        amount: Number(form.amount),
        paymentType: form.paymentType,
        note: form.note,
      },
    ]);
    setForm({
      date: "",
      expenseHead: "",
      amount: "",
      paymentType: "",
      note: "",
    });
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = expenses.find((e) => e.id === id);
    if (item) {
      setEditForm({
        date: item.date,
        expenseHead: item.expenseHead,
        amount: item.amount.toString(),
        paymentType: item.paymentType,
        note: item.note,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.date ||
      !editForm.expenseHead ||
      !editForm.amount ||
      !editForm.paymentType
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                date: editForm.date,
                expenseHead: editForm.expenseHead,
                amount: Number(editForm.amount),
                paymentType: editForm.paymentType,
                note: editForm.note,
              }
            : item
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  // Cancel editing modal
  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      // If deleting last item on page, go to previous page if needed
      if (
        (currentPage - 1) * itemsPerPage >= expenses.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      date: "",
      expenseHead: "",
      amount: "",
      paymentType: "",
      note: "",
    });
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    const total = expenses.reduce((acc, cur) => acc + cur.amount, 0);
    alert(`Report:\nTotal Expenses: ${expenses.length}\nTotal Amount: $${total.toFixed(2)}`);
  };

  // Calculate paginated data using Pagination component props
  const paginatedExpenses = expenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6">Expenses</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-6 gap-6"
        >
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Expense Head */}
          <div>
            <label htmlFor="expenseHead" className="block text-sm font-medium mb-1">
              Expense Head <span className="text-destructive">*</span>
            </label>
            <select
              id="expenseHead"
              name="expenseHead"
              value={form.expenseHead}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount <span className="text-destructive">*</span>
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
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Payment Type */}
          <div>
            <label htmlFor="paymentType" className="block text-sm font-medium mb-1">
              Payment Type <span className="text-destructive">*</span>
            </label>
            <select
              id="paymentType"
              name="paymentType"
              value={form.paymentType}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
          <div className="md:col-span-2">
            <label htmlFor="note" className="block text-sm font-medium mb-1">
              Note
            </label>
            <textarea
              id="note"
              name="note"
              rows={1}
              value={form.note}
              onChange={handleInputChange}
              placeholder="Optional note"
              className="w-full border border-input rounded px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-6 mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <h2 className="text-xl font-semibold mb-4 px-6">Expenses List</h2>
        <div className="overflow-x-auto px-6">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-24">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-32">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Expense Head</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-28">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-32">Payment Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Note</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedExpenses.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center px-4 py-6 text-muted-foreground italic">
                    No expenses found.
                  </td>
                </tr>
              )}
              {paginatedExpenses.map((expense, idx) => (
                <tr
                  key={expense.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{expense.date}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{expense.expenseHead}</td>
                  <td className="px-4 py-3 text-sm text-foreground">${expense.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{expense.paymentType}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{expense.note}</td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(expense.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit expense ${expense.expenseHead}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete expense ${expense.expenseHead}`}
                      type="button"
                    >
                      <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={expenses.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <div className="bg-white rounded shadow-lg max-w-xl w-full p-6 relative">
            <h2
              id="edit-modal-title"
              className="text-xl font-semibold mb-4 text-center"
            >
              Edit Expense
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {/* Date */}
              <div>
                <label
                  htmlFor="editDate"
                  className="block text-sm font-medium mb-1"
                >
                  Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  id="editDate"
                  name="date"
                  value={editForm.date}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              {/* Expense Head */}
              <div>
                <label
                  htmlFor="editExpenseHead"
                  className="block text-sm font-medium mb-1"
                >
                  Expense Head <span className="text-destructive">*</span>
                </label>
                <select
                  id="editExpenseHead"
                  name="expenseHead"
                  value={editForm.expenseHead}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              <div>
                <label
                  htmlFor="editAmount"
                  className="block text-sm font-medium mb-1"
                >
                  Amount <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  id="editAmount"
                  name="amount"
                  min="0"
                  step="0.01"
                  value={editForm.amount}
                  onChange={handleEditInputChange}
                  placeholder="0.00"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              {/* Payment Type */}
              <div>
                <label
                  htmlFor="editPaymentType"
                  className="block text-sm font-medium mb-1"
                >
                  Payment Type <span className="text-destructive">*</span>
                </label>
                <select
                  id="editPaymentType"
                  name="paymentType"
                  value={editForm.paymentType}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              <div className="md:col-span-2">
                <label
                  htmlFor="editNote"
                  className="block text-sm font-medium mb-1"
                >
                  Note
                </label>
                <textarea
                  id="editNote"
                  name="note"
                  rows={1}
                  value={editForm.note}
                  onChange={handleEditInputChange}
                  placeholder="Optional note"
                  className="w-full border border-input rounded px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleEditCancel}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}