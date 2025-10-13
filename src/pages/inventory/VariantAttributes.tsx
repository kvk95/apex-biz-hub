import { apiService } from "@/services/ApiService";
import React, { useEffect, useState } from "react";

const pageSize = 5;

const VariantAttributes: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("VariantAttributes");
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

  const [currentPage, setCurrentPage] = useState(1);
  const [variantName, setVariantName] = useState("");
  const [variantValue, setVariantValue] = useState("");
  const [status, setStatus] = useState("Active");
  const [editId, setEditId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered and paginated data
  const filteredData = data.filter(
    (item) =>
      item.variantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.variantValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset form fields
  const resetForm = () => {
    setVariantName("");
    setVariantValue("");
    setStatus("Active");
    setEditId(null);
  };

  // Handle save (add or update)
  const handleSave = () => {
    if (!variantName.trim() || !variantValue.trim()) {
      alert("Please fill all fields.");
      return;
    }
    if (editId !== null) {
      // Update existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editId
            ? { ...item, variantName, variantValue, status }
            : item
        )
      );
    } else {
      // Add new
      const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [
        ...prev,
        { id: newId, variantName, variantValue, status },
      ]);
    }
    resetForm();
  };

  // Handle edit
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (!item) return;
    setVariantName(item.variantName);
    setVariantValue(item.variantValue);
    setStatus(item.status);
    setEditId(id);
  };

  // Handle delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
      if (editId === id) resetForm();
    }
  };

  // Handle refresh (reset filters and form)
  const handleRefresh = () => {
    setSearchTerm("");
    resetForm();
    setCurrentPage(1);
  };

  // Handle report (simulate export)
  const handleReport = () => {
    // For demo, just alert JSON string of current filtered data
    alert(
      "Report Data:\n" + JSON.stringify(filteredData, null, 2)
    );
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (page < 1 || page > pageCount) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <title>Variant Attributes</title>
      <div className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold mb-6">Variant Attributes</h1>

        {/* Form Section */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add / Edit Variant</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
            noValidate
          >
            {/* Variant Name */}
            <div>
              <label
                htmlFor="variantName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Variant Name
              </label>
              <input
                id="variantName"
                type="text"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter Variant Name"
                required
              />
            </div>

            {/* Variant Value */}
            <div>
              <label
                htmlFor="variantValue"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Variant Value
              </label>
              <input
                id="variantValue"
                type="text"
                value={variantValue}
                onChange={(e) => setVariantValue(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter Variant Value"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex space-x-2">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <i className="fa fa-save mr-2" aria-hidden="true"></i> Save
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <i className="fa fa-times mr-2" aria-hidden="true"></i> Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Search and Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white rounded shadow p-4 mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search Variant Attributes..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
              title="Refresh"
              type="button"
            >
              <i className="fa fa-refresh" aria-hidden="true"></i>
            </button>
          </div>
          <button
            onClick={handleReport}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
            type="button"
          >
            <i className="fa fa-file-text-o mr-2" aria-hidden="true"></i> Report
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Variant Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Variant Value
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    No variant attributes found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.variantName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.variantValue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                        type="button"
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                        type="button"
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

        {/* Pagination */}
        <nav
          className="flex justify-between items-center mt-4"
          aria-label="Table navigation"
        >
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`inline-flex items-center px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Previous page"
            type="button"
          >
            <i className="fa fa-chevron-left mr-1" aria-hidden="true"></i> Prev
          </button>
          <ul className="inline-flex items-center space-x-1">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => goToPage(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`px-3 py-1 rounded border ${
                    page === currentPage
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  type="button"
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === pageCount || pageCount === 0}
            className={`inline-flex items-center px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              currentPage === pageCount || pageCount === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            aria-label="Next page"
            type="button"
          >
            Next <i className="fa fa-chevron-right ml-1" aria-hidden="true"></i>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default VariantAttributes;