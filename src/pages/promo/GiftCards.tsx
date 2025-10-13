import { apiService } from "@/services/ApiService";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

export default function GiftCards() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for Add Section (preserved exactly)
  const [form, setForm] = useState({
    cardNumber: "",
    cardHolder: "",
    issueDate: "",
    expiryDate: "",
    balance: "",
    status: "Active",
  });

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    cardNumber: "",
    cardHolder: "",
    issueDate: "",
    expiryDate: "",
    balance: "",
    status: "Active",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Filter state (search by card number or holder)
  const [searchTerm, setSearchTerm] = useState("");

  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("GiftCards");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Filtered and paginated data
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    return data.filter(
      (card) =>
        card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.cardHolder.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section (Add new gift card)
  const handleSave = () => {
    if (
      !form.cardNumber.trim() ||
      !form.cardHolder.trim() ||
      !form.issueDate ||
      !form.expiryDate ||
      form.balance === ""
    ) {
      alert("Please fill all fields");
      return;
    }
    const newCard = {
      id: data.length ? Math.max(...data.map((c) => c.id)) + 1 : 1,
      cardNumber: form.cardNumber,
      cardHolder: form.cardHolder,
      issueDate: form.issueDate,
      expiryDate: form.expiryDate,
      balance: Number(form.balance),
      status: form.status,
    };
    setData((d) => [newCard, ...d]);
    setForm({
      cardNumber: "",
      cardHolder: "",
      issueDate: "",
      expiryDate: "",
      balance: "",
      status: "Active",
    });
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const card = data.find((c) => c.id === id);
    if (!card) return;
    setEditForm({
      cardNumber: card.cardNumber,
      cardHolder: card.cardHolder,
      issueDate: card.issueDate,
      expiryDate: card.expiryDate,
      balance: card.balance.toString(),
      status: card.status,
    });
    setEditId(id);
    setIsEditModalOpen(true);
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.cardNumber.trim() ||
      !editForm.cardHolder.trim() ||
      !editForm.issueDate ||
      !editForm.expiryDate ||
      editForm.balance === ""
    ) {
      alert("Please fill all fields");
      return;
    }
    if (editId !== null) {
      setData((d) =>
        d.map((card) =>
          card.id === editId
            ? {
                ...card,
                cardNumber: editForm.cardNumber,
                cardHolder: editForm.cardHolder,
                issueDate: editForm.issueDate,
                expiryDate: editForm.expiryDate,
                balance: Number(editForm.balance),
                status: editForm.status,
              }
            : card
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
    if (window.confirm("Are you sure you want to delete this gift card?")) {
      setData((d) => d.filter((card) => card.id !== id));
      if ((currentPage - 1) * itemsPerPage >= data.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      cardNumber: "",
      cardHolder: "",
      issueDate: "",
      expiryDate: "",
      balance: "",
      status: "Active",
    });
    setEditId(null);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handleReport = () => {
    alert("Report generated for current gift cards data.");
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Gift Cards</h1>

      {/* Controls: Search, Report, Clear */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full md:w-1/3">
          <label htmlFor="search" className="block text-sm font-medium mb-1">
            Search:
          </label>
          <input
            id="search"
            type="text"
            placeholder="Card Number or Holder"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
            title="Generate Report"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
            title="Clear"
          >
            <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
          </button>
        </div>
      </div>

      {/* Add Gift Card Form (preserved exactly) */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Gift Card</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium mb-1"
            >
              Card Number
            </label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              value={form.cardNumber}
              onChange={handleInputChange}
              placeholder="XXXX XXXX XXXX XXXX"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              required
              maxLength={19}
              pattern="[\d\s]+"
              title="Card number format: digits and spaces only"
            />
          </div>
          <div>
            <label
              htmlFor="cardHolder"
              className="block text-sm font-medium mb-1"
            >
              Card Holder
            </label>
            <input
              id="cardHolder"
              name="cardHolder"
              type="text"
              value={form.cardHolder}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="issueDate"
              className="block text-sm font-medium mb-1"
            >
              Issue Date
            </label>
            <input
              id="issueDate"
              name="issueDate"
              type="date"
              value={form.issueDate}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium mb-1"
            >
              Expiry Date
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="balance"
              className="block text-sm font-medium mb-1"
            >
              Balance
            </label>
            <input
              id="balance"
              name="balance"
              type="number"
              min="0"
              step="0.01"
              value={form.balance}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              required
            >
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div className="md:col-span-3 flex justify-end pt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
            </button>
          </div>
        </form>
      </section>

      {/* Gift Cards Table */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Card Number
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Card Holder
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Issue Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Expiry Date
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Balance
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No gift cards found.
                  </td>
                </tr>
              )}
              {paginatedData.map((card) => (
                <tr
                  key={card.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {card.cardNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {card.cardHolder}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {card.issueDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {card.expiryDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    ${card.balance.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        card.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {card.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(card.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit gift card ${card.cardNumber}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete gift card ${card.cardNumber}`}
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
          totalItems={filteredData.length}
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
          <div className="bg-card rounded shadow-lg max-w-xl w-full p-6 relative">
            <h2
              id="edit-modal-title"
              className="text-xl font-semibold mb-4 text-center"
            >
              Edit Gift Card
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="editCardNumber"
                  className="block text-sm font-medium mb-1"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="editCardNumber"
                  name="cardNumber"
                  value={editForm.cardNumber}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  placeholder="XXXX XXXX XXXX XXXX"
                  maxLength={19}
                  pattern="[\d\s]+"
                  title="Card number format: digits and spaces only"
                />
              </div>
              <div>
                <label
                  htmlFor="editCardHolder"
                  className="block text-sm font-medium mb-1"
                >
                  Card Holder
                </label>
                <input
                  type="text"
                  id="editCardHolder"
                  name="cardHolder"
                  value={editForm.cardHolder}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label
                  htmlFor="editIssueDate"
                  className="block text-sm font-medium mb-1"
                >
                  Issue Date
                </label>
                <input
                  type="date"
                  id="editIssueDate"
                  name="issueDate"
                  value={editForm.issueDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="editExpiryDate"
                  className="block text-sm font-medium mb-1"
                >
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="editExpiryDate"
                  name="expiryDate"
                  value={editForm.expiryDate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="editBalance"
                  className="block text-sm font-medium mb-1"
                >
                  Balance
                </label>
                <input
                  type="number"
                  id="editBalance"
                  name="balance"
                  min="0"
                  step="0.01"
                  value={editForm.balance}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label
                  htmlFor="editStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="editStatus"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>
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