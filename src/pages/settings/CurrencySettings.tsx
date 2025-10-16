import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

const PAGE_SIZES = [5, 10, 20];

export default function CurrencySettings() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [form, setForm] = useState({
    currencyName: "",
    currencyCode: "",
    currencySymbol: "",
    currencyRate: "",
    currencyStatus: "Active",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    currencyName: "",
    currencyCode: "",
    currencySymbol: "",
    currencyRate: "",
    currencyStatus: "Active",
  });

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("CurrencySettings");
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

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, data]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !form.currencyName.trim() ||
      !form.currencyCode.trim() ||
      !form.currencySymbol.trim() ||
      !form.currencyRate.trim()
    )
      return;

    if (editingId !== null) {
      setData((d) =>
        d.map((item) =>
          item.id === editingId
            ? {
                ...item,
                currencyName: form.currencyName,
                currencyCode: form.currencyCode,
                currencySymbol: form.currencySymbol,
                currencyRate: form.currencyRate,
                currencyStatus: form.currencyStatus,
              }
            : item
        )
      );
    } else {
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((d) => [
        ...d,
        {
          id: newId,
          currencyName: form.currencyName,
          currencyCode: form.currencyCode,
          currencySymbol: form.currencySymbol,
          currencyRate: form.currencyRate,
          currencyStatus: form.currencyStatus,
        },
      ]);
    }
    resetForm();
  };

  const resetForm = () => {
    setForm({
      currencyName: "",
      currencyCode: "",
      currencySymbol: "",
      currencyRate: "",
      currencyStatus: "Active",
    });
    setEditingId(null);
  };

  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (!item) return;
    setEditForm({
      currencyName: item.currencyName,
      currencyCode: item.currencyCode,
      currencySymbol: item.currencySymbol,
      currencyRate: item.currencyRate,
      currencyStatus: item.currencyStatus,
    });
    setEditingId(id);
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    if (
      !editForm.currencyName.trim() ||
      !editForm.currencyCode.trim() ||
      !editForm.currencySymbol.trim() ||
      !editForm.currencyRate.trim()
    )
      return;

    if (editingId !== null) {
      setData((d) =>
        d.map((item) =>
          item.id === editingId
            ? {
                ...item,
                currencyName: editForm.currencyName,
                currencyCode: editForm.currencyCode,
                currencySymbol: editForm.currencySymbol,
                currencyRate: editForm.currencyRate,
                currencyStatus: editForm.currencyStatus,
              }
            : item
        )
      );
    }
    setIsEditModalOpen(false);
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this currency?")) return;
    setData((d) => d.filter((item) => item.id !== id));
    if (pagedData.length === 1 && currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
    if (editingId === id) {
      resetForm();
    }
  };

  const handleClear = () => {
    resetForm();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-lg font-semibold mb-6">Currency Settings</h1>

      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Currency Name */}
          <div>
            <label
              htmlFor="currencyName"
              className="block text-sm font-medium mb-1"
            >
              Currency Name
            </label>
            <input
              type="text"
              id="currencyName"
              name="currencyName"
              value={form.currencyName}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter currency name"
              required
            />
          </div>

          {/* Currency Code */}
          <div>
            <label
              htmlFor="currencyCode"
              className="block text-sm font-medium mb-1"
            >
              Currency Code
            </label>
            <input
              type="text"
              id="currencyCode"
              name="currencyCode"
              value={form.currencyCode}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter currency code"
              maxLength={3}
              required
            />
          </div>

          {/* Currency Symbol */}
          <div>
            <label
              htmlFor="currencySymbol"
              className="block text-sm font-medium mb-1"
            >
              Currency Symbol
            </label>
            <input
              type="text"
              id="currencySymbol"
              name="currencySymbol"
              value={form.currencySymbol}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter currency symbol"
              maxLength={3}
              required
            />
          </div>

          {/* Currency Rate */}
          <div>
            <label
              htmlFor="currencyRate"
              className="block text-sm font-medium mb-1"
            >
              Currency Rate
            </label>
            <input
              type="number"
              step="any"
              id="currencyRate"
              name="currencyRate"
              value={form.currencyRate}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter currency rate"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="currencyStatus"
              className="block text-sm font-medium mb-1"
            >
              Status
            </label>
            <select
              id="currencyStatus"
              name="currencyStatus"
              value={form.currencyStatus}
              onChange={handleInputChange}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
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
        </div>
      </section>

      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Currency Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Currency Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Currency Symbol
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Currency Rate
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
              {pagedData.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No currencies available.
                  </td>
                </tr>
              )}
              {pagedData.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.currencyName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground uppercase">
                    {item.currencyCode}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.currencySymbol}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.currencyRate}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        item.currencyStatus === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {item.currencyStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit currency ${item.currencyName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete currency ${item.currencyName}`}
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

        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={data.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>

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
              Edit Currency
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Currency Name */}
              <div>
                <label
                  htmlFor="editCurrencyName"
                  className="block text-sm font-medium mb-1"
                >
                  Currency Name
                </label>
                <input
                  type="text"
                  id="editCurrencyName"
                  name="currencyName"
                  value={editForm.currencyName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter currency name"
                />
              </div>

              {/* Currency Code */}
              <div>
                <label
                  htmlFor="editCurrencyCode"
                  className="block text-sm font-medium mb-1"
                >
                  Currency Code
                </label>
                <input
                  type="text"
                  id="editCurrencyCode"
                  name="currencyCode"
                  value={editForm.currencyCode}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter currency code"
                  maxLength={3}
                />
              </div>

              {/* Currency Symbol */}
              <div>
                <label
                  htmlFor="editCurrencySymbol"
                  className="block text-sm font-medium mb-1"
                >
                  Currency Symbol
                </label>
                <input
                  type="text"
                  id="editCurrencySymbol"
                  name="currencySymbol"
                  value={editForm.currencySymbol}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter currency symbol"
                  maxLength={3}
                />
              </div>

              {/* Currency Rate */}
              <div>
                <label
                  htmlFor="editCurrencyRate"
                  className="block text-sm font-medium mb-1"
                >
                  Currency Rate
                </label>
                <input
                  type="number"
                  step="any"
                  id="editCurrencyRate"
                  name="currencyRate"
                  value={editForm.currencyRate}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter currency rate"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="editCurrencyStatus"
                  className="block text-sm font-medium mb-1"
                >
                  Status
                </label>
                <select
                  id="editCurrencyStatus"
                  name="currencyStatus"
                  value={editForm.currencyStatus}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
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