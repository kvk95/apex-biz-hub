import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const statusOptions = ["Active", "Inactive"];

export default function Warehouses() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for Add Section
  const [form, setForm] = useState({
    warehouseName: "",
    warehouseCode: "",
    warehousePhone: "",
    warehouseEmail: "",
    warehouseAddress: "",
    warehouseStatus: statusOptions[0],
  });

  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    warehouseName: "",
    warehouseCode: "",
    warehousePhone: "",
    warehouseEmail: "",
    warehouseAddress: "",
    warehouseStatus: statusOptions[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Warehouses");
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

  // Save handler for Add Section (Add new warehouse)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.warehouseName.trim() || !form.warehouseCode.trim()) {
      alert("Warehouse Name and Code are required.");
      return;
    }
    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    setData((prev) => [
      {
        id: newId,
        warehouseName: form.warehouseName.trim(),
        warehouseCode: form.warehouseCode.trim(),
        warehousePhone: form.warehousePhone,
        warehouseEmail: form.warehouseEmail,
        warehouseAddress: form.warehouseAddress,
        warehouseStatus: form.warehouseStatus,
      },
      ...prev,
    ]);
    setForm({
      warehouseName: "",
      warehouseCode: "",
      warehousePhone: "",
      warehouseEmail: "",
      warehouseAddress: "",
      warehouseStatus: statusOptions[0],
    });
    setCurrentPage(1);
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        warehouseName: item.warehouseName,
        warehouseCode: item.warehouseCode,
        warehousePhone: item.warehousePhone,
        warehouseEmail: item.warehouseEmail,
        warehouseAddress: item.warehouseAddress,
        warehouseStatus: item.warehouseStatus,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (!editForm.warehouseName.trim() || !editForm.warehouseCode.trim()) {
      alert("Warehouse Name and Code are required.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                warehouseName: editForm.warehouseName.trim(),
                warehouseCode: editForm.warehouseCode.trim(),
                warehousePhone: editForm.warehousePhone,
                warehouseEmail: editForm.warehouseEmail,
                warehouseAddress: editForm.warehouseAddress,
                warehouseStatus: editForm.warehouseStatus,
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
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
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
    setForm({
      warehouseName: "",
      warehouseCode: "",
      warehousePhone: "",
      warehouseEmail: "",
      warehouseAddress: "",
      warehouseStatus: statusOptions[0],
    });
    setEditId(null);
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
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6">Warehouses</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Warehouse</h2>
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Warehouse Name */}
          <div>
            <label
              htmlFor="warehouseName"
              className="block text-sm font-medium mb-1"
            >
              Warehouse Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="warehouseName"
              name="warehouseName"
              value={form.warehouseName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter warehouse name"
              required
            />
          </div>

          {/* Warehouse Code */}
          <div>
            <label
              htmlFor="warehouseCode"
              className="block text-sm font-medium mb-1"
            >
              Warehouse Code <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="warehouseCode"
              name="warehouseCode"
              value={form.warehouseCode}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter warehouse code"
              required
            />
          </div>

          {/* Warehouse Phone */}
          <div>
            <label
              htmlFor="warehousePhone"
              className="block text-sm font-medium mb-1"
            >
              Warehouse Phone
            </label>
            <input
              type="tel"
              id="warehousePhone"
              name="warehousePhone"
              value={form.warehousePhone}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter phone number"
            />
          </div>

          {/* Warehouse Email */}
          <div>
            <label
              htmlFor="warehouseEmail"
              className="block text-sm font-medium mb-1"
            >
              Warehouse Email
            </label>
            <input
              type="email"
              id="warehouseEmail"
              name="warehouseEmail"
              value={form.warehouseEmail}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter email address"
            />
          </div>

          {/* Warehouse Address */}
          <div className="md:col-span-2">
            <label
              htmlFor="warehouseAddress"
              className="block text-sm font-medium mb-1"
            >
              Warehouse Address
            </label>
            <textarea
              id="warehouseAddress"
              name="warehouseAddress"
              rows={3}
              value={form.warehouseAddress}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Enter address"
            />
          </div>

          {/* Warehouse Status */}
          <div>
            <label
              htmlFor="warehouseStatus"
              className="block text-sm font-medium mb-1"
            >
              Warehouse Status
            </label>
            <select
              id="warehouseStatus"
              name="warehouseStatus"
              value={form.warehouseStatus}
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
        </form>

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
                  Warehouse Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Address
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
                    colSpan={8}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No warehouses found.
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
                    {item.warehouseName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.warehouseCode}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.warehousePhone}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.warehouseEmail}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.warehouseAddress}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        item.warehouseStatus === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {item.warehouseStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit warehouse ${item.warehouseName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete warehouse ${item.warehouseName}`}
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
              Edit Warehouse
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Warehouse Name */}
              <div>
                <label
                  htmlFor="editWarehouseName"
                  className="block text-sm font-medium mb-1"
                >
                  Warehouse Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editWarehouseName"
                  name="warehouseName"
                  value={editForm.warehouseName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter warehouse name"
                  required
                />
              </div>

              {/* Warehouse Code */}
              <div>
                <label
                  htmlFor="editWarehouseCode"
                  className="block text-sm font-medium mb-1"
                >
                  Warehouse Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editWarehouseCode"
                  name="warehouseCode"
                  value={editForm.warehouseCode}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter warehouse code"
                  required
                />
              </div>

              {/* Warehouse Phone */}
              <div>
                <label
                  htmlFor="editWarehousePhone"
                  className="block text-sm font-medium mb-1"
                >
                  Warehouse Phone
                </label>
                <input
                  type="tel"
                  id="editWarehousePhone"
                  name="warehousePhone"
                  value={editForm.warehousePhone}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Warehouse Email */}
              <div>
                <label
                  htmlFor="editWarehouseEmail"
                  className="block text-sm font-medium mb-1"
                >
                  Warehouse Email
                </label>
                <input
                  type="email"
                  id="editWarehouseEmail"
                  name="warehouseEmail"
                  value={editForm.warehouseEmail}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter email address"
                />
              </div>

              {/* Warehouse Address */}
              <div className="md:col-span-2">
                <label
                  htmlFor="editWarehouseAddress"
                  className="block text-sm font-medium mb-1"
                >
                  Warehouse Address
                </label>
                <textarea
                  id="editWarehouseAddress"
                  name="warehouseAddress"
                  rows={3}
                  value={editForm.warehouseAddress}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Enter address"
                />
              </div>

              {/* Warehouse Status */}
              <div>
                <label
                  htmlFor="editWarehouseStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Warehouse Status
                </label>
                <select
                  id="editWarehouseStatus"
                  name="warehouseStatus"
                  value={editForm.warehouseStatus}
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