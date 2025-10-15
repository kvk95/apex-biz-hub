import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const PaymentGatewaySettings: React.FC = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for Add Section
  const [form, setForm] = useState({
    gatewayName: "",
    gatewayType: "Online",
    gatewayStatus: "Active",
    description: "",
  });

  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    gatewayName: "",
    gatewayType: "Online",
    gatewayStatus: "Active",
    description: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PaymentGatewaySettings");
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

  // Save handler for Add Section (Add new gateway)
  const handleSave = () => {
    if (!form.gatewayName.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    setData((prev) => [
      ...prev,
      {
        id: newId,
        gatewayName: form.gatewayName.trim(),
        type: form.gatewayType,
        status: form.gatewayStatus,
        description: form.description,
      },
    ]);
    setForm({
      gatewayName: "",
      gatewayType: "Online",
      gatewayStatus: "Active",
      description: "",
    });
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        gatewayName: item.gatewayName,
        gatewayType: item.type,
        gatewayStatus: item.status,
        description: item.description,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (!editForm.gatewayName.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                gatewayName: editForm.gatewayName.trim(),
                type: editForm.gatewayType,
                status: editForm.gatewayStatus,
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

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      gatewayName: "",
      gatewayType: "Online",
      gatewayStatus: "Active",
      description: "",
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
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Payment Gateway Settings</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Payment Gateway</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gateway Name */}
          <div>
            <label
              htmlFor="gatewayName"
              className="block text-sm font-medium mb-1"
            >
              Gateway Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="gatewayName"
              name="gatewayName"
              value={form.gatewayName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter gateway name"
              required
            />
          </div>

          {/* Gateway Type */}
          <div>
            <label
              htmlFor="gatewayType"
              className="block text-sm font-medium mb-1"
            >
              Gateway Type
            </label>
            <select
              id="gatewayType"
              name="gatewayType"
              value={form.gatewayType}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Online</option>
              <option>Offline</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="gatewayStatus"
              className="block text-sm font-medium mb-1"
            >
              Status
            </label>
            <select
              id="gatewayStatus"
              name="gatewayStatus"
              value={form.gatewayStatus}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleInputChange}
            className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter description"
          />
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 px-6">
          <h2 className="text-xl font-semibold">Payment Gateway List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Gateway Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
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
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No payment gateways found.
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
                    {item.gatewayName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.type}
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
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit gateway ${item.gatewayName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
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
              Edit Payment Gateway
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Gateway Name */}
              <div>
                <label
                  htmlFor="editGatewayName"
                  className="block text-sm font-medium mb-1"
                >
                  Gateway Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editGatewayName"
                  name="gatewayName"
                  value={editForm.gatewayName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter gateway name"
                  required
                />
              </div>

              {/* Gateway Type */}
              <div>
                <label
                  htmlFor="editGatewayType"
                  className="block text-sm font-medium mb-1"
                >
                  Gateway Type
                </label>
                <select
                  id="editGatewayType"
                  name="gatewayType"
                  value={editForm.gatewayType}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Online</option>
                  <option>Offline</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="editGatewayStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="editGatewayStatus"
                  name="gatewayStatus"
                  value={editForm.gatewayStatus}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label
                htmlFor="editDescription"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <textarea
                id="editDescription"
                name="description"
                rows={3}
                value={editForm.description}
                onChange={handleEditInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter description"
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

export default PaymentGatewaySettings;