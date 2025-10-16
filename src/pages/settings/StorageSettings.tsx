import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const storageTypes = ["Warehouse", "Store", "Cold Room"];
const statuses = ["Active", "Inactive"];

export default function StorageSettings() {
  // State variables for API data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state
  const [form, setForm] = useState({
    storageName: "",
    storageCode: "",
    storageType: storageTypes[0],
    status: statuses[0],
    description: "",
  });

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    storageName: "",
    storageCode: "",
    storageType: storageTypes[0],
    status: statuses[0],
    description: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // API call logic
  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("StorageSettings");
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

  // Pagination calculations
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.storageName.trim() || !form.storageCode.trim()) {
      alert("Storage Name and Storage Code are required.");
      return;
    }
    if (editId !== null) {
      // Update existing
      const updatedData = data.map((item) =>
        item.id === editId ? { ...item, ...form } : item
      );
      // Call API to update data
      await apiService.put("StorageSettings", updatedData);
      setEditId(null);
      setForm({
        storageName: "",
        storageCode: "",
        storageType: storageTypes[0],
        status: statuses[0],
        description: "",
      });
    } else {
      // Add new
      const newId = data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
      const newData = [...data, { id: newId, ...form }];
      // Call API to add new data
      await apiService.post("StorageSettings", newData);
      // If new item added on last page, update pagination to last page
      const newTotalPages = Math.ceil((data.length + 1) / itemsPerPage);
      if (newTotalPages > Math.ceil(data.length / itemsPerPage)) setCurrentPage(newTotalPages);
    }
    setForm({
      storageName: "",
      storageCode: "",
      storageType: storageTypes[0],
      status: statuses[0],
      description: "",
    });
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        storageName: item.storageName,
        storageCode: item.storageCode,
        storageType: item.storageType,
        status: item.status,
        description: item.description,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSave = async () => {
    if (!editForm.storageName.trim() || !editForm.storageCode.trim()) {
      alert("Storage Name and Storage Code are required.");
      return;
    }
    if (editId !== null) {
      const updatedData = data.map((item) =>
        item.id === editId ? { ...item, ...editForm } : item
      );
      // Call API to update data
      await apiService.put("StorageSettings", updatedData);
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this storage?")) {
      const updatedData = data.filter((item) => item.id !== id);
      // Call API to delete data
      await apiService.delete(`StorageSettings/${id}`);
      // Adjust page if last item on page deleted
      const newTotalPages = Math.ceil((data.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages || 1);
    }
  };

  const handleClear = () => {
    setForm({
      storageName: "",
      storageCode: "",
      storageType: storageTypes[0],
      status: statuses[0],
      description: "",
    });
    setEditId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Storage Report:\n" + JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-lg font-semibold mb-6">Storage Settings</h1>

      {/* Storage Form Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add / Edit Storage</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="storageName"
                className="block text-sm font-medium mb-1"
              >
                Storage Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="storageName"
                name="storageName"
                value={form.storageName}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter storage name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="storageCode"
                className="block text-sm font-medium mb-1"
              >
                Storage Code <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="storageCode"
                name="storageCode"
                value={form.storageCode}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter storage code"
                required
              />
            </div>
            <div>
              <label
                htmlFor="storageType"
                className="block text-sm font-medium mb-1"
              >
                Storage Type
              </label>
              <select
                id="storageType"
                name="storageType"
                value={form.storageType}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {storageTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
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
                rows={2}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Enter description"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Save Storage"
            >
              <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Clear Form"
            >
              <i className="fa fa-undo fa-light" aria-hidden="true"></i> Clear
            </button>
            <button
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              type="button"
            >
              <i className="fa fa-file-alt fa-light" aria-hidden="true"></i> Report
            </button>
          </div>
        </form>
      </section>

      {/* Storage List Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 px-6">
          <h2 className="text-xl font-semibold mb-3 md:mb-0">Storage List</h2>
          <div className="flex gap-3">
            <button
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Generate Report"
              type="button"
            >
              <i className="fa fa-file-alt fa-light" aria-hidden="true"></i> Report
            </button>
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Refresh List"
              type="button"
            >
              <i className="fa fa-sync-alt fa-light" aria-hidden="true"></i> Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto px-6">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Storage Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Storage Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Storage Type
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
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No storage entries found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-foreground">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.storageName}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.storageCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.storageType}
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
                        aria-label={`Edit storage ${item.storageName}`}
                        type="button"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        aria-label={`Delete storage ${item.storageName}`}
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
              Edit Storage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="editStorageName"
                  className="block text-sm font-medium mb-1"
                >
                  Storage Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editStorageName"
                  name="storageName"
                  value={editForm.storageName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter storage name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editStorageCode"
                  className="block text-sm font-medium mb-1"
                >
                  Storage Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editStorageCode"
                  name="storageCode"
                  value={editForm.storageCode}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter storage code"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editStorageType"
                  className="block text-sm font-medium mb-1"
                >
                  Storage Type
                </label>
                <select
                  id="editStorageType"
                  name="storageType"
                  value={editForm.storageType}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {storageTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
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
                  rows={2}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Enter description"
                />
              </div>
            </div>

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