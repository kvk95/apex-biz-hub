import React, { useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";

const PAGE_SIZE = 5;

const IncomeCategory: React.FC = () => {
  // Form state
  const [incomeCategory, setIncomeCategory] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  // Filtered page data
  const currentData = data.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("IncomeCategory");
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

  // Reset form
  const resetForm = () => {
    setIncomeCategory("");
    setDescription("");
    setStatus("Active");
    setEditingId(null);
  };

  // Save or update entry
  const handleSave = () => {
    if (!incomeCategory.trim()) return; // Require income category

    if (editingId !== null) {
      // Update existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, incomeCategory, description, status }
            : item
        )
      );
    } else {
      // Add new
      const newId =
        data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [
        ...prev,
        { id: newId, incomeCategory, description, status },
      ]);
      // If new page needed, move to last page
      if ((data.length + 1) > PAGE_SIZE * totalPages) {
        setCurrentPage(totalPages + 1);
      }
    }
    resetForm();
  };

  // Edit entry
  const handleEdit = (id: number) => {
    const item = data.find((d) => d.id === id);
    if (!item) return;
    setIncomeCategory(item.incomeCategory);
    setDescription(item.description);
    setStatus(item.status);
    setEditingId(id);
  };

  // Delete entry
  const handleDelete = (id: number) => {
    const filtered = data.filter((d) => d.id !== id);
    setData(filtered);
    // Adjust current page if needed
    if (
      currentPage > 1 &&
      filtered.length <= (currentPage - 1) * PAGE_SIZE
    ) {
      setCurrentPage(currentPage - 1);
    }
    if (editingId === id) resetForm();
  };

  // Refresh data (reset to initial)
  const handleRefresh = () => {
    loadData();
    setCurrentPage(1);
    resetForm();
  };

  // Report action (dummy alert)
  const handleReport = () => {
    alert("Report generated (dummy action).");
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6 text-gray-900">
          Income Category
        </h1>

        {/* Form Section */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Income Category Form
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              <label
                htmlFor="incomeCategory"
                className="col-span-3 text-gray-700 font-medium"
              >
                Income Category <span className="text-red-600">*</span>
              </label>
              <input
                id="incomeCategory"
                type="text"
                value={incomeCategory}
                onChange={(e) => setIncomeCategory(e.target.value)}
                className="col-span-9 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter Income Category"
                required
              />
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label
                htmlFor="description"
                className="col-span-3 text-gray-700 font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-9 border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Enter Description"
              />
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label
                htmlFor="status"
                className="col-span-3 text-gray-700 font-medium"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="col-span-9 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleRefresh}
                className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded transition"
                title="Refresh"
              >
                <i className="fa fa-refresh" aria-hidden="true"></i>
                <span>Refresh</span>
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded transition"
                title={editingId !== null ? "Update" : "Save"}
              >
                <i className="fa fa-save" aria-hidden="true"></i>
                <span>{editingId !== null ? "Update" : "Save"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Income Category List
            </h2>
            <button
              onClick={handleReport}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition"
              title="Report"
            >
              <i className="fa fa-file-text-o" aria-hidden="true"></i>
              <span>Report</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border-b border-gray-300 font-semibold text-gray-700 w-1/12">
                    #
                  </th>
                  <th className="px-4 py-3 border-b border-gray-300 font-semibold text-gray-700 w-3/12">
                    Income Category
                  </th>
                  <th className="px-4 py-3 border-b border-gray-300 font-semibold text-gray-700 w-5/12">
                    Description
                  </th>
                  <th className="px-4 py-3 border-b border-gray-300 font-semibold text-gray-700 w-2/12">
                    Status
                  </th>
                  <th className="px-4 py-3 border-b border-gray-300 font-semibold text-gray-700 w-1/12 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No records found.
                    </td>
                  </tr>
                )}
                {currentData.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 even:bg-gray-50"
                  >
                    <td className="px-4 py-3 border-b border-gray-300">
                      {(currentPage - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      {item.incomeCategory}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Edit"
                        aria-label={`Edit ${item.incomeCategory}`}
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                        aria-label={`Delete ${item.incomeCategory}`}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-gray-700 text-sm">
            <div>
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(currentPage * PAGE_SIZE, data.length)} of {data.length}{" "}
              entries
            </div>
            <nav
              className="inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none ${
                  currentPage === 1
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                aria-label="First"
              >
                <i className="fa fa-angle-double-left" aria-hidden="true"></i>
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none ${
                  currentPage === 1
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                aria-label="Previous"
              >
                <i className="fa fa-angle-left" aria-hidden="true"></i>
              </button>

              {/* Page numbers */}
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium focus:z-20 focus:outline-none ${
                      currentPage === page
                        ? "z-10 bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none ${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                aria-label="Next"
              >
                <i className="fa fa-angle-right" aria-hidden="true"></i>
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-none ${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                aria-label="Last"
              >
                <i className="fa fa-angle-double-right" aria-hidden="true"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeCategory;