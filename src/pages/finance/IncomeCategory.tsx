import React, { useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const statusOptions = ["Active", "Inactive"];

const IncomeCategory: React.FC = () => {
  // Form state
  const [incomeCategory, setIncomeCategory] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(statusOptions[0]);

  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    incomeCategory: "",
    description: "",
    status: statusOptions[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("IncomeCategory");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Reset form
  const resetForm = () => {
    setIncomeCategory("");
    setDescription("");
    setStatus(statusOptions[0]);
  };

  // Save handler for Add Section
  const handleSave = () => {
    if (!incomeCategory.trim()) {
      alert("Income Category is required.");
      return;
    }
    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    setData((prev) => [
      ...prev,
      { id: newId, incomeCategory, description, status },
    ]);
    resetForm();
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        incomeCategory: item.incomeCategory,
        description: item.description,
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (!editForm.incomeCategory.trim()) {
      alert("Income Category is required.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                incomeCategory: editForm.incomeCategory,
                description: editForm.description,
                status: editForm.status,
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

  // Delete entry
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      // If deleting last item on page, go to previous page if needed
      if (
        (currentPage - 1) * itemsPerPage >= data.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    resetForm();
    setEditId(null);
    setCurrentPage(1);
  };

  // Report action (dummy alert)
  const handleReport = () => {
    alert("Report generated (dummy action).");
  };

  // Calculate paginated data using Pagination component props
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Income Category</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Income Category */}
          <div>
            <label
              htmlFor="incomeCategory"
              className="block text-sm font-medium mb-1"
            >
              Income Category <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="incomeCategory"
              value={incomeCategory}
              onChange={(e) => setIncomeCategory(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter Income Category"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              placeholder="Enter Description"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
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
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Income Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
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
                    colSpan={5}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No records found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.incomeCategory}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit ${item.incomeCategory}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete ${item.incomeCategory}`}
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
              Edit Income Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Income Category */}
              <div>
                <label
                  htmlFor="editIncomeCategory"
                  className="block text-sm font-medium mb-1"
                >
                  Income Category <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editIncomeCategory"
                  value={editForm.incomeCategory}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      incomeCategory: e.target.value,
                    }))
                  }
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Income Category"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="editDescription"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <textarea
                  id="editDescription"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                  placeholder="Enter Description"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="editStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="editStatus"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
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
};

export default IncomeCategory;