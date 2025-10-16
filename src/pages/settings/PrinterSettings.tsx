import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

const printerTypes = ["Thermal", "Inkjet", "Laser"];
const printerStatuses = ["Active", "Inactive"];

export default function PrinterSettings() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Form state
  const [printerName, setPrinterName] = useState("");
  const [printerType, setPrinterType] = useState(printerTypes[0]);
  const [printerPath, setPrinterPath] = useState("");
  const [status, setStatus] = useState(printerStatuses[0]);

  // Data state
  const [printers, setPrinters] = useState([]);

  // Loading and error states for API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    printerName: "",
    printerType: printerTypes[0],
    printerPath: "",
    status: printerStatuses[0],
  });
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PrinterSettings");
    if (response.status.code === "S") {
      setPrinters(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const resetForm = () => {
    setPrinterName("");
    setPrinterType(printerTypes[0]);
    setPrinterPath("");
    setStatus(printerStatuses[0]);
    setEditId(null);
  };

  const handleSave = () => {
    if (!printerName.trim() || !printerPath.trim()) return;

    if (editId !== null) {
      // Edit existing
      setPrinters((prev) =>
        prev.map((p) =>
          p.id === editId
            ? { ...p, printerName, printerType, printerPath, status }
            : p
        )
      );
    } else {
      // Add new
      const newId =
        printers.length > 0 ? Math.max(...printers.map((p) => p.id)) + 1 : 1;
      setPrinters((prev) => [
        ...prev,
        { id: newId, printerName, printerType, printerPath, status },
      ]);
    }
    resetForm();
  };

  const handleEdit = (id: number) => {
    const p = printers.find((p) => p.id === id);
    if (!p) return;
    setEditForm({
      printerName: p.printerName,
      printerType: p.printerType,
      printerPath: p.printerPath,
      status: p.status,
    });
    setEditId(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this printer?")) {
      setPrinters((prev) => prev.filter((p) => p.id !== id));
      if (currentPage > 1 && printers.length <= currentPage * itemsPerPage) {
        setCurrentPage(currentPage - 1);
      }
      if (editId === id) resetForm();
    }
  };

  const handleClear = () => {
    resetForm();
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demonstration, just alert JSON data
    alert(
      "Printer Settings Report:\n\n" +
        JSON.stringify(printers, null, 2)
    );
  };

  // Handlers for Edit Modal form inputs
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save handler for Edit Modal
  const handleEditSave = () => {
    if (!editForm.printerName.trim() || !editForm.printerPath.trim()) return;

    if (editId !== null) {
      // Update existing
      setPrinters((prev) =>
        prev.map((p) =>
          p.id === editId
            ? { ...p, ...editForm }
            : p
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

  // Calculate paginated data using Pagination component props
  const paginatedPrinters = printers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6">Printer Settings</h1>

      {/* Form Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Printer Name */}
          <div>
            <label
              htmlFor="printerName"
              className="block text-sm font-medium mb-1"
            >
              Printer Name
            </label>
            <input
              type="text"
              id="printerName"
              name="printerName"
              value={printerName}
              onChange={(e) => setPrinterName(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter printer name"
            />
          </div>

          {/* Printer Type */}
          <div>
            <label
              htmlFor="printerType"
              className="block text-sm font-medium mb-1"
            >
              Printer Type
            </label>
            <select
              id="printerType"
              name="printerType"
              value={printerType}
              onChange={(e) => setPrinterType(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {printerTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Printer Path */}
          <div>
            <label
              htmlFor="printerPath"
              className="block text-sm font-medium mb-1"
            >
              Printer Path
            </label>
            <input
              type="text"
              id="printerPath"
              name="printerPath"
              value={printerPath}
              onChange={(e) => setPrinterPath(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter printer path"
            />
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
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {printerStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
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
                  Printer Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Printer Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Printer Path
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
              {paginatedPrinters.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No printers found.
                  </td>
                </tr>
              )}
              {paginatedPrinters.map((printer, idx) => (
                <tr
                  key={printer.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {printer.printerName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {printer.printerType}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {printer.printerPath}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        printer.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {printer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm space-x-3">
                    <button
                      onClick={() => handleEdit(printer.id)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Edit printer ${printer.printerName}`}
                      type="button"
                    >
                      <i className="fa fa-pencil fa-light" aria-hidden="true"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(printer.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label={`Delete printer ${printer.printerName}`}
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
          totalItems={printers.length}
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
              Edit Printer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Printer Name */}
              <div>
                <label
                  htmlFor="editPrinterName"
                  className="block text-sm font-medium mb-1"
                >
                  Printer Name
                </label>
                <input
                  type="text"
                  id="editPrinterName"
                  name="printerName"
                  value={editForm.printerName}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter printer name"
                />
              </div>

              {/* Printer Type */}
              <div>
                <label
                  htmlFor="editPrinterType"
                  className="block text-sm font-medium mb-1"
                >
                  Printer Type
                </label>
                <select
                  id="editPrinterType"
                  name="printerType"
                  value={editForm.printerType}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {printerTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Printer Path */}
              <div>
                <label
                  htmlFor="editPrinterPath"
                  className="block text-sm font-medium mb-1"
                >
                  Printer Path
                </label>
                <input
                  type="text"
                  id="editPrinterPath"
                  name="printerPath"
                  value={editForm.printerPath}
                  onChange={handleEditInputChange}
                  className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter printer path"
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
                  {printerStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
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