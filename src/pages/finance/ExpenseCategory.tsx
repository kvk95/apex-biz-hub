import { apiService } from "@/services/ApiService";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

type ExpenseCategory = {
  id: number;
  name: string;
  description: string;
  status: "Active" | "Inactive";
};

export default function ExpenseCategory() {
  const [data, setData] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: 0,
    name: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Form state for Add Section
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
  });

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<ExpenseCategory[]>("ExpenseCategory");
    if (response.status.code === "S") {
      setData(response.result);
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
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section (Add new category)
  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Expense Category Name is required.");
      return;
    }
    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    setData((prev) => [
      ...prev,
      {
        id: newId,
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
      },
    ]);
    setForm({
      name: "",
      description: "",
      status: "Active",
    });
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        id: item.id,
        name: item.name,
        description: item.description,
        status: item.status,
      });
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (!editForm.name.trim()) {
      alert("Expense Category Name is required.");
      return;
    }
    setData((prev) =>
      prev.map((item) =>
        item.id === editForm.id
          ? {
              ...item,
              name: editForm.name.trim(),
              description: editForm.description.trim(),
              status: editForm.status,
            }
          : item
      )
    );
    setIsEditModalOpen(false);
  };

  // Cancel editing modal
  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this Expense Category?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      // If deleting last item on page, go to previous page if needed
      if ((currentPage - 1) * itemsPerPage >= data.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      name: "",
      description: "",
      status: "Active",
    });
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

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Expense Category</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Expense Category Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1"
              >
                Expense Category Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Enter Expense Category Name"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Enter Description"
                rows={1}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            {/* Status */}
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
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
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
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-16 text-center">
                  SL
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-48">
                  Expense Category Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-28 text-center">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground w-36">
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
                    No Expense Categories found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground text-center">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
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
                      aria-label={`Edit category ${item.name}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete category ${item.name}`}
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
              Edit Expense Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Expense Category Name */}
              <div>
                <label
                  htmlFor="editName"
                  className="block text-sm font-medium mb-1"
                >
                  Expense Category Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="editName"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Expense Category Name"
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
                  name="description"
                  value={editForm.description}
                  onChange={handleEditInputChange}
                  placeholder="Enter Description"
                  rows={1}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
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
                  name="status"
                  value={editForm.status}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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