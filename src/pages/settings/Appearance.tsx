import React, { useState, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const pageSizeOptions = [5, 10, 20];

export default function Appearance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSizeOptions[0]);
  const [formData, setFormData] = useState({
    themeName: "",
    sidebarType: "Expanded",
    headerType: "Fixed",
    footerType: "Static",
    status: "Active",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    themeName: "",
    sidebarType: "Expanded",
    headerType: "Fixed",
    footerType: "Static",
    status: "Active",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Appearance");
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Save functionality is not implemented in this demo.");
  };

  const handleClear = () => {
    setFormData({
      themeName: "",
      sidebarType: "Expanded",
      headerType: "Fixed",
      footerType: "Static",
      status: "Active",
    });
    setCurrentPage(1);
  };

  const handleReport = () => {
    alert("Report functionality is not implemented in this demo.");
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        themeName: item.name,
        sidebarType: item.sidebar,
        headerType: item.header,
        footerType: item.footer,
        status: item.status,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSave = () => {
    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
              ...item,
              name: editForm.themeName,
              sidebar: editForm.sidebarType,
              header: editForm.headerType,
              footer: editForm.footerType,
              status: editForm.status,
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

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background font-sans p-6">
      <title>Appearance - Dreams POS</title>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <h1 className="text-2xl font-semibold mb-6">Appearance</h1>

        {/* Form Section */}
        <section className="bg-card rounded shadow p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
          <form className="space-y-6">
            {/* Theme Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="themeName"
                  className="block text-sm font-medium mb-1"
                >
                  Theme Name
                </label>
                <input
                  type="text"
                  id="themeName"
                  name="themeName"
                  value={formData.themeName}
                  onChange={handleInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter theme name"
                />
              </div>

              {/* Sidebar Type */}
              <div>
                <label
                  htmlFor="sidebarType"
                  className="block text-sm font-medium mb-1"
                >
                  Sidebar Type
                </label>
                <select
                  id="sidebarType"
                  name="sidebarType"
                  value={formData.sidebarType}
                  onChange={handleInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Expanded</option>
                  <option>Collapsed</option>
                </select>
              </div>

              {/* Header Type */}
              <div>
                <label
                  htmlFor="headerType"
                  className="block text-sm font-medium mb-1"
                >
                  Header Type
                </label>
                <select
                  id="headerType"
                  name="headerType"
                  value={formData.headerType}
                  onChange={handleInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Fixed</option>
                  <option>Static</option>
                </select>
              </div>

              {/* Footer Type */}
              <div>
                <label
                  htmlFor="footerType"
                  className="block text-sm font-medium mb-1"
                >
                  Footer Type
                </label>
                <select
                  id="footerType"
                  name="footerType"
                  value={formData.footerType}
                  onChange={handleInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Static</option>
                  <option>Fixed</option>
                </select>
              </div>

              {/* Status */}
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
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Active</option>
                  <option>Inactive</option>
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
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-card rounded shadow py-6">
          <h2 className="text-xl font-semibold mb-4">Appearance List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Theme
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Sidebar
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Header
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    Footer
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
                      No appearances found.
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
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.theme}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.sidebar}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.header}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {item.footer}
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
                        aria-label={`Edit appearance ${item.name}`}
                        type="button"
                      >
                        <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                      </button>
                      <button
                        title="Delete"
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        onClick={() =>
                          alert(
                            `Delete functionality for "${item.name}" is not implemented in this demo.`
                          )
                        }
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
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
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
                Edit Appearance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Theme Name */}
                <div>
                  <label
                    htmlFor="editThemeName"
                    className="block text-sm font-medium mb-1"
                  >
                    Theme Name
                  </label>
                  <input
                    type="text"
                    id="editThemeName"
                    name="themeName"
                    value={editForm.themeName}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter theme name"
                  />
                </div>

                {/* Sidebar Type */}
                <div>
                  <label
                    htmlFor="editSidebarType"
                    className="block text-sm font-medium mb-1"
                  >
                    Sidebar Type
                  </label>
                  <select
                    id="editSidebarType"
                    name="sidebarType"
                    value={editForm.sidebarType}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Expanded</option>
                    <option>Collapsed</option>
                  </select>
                </div>

                {/* Header Type */}
                <div>
                  <label
                    htmlFor="editHeaderType"
                    className="block text-sm font-medium mb-1"
                  >
                    Header Type
                  </label>
                  <select
                    id="editHeaderType"
                    name="headerType"
                    value={editForm.headerType}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Fixed</option>
                    <option>Static</option>
                  </select>
                </div>

                {/* Footer Type */}
                <div>
                  <label
                    htmlFor="editFooterType"
                    className="block text-sm font-medium mb-1"
                  >
                    Footer Type
                  </label>
                  <select
                    id="editFooterType"
                    name="footerType"
                    value={editForm.footerType}
                    onChange={handleEditInputChange}
                    className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Static</option>
                    <option>Fixed</option>
                  </select>
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
                    <option>Active</option>
                    <option>Inactive</option>
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
    </div>
  );
}