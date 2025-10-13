import React, { useState, useMemo, useEffect } from "react";
import { apiService } from "@/services/ApiService";

const statuses = ["Active", "Inactive"];

export default function Prefixes() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state
  const [prefixName, setPrefixName] = useState("");
  const [prefixCode, setPrefixCode] = useState("");
  const [status, setStatus] = useState("Active");

  // Data state
  const [prefixes, setPrefixes] = useState([]);

  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [editId, setEditId] = useState<number | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(prefixes.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return prefixes.slice(start, start + itemsPerPage);
  }, [currentPage, prefixes]);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("Prefixes");
    if (response.status.code === "S") {
      setPrefixes(response.result);
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
    setPrefixName("");
    setPrefixCode("");
    setStatus("Active");
    setEditId(null);
  };

  const handleSave = () => {
    if (!prefixName.trim() || !prefixCode.trim()) return;

    if (editId !== null) {
      // Update existing
      setPrefixes((prev) =>
        prev.map((p) =>
          p.id === editId
            ? { ...p, prefixName, prefixCode, status }
            : p
        )
      );
    } else {
      // Add new
      const newId =
        prefixes.length > 0
          ? Math.max(...prefixes.map((p) => p.id)) + 1
          : 1;
      setPrefixes((prev) => [
        ...prev,
        { id: newId, prefixName, prefixCode, status },
      ]);
    }
    resetForm();
  };

  const handleEdit = (id: number) => {
    const prefix = prefixes.find((p) => p.id === id);
    if (!prefix) return;
    setPrefixName(prefix.prefixName);
    setPrefixCode(prefix.prefixCode);
    setStatus(prefix.status);
    setEditId(id);
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this prefix?"
      )
    ) {
      setPrefixes((prev) => prev.filter((p) => p.id !== id));
      if (
        (currentPage - 1) * itemsPerPage >=
        prefixes.length - 1
      ) {
        setCurrentPage((p) => Math.max(p - 1, 1));
      }
      if (editId === id) resetForm();
    }
  };

  const handleRefresh = () => {
    loadData();
    resetForm();
    setCurrentPage(1);
  };

  const handleReport = () => {
    // For demo: just alert JSON data
    alert(
      "Report Data:\n" + JSON.stringify(prefixes, null, 2)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <title>Prefixes - Dreams POS</title>

      {/* Page Header */}
      <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Prefixes
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={handleReport}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition"
            title="Report"
          >
            <i className="fa fa-file-alt"></i> Report
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium transition"
            title="Refresh"
          >
            <i className="fa fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Form Section */}
        <section className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Add / Edit Prefix
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {/* Prefix Name */}
            <div className="flex flex-col">
              <label
                htmlFor="prefixName"
                className="mb-1 font-medium text-gray-700"
              >
                Prefix Name <span className="text-red-600">*</span>
              </label>
              <input
                id="prefixName"
                type="text"
                value={prefixName}
                onChange={(e) =>
                  setPrefixName(e.target.value)
                }
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter prefix name"
                required
              />
            </div>

            {/* Prefix Code */}
            <div className="flex flex-col">
              <label
                htmlFor="prefixCode"
                className="mb-1 font-medium text-gray-700"
              >
                Prefix Code <span className="text-red-600">*</span>
              </label>
              <input
                id="prefixCode"
                type="text"
                value={prefixCode}
                onChange={(e) =>
                  setPrefixCode(e.target.value)
                }
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter prefix code"
                required
              />
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label
                htmlFor="status"
                className="mb-1 font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex items-end space-x-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-semibold transition flex items-center gap-2"
                title="Save"
              >
                <i className="fa fa-save"></i> Save
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded font-semibold transition flex items-center gap-2"
                title="Clear"
              >
                <i className="fa fa-times"></i> Clear
              </button>
            </div>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Prefix List
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Prefix Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Prefix Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-6 text-gray-500"
                    >
                      No prefixes found.
                    </td>
                  </tr>
                )}
                {currentData.map((prefix, idx) => (
                  <tr
                    key={prefix.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 border-r border-gray-300 text-sm text-gray-700">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 text-sm text-gray-700">
                      {prefix.prefixName}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 text-sm text-gray-700 uppercase">
                      {prefix.prefixCode}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-300 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          prefix.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {prefix.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(prefix.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(prefix.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <i className="fa fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav
            className="mt-6 flex justify-center items-center space-x-1"
            aria-label="Pagination"
          >
            <button
              onClick={() =>
                setCurrentPage((p) => Math.max(p - 1, 1))
              }
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition`}
              aria-label="Previous page"
            >
              <i className="fa fa-chevron-left"></i>
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border border-gray-300 transition ${
                    page === currentPage
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(p + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition`}
              aria-label="Next page"
            >
              <i className="fa fa-chevron-right"></i>
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
}