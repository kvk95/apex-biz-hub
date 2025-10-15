import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const statusOptions = ["Active", "Inactive"];

export default function EmailSettings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [form, setForm] = useState({
    email: "",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
    status: "Active",
  });

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    email: "",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
    status: "Active",
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("EmailSettings");
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section (Add new email setting)
  const handleSave = () => {
    if (
      !form.email.trim() ||
      !form.smtpHost.trim() ||
      !form.smtpPort.trim() ||
      !form.smtpUser.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    const portNum = Number(form.smtpPort);
    if (isNaN(portNum) || portNum <= 0) {
      alert("SMTP Port must be a positive number.");
      return;
    }

    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    setData((prev) => [
      ...prev,
      {
        id: newId,
        email: form.email.trim(),
        smtpHost: form.smtpHost.trim(),
        smtpPort: portNum,
        smtpUser: form.smtpUser.trim(),
        smtpPass: form.smtpPass,
        status: form.status,
      },
    ]);
    setForm({
      email: "",
      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPass: "",
      status: "Active",
    });
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        email: item.email,
        smtpHost: item.smtpHost,
        smtpPort: item.smtpPort.toString(),
        smtpUser: item.smtpUser,
        smtpPass: "",
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.email.trim() ||
      !editForm.smtpHost.trim() ||
      !editForm.smtpPort.trim() ||
      !editForm.smtpUser.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    const portNum = Number(editForm.smtpPort);
    if (isNaN(portNum) || portNum <= 0) {
      alert("SMTP Port must be a positive number.");
      return;
    }
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                email: editForm.email.trim(),
                smtpHost: editForm.smtpHost.trim(),
                smtpPort: portNum,
                smtpUser: editForm.smtpUser.trim(),
                smtpPass: editForm.smtpPass ? editForm.smtpPass : item.smtpPass,
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
    if (
      window.confirm(
        "Are you sure you want to delete this email setting? This action cannot be undone."
      )
    ) {
      setData((prev) => prev.filter((item) => item.id !== id));
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
      email: "",
      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPass: "",
      status: "Active",
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
      <h1 className="text-2xl font-semibold mb-6">Email Settings</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
            >
              Email Address <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="example@domain.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="smtpHost"
              className="block text-sm font-medium mb-1"
            >
              SMTP Host <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="smtpHost"
              name="smtpHost"
              value={form.smtpHost}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="smtp.domain.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="smtpPort"
              className="block text-sm font-medium mb-1"
            >
              SMTP Port <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="smtpPort"
              name="smtpPort"
              value={form.smtpPort}
              onChange={handleInputChange}
              min={1}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="587"
              required
            />
          </div>
          <div>
            <label
              htmlFor="smtpUser"
              className="block text-sm font-medium mb-1"
            >
              SMTP User <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="smtpUser"
              name="smtpUser"
              value={form.smtpUser}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="smtpPass"
              className="block text-sm font-medium mb-1"
            >
              SMTP Password
            </label>
            <input
              type="password"
              id="smtpPass"
              name="smtpPass"
              value={form.smtpPass}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
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

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Email Address
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  SMTP Host
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  SMTP Port
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  SMTP User
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
                    colSpan={6}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No email settings found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.smtpHost}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.smtpPort}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.smtpUser}
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
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit email setting ${item.email}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete email setting ${item.email}`}
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
              Edit Email Setting
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="editEmail"
                  className="block text-sm font-medium mb-1"
                >
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="example@domain.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editSmtpHost"
                  className="block text-sm font-medium mb-1"
                >
                  SMTP Host <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editSmtpHost"
                  name="smtpHost"
                  value={editForm.smtpHost}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="smtp.domain.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editSmtpPort"
                  className="block text-sm font-medium mb-1"
                >
                  SMTP Port <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  id="editSmtpPort"
                  name="smtpPort"
                  value={editForm.smtpPort}
                  onChange={handleEditInputChange}
                  min={1}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="587"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editSmtpUser"
                  className="block text-sm font-medium mb-1"
                >
                  SMTP User <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="editSmtpUser"
                  name="smtpUser"
                  value={editForm.smtpUser}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="username"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="editSmtpPass"
                  className="block text-sm font-medium mb-1"
                >
                  SMTP Password
                </label>
                <input
                  type="password"
                  id="editSmtpPass"
                  name="smtpPass"
                  value={editForm.smtpPass}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
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