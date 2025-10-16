import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

const statusOptions = ["Active", "Inactive"];

export default function Brands() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Brands");
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for Add Section (preserved exactly)
  const [form, setForm] = useState({
    brandName: "",
    brandCode: "",
    brandDescription: "",
    brandStatus: statusOptions[0],
  });

  // Data state for brands list
  const [brands, setBrands] = useState([]);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    brandName: "",
    brandCode: "",
    brandDescription: "",
    brandStatus: statusOptions[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    setBrands(data);
  }, [data]);

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

  // Save handler for Add Section (Add new brand)
  const handleSave = () => {
    if (!form.brandName.trim() || !form.brandCode.trim()) {
      alert("Brand Name and Brand Code are required.");
      return;
    }
    const newBrand = {
      id: brands.length ? Math.max(...brands.map((b) => b.id)) + 1 : 1,
      brandName: form.brandName.trim(),
      brandCode: form.brandCode.trim(),
      brandDescription: form.brandDescription.trim(),
      brandStatus: form.brandStatus,
    };
    setBrands((prev) => [...prev, newBrand]);
    setForm({
      brandName: "",
      brandCode: "",
      brandDescription: "",
      brandStatus: statusOptions[0],
    });
    // If new brand added on last page and page full, move to last page
    const totalItems = brands.length + 1;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(totalPages);
    }
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const brand = brands.find((b) => b.id === id);
    if (brand) {
      setEditForm({
        brandName: brand.brandName,
        brandCode: brand.brandCode,
        brandDescription: brand.brandDescription,
        brandStatus: brand.brandStatus,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (!editForm.brandName.trim() || !editForm.brandCode.trim()) {
      alert("Brand Name and Brand Code are required.");
      return;
    }
    if (editId !== null) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editId
            ? {
                ...b,
                brandName: editForm.brandName.trim(),
                brandCode: editForm.brandCode.trim(),
                brandDescription: editForm.brandDescription.trim(),
                brandStatus: editForm.brandStatus,
              }
            : b
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
    if (
      window.confirm(
        "Are you sure you want to delete this brand? This action cannot be undone."
      )
    ) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
      // Adjust page if deleting last item on page
      const totalItems = brands.length - 1;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (currentPage > totalPages && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      // Clear edit modal if editing deleted brand
      if (editId === id) {
        setEditId(null);
        setIsEditModalOpen(false);
      }
    }
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      brandName: "",
      brandCode: "",
      brandDescription: "",
      brandStatus: statusOptions[0],
    });
    setEditId(null);
    setIsEditModalOpen(false);
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Brands Report:\n\n" + JSON.stringify(brands, null, 2));
  };

  // Calculate paginated data using Pagination component props
  const paginatedBrands = brands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6">Brands</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand Name */}
          <div>
            <label
              htmlFor="brandName"
              className="block text-sm font-medium mb-1"
            >
              Brand Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              value={form.brandName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter Brand Name"
              required
            />
          </div>

          {/* Brand Code */}
          <div>
            <label
              htmlFor="brandCode"
              className="block text-sm font-medium mb-1"
            >
              Brand Code <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="brandCode"
              name="brandCode"
              value={form.brandCode}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter Brand Code"
              required
            />
          </div>

          {/* Brand Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="brandDescription"
              className="block text-sm font-medium mb-1"
            >
              Brand Description
            </label>
            <textarea
              id="brandDescription"
              name="brandDescription"
              value={form.brandDescription}
              onChange={handleInputChange}
              rows={1}
              className="w-full border border-input rounded px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter Brand Description"
            />
          </div>

          {/* Brand Status */}
          <div>
            <label
              htmlFor="brandStatus"
              className="block text-sm font-medium mb-1"
            >
              Brand Status
            </label>
            <select
              id="brandStatus"
              name="brandStatus"
              value={form.brandStatus}
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

      {/* Brands Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Brand Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Brand Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Brand Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Brand Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBrands.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No brands found.
                  </td>
                </tr>
              )}
              {paginatedBrands.map((brand, idx) => (
                <tr
                  key={brand.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {brand.brandName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {brand.brandCode}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {brand.brandDescription}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        brand.brandStatus === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {brand.brandStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(brand.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit brand ${brand.brandName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete brand ${brand.brandName}`}
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
          totalItems={brands.length}
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
              Edit Brand
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Brand Name */}
              <div>
                <label
                  htmlFor="editBrandName"
                  className="block text-sm font-medium mb-1"
                >
                  Brand Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editBrandName"
                  name="brandName"
                  value={editForm.brandName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Brand Name"
                  required
                />
              </div>

              {/* Brand Code */}
              <div>
                <label
                  htmlFor="editBrandCode"
                  className="block text-sm font-medium mb-1"
                >
                  Brand Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editBrandCode"
                  name="brandCode"
                  value={editForm.brandCode}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Brand Code"
                  required
                />
              </div>

              {/* Brand Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="editBrandDescription"
                  className="block text-sm font-medium mb-1"
                >
                  Brand Description
                </label>
                <textarea
                  id="editBrandDescription"
                  name="brandDescription"
                  value={editForm.brandDescription}
                  onChange={handleEditInputChange}
                  rows={1}
                  className="w-full border border-input rounded px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Brand Description"
                />
              </div>

              {/* Brand Status */}
              <div>
                <label
                  htmlFor="editBrandStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Brand Status
                </label>
                <select
                  id="editBrandStatus"
                  name="brandStatus"
                  value={editForm.brandStatus}
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