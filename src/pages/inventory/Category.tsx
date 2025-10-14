import React, { useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const statusOptions = ["Active", "Inactive"];

export default function Category() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for Add Section (preserved exactly)
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(statusOptions[0]);

  // Data state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    categoryName: "",
    description: "",
    status: statusOptions[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Category");
    if (response.status.code === "S") {
      setCategories(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Reset form fields
  const resetForm = () => {
    setCategoryName("");
    setDescription("");
    setStatus(statusOptions[0]);
    setEditId(null);
  };

  // Handle Save (Add new category)
  const handleSave = () => {
    if (!categoryName.trim()) {
      alert("Please enter category name.");
      return;
    }
    const newId =
      categories.length > 0
        ? Math.max(...categories.map((c) => c.id)) + 1
        : 1;
    setCategories((prev) => [
      ...prev,
      { id: newId, categoryName: categoryName.trim(), description, status },
    ]);
    resetForm();
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    setEditForm({
      categoryName: cat.categoryName,
      description: cat.description,
      status: cat.status,
    });
    setEditId(id);
    setIsEditModalOpen(true);
  };

  // Handle Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (!editForm.categoryName.trim()) {
      alert("Please enter category name.");
      return;
    }
    if (editId !== null) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editId
            ? {
                ...cat,
                categoryName: editForm.categoryName.trim(),
                description: editForm.description,
                status: editForm.status,
              }
            : cat
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

  // Handle Delete click
  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category?"
      )
    ) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      // If deleting last item on page, go back a page if possible
      if (
        (currentPage - 1) * itemsPerPage >= categories.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
      if (editId === id) resetForm();
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    resetForm();
    setCurrentPage(1);
  };

  // Handle Report (simulate report generation)
  const handleReport = () => {
    alert("Report generated for categories.");
  };

  // Calculate paginated data using Pagination component props
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <title>Category - Dreams POS</title>
      <div className="min-h-screen bg-background font-sans p-6">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">Category</h1>

        {/* Form Section (Add Section) - preserved exactly */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            {/* Category Name */}
            <div>
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium mb-1"
              >
                Category Name
              </label>
              <input
                id="categoryName"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
                title="Save"
              >
                <i className="fa fa-save fa-light" aria-hidden="true"></i>
                Save
              </button>
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                type="button"
                title="Clear"
              >
                <i className="fa fa-eraser fa-light" aria-hidden="true"></i>
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-4">
          <button
            onClick={handleReport}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
            title="Report"
          >
            <i className="fa fa-file-text fa-light" aria-hidden="true"></i>
            Report
          </button>
        </div>

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
                    Category Name
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
                {paginatedCategories.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center px-4 py-6 text-muted-foreground italic"
                    >
                      No categories found.
                    </td>
                  </tr>
                )}
                {paginatedCategories.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {cat.categoryName}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {cat.description}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          cat.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {cat.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(cat.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit category ${cat.categoryName}`}
                        type="button"
                        title="Edit"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        aria-label={`Delete category ${cat.categoryName}`}
                        type="button"
                        title="Delete"
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
            totalItems={categories.length}
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
                Edit Category
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Category Name */}
                <div>
                  <label
                    htmlFor="editCategoryName"
                    className="block text-sm font-medium mb-1"
                  >
                    Category Name
                  </label>
                  <input
                    type="text"
                    id="editCategoryName"
                    name="categoryName"
                    value={editForm.categoryName}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Category Name"
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
                  <input
                    type="text"
                    id="editDescription"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Description"
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
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
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
    </>
  );
}