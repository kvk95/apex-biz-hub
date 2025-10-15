import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const pageSizeOptions = [5, 10, 15];

export default function SmsSettings() {
  const [form, setForm] = useState({
    smsGateway: "",
    username: "",
    password: "",
    senderId: "",
    status: "Active",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    smsGateway: "",
    username: "",
    password: "",
    senderId: "",
    status: "Active",
  });

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("SmsSettings");
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
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [currentPage, pageSize, data]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !form.smsGateway.trim() ||
      !form.username.trim() ||
      !form.password.trim() ||
      !form.senderId.trim()
    )
      return;

    if (editingId !== null) {
      // Edit existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                smsGateway: form.smsGateway,
                username: form.username,
                password: form.password,
                senderId: form.senderId,
                status: form.status,
              }
            : item
        )
      );
    } else {
      // Add new
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [
        ...prev,
        {
          id: newId,
          smsGateway: form.smsGateway,
          username: form.username,
          password: form.password,
          senderId: form.senderId,
          status: form.status,
        },
      ]);
    }
    setForm({
      smsGateway: "",
      username: "",
      password: "",
      senderId: "",
      status: "Active",
    });
    setEditingId(null);
    setCurrentPage(1);
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        smsGateway: item.smsGateway,
        username: item.username,
        password: item.password,
        senderId: item.senderId,
        status: item.status,
      });
      setEditingId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSave = () => {
    if (
      !editForm.smsGateway.trim() ||
      !editForm.username.trim() ||
      !editForm.password.trim() ||
      !editForm.senderId.trim()
    )
      return;

    if (editingId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                smsGateway: editForm.smsGateway,
                username: editForm.username,
                password: editForm.password,
                senderId: editForm.senderId,
                status: editForm.status,
              }
            : item
        )
      );
      setEditingId(null);
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      if ((currentPage - 1) * pageSize >= data.length - 1) {
        setCurrentPage((p) => Math.max(1, p - 1));
      }
    }
  };

  const handleClear = () => {
    setForm({
      smsGateway: "",
      username: "",
      password: "",
      senderId: "",
      status: "Active",
    });
    setEditingId(null);
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo, just alert JSON data
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      <h1 className="text-2xl font-semibold mb-6">SMS Settings</h1>

      {/* Form Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add / Edit SMS Gateway</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="smsGateway"
                className="block text-sm font-medium mb-1"
              >
                SMS Gateway <span className="text-red-600">*</span>
              </label>
              <input
                id="smsGateway"
                name="smsGateway"
                type="text"
                value={form.smsGateway}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter SMS Gateway"
                required
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1"
              >
                Username <span className="text-red-600">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter Username"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password <span className="text-red-600">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter Password"
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="senderId"
                className="block text-sm font-medium mb-1"
              >
                Sender ID <span className="text-red-600">*</span>
              </label>
              <input
                id="senderId"
                name="senderId"
                type="text"
                value={form.senderId}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter Sender ID"
                required
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status <span className="text-red-600">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
                title={editingId !== null ? "Update" : "Save"}
              >
                {editingId !== null ? (
                  <>
                    <i className="fa fa-edit fa-light mr-2" aria-hidden="true"></i> Update
                  </>
                ) : (
                  <>
                    <i className="fa fa-save fa-light mr-2" aria-hidden="true"></i> Save
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
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
                  SMS Gateway
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Password
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Sender ID
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
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No SMS Gateway entries found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.smsGateway}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.username}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground font-mono">
                      {item.password}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.senderId}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${item.status === "Active"
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
                        aria-label={`Edit SMS Gateway ${item.smsGateway}`}
                        type="button"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        aria-label={`Delete SMS Gateway ${item.smsGateway}`}
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
          itemsPerPage={pageSize}
          totalItems={data.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
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
              Edit SMS Gateway
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* SMS Gateway */}
              <div>
                <label
                  htmlFor="editSmsGateway"
                  className="block text-sm font-medium mb-1"
                >
                  SMS Gateway
                </label>
                <input
                  type="text"
                  id="editSmsGateway"
                  name="smsGateway"
                  value={editForm.smsGateway}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter SMS Gateway"
                />
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="editUsername"
                  className="block text-sm font-medium mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="editUsername"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Username"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="editPassword"
                  className="block text-sm font-medium mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="editPassword"
                  name="password"
                  value={editForm.password}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sender ID */}
              <div>
                <label
                  htmlFor="editSenderId"
                  className="block text-sm font-medium mb-1"
                >
                  Sender ID
                </label>
                <input
                  type="text"
                  id="editSenderId"
                  name="senderId"
                  value={editForm.senderId}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter Sender ID"
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