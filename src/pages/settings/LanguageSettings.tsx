import React, { useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const statusOptions = ["Active", "Inactive"];

const LanguageSettings: React.FC = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state for Add Section
  const [form, setForm] = useState({
    languageName: "",
    languageCode: "",
    languageFlag: "",
    languageOrder: "",
    languageStatus: statusOptions[0],
  });

  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    languageName: "",
    languageCode: "",
    languageFlag: "",
    languageOrder: "",
    languageStatus: statusOptions[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("LanguageSettings");
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

  // Save handler for Add Section (Add new language)
  const handleSave = () => {
    if (
      !form.languageName.trim() ||
      !form.languageCode.trim() ||
      !form.languageFlag.trim() ||
      !form.languageOrder.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (isNaN(Number(form.languageOrder))) {
      alert("Language Order must be a number.");
      return;
    }

    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    setData((prev) => [
      ...prev,
      {
        id: newId,
        languageName: form.languageName.trim(),
        languageCode: form.languageCode.trim(),
        languageFlag: form.languageFlag.trim(),
        languageOrder: Number(form.languageOrder),
        languageStatus: form.languageStatus,
      },
    ]);
    setForm({
      languageName: "",
      languageCode: "",
      languageFlag: "",
      languageOrder: "",
      languageStatus: statusOptions[0],
    });
  };

  // Open edit modal and populate edit form
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditForm({
        languageName: item.languageName,
        languageCode: item.languageCode,
        languageFlag: item.languageFlag,
        languageOrder: item.languageOrder.toString(),
        languageStatus: item.languageStatus,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (
      !editForm.languageName.trim() ||
      !editForm.languageCode.trim() ||
      !editForm.languageFlag.trim() ||
      !editForm.languageOrder.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (isNaN(Number(editForm.languageOrder))) {
      alert("Language Order must be a number.");
      return;
    }

    if (editId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                languageName: editForm.languageName.trim(),
                languageCode: editForm.languageCode.trim(),
                languageFlag: editForm.languageFlag.trim(),
                languageOrder: Number(editForm.languageOrder),
                languageStatus: editForm.languageStatus,
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
    if (window.confirm("Are you sure you want to delete this language?")) {
      setData((prev) => prev.filter((d) => d.id !== id));
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
      languageName: "",
      languageCode: "",
      languageFlag: "",
      languageOrder: "",
      languageStatus: statusOptions[0],
    });
    setEditId(null);
    setCurrentPage(1);
  };

  // Report button handler
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
      <h1 className="text-lg font-semibold mb-6">Language Settings</h1>

      {/* Form Section (Add Section) - preserved exactly */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* Language Name */}
          <div className="md:col-span-2">
            <label
              htmlFor="languageName"
              className="block text-sm font-medium mb-1"
            >
              Language Name
            </label>
            <input
              type="text"
              id="languageName"
              name="languageName"
              value={form.languageName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter language name"
              required
            />
          </div>

          {/* Language Code */}
          <div className="md:col-span-1">
            <label
              htmlFor="languageCode"
              className="block text-sm font-medium mb-1"
            >
              Language Code
            </label>
            <input
              type="text"
              id="languageCode"
              name="languageCode"
              value={form.languageCode}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. en"
              maxLength={5}
              required
            />
          </div>

          {/* Language Flag */}
          <div className="md:col-span-1">
            <label
              htmlFor="languageFlag"
              className="block text-sm font-medium mb-1"
            >
              Language Flag
            </label>
            <input
              type="text"
              id="languageFlag"
              name="languageFlag"
              value={form.languageFlag}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Country code (e.g. us)"
              maxLength={2}
              required
            />
          </div>

          {/* Language Order */}
          <div className="md:col-span-1">
            <label
              htmlFor="languageOrder"
              className="block text-sm font-medium mb-1"
            >
              Language Order
            </label>
            <input
              type="number"
              id="languageOrder"
              name="languageOrder"
              value={form.languageOrder}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Order"
              min={1}
              required
            />
          </div>

          {/* Language Status */}
          <div className="md:col-span-1">
            <label
              htmlFor="languageStatus"
              className="block text-sm font-medium mb-1"
            >
              Status
            </label>
            <select
              id="languageStatus"
              name="languageStatus"
              value={form.languageStatus}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
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
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Language Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Language Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Language Flag
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Language Order
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
                    colSpan={7}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No languages found.
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
                    {item.languageName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.languageCode}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground flex items-center space-x-2">
                    <i
                      className={`fa fa-flag fa-light text-lg`}
                      title={item.languageFlag.toUpperCase()}
                      aria-hidden="true"
                    ></i>
                    <span className="uppercase text-xs font-semibold select-none">
                      {item.languageFlag}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.languageOrder}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        item.languageStatus === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {item.languageStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit language ${item.languageName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete language ${item.languageName}`}
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
              Edit Language
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {/* Language Name */}
              <div className="md:col-span-2">
                <label
                  htmlFor="editLanguageName"
                  className="block text-sm font-medium mb-1"
                >
                  Language Name
                </label>
                <input
                  type="text"
                  id="editLanguageName"
                  name="languageName"
                  value={editForm.languageName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter language name"
                  required
                />
              </div>

              {/* Language Code */}
              <div className="md:col-span-1">
                <label
                  htmlFor="editLanguageCode"
                  className="block text-sm font-medium mb-1"
                >
                  Language Code
                </label>
                <input
                  type="text"
                  id="editLanguageCode"
                  name="languageCode"
                  value={editForm.languageCode}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. en"
                  maxLength={5}
                  required
                />
              </div>

              {/* Language Flag */}
              <div className="md:col-span-1">
                <label
                  htmlFor="editLanguageFlag"
                  className="block text-sm font-medium mb-1"
                >
                  Language Flag
                </label>
                <input
                  type="text"
                  id="editLanguageFlag"
                  name="languageFlag"
                  value={editForm.languageFlag}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Country code (e.g. us)"
                  maxLength={2}
                  required
                />
              </div>

              {/* Language Order */}
              <div className="md:col-span-1">
                <label
                  htmlFor="editLanguageOrder"
                  className="block text-sm font-medium mb-1"
                >
                  Language Order
                </label>
                <input
                  type="number"
                  id="editLanguageOrder"
                  name="languageOrder"
                  value={editForm.languageOrder}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Order"
                  min={1}
                  required
                />
              </div>

              {/* Language Status */}
              <div className="md:col-span-1">
                <label
                  htmlFor="editLanguageStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="editLanguageStatus"
                  name="languageStatus"
                  value={editForm.languageStatus}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
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
};

export default LanguageSettings;