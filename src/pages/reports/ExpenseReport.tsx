import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

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

export default function ExpenseReport() {
  // Form state for Add Section (preserved exactly)
  const [date, setDate] = useState("");
  const [expenseHead, setExpenseHead] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Data state
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    date: "",
    expenseHead: expenseHeads[0],
    paymentType: paymentTypes[0],
    amount: "",
    description: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<Expense[]>("ExpenseReport");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Handlers for Add Section form inputs
  const resetForm = () => {
    setDate("");
    setExpenseHead("");
    setPaymentType("");
    setAmount("");
    setDescription("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "date":
        setDate(value);
        break;
      case "expenseHead":
        setExpenseHead(value);
        break;
      case "paymentType":
        setPaymentType(value);
        break;
      case "amount":
        setAmount(value);
        break;
      case "description":
        setDescription(value);
        break;
    }
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section (Add new expense)
  const handleSave = () => {
    if (!date || !expenseHead || !paymentType || !amount) {
      alert("Please fill in all required fields.");
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    setData((prev) => [
      ...prev,
      {
        id: newId,
        date,
        expenseHead,
        paymentType,
        amount: amt,
        description,
      },
    ]);
    resetForm();
    // If new page needed, go to last page
    const newTotalPages = Math.ceil((data.length + 1) / itemsPerPage);
    if (newTotalPages > Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(newTotalPages);
    }
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        date: item.date,
        expenseHead: item.expenseHead,
        paymentType: item.paymentType,
        amount: item.amount.toString(),
        description: item.description,
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
      !editForm.paymentType ||
      !editForm.amount
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    const amt = parseFloat(editForm.amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                date: editForm.date,
                expenseHead: editForm.expenseHead,
                paymentType: editForm.paymentType,
                amount: amt,
                description: editForm.description,
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
      setData((prev) => prev.filter((d) => d.id !== id));
      // Adjust page if last item on last page deleted
      const newTotalPages = Math.ceil((data.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages || 1);
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    resetForm();
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report Data:\n" + JSON.stringify(data, null, 2));
  };

  // Calculate paginated data using Pagination component props
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total amount for current page
  const totalAmount = paginatedData.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      
      <h1 className="text-lg font-semibold mb-6">Expense Report</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date <span className="text-destructive">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Expense Head */}
          <div>
            <label
              htmlFor="expenseHead"
              className="block text-sm font-medium mb-1"
            >
              Expense Head <span className="text-destructive">*</span>
            </label>
            <select
              id="expenseHead"
              name="expenseHead"
              value={expenseHead}
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

          {/* Payment Type */}
          <div>
            <label
              htmlFor="paymentType"
              className="block text-sm font-medium mb-1"
            >
              Payment Type <span className="text-destructive">*</span>
            </label>
            <select
              id="paymentType"
              name="paymentType"
              value={paymentType}
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

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount <span className="text-destructive">*</span>
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              placeholder="Description"
              value={description}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Add
          </button>

          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>

          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Expense Head
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Payment Type
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No expenses found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.expenseHead}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.paymentType}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">
                      ${item.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit expense ${item.id}`}
                        type="button"
                        title="Edit"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        aria-label={`Delete expense ${item.id}`}
                        type="button"
                        title="Delete"
                      >
                        <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-muted/20 font-semibold text-foreground">
                <td colSpan={3} className="px-4 py-3 text-right">
                  Total:
                </td>
                <td className="px-4 py-3 text-right">${totalAmount.toFixed(2)}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={data.length}
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
                >
                  {expenseHeads.map((head) => (
                    <option key={head} value={head}>
                      {head}
                    </option>
                  ))}
                </select>
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
                >
                  {paymentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
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
                  min={0}
                  step="0.01"
                  value={editForm.amount}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="editDescription"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="editDescription"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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