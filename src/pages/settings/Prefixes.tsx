import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const statuses = ["Active", "Inactive"];

export default function Prefixes() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for Add Section
  const [prefixName, setPrefixName] = useState("");
  const [prefixCode, setPrefixCode] = useState("");
  const [status, setStatus] = useState("Active");

  // Data state
  const [prefixes, setPrefixes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    prefixName: "",
    prefixCode: "",
    status: "Active",
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Prefixes");
    if (response.status.code === "S") {
      setPrefixes(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Handlers for Add Section form inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === "prefixName") setPrefixName(value);
    else if (id === "prefixCode") setPrefixCode(value);
    else if (id === "status") setStatus(value);
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section (Add new prefix)
  const handleSave = () => {
    if (!prefixName.trim() || !prefixCode.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      // Update existing
      setPrefixes((prev) =>
        prev.map((p) =>
          p.id === editId
            ? { ...p, prefixName, prefixCode, status }
            : p
        )
      );
    } else {
      // Add new
      const newId =
        prefixes.length > 0
          ? Math.max(...prefixes.map((p) => p.id)) + 1
          : 1;
      setPrefixes((prev) => [
        ...prev,
        { id: newId, prefixName, prefixCode, status },
      ]);
    }
    resetForm();
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const prefix = prefixes.find((p) => p.id === id);
    if (prefix) {
      setEditForm({
        prefixName: prefix.prefixName,
        prefixCode: prefix.prefixCode,
        status: prefix.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (!editForm.prefixName.trim() || !editForm.prefixCode.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setPrefixes((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                prefixName: editForm.prefixName.trim(),
                prefixCode: editForm.prefixCode.trim(),
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

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this prefix?")) {
      setPrefixes((prev) => prev.filter((p) => p.id !== id));
      // If deleting last item on page, go to previous page if needed
      if (
        (currentPage - 1) * itemsPerPage >= prefixes.length - 1 &&
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

  const resetForm = () => {
    setPrefixName("");
    setPrefixCode("");
    setStatus("Active");
    setEditId(null);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert("Report Data:\n" + JSON.stringify(prefixes, null, 2));
  };

  // Calculate paginated data using Pagination component props
  const paginatedData = prefixes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6">Prefixes</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Prefix Name */}
          <div>
            <label
              htmlFor="prefixName"
              className="block text-sm font-medium mb-1"
            >
              Prefix Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="prefixName"
              value={prefixName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter prefix name"
              required
            />
          </div>

          {/* Prefix Code */}
          <div>
            <label
              htmlFor="prefixCode"
              className="block text-sm font-medium mb-1"
            >
              Prefix Code <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="prefixCode"
              value={prefixCode}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter prefix code"
              required
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
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-3">
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
              <i className="fa fa-times fa-light" aria-hidden="true"></i> Clear
            </button>
          </div>
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
                  Prefix Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Prefix Code
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
                    No prefixes found.
                  </td>
                </tr>
              )}
              {paginatedData.map((prefix, idx) => (
                <tr
                  key={prefix.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {prefix.prefixName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground uppercase">
                    {prefix.prefixCode}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        prefix.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {prefix.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(prefix.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit prefix ${prefix.prefixName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(prefix.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete prefix ${prefix.prefixName}`}
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
          totalItems={prefixes.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>

      {/* Report Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReport}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
        >
          <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
        </button>
      </div>

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
              Edit Prefix
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prefix Name */}
              <div>
                <label
                  htmlFor="editPrefixName"
                  className="block text-sm font-medium mb-1"
                >
                  Prefix Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editPrefixName"
                  name="prefixName"
                  value={editForm.prefixName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter prefix name"
                  required
                />
              </div>

              {/* Prefix Code */}
              <div>
                <label
                  htmlFor="editPrefixCode"
                  className="block text-sm font-medium mb-1"
                >
                  Prefix Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editPrefixCode"
                  name="prefixCode"
                  value={editForm.prefixCode}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter prefix code"
                  required
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
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
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
}