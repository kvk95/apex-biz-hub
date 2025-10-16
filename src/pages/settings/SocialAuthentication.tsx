import { apiService } from "@/services/ApiService";
import React, { useState, useEffect } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

export default function SocialAuthentication() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    socialName: "",
    clientId: "",
    clientSecret: "",
    redirectUrl: "",
    status: "Active",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Form state for Add Section
  const [form, setForm] = useState({
    socialName: "",
    clientId: "",
    clientSecret: "",
    redirectUrl: "",
    status: "Active",
  });

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("SocialAuthentication");
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

  // Handlers for Add Section form inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Add Section
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Save clicked - form data submitted");
  };

  // Clear button handler (replaces Refresh)
  const handleClear = () => {
    setForm({
      socialName: "",
      clientId: "",
      clientSecret: "",
      redirectUrl: "",
      status: "Active",
    });
    setEditId(null);
    setCurrentPage(1);
  };

  // Report button handler
  const handleReport = () => {
    alert("Report generated");
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        socialName: item.socialName,
        clientId: item.clientId,
        clientSecret: item.clientSecret,
        redirectUrl: item.redirectUrl,
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                socialName: editForm.socialName,
                clientId: editForm.clientId,
                clientSecret: editForm.clientSecret,
                redirectUrl: editForm.redirectUrl,
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

  // Delete handler
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this social authentication?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
      // If deleting last item on page, go to previous page if needed
      if ((currentPage - 1) * itemsPerPage >= data.length - 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  // Calculate paginated data using Pagination component props
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>       
      <div className="min-h-screen bg-background">

        <h1 className="text-lg font-semibold mb-6">Social Authentication</h1>
        
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          
          <div className="space-x-3">
            <button
              onClick={handleReport}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              type="button"
            >
              <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              type="button"
            >
              <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
            </button>
          </div>
        </div>

        {/* Form Section (Add Section) - preserved exactly */}
        <section className="bg-card rounded shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Add / Edit Social Authentication</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Social Name */}
              <div>
                <label htmlFor="socialName" className="block text-sm font-medium mb-1">
                  Social Name
                </label>
                <input
                  id="socialName"
                  name="socialName"
                  type="text"
                  value={form.socialName}
                  onChange={handleInputChange}
                  placeholder="Enter social platform name"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              {/* Client ID */}
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium mb-1">
                  Client ID
                </label>
                <input
                  id="clientId"
                  name="clientId"
                  type="text"
                  value={form.clientId}
                  onChange={handleInputChange}
                  placeholder="Enter client ID"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              {/* Client Secret */}
              <div>
                <label htmlFor="clientSecret" className="block text-sm font-medium mb-1">
                  Client Secret
                </label>
                <input
                  id="clientSecret"
                  name="clientSecret"
                  type="password"
                  value={form.clientSecret}
                  onChange={handleInputChange}
                  placeholder="Enter client secret"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              {/* Redirect URL */}
              <div>
                <label htmlFor="redirectUrl" className="block text-sm font-medium mb-1">
                  Redirect URL
                </label>
                <input
                  id="redirectUrl"
                  name="redirectUrl"
                  type="url"
                  value={form.redirectUrl}
                  onChange={handleInputChange}
                  placeholder="Enter redirect URL"
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
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
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-card rounded shadow py-6">
          <h2 className="text-lg font-semibold mb-4 px-6 text-foreground">Social Authentication List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Social Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Client ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Client Secret</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Redirect URL</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center px-4 py-6 text-muted-foreground italic">
                      No social authentications found.
                    </td>
                  </tr>
                )}
                {paginatedData.map((item, idx) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-foreground">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-foreground flex items-center space-x-2">
                      <i className={`${item.socialIcon} fa-light text-lg text-primary w-5`}></i>
                      <span>{item.socialName}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{item.clientId}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{item.clientSecret}</td>
                    <td className="px-4 py-3 text-sm text-foreground break-all max-w-xs">{item.redirectUrl}</td>
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
                        aria-label={`Edit ${item.socialName}`}
                        type="button"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        aria-label={`Delete ${item.socialName}`}
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
              <h2 id="edit-modal-title" className="text-xl font-semibold mb-4 text-center">
                Edit Social Authentication
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Social Name */}
                <div>
                  <label htmlFor="editSocialName" className="block text-sm font-medium mb-1">
                    Social Name
                  </label>
                  <input
                    type="text"
                    id="editSocialName"
                    name="socialName"
                    value={editForm.socialName}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter social platform name"
                    required
                  />
                </div>

                {/* Client ID */}
                <div>
                  <label htmlFor="editClientId" className="block text-sm font-medium mb-1">
                    Client ID
                  </label>
                  <input
                    type="text"
                    id="editClientId"
                    name="clientId"
                    value={editForm.clientId}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter client ID"
                    required
                  />
                </div>

                {/* Client Secret */}
                <div>
                  <label htmlFor="editClientSecret" className="block text-sm font-medium mb-1">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    id="editClientSecret"
                    name="clientSecret"
                    value={editForm.clientSecret}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter client secret"
                    required
                  />
                </div>

                {/* Redirect URL */}
                <div>
                  <label htmlFor="editRedirectUrl" className="block text-sm font-medium mb-1">
                    Redirect URL
                  </label>
                  <input
                    type="url"
                    id="editRedirectUrl"
                    name="redirectUrl"
                    value={editForm.redirectUrl}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter redirect URL"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="editStatus" className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    id="editStatus"
                    name="status"
                    value={editForm.status}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    required
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
    </>
  );
}