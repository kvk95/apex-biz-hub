import { apiService } from "@/services/ApiService";
import { useEffect, useState } from "react";

const printerTypes = ["Thermal", "Inkjet", "Laser"];
const printerStatuses = ["Active", "Inactive"];

export default function PrinterSettings() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state
  const [printerName, setPrinterName] = useState("");
  const [printerType, setPrinterType] = useState(printerTypes[0]);
  const [printerPath, setPrinterPath] = useState("");
  const [status, setStatus] = useState(printerStatuses[0]);

  // Data state
  const [printers, setPrinters] = useState([]);

  // Loading and error states for API
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PrinterSettings");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
      setPrinters(response.result);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Editing state
  const [editId, setEditId] = useState<number | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(printers.length / itemsPerPage);
  const paginatedPrinters = printers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    setPrinterName(p.printerName);
    setPrinterType(p.printerType);
    setPrinterPath(p.printerPath);
    setStatus(p.status);
    setEditId(id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this printer?")) {
      setPrinters((prev) => prev.filter((p) => p.id !== id));
      if (currentPage > 1 && paginatedPrinters.length === 1) {
        setCurrentPage(currentPage - 1);
      }
      if (editId === id) resetForm();
    }
  };

  const handleRefresh = () => {
    setPrinters(data);
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

  // Pagination controls
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <title>Printer Settings</title>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-semibold mb-6">Printer Settings</h1>

        {/* Form Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add / Edit Printer</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              {/* Printer Name */}
              <label
                htmlFor="printerName"
                className="block text-sm font-medium text-gray-700"
              >
                Printer Name
              </label>
              <input
                id="printerName"
                type="text"
                value={printerName}
                onChange={(e) => setPrinterName(e.target.value)}
                className="col-span-3 block w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Enter printer name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              {/* Printer Type */}
              <label
                htmlFor="printerType"
                className="block text-sm font-medium text-gray-700"
              >
                Printer Type
              </label>
              <select
                id="printerType"
                value={printerType}
                onChange={(e) => setPrinterType(e.target.value)}
                className="col-span-3 block w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white"
              >
                {printerTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              {/* Printer Path */}
              <label
                htmlFor="printerPath"
                className="block text-sm font-medium text-gray-700"
              >
                Printer Path
              </label>
              <input
                id="printerPath"
                type="text"
                value={printerPath}
                onChange={(e) => setPrinterPath(e.target.value)}
                className="col-span-3 block w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Enter printer path"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              {/* Status */}
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="col-span-3 block w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white"
              >
                {printerStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 justify-start">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa fa-save mr-2" aria-hidden="true"></i> Save
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <i className="fa fa-times mr-2" aria-hidden="true"></i> Cancel
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <i className="fa fa-refresh mr-2" aria-hidden="true"></i> Refresh
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i> Report
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Printer List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    #
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Printer Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Printer Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Printer Path
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedPrinters.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No printers found.
                    </td>
                  </tr>
                ) : (
                  paginatedPrinters.map((printer, idx) => (
                    <tr
                      key={printer.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td className="px-4 py-3">{printer.printerName}</td>
                      <td className="px-4 py-3">{printer.printerType}</td>
                      <td className="px-4 py-3">{printer.printerPath}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            printer.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {printer.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(printer.id)}
                          title="Edit"
                          className="inline-flex items-center px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <i className="fa fa-pencil" aria-hidden="true"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(printer.id)}
                          title="Delete"
                          className="inline-flex items-center px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <nav
            className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-6"
            aria-label="Pagination"
          >
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
              <ul className="inline-flex -space-x-px rounded-md shadow-sm">
                <li>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label="Previous"
                  >
                    <i className="fa fa-angle-left" aria-hidden="true"></i>
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <li key={page}>
                      <button
                        onClick={() => goToPage(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20 ${
                          page === currentPage
                            ? "z-10 border-indigo-500 bg-indigo-600 text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  );
                })}
                <li>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 ${
                      currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label="Next"
                  >
                    <i className="fa fa-angle-right" aria-hidden="true"></i>
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </section>
      </div>
    </div>
  );
}