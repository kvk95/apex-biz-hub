import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

export default function ConnectedApps() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    appName: "",
    appIcon: "",
    connectedOn: "",
    status: "",
    description: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Sorting state
  const [sortField, setSortField] = useState<keyof typeof data[0] | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("ConnectedApps");
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

  // Sort and paginate data
  const paginatedData = useMemo(() => {
    let sortedData = [...data];
    if (sortField) {
      sortedData.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [currentPage, itemsPerPage, sortField, sortOrder, data]);

  // Handle sorting click
  function handleSort(field: keyof typeof data[0]) {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  // Format date to readable format
  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Clear button handler (replaces Refresh)
  function handleClear() {
    setCurrentPage(1);
    setSortField(null);
    setSortOrder("asc");
  }

  // Report button handler
  function handleReport() {
    alert("Report generated!");
  }

  // Save button handler
  function handleSave() {
    alert("Changes saved successfully!");
  }

  // Edit modal handlers
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        appName: item.appName,
        appIcon: item.appIcon,
        connectedOn: item.connectedOn,
        status: item.status,
        description: item.description,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    if (!editForm.appName.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                appName: editForm.appName.trim(),
                appIcon: editForm.appIcon,
                connectedOn: editForm.connectedOn,
                status: editForm.status,
                description: editForm.description,
              }
            : item
        )
      );
      setEditId(null);
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this app?")) {
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

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Connected Apps</h1>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        {/* Header with buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-6">
          <h2 className="text-xl font-semibold mb-3 sm:mb-0">
            Connected Applications
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              type="button"
              aria-label="Generate Report"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              type="button"
              aria-label="Clear"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto px-6">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer"
                  onClick={() => handleSort("appName")}
                  aria-sort={
                    sortField === "appName"
                      ? sortOrder === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  App Name
                  {sortField === "appName" && (
                    <i
                      className={`fa fa-sort-${sortOrder === "asc" ? "up" : "down"} fa-light ml-1`}
                      aria-hidden="true"
                    ></i>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                >
                  Icon
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer"
                  onClick={() => handleSort("connectedOn")}
                  aria-sort={
                    sortField === "connectedOn"
                      ? sortOrder === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  Connected On
                  {sortField === "connectedOn" && (
                    <i
                      className={`fa fa-sort-${sortOrder === "asc" ? "up" : "down"} fa-light ml-1`}
                      aria-hidden="true"
                    ></i>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer"
                  onClick={() => handleSort("status")}
                  aria-sort={
                    sortField === "status"
                      ? sortOrder === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  Status
                  {sortField === "status" && (
                    <i
                      className={`fa fa-sort-${sortOrder === "asc" ? "up" : "down"} fa-light ml-1`}
                      aria-hidden="true"
                    ></i>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-sm font-medium text-muted-foreground"
                >
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
                    No connected apps found.
                  </td>
                </tr>
              )}
              {paginatedData.map((app, idx) => (
                <tr
                  key={app.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {app.appName}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <i
                      className={`fab ${app.appIcon} text-2xl text-blue-600`}
                    ></i>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {formatDate(app.connectedOn)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        app.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {app.description}
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(app.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit ${app.appName}`}
                      type="button"
                    >
                      <i
                        className="fa fa-pencil fa-light"
                        aria-hidden="true"
                      ></i>
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete ${app.appName}`}
                      type="button"
                    >
                      <i
                        className="fa fa-trash fa-light"
                        aria-hidden="true"
                      ></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 mt-4">
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={data.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setItemsPerPage}
          />
        </div>

        {/* Save Button */}
        <div className="mt-6 px-6 flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
            type="button"
            aria-label="Save changes"
          >
            <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
          </button>
        </div>
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
              Edit Connected App
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* App Name */}
              <div>
                <label
                  htmlFor="editAppName"
                  className="block text-sm font-medium mb-1"
                >
                  App Name
                </label>
                <input
                  type="text"
                  id="editAppName"
                  name="appName"
                  value={editForm.appName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter app name"
                />
              </div>

              {/* App Icon */}
              <div>
                <label
                  htmlFor="editAppIcon"
                  className="block text-sm font-medium mb-1"
                >
                  Icon
                </label>
                <input
                  type="text"
                  id="editAppIcon"
                  name="appIcon"
                  value={editForm.appIcon}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter icon class (e.g., fa-apple)"
                />
              </div>

              {/* Connected On */}
              <div>
                <label
                  htmlFor="editConnectedOn"
                  className="block text-sm font-medium mb-1"
                >
                  Connected On
                </label>
                <input
                  type="date"
                  id="editConnectedOn"
                  name="connectedOn"
                  value={editForm.connectedOn}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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

              {/* Description */}
              <div className="md:col-span-2">
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
                  placeholder="Enter description"
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
}