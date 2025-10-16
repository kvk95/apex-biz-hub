import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const TAX_TYPES = ["Percentage", "Fixed"];

export default function TaxRates() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state
  const [form, setForm] = useState({
    taxName: "",
    taxRate: "",
    taxType: "Percentage",
    taxDescription: "",
  });

  // Data state
  const [taxRates, setTaxRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    taxName: "",
    taxRate: "",
    taxType: "Percentage",
    taxDescription: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("TaxRates");
    if (response.status.code === "S") {
      setTaxRates(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  // Handlers for Add Section form inputs
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // Handlers for Edit Modal form inputs
  function handleEditInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  }

  // Open edit modal and populate edit form
  function handleEdit(id: number) {
    const tax = taxRates.find((t) => t.id === id);
    if (!tax) return;
    setEditForm({
      taxName: tax.taxName,
      taxRate: tax.taxRate.replace("%", ""),
      taxType: tax.taxType,
      taxDescription: tax.taxDescription,
    });
    setEditId(id);
    setIsEditModalOpen(true);
  }

  // Save handler for Add Section (Add new tax rate)
  function handleSave() {
    if (!form.taxName.trim()) {
      alert("Tax Name is required");
      return;
    }
    if (!form.taxRate.trim() || isNaN(Number(form.taxRate))) {
      alert("Tax Rate must be a valid number");
      return;
    }
    if (!TAX_TYPES.includes(form.taxType)) {
      alert("Tax Type is invalid");
      return;
    }
    if (editId !== null) {
      // Update existing
      setTaxRates((prev) =>
        prev.map((t) =>
          t.id === editId
            ? {
                ...t,
                taxName: form.taxName.trim(),
                taxRate: form.taxRate.trim() + (form.taxType === "Percentage" ? "%" : ""),
                taxType: form.taxType,
                taxDescription: form.taxDescription.trim(),
              }
            : t
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    } else {
      // Add new
      const newId = taxRates.length ? Math.max(...taxRates.map((t) => t.id)) + 1 : 1;
      setTaxRates((prev) => [
        ...prev,
        {
          id: newId,
          taxName: form.taxName.trim(),
          taxRate: form.taxRate.trim() + (form.taxType === "Percentage" ? "%" : ""),
          taxType: form.taxType,
          taxDescription: form.taxDescription.trim(),
        },
      ]);
      // If new item added to last page, move to last page
      const totalItems = taxRates.length + 1;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (totalItems > itemsPerPage * (totalPages - 1)) {
        setCurrentPage(totalPages);
      }
    }
    setForm({
      taxName: "",
      taxRate: "",
      taxType: "Percentage",
      taxDescription: "",
    });
  }

  // Cancel editing modal
  function handleEditCancel() {
    setEditId(null);
    setIsEditModalOpen(false);
  }

  function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this tax rate?")) return;
    setTaxRates((prev) => prev.filter((t) => t.id !== id));
    // Adjust page if needed
    if ((taxRates.length - 1) % itemsPerPage === 0 && currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  }

  // Clear button handler (replaces Refresh)
  function handleClear() {
    setForm({
      taxName: "",
      taxRate: "",
      taxType: "Percentage",
      taxDescription: "",
    });
    setEditId(null);
    setCurrentPage(1);
  }

  function handleReport() {
    // For demo, just alert JSON data
    alert(JSON.stringify(taxRates, null, 2));
  }

  // Calculate paginated data using Pagination component props
  const paginatedData = taxRates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-lg font-semibold mb-6">Tax Rates</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <label htmlFor="taxName" className="block text-sm font-medium mb-1">
            Tax Name <span className="text-destructive">*</span>
          </label>
          <input
            id="taxName"
            name="taxName"
            type="text"
            value={form.taxName}
            onChange={handleInputChange}
            className="col-span-3 w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter tax name"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center mt-4">
          <label htmlFor="taxRate" className="block text-sm font-medium mb-1">
            Tax Rate <span className="text-destructive">*</span>
          </label>
          <input
            id="taxRate"
            name="taxRate"
            type="number"
            min="0"
            step="any"
            value={form.taxRate}
            onChange={handleInputChange}
            className="col-span-3 w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter tax rate"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center mt-4">
          <label htmlFor="taxType" className="block text-sm font-medium mb-1">
            Tax Type <span className="text-destructive">*</span>
          </label>
          <select
            id="taxType"
            name="taxType"
            value={form.taxType}
            onChange={handleInputChange}
            className="col-span-3 w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            required
          >
            {TAX_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start mt-4">
          <label htmlFor="taxDescription" className="block text-sm font-medium mb-1 pt-2">
            Tax Description
          </label>
          <textarea
            id="taxDescription"
            name="taxDescription"
            value={form.taxDescription}
            onChange={handleInputChange}
            rows={3}
            className="col-span-3 w-full border border-input rounded px-3 py-2 resize-none bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter tax description"
          />
        </div>

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
                  Tax Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Tax Rate
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Tax Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Tax Description
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center px-4 py-6 text-muted-foreground italic">
                    No tax rates found.
                  </td>
                </tr>
              ) : (
                paginatedData.map(({ id, taxName, taxRate, taxType, taxDescription }) => (
                  <tr
                    key={id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">{taxName}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{taxRate}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{taxType}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{taxDescription}</td>
                    <td className="px-4 py-3 text-center text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Edit tax rate ${taxName}`}
                        type="button"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        aria-label={`Delete tax rate ${taxName}`}
                        type="button"
                      >
                        <i className="fa fa-trash fa-light" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={taxRates.length}
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
            <h2 id="edit-modal-title" className="text-xl font-semibold mb-4 text-center">
              Edit Tax Rate
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label htmlFor="editTaxName" className="block text-sm font-medium mb-1">
                Tax Name <span className="text-destructive">*</span>
              </label>
              <input
                id="editTaxName"
                name="taxName"
                type="text"
                value={editForm.taxName}
                onChange={handleEditInputChange}
                className="col-span-3 w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter tax name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center mt-4">
              <label htmlFor="editTaxRate" className="block text-sm font-medium mb-1">
                Tax Rate <span className="text-destructive">*</span>
              </label>
              <input
                id="editTaxRate"
                name="taxRate"
                type="number"
                min="0"
                step="any"
                value={editForm.taxRate}
                onChange={handleEditInputChange}
                className="col-span-3 w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter tax rate"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center mt-4">
              <label htmlFor="editTaxType" className="block text-sm font-medium mb-1">
                Tax Type <span className="text-destructive">*</span>
              </label>
              <select
                id="editTaxType"
                name="taxType"
                value={editForm.taxType}
                onChange={handleEditInputChange}
                className="col-span-3 w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                {TAX_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start mt-4">
              <label htmlFor="editTaxDescription" className="block text-sm font-medium mb-1 pt-2">
                Tax Description
              </label>
              <textarea
                id="editTaxDescription"
                name="taxDescription"
                value={editForm.taxDescription}
                onChange={handleEditInputChange}
                rows={3}
                className="col-span-3 w-full border border-input rounded px-3 py-2 resize-none bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter tax description"
              />
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
                onClick={handleSave}
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