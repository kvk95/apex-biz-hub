import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const statusOptions = ["Active", "Inactive"];

const Packages: React.FC = () => {
  // Form state for add package (Add Section)
  const [form, setForm] = useState({
    packageName: "",
    price: "",
    duration: "",
    description: "",
    status: "Active",
  });

  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    packageName: "",
    price: "",
    duration: "",
    description: "",
    status: "Active",
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Packages");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Handlers for Add Section form inputs
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section (Add new package)
  const handleSave = () => {
    if (
      !form.packageName.trim() ||
      !form.price.trim() ||
      !form.duration.trim() ||
      !form.description.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }
    const newId = data.length ? Math.max(...data.map((d: any) => d.id)) + 1 : 1;
    setData((prev) => [
      ...prev,
      {
        id: newId,
        packageName: form.packageName.trim(),
        price: form.price,
        duration: form.duration,
        description: form.description,
        status: form.status,
      },
    ]);
    setForm({
      packageName: "",
      price: "",
      duration: "",
      description: "",
      status: "Active",
    });
    setCurrentPage(Math.ceil((data.length + 1) / itemsPerPage));
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const pkg = data.find((d: any) => d.id === id);
    if (pkg) {
      setEditForm({
        packageName: pkg.packageName,
        price: pkg.price,
        duration: pkg.duration,
        description: pkg.description,
        status: pkg.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.packageName.trim() ||
      !editForm.price.trim() ||
      !editForm.duration.trim() ||
      !editForm.description.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item: any) =>
          item.id === editId ? { id: editId, ...editForm } : item
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
    if (window.confirm("Are you sure you want to delete this package?")) {
      setData((prev) => prev.filter((item: any) => item.id !== id));
      // If deleting last item on page, go to previous page if needed
      if (
        (currentPage - 1) * itemsPerPage >= data.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
      if (editId === id) {
        setEditId(null);
        setIsEditModalOpen(false);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      packageName: "",
      price: "",
      duration: "",
      description: "",
      status: "Active",
    });
    setEditId(null);
    setIsEditModalOpen(false);
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report generated for packages.");
  };

  // Calculate paginated data using Pagination component props
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Page Title */}
      <h1 className="text-lg font-semibold mb-6">Packages</h1>

      {/* Package Form Section (Add Section preserved exactly) */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Package Name */}
          <div>
            <label
              htmlFor="packageName"
              className="block text-sm font-medium mb-1"
            >
              Package Name
            </label>
            <input
              type="text"
              id="packageName"
              name="packageName"
              value={form.packageName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter package name"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={form.price}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="₹ 0"
            />
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium mb-1"
            >
              Duration
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={form.duration}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. 1 Month"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
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
              rows={3}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter package description"
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

      {/* Packages Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Package Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Duration
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
                    colSpan={7}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No packages found.
                  </td>
                </tr>
              )}
              {paginatedData.map((pkg: any, idx: number) => (
                <tr
                  key={pkg.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500"
                >
                  <td className="px-4 py-2">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-2">{pkg.packageName}</td>
                  <td className="px-4 py-2">{pkg.price}</td>
                  <td className="px-4 py-2">{pkg.duration}</td>
                  <td className="px-4 py-2 max-w-xs truncate">{pkg.description}</td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        pkg.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(pkg.id)}
                      aria-label={`Edit package ${pkg.packageName}`}
                      className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                    >
                      <i className="fa fa-edit fa-light" aria-hidden="true"></i>
                      <span className="sr-only">Edit record</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(pkg.id)}
                      aria-label={`Delete package ${pkg.packageName}`}
                      className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                    >
                      <i
                        className="fa fa-trash-can-xmark fa-light"
                        aria-hidden="true"
                      ></i>
                      <span className="sr-only">Delete record</span>
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
              Edit Package
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Package Name */}
              <div>
                <label
                  htmlFor="editPackageName"
                  className="block text-sm font-medium mb-1"
                >
                  Package Name
                </label>
                <input
                  type="text"
                  id="editPackageName"
                  name="packageName"
                  value={editForm.packageName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter package name"
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="editPrice"
                  className="block text-sm font-medium mb-1"
                >
                  Price
                </label>
                <input
                  type="text"
                  id="editPrice"
                  name="price"
                  value={editForm.price}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="₹ 0"
                />
              </div>

              {/* Duration */}
              <div>
                <label
                  htmlFor="editDuration"
                  className="block text-sm font-medium mb-1"
                >
                  Duration
                </label>
                <input
                  type="text"
                  id="editDuration"
                  name="duration"
                  value={editForm.duration}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. 1 Month"
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
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
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
                  rows={3}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter package description"
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
};

export default Packages;